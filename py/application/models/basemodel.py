from application import db
from datetime import datetime
import base64


class BaseModel(db.Model):
  __abstract__  = True

  id = db.Column(db.Integer, primary_key=True)
  date_created = db.Column(db.DateTime, default=datetime.utcnow)
  date_modified = db.Column(
      db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

  @classmethod
  def get(cls, session, **kwargs):
    instance = session.query(cls).filter_by(**kwargs).first()
    if instance:
      return instance

  @classmethod
  def create(cls, session, **kwargs):
    """Does not ensure uniqueness of kwargs."""
    instance = cls(**kwargs)
    session.add(instance)
    session.commit()
    return instance

  @classmethod
  def get_or_create(cls, session, **kwargs):
    instance = cls.get(session, **kwargs)
    if instance:
      return instance
    else:
      instance = cls(**kwargs)
      session.add(instance)
      session.commit()
      return instance

  def json(self):
    cols = self.__table__.columns
    result = { c.name: _getattr(self, c.name) for c in cols }
    return result

def _getattr(obj, attr):
  result = getattr(obj, attr)
  if isinstance(result, bytes):
    return base64.b64encode(result).decode('utf-8')
  if isinstance(result, datetime):
    return result.isoformat()
  return result

