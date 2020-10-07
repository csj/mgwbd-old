from datetime import timedelta
from flask import Flask, session
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from config import Config


# Globally accessible libraries
db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()


def cors_init_app(app):
  if Config.APP_CORS:
    # Several notes here:
    #   - 'CORS(app[, ...]) does not seem to enable cors on its own,
    #     @cross_origin() decorator still needed
    #   - 'support_credentials' arg seems to have no effect; header added
    #     manually below
    #   - nor does the 'origins' kwarg appear to do anything
    #   - 'expose_headers=['X-CSRFToken']' appears not to be needed, as the
    #     token comes in via the session cookie instead.
    CORS(app)
    @app.after_request
    def add_cors(rv):
      rv.headers.add('Access-Control-Allow-Credentials', 'true')
      return rv


def session_timeout_init_app(app):
  @app.before_request
  def before_request():
    session.permanent = True
    session.modified = True
    app.permanent_session_lifetime = timedelta(minutes=15)
 

def create_app():
  """Initializes the core application."""
  app = Flask(__name__, instance_relative_config=False)
  app.secret_key = b'\x55\xea\x12\x09\x08\x34\x99\xaa'
  app.config.from_object(Config)

  # Initialize Plugins
  db.init_app(app)
  login_manager.init_app(app)
  migrate.init_app(app, db)
  cors_init_app(app)
  session_timeout_init_app(app)

  with app.app_context():
    from . import routes
    from . import models

    routes.register_blueprints(app)

    return app

