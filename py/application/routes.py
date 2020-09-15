#import boto3
import os
from flask import Blueprint, jsonify, redirect, render_template, request
from flask_cors import cross_origin
from werkzeug.exceptions import BadRequest
from application.games import gamePlayer
from application import cron


MAIN_GROUP = 'main'
CRON_GROUP = 'cron'

main_blueprint = Blueprint(MAIN_GROUP, __name__, template_folder='../static')
cron_blueprint = Blueprint(CRON_GROUP, __name__)


def register_blueprints(app):
  app.register_blueprint(main_blueprint)
  app.register_blueprint(cron_blueprint)


@main_blueprint.route('/')
@main_blueprint.route('/<path:path>')  # catch-all route  # TODO allow static pass-through
def landing(path=''):
  if 'localhost:' in request.host:
    return 'On localhost, access index.html by running frontend server separately'
  return render_template('index.html')

@main_blueprint.route('/favicon.ico')
def static_redirect():
  scheme = 'http' if 'localhost:' in request.host else 'https'
  return redirect(scheme + '://' + request.host + '/static' + request.path)

@cron_blueprint.route('/cron/archive-stale-games', methods=['POST'])
def cron_archive_stale_games():
  cron.archiveStaleGames()
  return jsonify({'result': 'success'})

@main_blueprint.route('/gameplay/new', methods=['POST'])
@cross_origin()
def gameplay_new():
  result = gamePlayer.new(request.json['hostDomain'], request.json['gameType'])
  return jsonify(result)

@main_blueprint.route('/gameplay/setsettings', methods=['POST'])
@cross_origin()
def gameplay_setsettings():
  result = gamePlayer.setSettings(
      request.json['gameKey'], request.json['gameSettings'])
  return jsonify(result)

@main_blueprint.route('/gameplay/setphase', methods=['POST'])
@cross_origin()
def gameplay_setphase():
  result = gamePlayer.setPhase(
      request.json['gameKey'], request.json['gamePhase'])
  return jsonify(result)

@main_blueprint.route('/gameplay/start', methods=['POST'])
@cross_origin()
def gameplay_start():
  result = gamePlayer.start(
      request.json['gameKey'], request.json['gameSettings'])
  return jsonify(result)

@main_blueprint.route('/gameplay/query', methods=['GET'])
@cross_origin()
def gameplay_query():
  result = gamePlayer.query(request.args['gameKey'])
  return jsonify(result)

@main_blueprint.route('/gameplay/poll', methods=['GET'])
@cross_origin()
def gameplay_poll():
  result = gamePlayer.poll(
      request.args['gameKey'], int(request.args['lastSeenMillis']))
  return jsonify(result)

@main_blueprint.route('/gameplay/action', methods=['POST'])
@cross_origin()
def gameplay_action():
  result = gamePlayer.action(
      request.json['gameKey'], request.json['clientCode'],
      request.json['action'])
  return jsonify(result)

# TODO make this admin-protected
@main_blueprint.route('/admin/internal/environment')
@cross_origin()
def internal_environment():
  return jsonify({
    'result': 'success',
    'os.environ': dict(**os.environ),
  })

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

