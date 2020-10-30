from . import registry
import boto3
import json


class Invoker():

  def __init__(self, gameName, botName):
    self.bot = registry.getEntry(gameName, botName)
    self.client = boto3.client('lambda')

  def action(self, game, playerIndex):
    req = {
      'request': 'action',
      'gameState': game.gameState, 'gameSettings': game.gameSettings,
      'playerIndex': playerIndex,
    }
    rsp = self.client.invoke(
        FunctionName=self.bot.get('arn'), Payload=json.dumps(req))
    body = json.loads(rsp['Payload'].read())
    print(body)
    game.action(body.get('action'))

