import json
import os
import requests
from oauthlib.oauth2 import WebApplicationClient
from application import db
from application.models import User
from flask_login import login_user, logout_user


# Client constants configured here:
# https://console.developers.google.com/apis/credentials?project=math-games-with-bad-drawings
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', None)
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', None)
GOOGLE_DISCOVERY_URL = (
    'https://accounts.google.com/.well-known/openid-configuration')


def getOauthUrl(callbackPath):
  google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
  authorization_endpoint = google_provider_cfg['authorization_endpoint']
  client = WebApplicationClient(GOOGLE_CLIENT_ID)
  request_uri = client.prepare_request_uri(
      authorization_endpoint,
      redirect_uri=callbackPath,
      scope=['openid', 'email', 'profile'])
  return request_uri

def handleOauthCallback(code, authResponseUrl, redirectUrl):
  google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
  token_endpoint = google_provider_cfg['token_endpoint']
  client = WebApplicationClient(GOOGLE_CLIENT_ID)

  token_url, headers, body = client.prepare_token_request(
      token_endpoint,
      authorization_response=authResponseUrl,
      redirect_url=redirectUrl,
      code=code)
  token_rsp = requests.post(
      token_url,
      headers=headers,
      data=body,
      auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET))
  client.parse_request_body_response(json.dumps(token_rsp.json()))

  userinfo_endpoint = google_provider_cfg['userinfo_endpoint']
  user_info_url, headers, body = client.add_token(userinfo_endpoint)
  user_info_rsp = requests.get(user_info_url, headers=headers, data=body)
  user_info = user_info_rsp.json()

  user = User.get_or_create(db.session, sub=user_info['sub'])
  for key, val in user_info.items():
    setattr(user, key, val)
  login_user(user)
  db.session.commit()
  return True

def logoutUser():
  logout_user()

