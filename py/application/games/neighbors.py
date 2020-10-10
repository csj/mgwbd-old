import copy
from .game import Game

"""
  Example game state:
  {
    grids: [
      [ # player index 0
        [{value: 1}, None, None, None, None],
        [None, None, None, None, None],
        [None, None, None, None, None],
        [None, None, None, None, None],
        [None, None, None, None, None],
      ],
      [ # player index 1
        [None, None, None, None, None],
        [None, None, None, None, None],
        [None, None, {value: 1}, None, None],
        [None, None, None, None, None],
        [None, None, None, None, None],
      ],
    ],
    die: 1, # 1-10, or None
    pendingMove: {
      0: {key: <string>, token: <string>}, # key decrypts token
      1: {key: <string>, token: <string>}, # key decrypts token
    },
    lastMove: { # either `die` or `players`, not both
      die: 1,
      players: [
        {row: 0, col: 0}, # player index 0
        {row: 2, col: 2}, # player index 1
      ],
    },
    playerTurn: None, # always None
    gameEnd: None,  # {win: 1}, {win: 2}, {draw: True}
  }
 
  Example action:
  {
    playerIndex: 0,
    row: 2,
    col: 2,
  }
"""


class Neighbors(Game):

  def gameEndCondition(self, gameState):
    pass # TODO

  def getInitialGameState(self, gameSettings=None):
    numCols = 5
    numRows = 5
    grid = [[None] * numCols for i in range(numRows)]
    grid[0][2]={'value': 5}
    grid[0][3]={'value': 5}
    grid[1][2]={'value': 5}
    grid[1][3]={'value': 3}
    grid[2][1]={'value': 1}
    grid[3][1]={'value': 1}
    grid[2][2]={'value': 1}
    grid[2][3]={'value': 1}
    grid[3][2]={'value': 1}
    grid[3][3]={'value': 1}
    return {
      'grids': [grid for p in gameSettings['players']],
      'die': 10,
      'pendingMove': {},
      'lastMove': {},
      'playerTurn': None,
    }
 
  def getSettingsConfig(self):
    return []

  def action(self, gameState, action, gamePhase=None, gameSettings=None):
    pass # TODO

