import copy
from application.games.game import Game


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

  @classmethod
  def getDefaultPlayerConfig(cls):
    config = Game.getDefaultPlayerConfig()
    config[0]['name'] = 'Dandelions'
    config[1]['name'] = 'Wind'
    return config

  @classmethod
  def getSettingsConfig(cls):
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

  @classmethod
  def getInitialGameState(cls, gameSettings):
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

  def gameEndCondition(self):
    grid = self.gameState['grid']
    allSquaresFilled = True
    for row in range(len(grid)):
      for col in range(len(grid[0])):
        if grid[row][col] == sq['NULL']:
          allSquaresFilled = False

    if allSquaresFilled:
      return { 'win': 0 }

    if len(self.gameState['compass']['directions']) == 7:
      return { 'win': 1 }
    return None

  def nextPlayerTurn(self):
    if self.gameSettings['doublePlanting']:
      numDanTurns = 0
      grid = self.gameState['grid']
      for row in range(len(grid)):
        for col in range(len(grid[0])):
          if grid[row][col] == sq['FLWR']:
            numDanTurns += 1
      numWindTurns = len(self.gameState['compass']['directions'])
      if numDanTurns == 1:
        return
      if numWindTurns == 6:
        return
    Game.nextPlayerTurn(self)

  def actionGrid(self, action):
    row = action['grid']['row']
    col = action['grid']['col']
    curSquare = self.gameState['grid'][row][col]
    if curSquare == sq['FLWR']:
      return False
    newGameState = copy.deepcopy(self.gameState)
    newGameState['grid'][row][col] = sq['FLWR']
    newGameState['lastMove'] = self.getInitialGameState(self.gameSettings)
    newGameState['lastMove']['grid'][row][col] = sq['FLWR']
    self._gameState = newGameState
    self.checkGameEndCondition()
    self.nextPlayerTurn()
    return True

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

  def actionCompass(self, action):
    direction = action['compass']
    if direction in self.gameState['compass']['directions']:
      return False
    newGameState = copy.deepcopy(self.gameState)
    newGameState['compass']['directions'].append(direction)
    self.blowAllSeeds(newGameState['grid'], direction)
    newGameState['lastMove'] = self.getInitialGameState(self.gameSettings)
    newGameState['lastMove']['compass']['directions'].append(direction)
    newGameState['lastMove']['grid'] = _gridDiff(
        self.gameState['grid'], newGameState['grid'])
    self._gameState = newGameState
    self.checkGameEndCondition()
    self.nextPlayerTurn()
    return True

  def action(self, action):
    if self.gameState['activePlayerIndex'] is None:
      return False
    if self.gameState['activePlayerIndex'] == 0 and 'grid' in action:
      return self.actionGrid(action)
    if self.gameState['activePlayerIndex'] == 1 and 'compass' in action:
      return self.actionCompass(action)
    return False

def _gridDiff(oldGrid, newGrid):
  if len(oldGrid) != len(newGrid) or not len(oldGrid):
    return [[]]
  if len(oldGrid[0]) != len(newGrid[0]) or not len(oldGrid[0]):
    return [[]]
  diffGrid = []
  for row in range(len(oldGrid)):
    diffRow = []
    for col in range(len(oldGrid[row])):
      oldVal = oldGrid[row][col]
      newVal = newGrid[row][col]
      diffRow.append(None if oldVal == newVal else newVal)
    diffGrid.append(diffRow)
  return diffGrid

