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
  }


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
  return { 'gameState': gameInstance.gameState }


def action(gameKey, action):
  gameInstance = GameInstance.get(db.session, gameKey=gameKey)
  if not gameInstance:
    raise BadRequest('No such game instance.')
  if gameInstance.gamePhase != GamePhase.PLAYING.value:
    raise BadRequest('Game instance is not currently playing.')

  gamePlayer = _GAME_MAP[gameInstance.gameType]()
  newGameState = gamePlayer.action(
      gameInstance.gameState, action, gamePhase=gameInstance.gamePhase,
      gameSettings=gameInstance.gameSettings)
  gameInstance.gameState = newGameState
  if gamePlayer.gameEndCondition(newGameState):
    gameInstance.gamePhase = GamePhase.POST_GAME.value
  db.session.commit()
  return { 'gameState': newGameState }


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

