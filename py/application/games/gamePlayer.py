from .dandelions import Dandelions
from .sequencium import Sequencium
from .constants import GamePhase
from application import db
from application.models import GameInstance
from werkzeug.exceptions import BadRequest
import random


_GAME_MAP = {
  'dandelions': Dandelions,
  'sequencium': Sequencium,
}

_GAME_KEY_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
_GAME_KEY_LEN = 8


def new(hostDomain, gameType, gameSettings=None):
  if gameType not in _GAME_MAP:
    raise BadRequest('Unknown game.')
  game = _GAME_MAP[gameType]()
  gameState = game.getInitialGameState(gameSettings)
  gameKey = _generateGameKey()
  gameKey = ''.join(random.choice(_GAME_KEY_CHARS) for i in range(_GAME_KEY_LEN))
  gameInstance = GameInstance.create(
      db.session, hostDomain=hostDomain, gameKey=gameKey, gameType=gameType,
      gameSettings=gameSettings, gameState=gameState,
      gamePhase=GamePhase.PLAYING.value)
  db.session.commit()
  return { 'gameState': gameState, 'gameKey': gameKey, }


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


def _generateGameKey():
  return ''.join(random.choice(_GAME_KEY_CHARS) for i in range(_GAME_KEY_LEN))
