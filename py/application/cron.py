from application import db
from application.games import archive
from application.models import GameInstance
from datetime import datetime, timedelta


_STALE_AGE = timedelta(hours=3)


def archiveStaleGames():
  date = datetime.utcnow() - _STALE_AGE
  results = db.session.query(GameInstance) \
      .filter(GameInstance.date_modified < date) \
      .all()
  for gi in results:
    archive.archiveGameInstance(gi)
  db.session.commit()

