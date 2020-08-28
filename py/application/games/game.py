

class Game():
  def nextPlayerTurn(self, gameState):
    # By default, assumes two players alternating
    gameState['activePlayer'] = gameState['activePlayer'] % 2 + 1
    return gameState

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

  def action(self, gameState, action):
    return gameState

