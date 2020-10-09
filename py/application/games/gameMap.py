from .dandelions import Dandelions
from .prophecies import Prophecies
from .sequencium import Sequencium


_GAME_MAP = {
  'dandelions': Dandelions,
  'sequencium': Sequencium,
  'prophecies': Prophecies,
}


def get(gameType):
  return _GAME_MAP.get(gameType, None)

