from .basemodel import BaseModel
from .sqldict import JSONEncodedDict, MutableDict
from application import db


class GameInstance(BaseModel):
  """Represents one instance of gameplay."""
  gameKey = db.Column(db.String(8), index=True)
  hostDomain = db.Column(db.String(60))
  gameType = db.Column(db.String(40))
  gameSettings = db.Column(MutableDict.as_mutable(JSONEncodedDict))
  gameState = db.Column(MutableDict.as_mutable(JSONEncodedDict))
  gamePhase = db.Column(db.Integer())

  def __repr__(self):
    return '[GameInstance (id:{}) {}]'.format(self.id, self.gameKey)

class ArchivedGameInstance(BaseModel):
  """Represents a game in the past."""
  hostDomain = db.Column(db.String(60))
  gameType = db.Column(db.String(40))
  gameSettings = db.Column(MutableDict.as_mutable(JSONEncodedDict))
  gamePhase = db.Column(db.Integer())
  gameStart = db.Column(db.DateTime)
  gameEnd = db.Column(db.DateTime)
  result = db.Column(db.String()) # win, tie, quit, timeout
  winningScore = db.Column(db.Integer())
  secondPlaceScore = db.Column(db.Integer())
  player1Type = db.Column(db.String()) # human, bot
  player2Type = db.Column(db.String())
  player3Type = db.Column(db.String())
  player4Type = db.Column(db.String())
  isPlayer1LoggedIn = db.Column(db.Boolean())
  isPlayer2LoggedIn = db.Column(db.Boolean())
  isPlayer3LoggedIn = db.Column(db.Boolean())
  isPlayer4LoggedIn = db.Column(db.Boolean())
  isMultiDevice = db.Column(db.Boolean()) # if two+ human players on two+ devices
  customGameState1 = db.Column(db.Integer())
  customGameState2 = db.Column(db.Integer())
  customGameState3 = db.Column(db.Integer())
  customGameState4 = db.Column(db.Integer())
  customGameState5 = db.Column(db.Integer())
  customGameState6 = db.Column(db.Integer())
  customGameState7 = db.Column(db.Integer())
  customGameState8 = db.Column(db.Integer())

