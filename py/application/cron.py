from application import db
from application.models import ArchivedGameInstance, GameInstance
from datetime import datetime, timedelta


_STALE_AGE = timedelta(minutes=30)


def archiveStaleGames():
  date = datetime.utcnow() - _STALE_AGE
  results = db.session.query(GameInstance)\
      .filter(GameInstance.date_modified < date)\
      .all()
  for gi in results:
    agi = ArchivedGameInstance.create(
        db.session, hostDomain=gi.hostDomain, gameType=gi.gameType,
        gamePhase=gi.gamePhase, gameStart=gi.date_created,
        gameEnd=gi.date_modified)
    db.session.delete(gi)
  db.session.commit()

