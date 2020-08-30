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

  def opposingPlayerHasAvailableMove(self, playerNumber, grid):
    oppPlayer = 3 - playerNumber
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
                grid[r + dr][c + dc]['playerNumber'] == oppPlayer):
              return True
    return False

  def action(self, gameState, action):
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
    if self.opposingPlayerHasAvailableMove(playerNumber, newGameState['grid']):
      self.nextPlayerTurn(newGameState)
    return newGameState

