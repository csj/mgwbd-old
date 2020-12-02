import copy
from application.games.game import Game


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
    turnSequence: [],  # keeps track of playerIndex for each turn
    lastMove: {
      row: rowId,
      col: colId,
    },
    gameEnd: None,  # {win: 1}, {win: 2}, {draw: True}
  }
 
  typedef Square = {
    playerIndex: 0, // or 1, 2, 3
    value: 1, // 2, 3, 4, ...
    from: 'SW', // N, NE, E, SE, S, SW, W, NW, None
  }

  Example action:
  {
    playerIndex: 0,
    rowFrom: 1,
    colFrom: 1,
    rowTo: 2,
    colTo: 2,
  }
"""


_directionHelper = [ [None, 'W', 'E'], ['N', 'NW', 'NE'], ['S', 'SW', 'SE'], ]


class Sequencium(Game):

  @classmethod
  def getSettingsConfig(cls):
    return [
      {
        'canonicalName': 'doubleMoves',
        'displayName': 'Players move twice',
        'description': (
            'Starting with the second player’s first turn, each player '
            'moves twice per turn.'),
        'values': [True, False],
        'defaultValue': False,
      },
      {
        'canonicalName': 'gridSize',
        'displayName': 'Grid size',
        'values': [6, 8, 10],
        'defaultValue': 6,
      },
      {
        'canonicalName': 'players:playerCount',
        'displayName': 'Player count',
        'values': [2, 4],
        'defaultValue': 2,
      },
    ]

  @classmethod
  def getInitialGameState(cls, gameSettings=None):
    return {
      'grid': _makeGrid(gameSettings['gridSize'], len(gameSettings['players'])),
      'lastMove': {}, # row: 3, col: 3,
      'turnSequence': [],
      'activePlayerIndex': None,
    }
 
  def nextPlayerTurn(self):
    playerIndex = self.gameState['activePlayerIndex']
    numPlayers = len(self.gameSettings['players'])
    grid = self.gameState['grid']
    turnSequence = self.gameState['turnSequence']

    if playerIndex is None:
      Game.nextPlayerTurn(self)
      return
    if len(self.gameState['turnSequence']) <= 1:
      Game.nextPlayerTurn(self)
      return

    isGridFull = True
    for row in grid:
      for cell in row:
        if not cell:
          isGridFull = False
    if isGridFull:
      return

    if self.gameSettings['doubleMoves'] and len(set(turnSequence[-2:])) > 1:
      pass
    else:
      Game.nextPlayerTurn(self)

    while not self.playerHasAvailableMove():
      print('here')
      Game.nextPlayerTurn(self)

  def gameEndCondition(self):
    grid = self.gameState['grid']
    scores = [0] * len(self.gameSettings['players'])
    for row in grid:
      for sq in row:
        if sq is None:
          return None
        i = sq['playerIndex']
        scores[i] = max(scores[i], sq['value'])
    result = {'scores': scores}
    winners = list(filter(lambda i: i[1] == max(scores), enumerate(scores)))
    if len(winners) > 1:
      result['draw'] = True
    else:
      result['win'] = winners[0][0]
    return result

  def playerHasAvailableMove(self):
    playerIndex = self.gameState['activePlayerIndex']
    grid = self.gameState['grid']
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
                grid[r + dr][c + dc]['playerIndex'] == playerIndex):
              return True
    return False

  def action(self, action):
    grid = self.gameState['grid']
    playerIndex = action['playerIndex']
    rowFrom = action['rowFrom']
    colFrom = action['colFrom']
    rowTo = action['rowTo']
    colTo = action['colTo']
    if self.gameState['activePlayerIndex'] is None:
      return False
    if (playerIndex != self.gameState['activePlayerIndex'] or
        rowFrom - rowTo < -1 or rowFrom - rowTo > 1 or
        colFrom - colTo < -1 or colFrom - colTo > 1 or
        grid[rowFrom][colFrom] is None or
        grid[rowFrom][colFrom]['playerIndex'] != playerIndex or
        grid[rowTo][colTo]):
      return False
    direction = _getDirection(rowFrom, colFrom, rowTo, colTo)
    value = grid[rowFrom][colFrom]['value'] + 1
    newGameState = copy.deepcopy(self.gameState)
    newGameState['grid'][rowTo][colTo] = {
        'playerIndex': playerIndex, 'value': value, 'from': direction}
    newGameState['lastMove'] = {'row': rowTo, 'col': colTo}
    newGameState['turnSequence'].append(playerIndex)
    self._gameState = newGameState
    self.checkGameEndCondition()
    self.nextPlayerTurn()
    return True


def _sq(playerIndex, value, direction):
	return {'playerIndex': playerIndex, 'value': value, 'from': direction}


def _getDirection(rowFrom, colFrom, rowTo, colTo):
  return _directionHelper[rowTo - rowFrom][colTo - colFrom]


def _makeGrid(gridSize, playerCount):
  grid = [[None for i in range(gridSize)] for j in range(gridSize)]
  if playerCount == 2:
    playerCorners = ['NW', 'SE']
  if playerCount == 4:
    playerCorners = ['NW', 'NE', 'SE', 'SW']
  for i, corner in enumerate(playerCorners):
    row = 0 if corner[0] == 'N' else -1
    col = 0 if corner[1] == 'W' else -1
    for val in range(1, int(gridSize / 2) + 1):
      grid[row][col] = _sq(i, val, corner if val > 1 else None)
      row += (1 if corner[0] == 'N' else -1)
      col += (1 if corner[1] == 'W' else -1)
  return grid

