from .library.dandelions import Dandelions
from .library.neighbors import Neighbors
from .library.prophecies import Prophecies
from .library.sequencium import Sequencium


_GAME_MAP = {
  'dandelions': Dandelions,
  'neighbors': Neighbors,
  'sequencium': Sequencium,
  'prophecies': Prophecies,
}


def get(gameType):
  return _GAME_MAP.get(gameType, None)

