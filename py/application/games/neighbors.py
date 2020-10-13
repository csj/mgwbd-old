import copy
import jwt
import random
from .game import Game
from .mechanics.partialMoveEncoder import PartialMoveEncoder

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
  pme = PartialMoveEncoder()

  def getInitialGameState(self, gameSettings=None):
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
 
  def getSettingsConfig(self):
    return []

  def nextPlayerTurn(self, gameState, **kwargs):
    gameState['activePlayerIndex'] = None # Players move simultaneously in this game.

  def rollAction(self, gameState):
    newGameState = copy.deepcopy(gameState)
    value = random.randint(1, 10)
    newGameState['die'] = { 'rolled': True, 'value': value }
    newGameState['lastMove'] = {'die': value}
    return newGameState

  def gridAction(self, gameState, action, gameSettings=None):
    newGameState = copy.deepcopy(gameState)
    playerIndex = action.get('playerIndex')
    grid = gameState['grids'][playerIndex]
    row = action.get('row')
    col = action.get('col')
    if grid[row][col]:
      return newGameState # invalid selection
    if str(playerIndex) in newGameState['pendingMove']:
      return newGameState # player already made a selection
    newGameState['pendingMove'][str(playerIndex)] = self.pme.encode(
        { 'row': row, 'col': col })
    if set(newGameState['pendingMove'].keys()).issuperset(
        set([str(i) for i in range(len(gameSettings['players']))])):
      lastMove = []
      for i in range(len(gameSettings['players'])):
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
    return newGameState

  def action(self, gameState, action, gamePhase=None, gameSettings=None):
    if 'roll' in action and not gameState['die']['rolled']:
      newGameState = self.rollAction(gameState)

    if 'playerIndex' in action and gameState['die']['rolled']:
      newGameState = self.gridAction(
          gameState, action, gameSettings=gameSettings)

    self.checkGameEndCondition(newGameState, gameSettings=gameSettings)
    return newGameState

  def gameEndCondition(self, gameState, gameSettings=None):
    grid = gameState['grids'][0]
    for row in range(len(grid)):
      for col in range(len(grid[0])):
        if not grid[row][col]:
          return None
    scores = self.calculateScores(gameState['grids'])
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
    if scores[0] > scores[1]:
      result['win'] = 0
    elif scores[1] > scores[0]:
      result['win'] = 1
    else:
      result['draw'] = True
    return result

