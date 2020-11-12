from .library.dandelions import Dandelions
from .library.neighbors import Neighbors
from .library.prophecies import Prophecies
from .library.quantumtictactoe import QuantumTicTacToe
from .library.sequencium import Sequencium


_GAME_MAP = {
  'dandelions': Dandelions,
  'neighbors': Neighbors,
  'prophecies': Prophecies,
  'quantumtictactoe': QuantumTicTacToe,
  'sequencium': Sequencium,
}


def get(gameType):
  return _GAME_MAP.get(gameType, None)

