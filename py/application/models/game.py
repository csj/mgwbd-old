from .basemodel import BaseModel
from .sqldict import JSONEncodedDict, MutableDict
from application import db


class GameInstance(BaseModel):
  """Represents one instance of gameplay."""
  gameKey = db.Column(db.String(8), index=True)
  hostDomain = db.Column(db.String(40))
  gameType = db.Column(db.String(40))
  gameSettings = db.Column(MutableDict.as_mutable(JSONEncodedDict))
  gameState = db.Column(MutableDict.as_mutable(JSONEncodedDict))
  gamePhase = db.Column(db.Integer())

  def __repr__(self):
    return '[GameInstance (id:{}) {}]'.format(self.id, self.gameKey)

class ArchivedGameInstance(BaseModel):
  """Represents a game in the past."""
  hostDomain = db.Column(db.String(40))
  gameType = db.Column(db.String(40))
  gamePhase = db.Column(db.Integer())
  gameStart = db.Column(db.DateTime)
  gameEnd = db.Column(db.DateTime)

