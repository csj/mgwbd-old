#import boto3
import os
from flask import Blueprint, jsonify, redirect, render_template, request
from flask_cors import cross_origin
from werkzeug.exceptions import BadRequest


MAIN_GROUP = 'main'

main_blueprint = Blueprint(MAIN_GROUP, __name__, template_folder='../static')


def register_blueprints(app):
  app.register_blueprint(main_blueprint)


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
  return jsonify({ 'result': result })

@main_blueprint.errorhandler(BadRequest)
def handle_bad_request(error):
  rsp = jsonify({
    'status_code': error.code,
    'message': error.description,
  })
  rsp.status_code = error.code
  return rsp

