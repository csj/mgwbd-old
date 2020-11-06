from .constants import GamePhase
from application import db
from application.games import archive, gameMap
from application.games.mechanics.bots.invoker import Invoker
from application.models import ArchivedGameInstance, GameInstance
from werkzeug.exceptions import BadRequest
import random


_GAME_KEY_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
_GAME_KEY_LEN = 8


def new(hostDomain, gameType):
  cls = gameMap.get(gameType)
  if not cls:
    raise BadRequest('Unknown game.')
  gameSettingsConfig = cls.getSettingsConfig()
  playerConfig = cls.getDefaultPlayerConfig()
  gameSettings = _makeDefaultGameSettings(playerConfig, gameSettingsConfig)
  gameState = cls.getInitialGameState(gameSettings=gameSettings)
  gameKey = _generateGameKey()
  gameInstance = GameInstance.create(
      db.session, hostDomain=hostDomain, gameKey=gameKey, gameType=gameType,
      gameSettings=gameSettings, gameState=gameState,
      gamePhase=GamePhase.PRE_GAME.value)
  db.session.commit()
  return _toDict(
      gameInstance, extraKeys={ 'gameSettingsConfig': gameSettingsConfig, })


def setSettings(gameKey, gameSettings):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    raise BadRequest('No such game instance.')
  if gameInstance.gamePhase == GamePhase.PLAYING.value:
    raise BadRequest('Cannot modify settings for a game in progress.')
  if gameInstance.gamePhase == GamePhase.POST_GAME.value:
    archive.archiveGameInstance(gameInstance)
    gameInstance = GameInstance.create(
        db.session, hostDomain=gameInstance.hostDomain, gameKey=gameKey,
        gameType=gameInstance.gameType)
  game = _fromGameInstance(gameInstance)
  gameState = game.getInitialGameState(gameSettings=gameSettings)
  gameInstance.gameSettings = gameSettings
  gameInstance.gameState = gameState
  db.session.commit()
  return _toDict(gameInstance)


def setPhase(gameKey, gamePhase):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    raise BadRequest('No such game instance.')
  gameInstance.gamePhase = gamePhase
  db.session.commit()
  return _toDict(gameInstance)


def start(gameKey, gameSettings):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    raise BadRequest('No such game instance.')
  if gameInstance.gamePhase != GamePhase.PRE_GAME.value:
    archive.archiveGameInstance(gameInstance)
    gameInstance = GameInstance.create(
        db.session, hostDomain=gameInstance.hostDomain, gameKey=gameKey,
        gameType=gameInstance.gameType)
  cls = gameMap.get(gameInstance.gameType)
  gameInstance.gameSettings = gameSettings
  gameInstance.gameState = cls.getInitialGameState(gameSettings=gameSettings)
  game = _fromGameInstance(gameInstance)
  game.start()
  gameInstance.gamePhase = game.gamePhase
  gameInstance.gameState = game.gameState
  db.session.commit()

  _checkBotAction(gameInstance, game)

  return _toDict(gameInstance)


def query(gameKey):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    return {'gameType': None}
  return poll(gameKey, 0)


def poll(gameKey, lastSeenMillis):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    raise BadRequest('No such game instance.')
  game = _fromGameInstance(gameInstance)

  invoker = Invoker(gameInstance.gameType, gameKey)
  if invoker.receive(game):
    gameInstance.gameState = game.gameState
    if game.gameEndCondition():  # TODO move this logic into game.action
      gameInstance.gamePhase = GamePhase.POST_GAME.value
    db.session.commit()

  modifiedMillis = _modifiedMillis(gameInstance)
  if modifiedMillis == lastSeenMillis:
    return {}
  return _toDict(
      gameInstance, extraKeys={'gameSettingsConfig': game.getSettingsConfig()})


def action(gameKey, clientCode, action):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    raise BadRequest('No such game instance.')
  if gameInstance.gamePhase != GamePhase.PLAYING.value:
    raise BadRequest('Game instance is not currently playing.')
  if not _validateClientCode(clientCode, gameInstance):
    raise BadRequest('Client cannot perform this action.')

  game = _fromGameInstance(gameInstance)
  game.action(action)
  gameInstance.gameState = game.gameState
  if game.gameEndCondition():  # TODO move this logic into game.action
    gameInstance.gamePhase = GamePhase.POST_GAME.value
  db.session.commit()

  _checkBotAction(gameInstance, game)

  return _toDict(gameInstance)


def _fromGameInstance(gameInstance):
  """Returns a Game object."""
  cls = gameMap.get(gameInstance.gameType)
  return cls(
      gameState=gameInstance.gameState,
      gameSettings=gameInstance.gameSettings,
      gamePhase=gameInstance.gamePhase)


def _validateClientCode(clientCode, gameInstance):
  currentTurnPlayerIndex = gameInstance.gameState['activePlayerIndex']
  if currentTurnPlayerIndex is None:
    return True
  player = gameInstance.gameSettings['players'][currentTurnPlayerIndex]
  return (not player['owner'] or player['owner'] == clientCode)


def _modifiedMillis(gameInstance):
  return int(gameInstance.date_modified.timestamp() * 1000)


def _generateGameKey():
  return ''.join(random.choice(_GAME_KEY_CHARS) for i in range(_GAME_KEY_LEN))


def _makeDefaultGameSettings(players, settingsConfig):
  settings = {s['canonicalName']: s['defaultValue'] for s in settingsConfig}
  settings['players'] = players
  return settings


def _toDict(gameInstance, extraKeys=None):
  result = {
      key: val for key, val in gameInstance.json().items() if key in [
          'gameKey', 'hostDomain', 'gameType', 'gameSettings', 'gameState',
          'gamePhase', ]}
  if not result['gameState']:
    print('OH DAMN')
  result['lastSeenMillis'] = _modifiedMillis(gameInstance)
  result.update(extraKeys or {})
  return result


def _checkBotAction(gameInstance, game):
  invoker = Invoker(gameInstance.gameType, gameInstance.gameKey)
  invoker.putIf(game)

