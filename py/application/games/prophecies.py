import copy
from .game import Game

"""
Example game state:
  {
    grid: [ [{'owner': 2, 'value': 4'}, None, None, ], ... ],
    activePlayerIndex: 1, # 0 or 1
    lastMove: [{'row': 0, 'col': 0}, ...],
  }

Example actions:
  {owner: 2, row: 1, col: 2, value: 4}
"""

class Prophecies(Game):

  def getInitialGameState(self, gameSettings=None):
    numRows = gameSettings['numRows']
    numCols = gameSettings['numCols']
    if numRows > numCols: # swap the values
      numRows = numRows + numCols
      numCols = numRows - numCols
      numRows = numRows - numCols
    row = [None for i in range(numCols)]
    grid = [row for i in range(numRows)]
    return { 'grid': grid, 'activePlayerIndex': None, }

  def getSettingsConfig(self):
    return [
      {
        'canonicalName': 'numRows',
        'displayName': 'Number of rows',
        'description': '',
        'values': [3, 4, 5, 6],
        'defaultValue': 4,
      },
      {
        'canonicalName': 'numCols',
        'displayName': 'Number of columns',
        'description': '',
        'values': [3, 4, 5, 6],
        'defaultValue': 5,
      },
    ]

  def isValidValue(self, grid, row, col, value):
    if value == 0:
      return True
    for i in range(len(grid)):
      if grid[i][col] and grid[i][col]['value'] == value:
        return False
    for j in range(len(grid[0])):
      if grid[row][j] and grid[row][j]['value'] == value:
        return False
    return True

  def fillAutoXs(self, grid):
    maxValue = max(len(grid), len(grid[0]))
    autoXs = []
    for row in range(len(grid)):
      for col in range(len(grid[0])):
        if grid[row][col]:
          continue
        validMove = False
        for value in range(1, maxValue + 1):
          if self.isValidValue(grid, row, col, value):
            validMove = True
        if not validMove:
          grid[row][col] = {'owner': None, 'value': 0}
          autoXs.append({'row': row, 'col': col})
    return autoXs

  def action(self, gameState, action, gamePhase=None, gameSettings=None):
    grid = gameState['grid']
    playerIndex = action['owner']
    row = action['row']
    col = action['col']
    value = action['value']
    if gameState['activePlayerIndex'] is None:
      return gameState
    if (playerIndex != gameState['activePlayerIndex']) or grid[row][col] is not None:
      return gameState
    if not self.isValidValue(grid, row, col, value):
      return gameState

    newGameState = copy.deepcopy(gameState)
    newGameState['grid'][row][col] = {'owner': playerIndex, 'value': value}
    autoXs = self.fillAutoXs(newGameState['grid'])
    newGameState['lastMove'] = [{'row': row, 'col': col}] + autoXs
    self.checkGameEndCondition(newGameState)
    self.nextPlayerTurn(newGameState)
    return newGameState

  def calculateScores(self, grid):
    rowWinners = [0] * len(grid)
    colWinners = [0] * len(grid[0])
    playerScores = [0] * 2  # assuming two players
    for i in range(len(grid)):
      for j in range(len(grid[0])):
        if grid[i][j] and grid[i][j]['value']:
          rowWinners[i] += 1
          colWinners[j] += 1
    for i in range(len(grid)):
      for j in range(len(grid[0])):
        square = grid[i][j]
        if not square:
          continue
        value = square['value']
        if not value:
          continue
        if rowWinners[i] == value:
          playerScores[square['owner']] += value
        if colWinners[j] == value:
          playerScores[square['owner']] += value
    return playerScores

  def calculateWinner(self, scores):
    result = {'scores': scores}
    if scores[0] > scores[1]:
      result['win'] = 0
    elif scores[1] > scores[0]:
      result['win'] = 1
    else:
      result['draw'] = True
    return result

  def gameEndCondition(self, gameState):
    grid = gameState['grid']
    for row in range(len(grid)):
      for col in range(len(grid[0])):
        if not grid[row][col]:
          return None
    scores = self.calculateScores(grid)
    return self.calculateWinner(scores)

