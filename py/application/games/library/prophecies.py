import copy
from application.games.game import Game


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

  @classmethod
  def getDefaultPlayerConfig(cls):
    return [
      {'playerType': 'human', 'owner': None, 'name': 'Player 1', 'style': 'A'},
      {'playerType': 'bot', 'owner': 'prophecies-random-bot', 'name': 'Random Bot', 'style': 'E'},
    ]

  @classmethod
  def getSettingsConfig(cls):
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
      {
        'canonicalName': 'xProphecies',
        'displayName': 'X-Prophecies',
        'description': 'Treat each number as a prediction of the number of Xs, rather than the number of numbers.',
        'values': [True, False],
        'defaultValue': False,
      },
      {
        'canonicalName': 'players:playerCount',
        'displayName': 'Player count',
        'values': [2, 3, 4],
        'defaultValue': 2,
      },
    ]

  @classmethod
  def getInitialGameState(cls, gameSettings=None):
    numRows = gameSettings['numRows']
    numCols = gameSettings['numCols']
    if numRows > numCols: # swap the values
      numRows = numRows + numCols
      numCols = numRows - numCols
      numRows = numRows - numCols
    row = [None for i in range(numCols)]
    grid = [row for i in range(numRows)]
    return { 'grid': grid, 'activePlayerIndex': None, }

  def isValidValue(self, grid, row, col, value):
    if value == 0:
      return True
    if value > len(grid) and value > len(grid[0]):
      return False
    if (self.gameSettings['xProphecies'] and
        value >= len(grid) and value >= len(grid[0])):
      return False
    for i in range(len(grid)):
      if grid[i][col] and grid[i][col]['value'] == value:
        return False
    for j in range(len(grid[0])):
      if grid[row][j] and grid[row][j]['value'] == value:
        return False
    return True

  def fillAutoXs(self, grid):
    maxValue = max(len(grid), len(grid[0]))
    if self.gameSettings['xProphecies']:
      maxValue -= 1
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

  def action(self, action):
    grid = self.gameState['grid']
    playerIndex = action['owner']
    row = action['row']
    col = action['col']
    value = action['value']
    if self.gameState['activePlayerIndex'] is None:
      return False
    if (playerIndex != self.gameState['activePlayerIndex']):
      return False
    if grid[row][col] is not None:
      return False
    if not self.isValidValue(grid, row, col, value):
      return False

    newGameState = copy.deepcopy(self.gameState)
    newGameState['grid'][row][col] = {'owner': playerIndex, 'value': value}
    autoXs = self.fillAutoXs(newGameState['grid'])
    newGameState['lastMove'] = [{'row': row, 'col': col}] + autoXs
    self._gameState = newGameState
    self.checkGameEndCondition()
    self.nextPlayerTurn()
    return True

  def calculateScores(self, grid, matchCondition=(lambda v: v)):
    rowWinners = [0] * len(grid)
    colWinners = [0] * len(grid[0])
    playerScores = [0] * len(self._gameSettings['players'])
    for i in range(len(grid)):
      for j in range(len(grid[0])):
        if grid[i][j] and matchCondition(grid[i][j]['value']):
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
    winners = list(filter(lambda i: i[1] == max(scores), enumerate(scores)))
    if len(winners) > 1:
      result['draw'] = True
    else:
      result['win'] = winners[0][0]
    return result

  def gameEndCondition(self):
    grid = self.gameState['grid']
    for row in range(len(grid)):
      for col in range(len(grid[0])):
        if not grid[row][col]:
          return None
    if self.gameSettings and self.gameSettings['xProphecies']:
      scores = self.calculateScores(grid, matchCondition=(lambda v: not v))
    else:
      scores = self.calculateScores(grid)
    return self.calculateWinner(scores)

