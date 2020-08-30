from .dandelions import Dandelions
from .sequencium import Sequencium
from werkzeug.exceptions import BadRequest


_GAME_MAP = {
  'dandelions': Dandelions,
  'sequencium': Sequencium,
}


def action(gameType, gameState, action):
  if gameType not in _GAME_MAP:
    raise BadRequest('Unknown game.')
  # TODO: in the future, instantiate this from database
  gameInst = _GAME_MAP[gameType]()
  newGameState = gameInst.action(gameState, action)
  return {
    'gameState': newGameState,
  }
