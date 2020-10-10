from .dandelions import Dandelions
from .neighbors import Neighbors
from .prophecies import Prophecies
from .sequencium import Sequencium


_GAME_MAP = {
  'dandelions': Dandelions,
  'neighbors': Neighbors,
  'sequencium': Sequencium,
  'prophecies': Prophecies,
}


def get(gameType):
  return _GAME_MAP.get(gameType, None)

