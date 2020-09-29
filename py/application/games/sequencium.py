import copy
from .game import Game

"""
  Example game state:
  {
    grid: [
      [Square, None, None, None, None, None],
      [None, Square, None, None, None, None],
      [None, None, Square, None, None, None],
      [None, None, None, Square, None, None],
      [None, None, None, None, Square, None],
      [None, None, None, None, None, Square],
    ],
    lastMove: {
      row: rowId,
      col: colId,
    },
    playerTurn: 1, // None, 1 or 2
    gameEnd: None,  # {win: 1}, {win: 2}, {draw: True}
  }
 
  typedef Square = {
    playerNumber: 1, // or 2
    value: 1, // 2, 3, 4, ...
    from: 'SW', // N, NE, E, SE, S, SW, W, NW, None
  }

  Example action:
  {
    playerNumber: 1,
    rowFrom: 1,
    colFrom: 1,
    rowTo: 2,
    colTo: 2,
  }
"""


_directionHelper = [ [None, 'W', 'E'], ['N', 'NW', 'NE'], ['S', 'SW', 'SE'], ]


class Sequencium(Game):

  def gameEndCondition(self, gameState):
    grid = gameState['grid']
    scores = [0, 0]
    for r in range(len(grid)):
      for c in range(len(grid[0])):
        sq = grid[r][c]
        if sq is None:
          return None
        i = sq['playerNumber'] - 1
        scores[i] = max(scores[i], sq['value'])
    if scores[0] == scores[1]:
      return {'tie': True}
    return {'win': 1 if scores[0] > scores[1] else 2}

  def getDirection(self, rowFrom, colFrom, rowTo, colTo):
    return _directionHelper[rowTo - rowFrom][colTo - colFrom]

  def playerHasAvailableMove(self, playerNumber, grid):
    for r in range(len(grid)):
      for c in range(len(grid[0])):
        if grid[r][c]:
          continue
        for dr in range(-1, 2):
          for dc in range(-1, 2):
            if (r + dr < 0 or r + dr >= len(grid) or
                c + dc < 0 or c + dc >= len(grid[0])):
              continue
            if (grid[r + dr][c + dc] and
                grid[r + dr][c + dc]['playerNumber'] == playerNumber):
              return True
    return False

  def nextPlayerTurn(self, gameState, gameSettings):
    playerNumber = gameState['activePlayer']
    if not playerNumber:
      Game.nextPlayerTurn(self, gameState)
      return
    grid = gameState['grid']
    if not self.playerHasAvailableMove(3 - playerNumber, grid):
      return
    if not self.playerHasAvailableMove(playerNumber, grid):
      Game.nextPlayerTurn(self, gameState)
      return
    if not gameSettings or not gameSettings['doubleMoves']:
      Game.nextPlayerTurn(self, gameState)
      return
    numOccupiedSquares = 0
    for r in range(len(grid)):
      for c in range(len(grid[0])):
        numOccupiedSquares += 1 if grid[r][c] else 0
    if numOccupiedSquares % 2:
      Game.nextPlayerTurn(self, gameState)

  def getInitialGameState(self, gameSettings=None):
    return {
      'grid': [
        [_sq(1, 1, None), None, None, None, None, None],
        [None, _sq(1, 2, 'NW'), None, None, None, None],
        [None, None, _sq(1, 3, 'NW'), None, None, None],
        [None, None, None, _sq(2, 3, 'SE'), None, None],
        [None, None, None, None, _sq(2, 2, 'SE'), None],
        [None, None, None, None, None, _sq(2, 1, None)],
      ],
      'lastMove': {}, # row: 3, col: 3,
      'activePlayer': None,
    }
 
  def getSettingsConfig(self):
    return [
      {
        'canonicalName': 'handDrawnGrid',
        'displayName': 'Hand-drawn grid',
        'description': 'Displays the game grid as a drawing.',
        'values': [True, False],
        'defaultValue': True,
      },
      {
        'canonicalName': 'doubleMoves',
        'displayName': 'Players move twice',
        'description': (
            'Starting with the second player’s first turn, each player '
            'moves twice per turn.'),
        'values': [True, False],
        'defaultValue': False,
      },
    ]

  def action(self, gameState, action, gamePhase=None, gameSettings=None):
    grid = gameState['grid']
    playerNumber = action['playerNumber']
    rowFrom = action['rowFrom']
    colFrom = action['colFrom']
    rowTo = action['rowTo']
    colTo = action['colTo']
    if not gameState['activePlayer']:
      return gameState
    if (playerNumber != gameState['activePlayer'] or
        rowFrom - rowTo < -1 or rowFrom - rowTo > 1 or
        colFrom - colTo < -1 or colFrom - colTo > 1 or
        grid[rowFrom][colFrom] is None or
        grid[rowFrom][colFrom]['playerNumber'] != playerNumber or
        grid[rowTo][colTo]):
      return gameState
    direction = self.getDirection(rowFrom, colFrom, rowTo, colTo)
    value = grid[rowFrom][colFrom]['value'] + 1
    newGameState = copy.deepcopy(gameState)
    newGameState['grid'][rowTo][colTo] = {
        'playerNumber': playerNumber, 'value': value, 'from': direction}
    newGameState['lastMove'] = {'row': rowTo, 'col': colTo}
    self.checkGameEndCondition(newGameState)
    self.nextPlayerTurn(newGameState, gameSettings)
    return newGameState



def _sq(playerNumber, value, direction):
	return {'playerNumber': playerNumber, 'value': value, 'from': direction}

