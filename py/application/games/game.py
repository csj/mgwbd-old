from .constants import GamePhase


class Game():

  def __init__(self, gameSettings=None, gameState=None, gamePhase=None):
    self._gameSettings = gameSettings
    self._gameState = gameState
    self._gamePhase = gamePhase

  @property
  def gameSettings(self):
    return self._gameSettings

  @property
  def gameState(self):
    return self._gameState

  @property
  def gamePhase(self):
    return self._gamePhase

  @classmethod
  def getDefaultPlayerConfig(cls):
    return [
      {'playerType': 'human', 'owner': None, 'name': 'Player 1', 'style': 'A'},
      {'playerType': 'human', 'owner': None, 'name': 'Player 2', 'style': 'B'},
    ]

  @classmethod
  def getSettingsConfig(cls):
    return []

  @classmethod
  def getInitialGameState(cls, gameSettings=None):
    return {}

  def start(self):
    self._gamePhase = GamePhase.PLAYING.value
    self.nextPlayerTurn()

  def nextPlayerTurn(self):
    # By default, assumes two players alternating
    if 'gameEnd' in self._gameState and self._gameState['gameEnd']:
      self._gameState['activePlayerIndex'] = None
    elif ('activePlayerIndex' not in self._gameState or
          self._gameState['activePlayerIndex'] is None):
      self._gameState['activePlayerIndex'] = 0
    else:
      numPlayers = len(self._gameSettings['players'])
      self._gameState['activePlayerIndex'] = (
          self._gameState['activePlayerIndex'] + 1) % numPlayers

  def checkGameEndCondition(self):
    self._gameState['gameEnd'] = self.gameEndCondition()

  def gameEndCondition(self):
    return None

  def action(self, action):
    return None


