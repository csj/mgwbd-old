import copy
from application.games.game import Game


"""
Example game state:
  {
    squares: [
      {status: 'occupied', owner: 1}, # owner is 0 or 1
      {status: 'available', tunnels: []}, # list of tunnel indices
      {status: 'available', tunnels: [0, 2]},
      {status: 'available', tunnels: [0, 1]},
      {status: 'available', tunnels: [1, 2]},
      ...
    ], # list of length 9
    tunnels: [
      {owner: 0, squares: [2, 3],},
      {owner: 1, squares: [3, 4],},
      {owner: 0, squares: [2, 4],},
    ],
    cycle: [2, 3, 4], # cycle: [list of square indices] or cycle: None
  }

Example actions:
  {owner: 0, tunnel: {squares: [4, 5]}},
  {owner: 1, collapse: [2, 0, 1]},
  {owner: 1, collapse: [list of tunnel indices]},
    # 'collapse' list is 1:1 with squares, i.e. nth item of 'collapse' list
    #     corresponds to nth item of 'gameState.cycle' list.
    # 'collapse' list element indicates, for nth square, which tunnel resolves
    #     to this square
    # only includes indices in the cycle. other (secondary) tunnels may be
    #     collapsed by this action as well.
"""


class QuantumTicTacToe(Game):

  @classmethod
  def getSettingsConfig(cls):
    return []

  @classmethod
  def getInitialGameState(cls, gameSettings=None):
    return {
      'squares': [
        {'status': 'occupied', 'owner': 1},
        {'status': 'available', 'tunnels': []},
        {'status': 'available', 'tunnels': [0, 2]},
        {'status': 'available', 'tunnels': [0, 1]},
        {'status': 'available', 'tunnels': [1, 2]},
        {'status': 'available', 'tunnels': []},
        {'status': 'available', 'tunnels': []},
        {'status': 'available', 'tunnels': []},
        {'status': 'available', 'tunnels': []},
      ],
      'tunnels': [
        {'owner': 0, 'squares': [2, 3],},
        {'owner': 1, 'squares': [3, 4],},
        {'owner': 0, 'squares': [2, 4],},
      ],
      'cycle': [2, 3, 4],
    }

  def tunnelAction(self, action):
    pass

  def collapseAction(self, action):
    pass

  def action(self, action):
    return True

  def gameEndCondition(self):
    return None

