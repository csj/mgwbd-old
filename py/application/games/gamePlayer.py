from .dandelions import Dandelions
from .sequencium import Sequencium
from .constants import GamePhase
from application import db
from application.models import ArchivedGameInstance, GameInstance
from werkzeug.exceptions import BadRequest
import random


_GAME_MAP = {
  'dandelions': Dandelions,
  'sequencium': Sequencium,
}

_GAME_KEY_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
_GAME_KEY_LEN = 8


def new(hostDomain, gameType):
  if gameType not in _GAME_MAP:
    raise BadRequest('Unknown game.')
  game = _GAME_MAP[gameType]()
  gameSettingsConfig = game.getSettingsConfig()
  playerConfig = game.getDefaultPlayerConfig()
  gameSettings = _makeDefaultGameSettings(playerConfig, gameSettingsConfig)
  gameState = game.getInitialGameState(gameSettings)
  gameKey = _generateGameKey()
  gameInstance = GameInstance.create(
      db.session, hostDomain=hostDomain, gameKey=gameKey, gameType=gameType,
      gameSettings=gameSettings, gameState=gameState,
      gamePhase=GamePhase.PRE_GAME.value)
  db.session.commit()
  return {
    'gameState': gameState, 'gameSettingsConfig': gameSettingsConfig,
    'gameSettings': gameSettings, 'gameKey': gameKey,
    'gamePhase': gameInstance.gamePhase,
    'lastSeenMillis': _modifiedMillis(gameInstance),
  }


def setSettings(gameKey, gameSettings):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    raise BadRequest('No such game instance.')
  # TODO
  if gameInstance.gamePhase == GamePhase.PLAYING.value:
    raise BadRequest('Cannot modify settings for a game in progress.')
  if gameInstance.gamePhase == GamePhase.POST_GAME.value:
    _archiveGame(gameInstance)
    gameInstance = GameInstance.create(
        db.session, hostDomain=gameInstance.hostDomain, gameKey=gameKey,
        gameType=gameInstance.gameType)
  game = _GAME_MAP[gameInstance.gameType]()
  gameState = game.getInitialGameState(gameSettings)
  game.nextPlayerTurn(gameState, gameSettings=gameSettings)
  gameInstance.gameSettings = gameSettings
  gameInstance.gameState = gameState
  db.session.commit()
  return {
    'gameState': gameInstance.gameState,
    'lastSeenMillis': _modifiedMillis(gameInstance),
  }


def setPhase(gameKey, gamePhase):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    raise BadRequest('No such game instance.')
  gameInstance.gamePhase = gamePhase
  db.session.commit()
  return {'gamePhase': gamePhase}


def start(gameKey, gameSettings):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    raise BadRequest('No such game instance.')
  if gameInstance.gamePhase != GamePhase.PRE_GAME.value:
    _archiveGame(gameInstance)
    gameInstance = GameInstance.create(
        db.session, hostDomain=gameInstance.hostDomain, gameKey=gameKey,
        gameType=gameInstance.gameType)
  game = _GAME_MAP[gameInstance.gameType]()
  gameState = game.getInitialGameState(gameSettings)
  game.nextPlayerTurn(gameState, gameSettings=gameSettings)
  gameInstance.gamePhase = GamePhase.PLAYING.value
  gameInstance.gameSettings = gameSettings
  gameInstance.gameState = gameState
  db.session.commit()
  return {
    'gameState': gameInstance.gameState,
    'gamePhase': gameInstance.gamePhase,
    'lastSeenMillis': _modifiedMillis(gameInstance),
  }


def query(gameKey):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    return {'gameType': None}
  return poll(gameKey, 0)


def poll(gameKey, lastSeenMillis):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    raise BadRequest('No such game instance.')
  modifiedMillis = _modifiedMillis(gameInstance)
  if modifiedMillis == lastSeenMillis:
    return {}
  return {
    'gameState': gameInstance.gameState,
    'gameSettings': gameInstance.gameSettings,
    'gamePhase': gameInstance.gamePhase,
    'gameType': gameInstance.gameType,
    'lastSeenMillis': modifiedMillis,
  }


def action(gameKey, clientCode, action):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    raise BadRequest('No such game instance.')
  if gameInstance.gamePhase != GamePhase.PLAYING.value:
    raise BadRequest('Game instance is not currently playing.')
  if not _validateClientCode(clientCode, gameInstance):
    raise BadRequest('Client cannot perform this action.')

  gamePlayer = _GAME_MAP[gameInstance.gameType]()
  newGameState = gamePlayer.action(
      gameInstance.gameState, action, gamePhase=gameInstance.gamePhase,
      gameSettings=gameInstance.gameSettings)
  gameInstance.gameState = newGameState
  if gamePlayer.gameEndCondition(newGameState):
    gameInstance.gamePhase = GamePhase.POST_GAME.value
  db.session.commit()
  return {
    'gamePhase': gameInstance.gamePhase,
    'gameState': newGameState,
    'lastSeenMillis': _modifiedMillis(gameInstance),
  }


def _validateClientCode(clientCode, gameInstance):
  currentTurnPlayerNumber = gameInstance.gameState['activePlayer']
  player = gameInstance.gameSettings['players'][currentTurnPlayerNumber - 1]
  return (not player['owner'] or player['owner'] == clientCode)


def _modifiedMillis(gameInstance):
  return int(gameInstance.date_modified.timestamp() * 1000)


def _archiveGame(gameInstance):
  ArchivedGameInstance.create(
      db.session, hostDomain=gameInstance.hostDomain,
      gameType=gameInstance.gameType, gamePhase=gameInstance.gamePhase,
      gameStart=gameInstance.date_created, gameEnd=gameInstance.date_modified)
  db.session.delete(gameInstance)


def _generateGameKey():
  return ''.join(random.choice(_GAME_KEY_CHARS) for i in range(_GAME_KEY_LEN))


def _makeDefaultGameSettings(players, settingsConfig):
  settings = {s['canonicalName']: s['defaultValue'] for s in settingsConfig}
  settings['players'] = players
  return settings

