from application import db
from application.models import ArchivedGameInstance, GameInstance
from . import game


def archiveGameInstance(gameInstance):
  # TODO
  gi = gameInstance
  agi = ArchivedGameInstance.create(
      db.session,
      hostDomain=gi.hostDomain,
      gameType=gi.gameType,
      gamePhase=gi.gamePhase,
      gameStart=gi.date_created,
      gameEnd=gi.date_modified)
  db.session.delete(gameInstance)

  # TODO consider capturing some of the game settings too
  #result = db.Column(db.String()) # win, tie, quit, timeout
  #winningScore = db.Column(db.Integer())
  #secondPlaceScore = db.Column(db.Integer())
  #player1Type = db.Column(db.String()) # human, bot
  #player2Type = db.Column(db.String())
  #player3Type = db.Column(db.String())
  #player4Type = db.Column(db.String())
  #isPlayer1LoggedIn = db.Column(db.Boolean())
  #isPlayer2LoggedIn = db.Column(db.Boolean())
  #isPlayer3LoggedIn = db.Column(db.Boolean())
  #isPlayer4LoggedIn = db.Column(db.Boolean())
  #isMultiDevice = db.Column(db.Boolean()) # if two+ human players on two+ devices
  #customGameState1 = db.Column(db.Integer())
  #customGameState2 = db.Column(db.Integer())
  #customGameState3 = db.Column(db.Integer())
  #customGameState4 = db.Column(db.Integer())
  #customGameState5 = db.Column(db.Integer())
  #customGameState6 = db.Column(db.Integer())
  #customGameState7 = db.Column(db.Integer())
  #customGameState8 = db.Column(db.Integer())

