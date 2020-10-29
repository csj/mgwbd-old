import copy
import random
from application.games.game import Game
from application.games.mechanics.simultaneousMove import simultaneousMove


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

  @classmethod
  def getSettingsConfig(cls):
    return [
      {
        'canonicalName': 'players:playerCount',
        'displayName': 'Player count',
        'values': [2, 3, 4],
        'defaultValue': 2,
      },
    ]

  @classmethod
  def getInitialGameState(cls, gameSettings=None):
    numCols = 5
    numRows = 5
    grid = [[None] * numCols for i in range(numRows)]
    return {
      'grids': [grid for p in gameSettings['players']],
      'die': {'rolled': False, 'value': 10},
      'pendingMove': {},
      'lastMove': {},
      'playerTurn': None,
    }

  def nextPlayerTurn(self):
    # Players move simultaneously in this game.
    self.gameState['activePlayerIndex'] = None

  def rollAction(self):
    newGameState = copy.deepcopy(self.gameState)
    value = random.randint(1, 10)
    newGameState['die'] = { 'rolled': True, 'value': value }
    newGameState['lastMove'] = {'die': value}
    self._gameState = newGameState
    return True

  def isValidGridAction(self, action):
    playerIndex = action.get('playerIndex')
    grid = self.gameState['grids'][playerIndex]
    row = action.get('row')
    col = action.get('col')
    if grid[row][col]:
      return False  # invalid selection
    return True

  @simultaneousMove(isValidFn='isValidGridAction')
  def gridAction(self, actionList):
    newGameState = copy.deepcopy(self.gameState)
    lastMove = []
    for i, action in enumerate(actionList):
      grid = newGameState['grids'][i]
      row = action.get('row')
      col = action.get('col')
      grid[row][col] = {'value': newGameState['die']['value']}
      lastMove.append({'row': row, 'col': col})
    newGameState['die'] = {
        'rolled': False, 'value': newGameState['die']['value']}
    newGameState['lastMove'] = {'players': lastMove}
    self._gameState = newGameState
    return True

  def gridActionOld(self, action):
    newGameState = copy.deepcopy(self.gameState)
    playerIndex = action.get('playerIndex')
    grid = self.gameState['grids'][playerIndex]
    row = action.get('row')
    col = action.get('col')
    if grid[row][col]:
      return False  # invalid selection
    if str(playerIndex) in newGameState['pendingMove']:
      return False  # player already made a selection
    newGameState['pendingMove'][str(playerIndex)] = self.pme.encode(
        { 'row': row, 'col': col })
    if set(newGameState['pendingMove'].keys()).issuperset(
        set([str(i) for i in range(len(self.gameSettings['players']))])):
      lastMove = []
      for i in range(len(self.gameSettings['players'])):
        encodedMove = newGameState['pendingMove'][str(i)]
        move = self.pme.decode(encodedMove)
        grid = newGameState['grids'][i]
        row = move.get('row')
        col = move.get('col')
        grid[row][col] = {'value': newGameState['die']['value']}
        lastMove.append({'row': row, 'col': col})
      newGameState['pendingMove'] = {}
      newGameState['die'] = {
          'rolled': False, 'value': newGameState['die']['value']}
      newGameState['lastMove'] = {'players': lastMove}
    self._gameState = newGameState
    return True

  def action(self, action):
    result = False
    if 'roll' in action and not self.gameState['die']['rolled']:
      result = self.rollAction()
    if 'playerIndex' in action and self.gameState['die']['rolled']:
      result = self.gridAction(action)
    self.checkGameEndCondition()
    return result

  def gameEndCondition(self):
    grid = self.gameState['grids'][0]
    for row in range(len(grid)):
      for col in range(len(grid[0])):
        if not grid[row][col]:
          return None
    scores = self.calculateScores(self.gameState['grids'])
    return self.calculateWinner(scores)

  def calculateScores(self, grids):
    return [self.calculateScore(grid) for grid in grids]

  def calculateScore(self, grid):
    score = 0
    for row in range(len(grid)):
      prevVal = 0
      qty = 0
      for col in range(len(grid[0])):
        value = grid[row][col]['value']
        if value == prevVal:
          qty += 1
        else:
          prevVal = value
          qty = 1
        if qty > 1:
          score += value
        if qty == 2: # Compensate for not counting when qty was 1
          score += value
    for col in range(len(grid[0])):
      prevVal = 0
      qty = 0
      for row in range(len(grid)):
        value = grid[row][col]['value']
        if value == prevVal:
          qty += 1
        else:
          prevVal = value
          qty = 1
        if qty > 1:
          score += value
        if qty == 2: # Compensate for not counting when qty was 1
          score += value
    return score

  def calculateWinner(self, scores):
    result = {'scores': scores}
    winners = list(filter(lambda i: i[1] == max(scores), enumerate(scores)))
    if len(winners) > 1:
      result['draw'] = True
    else:
      result['win'] = winners[0][0]
    return result

