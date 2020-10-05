

class Game():
  def nextPlayerTurn(self, gameState, **kwargs):
    # By default, assumes two players alternating
    if 'gameEnd' in gameState and gameState['gameEnd']:
      gameState['activePlayerIndex'] = None
    elif gameState['activePlayerIndex'] is None:
      gameState['activePlayerIndex'] = 0
    else:
      gameState['activePlayerIndex'] = (gameState['activePlayerIndex'] + 1) % 2

  def checkGameEndCondition(self, gameState):
    gameState['gameEnd'] = self.gameEndCondition(gameState)

  def gridDiff(self, oldGrid, newGrid):
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

  def gameEndCondition(self, gameState):
    return None

  def getDefaultPlayerConfig(self):
    return [
      {'playerType': 'human', 'owner': None, 'name': 'Player 1', 'style': 'A'},
      {'playerType': 'human', 'owner': None, 'name': 'Player 2', 'style': 'B'},
    ]

  def getSettingsConfig(self):
    return []

  def getInitialGameState(self, gameSettings):
    return {}

  def action(self, gameState, action, **kwargs):
    return gameState

