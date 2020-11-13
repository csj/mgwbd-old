import copy
from application.games.game import Game


"""
Example game state:
  {
    squares: [
      {status: 'occupied', owner: 1}, # owner is 0 or 1
      {status: 'available', tunnels: []}, # list of tunnel indices
      {status: 'available', tunnels: [0, 2]},
      {status: 'available', tunnels: [0, 1]},
      {status: 'available', tunnels: [1, 2]},
      ...
    ], # list of length 9
    tunnels: [
      {owner: 0, squares: [2, 3],},
      {owner: 1, squares: [3, 4],},
      {owner: 0, squares: [2, 4],},
    ],
    cycle: [2, 3, 4], # cycle: [list of square indices] or cycle: None
  }

Example actions:
  {owner: 0, tunnel: {squares: [4, 5]}},
  {owner: 1, collapse: [2, 0, 1]},
  {owner: 1, collapse: [list of tunnel indices]},
    # 'collapse' list is 1:1 with squares, i.e. nth item of 'collapse' list
    #     corresponds to nth item of 'gameState.cycle' list.
    # 'collapse' list element indicates, for nth square, which tunnel resolves
    #     to this square
    # only includes indices in the cycle. other (secondary) tunnels may be
    #     collapsed by this action as well.
"""


class QuantumTicTacToe(Game):

  @classmethod
  def getSettingsConfig(cls):
    return []

  @classmethod
  def getInitialGameState(cls, gameSettings=None):
    return {
      'squares': [{'status': 'available', 'tunnels': []} for i in range(9)],
      'tunnels': [],
      'cycle': None,
    }
    '''
    return {
      'squares': [
        {'status': 'occupied', 'owner': 0},
        {'status': 'occupied', 'owner': 1},
        {'status': 'available', 'tunnels': [0, 2]},
        {'status': 'available', 'tunnels': [0, 1]},
        {'status': 'available', 'tunnels': [1, 2, 3]},
        {'status': 'available', 'tunnels': [4]},
        {'status': 'available', 'tunnels': []},
        {'status': 'available', 'tunnels': [3]},
        {'status': 'available', 'tunnels': [4]},
      ],
      'tunnels': [
        {'owner': 0, 'squares': [2, 3],},
        {'owner': 1, 'squares': [3, 4],},
        {'owner': 0, 'squares': [2, 4],},
        {'owner': 1, 'squares': [7, 4],},
        {'owner': 0, 'squares': [5, 8],},
      ],
      'cycle': [2, 3, 4],
    }
    '''

  def detectCycle(self, gameState):
    squares = gameState.get('squares')
    tunnels = gameState.get('tunnels')
    lastTunnel = tunnels[-1]
    tunnelIndices = set([len(tunnels) - 1])
    squareIndices = set(lastTunnel.get('squares'))
    
    newChanges = True
    while newChanges:
      newChanges = False
      for tunnelIndex, tunnel in enumerate(tunnels):
        if not tunnel.get('squares'):
          continue
        squareAindex = tunnel.get('squares')[0]
        squareBindex = tunnel.get('squares')[1]
        if squareAindex in squareIndices or squareBindex in squareIndices:
          if (squareAindex not in squareIndices or
              squareBindex not in squareIndices):
            newChanges = True
          squareIndices.add(squareAindex)
          squareIndices.add(squareBindex)
          tunnelIndices.add(tunnelIndex)

    newChanges = True
    while newChanges:
      newChanges = False
      for squareIndex, square in enumerate(squares):
        tunnelSet = set(square.get('tunnels', [])).intersection(tunnelIndices)
        if squareIndex in squareIndices and len(tunnelSet) <= 1:
          if len(tunnelSet):
            tunnelIndex = tunnelSet.pop()
            tunnelIndices.remove(tunnelIndex)
          squareIndices.remove(squareIndex)
          newChanges = True

    if len(squareIndices):
      return list(squareIndices)
    return None

  def tunnelAction(self, action):
    newGameState = copy.deepcopy(self.gameState)
    squares = newGameState.get('squares')
    tunnels = newGameState.get('tunnels')
    tunnelIndex = len(tunnels)
    squareAindex = int(action.get('tunnel').get('squares')[0])
    squareBindex = int(action.get('tunnel').get('squares')[1])
    squareA = squares[squareAindex]
    squareB = squares[squareBindex]
    if 'owner' in squareA or 'owner' in squareB:
      return False

    tunnels.append({
        'owner': action.get('owner'), 'squares': [squareAindex, squareBindex]})
    squareA.get('tunnels').append(tunnelIndex)
    squareB.get('tunnels').append(tunnelIndex)

    newGameState['cycle'] = self.detectCycle(newGameState)
    newGameState['lastMove'] = {'tunnel': tunnelIndex}

    self._gameState = newGameState
    self.checkGameEndCondition()
    self.nextPlayerTurn()
    return True

  def resolveSquareTunnel(self, square, tunnel):
    square['status'] = 'occupied'
    square['owner'] = tunnel['owner']
    del square['tunnels']
    del tunnel['squares']

  def collapseAction(self, action):
    if len(self.gameState.get('cycle')) != len(action.get('collapse')):
      return False

    newGameState = copy.deepcopy(self.gameState)
    squares = newGameState.get('squares')
    tunnels = newGameState.get('tunnels')
    for i, squareIndex in enumerate(self.gameState.get('cycle')):
      tunnel = tunnels[int(action.get('collapse')[i])]
      if squareIndex not in tunnel.get('squares'):
        return False
      self.resolveSquareTunnel(squares[squareIndex], tunnel)

    affectedSquares = newGameState['cycle']
    somethingChanged = True
    while somethingChanged:
      somethingChanged = False
      for tunnel in tunnels:
        if 'squares' not in tunnel:
          continue
        squareA = squares[tunnel.get('squares')[0]]
        squareB = squares[tunnel.get('squares')[1]]
        if squareA['status'] == 'occupied':
          affectedSquares.append(tunnel.get('squares')[1])
          self.resolveSquareTunnel(squareB, tunnel)
          somethingChanged = True
        elif squareB['status'] == 'occupied':
          affectedSquares.append(tunnel.get('squares')[0])
          self.resolveSquareTunnel(squareA, tunnel)
          somethingChanged = True

    newGameState['lastMove'] = {'squares': affectedSquares}
    newGameState['cycle'] = None
    self._gameState = newGameState
    self.checkGameEndCondition()
    # Player who 'collapsed' the waveform may place the next tunnel.
    return True

  def action(self, action):
    if action.get('owner') != self.gameState.get('activePlayerIndex'):
      return False
    if 'collapse' in action and self.gameState['cycle']:
      return self.collapseAction(action)
    if 'tunnel' in action and not self.gameState['cycle']:
      return self.tunnelAction(action)
    return False

  def gameEndCondition(self):
    squares = self.gameState.get('squares')
    triads = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]]
    winners = set()
    for triad in triads:
      winners.add(self.isVictory(squares[i] for i in triad))
    winners.remove(None)
    if len(winners) == 1:
      return {'win': winners.pop()}
    if len(winners) == 2:
      return {'draw': True}
    numOwnedSquares = sum(1 if 'owner' in square else 0 for square in squares)
    if numOwnedSquares >= 8:
      return {'draw': True}
    return None

  def isVictory(self, squares):
    owners = set([s.get('owner') for s in squares])
    return None if len(owners) > 1 else owners.pop()




