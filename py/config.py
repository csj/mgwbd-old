import os
from dotenv import load_dotenv


BASEDIR = os.path.abspath(os.path.dirname(__file__))

load_dotenv(os.path.join(BASEDIR, '.env'))


class BaseConfig(object):
  APP_CORS = False
  AWS_REGION = 'us-west-1'
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
  print(SQLALCHEMY_DATABASE_URI)
  SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevConfig(BaseConfig):
  APP_CORS = True


class ProdConfig(BaseConfig):
  pass


# TODO switch this based on environment
Config=DevConfig


