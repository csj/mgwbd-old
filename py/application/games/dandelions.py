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
    activePlayerIndex: None,  # 0 or 1
    gameEnd: None,  # {win: 0} or {win: 1}
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

 
class Dandelions(Game):

  def getSettingsConfig(self):
    return [
      {
        'canonicalName': 'gridSize',
        'displayName': 'Grid size',
        'values': ['5 by 5', '6 by 6'],
        'defaultValue': '5 by 5',
      },
      {
        'canonicalName': 'doublePlanting',
        'displayName': 'Double planting',
        'description': (
            'Dandelions begin with a “double turn” (i.e., two Dandelions are '
            'planted), while the Wind ends the game with a “double turn.”'),
        'values': [True, False],
        'defaultValue': False,
      },
    ]

  def gameEndCondition(self, gameState):
    grid = gameState['grid']
    allSquaresFilled = True
    for row in range(len(grid)):
      for col in range(len(grid[0])):
        if grid[row][col] == sq['NULL']:
          allSquaresFilled = False

    if allSquaresFilled:
      return { 'win': 0 }

    if len(gameState['compass']['directions']) == 7:
      return { 'win': 1 }
    return None

  def nextPlayerTurn(self, gameState, gameSettings):
    if gameSettings['doublePlanting']:
      numDanTurns = 0
      grid = gameState['grid']
      for row in range(len(grid)):
        for col in range(len(grid[0])):
          if grid[row][col] == sq['FLWR']:
            numDanTurns += 1
      numWindTurns = len(gameState['compass']['directions'])
      if numDanTurns == 1:
        return
      if numWindTurns == 6:
        return
    Game.nextPlayerTurn(self, gameState)

  def actionGrid(self, gameState, action, gameSettings=None):
    row = action['grid']['row']
    col = action['grid']['col']
    curSquare = gameState['grid'][row][col]
    if curSquare == sq['FLWR']:
      return gameState
    newGameState = copy.deepcopy(gameState)
    newGameState['grid'][row][col] = sq['FLWR']
    newGameState['lastMove'] = self.getInitialGameState(gameSettings)
    newGameState['lastMove']['grid'][row][col] = sq['FLWR']
    self.checkGameEndCondition(newGameState)
    self.nextPlayerTurn(newGameState, gameSettings)
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

  def actionCompass(self, gameState, action, gameSettings=None):
    direction = action['compass']
    if direction in gameState['compass']['directions']:
      return gameState
    newGameState = copy.deepcopy(gameState)
    newGameState['compass']['directions'].append(direction)
    self.blowAllSeeds(newGameState['grid'], direction)
    newGameState['lastMove'] = self.getInitialGameState(gameSettings)
    newGameState['lastMove']['compass']['directions'].append(direction)
    newGameState['lastMove']['grid'] = self.gridDiff(
        gameState['grid'], newGameState['grid'])
    self.checkGameEndCondition(newGameState)
    self.nextPlayerTurn(newGameState, gameSettings)
    return newGameState

  def action(self, gameState, action, gameSettings=None, **kwargs):
    if gameState['activePlayerIndex'] is None:
      return gameState
    if gameState['activePlayerIndex'] == 0 and 'grid' in action:
      return self.actionGrid(gameState, action,  gameSettings=gameSettings)
    if gameState['activePlayerIndex'] == 1 and 'compass' in action:
      return self.actionCompass(gameState, action,  gameSettings=gameSettings)
    return gameState

  def getInitialGameState(self, gameSettings):
    if gameSettings:
      numRows = int(gameSettings['gridSize'][0])
      numCols = int(gameSettings['gridSize'][-1])
    else:
      numRows = 4
      numCols = 4
    row = [None for i in range(numCols)]
    grid = [copy.copy(row) for i in range(numRows)]
    return {
      'compass': { 'directions': [] },
      'grid': grid,
      'activePlayerIndex': None,
    }

  def getDefaultPlayerConfig(self):
    config = Game.getDefaultPlayerConfig(self)
    config[0]['name'] = 'Dandelions'
    config[1]['name'] = 'Wind'
    return config

