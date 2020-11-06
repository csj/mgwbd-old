import os
from flask import Blueprint, jsonify, redirect, render_template, request
from flask_cors import cross_origin
from flask_login import current_user, login_required
from werkzeug.exceptions import BadRequest
from application.games import driver
from application import cron
from application import oauth


MAIN_GROUP = 'main'
CRON_GROUP = 'cron'

main_blueprint = Blueprint(MAIN_GROUP, __name__, template_folder='../static')
cron_blueprint = Blueprint(CRON_GROUP, __name__)


def register_blueprints(app):
  app.register_blueprint(main_blueprint)
  app.register_blueprint(cron_blueprint)


@main_blueprint.route('/')
@main_blueprint.route('/<path:path>')
def landing(path=''):
  if 'localhost:' in request.host:
    host = os.environ.get('FRONTEND_CLIENT_HOST')
    return redirect(request.scheme + '://' + host + request.path)
  return render_template('index.html')

@main_blueprint.route('/favicon.ico')
def static_redirect():
  scheme = 'http' if 'localhost:' in request.host else 'https'
  return redirect(scheme + '://' + request.host + '/static' + request.path)

@cron_blueprint.route('/cron/archive-stale-games', methods=['POST'])
def cron_archive_stale_games():
  cron.archiveStaleGames()
  return jsonify({'result': 'success'})

@main_blueprint.route('/account/info')
@cross_origin()
def account_info():
  result = None
  if current_user.is_authenticated:
    result = current_user.json()
  return jsonify(result)

@main_blueprint.route('/account/login')
@cross_origin()
def account_login():
  request_uri = oauth.getOauthUrl(request.base_url + '/callback')
  return jsonify({'oauth_url': request_uri})

@main_blueprint.route('/account/login/callback')
@cross_origin()
def account_login_callback():
  oauth.handleOauthCallback(
      request.args.get('code'), request.url, request.base_url)
  return redirect('/account')

@main_blueprint.route('/account/logout', methods=['POST'])
@cross_origin()
@login_required
def account_logout():
  oauth.logoutUser()
  return jsonify({'success': True})

@main_blueprint.route('/gameplay/new', methods=['POST'])
@cross_origin()
def gameplay_new():
  result = driver.new(request.json['hostDomain'], request.json['gameType'])
  return jsonify(result)

@main_blueprint.route('/gameplay/setsettings', methods=['POST'])
@cross_origin()
def gameplay_setsettings():
  result = driver.setSettings(
      request.json['gameKey'], request.json['gameSettings'])
  return jsonify(result)

@main_blueprint.route('/gameplay/setphase', methods=['POST'])
@cross_origin()
def gameplay_setphase():
  result = driver.setPhase(
      request.json['gameKey'], request.json['gamePhase'])
  return jsonify(result)

@main_blueprint.route('/gameplay/start', methods=['POST'])
@cross_origin()
def gameplay_start():
  result = driver.start(
      request.json['gameKey'], request.json['gameSettings'])
  return jsonify(result)

@main_blueprint.route('/gameplay/query', methods=['GET'])
@cross_origin()
def gameplay_query():
  result = driver.query(request.args['gameKey'])
  return jsonify(result)

@main_blueprint.route('/gameplay/poll', methods=['GET'])
@cross_origin()
def gameplay_poll():
  result = driver.poll(
      request.args['gameKey'], int(request.args['lastSeenMillis']))
  return jsonify(result)

@main_blueprint.route('/gameplay/action', methods=['POST'])
@cross_origin()
def gameplay_action():
  result = driver.action(
      request.json['gameKey'], request.json['clientCode'],
      request.json['action'])
  return jsonify(result)

@main_blueprint.route('/admin/internal/environment')
@cross_origin()
@login_required
def internal_environment():
  if current_user and current_user.is_admin():
    return jsonify({
      'result': 'success',
      'os.environ': dict(**os.environ),
    })
  return jsonify({})

@main_blueprint.route('/test', methods=['GET', 'POST'])
@cross_origin()
def test():
  result = 'hello'
  print('/test called')
  return jsonify({ 'result': result })

@main_blueprint.errorhandler(BadRequest)
def handle_bad_request(error):
  rsp = jsonify({
    'status_code': error.code,
    'message': error.description,
  })
  rsp.status_code = error.code
  return rsp

