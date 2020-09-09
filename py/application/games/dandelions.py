import copy
from .game import Game

"""
  Example game state:
  {
    compass: { directions: [] },
    grid: [
      [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
      [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
      [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
      [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
      [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
    ],
    lastMove: {
      compass: {directions: [] },
      grid: [
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
      ],
    },
    activePlayer: None,  # 1 or 2
    gameEnd: None,  # {win: 1} or {win: 2}
  }

  Example game actions:
  { compass: 'N' }
  { grid: { row: 1, col: 2 } }
"""

sq = {
  'FLWR': 'F',
  'SEED': 'S',
  'NULL': None,
}

all_directions = ('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW')

blankLastMove = {
  'compass': {'directions': []},
  'grid': [
    [sq['NULL'], sq['NULL'], sq['NULL'], sq['NULL'], sq['NULL']],
    [sq['NULL'], sq['NULL'], sq['NULL'], sq['NULL'], sq['NULL']],
    [sq['NULL'], sq['NULL'], sq['NULL'], sq['NULL'], sq['NULL']],
    [sq['NULL'], sq['NULL'], sq['NULL'], sq['NULL'], sq['NULL']],
    [sq['NULL'], sq['NULL'], sq['NULL'], sq['NULL'], sq['NULL']],
  ],
}

 
class Dandelions(Game):

  def gameEndCondition(self, gameState):
    grid = gameState['grid']
    allSquaresFilled = True
    for row in range(len(grid)):
      for col in range(len(grid[0])):
        if grid[row][col] == sq['NULL']:
          allSquaresFilled = False

    if allSquaresFilled:
      return { 'win': 1 }

    if len(gameState['compass']['directions']) == 7:
      return { 'win': 2 }
    return None

  def actionGrid(self, gameState, action):
    row = action['grid']['row']
    col = action['grid']['col']
    curSquare = gameState['grid'][row][col]
    if curSquare == sq['FLWR']:
      return gameState
    newGameState = copy.deepcopy(gameState)
    newGameState['grid'][row][col] = sq['FLWR']
    newGameState['lastMove'] = copy.deepcopy(blankLastMove)
    newGameState['lastMove']['grid'][row][col] = sq['FLWR']
    self.checkGameEndCondition(newGameState)
    self.nextPlayerTurn(newGameState)
    return newGameState

  def blowSeed(self, grid, direction, row, col):
    while row >= 0 and col >= 0 and row < len(grid) and col < len(grid[0]):
      if grid[row][col] != sq['FLWR']:
        grid[row][col] = sq['SEED']
      if direction not in all_directions:
        break
      row -= 1 if direction in ('NW', 'N', 'NE') else 0
      row += 1 if direction in ('SW', 'S', 'SE') else 0
      col -= 1 if direction in ('NW', 'W', 'SW') else 0
      col += 1 if direction in ('NE', 'E', 'SE') else 0

  def blowAllSeeds(self, grid, direction):
    for row in range(len(grid)):
      for col in range(len(grid[0])):
        if grid[row][col] == sq['FLWR']:
          self.blowSeed(grid, direction, row, col)

  def actionCompass(self, gameState, action):
    direction = action['compass']
    if direction in gameState['compass']['directions']:
      return gameState
    newGameState = copy.deepcopy(gameState)
    newGameState['compass']['directions'].append(direction)
    self.blowAllSeeds(newGameState['grid'], direction)
    newGameState['lastMove'] = copy.deepcopy(blankLastMove)
    newGameState['lastMove']['compass']['directions'].append(direction)
    newGameState['lastMove']['grid'] = self.gridDiff(
        gameState['grid'], newGameState['grid'])
    self.checkGameEndCondition(newGameState)
    self.nextPlayerTurn(newGameState)
    return newGameState

  def action(self, gameState, action, **kwargs):
    if not gameState['activePlayer']:
      return gameState
    if gameState['activePlayer'] == 1 and 'grid' in action:
      return self.actionGrid(gameState, action)
    if gameState['activePlayer'] == 2 and 'compass' in action:
      return self.actionCompass(gameState, action)
    return gameState

  def getInitialGameState(self, gameSettings=None):
    return {
      'compass': { 'directions': [] },
      'grid': [
        [None, None, None, None, None],
        [None, None, None, None, None],
        [None, None, None, None, None],
        [None, None, None, None, None],
        [None, None, None, None, None],
      ],
      'activePlayer': None,
    }

