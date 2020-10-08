from .basemodel import BaseModel
from application import db, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
  return User.query.get(int(user_id))


class User(UserMixin, BaseModel):
  """Represents an authenticated user."""
  email = db.Column(db.String())
  family_name = db.Column(db.String())
  given_name = db.Column(db.String())
  locale = db.Column(db.String())
  name = db.Column(db.String())
  picture = db.Column(db.String())
  sub = db.Column(db.String())

  def is_admin(self):
    return self.email in [
        'adambildersee@gmail.com', 'mathwithbaddrawings@gmail.com']

