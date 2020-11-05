from . import registry
import boto3
import json
import os


BOT_SQS_ARN = os.environ.get('BOT_SQS_ARN', None)
_defaultDelaySeconds = 2

_lambdaClient = boto3.client('lambda')
_sqsResource = boto3.resource('sqs')
_queue = _sqsResource.get_queue_by_name(QueueName=BOT_SQS_ARN.split(':')[-1])


class Invoker():

  def __init__(self, gameType, botOwner):
    self.bot = registry.getEntry(gameType, botOwner)

  @classmethod
  def isGameAwaitingBotAction(cls, game, playerIndex):
    """Determins whether to put an action onto the bot queue."""
    if playerIndex is None:
      return False
    return (
        game.canPlayerAct(playerIndex) and
        game.gameSettings['players'][playerIndex]['playerType'] == 'bot')

  @classmethod
  def receive(cls, gameKey, gameType, game):
    """Receives a message from the bot queue."""
    update = False
    for item in _queue.receive_messages():
      message = json.loads(item.body)
      if message['gameKey'] != gameKey:
        continue
      playerIndex = message['playerIndex']
      player = game.gameSettings['players'][playerIndex]
      invoker = Invoker(gameType, player['owner'])
      invoker.action(game, playerIndex)
      item.delete()
      update = True
    return update

  def put(self, gameKey, playerIndex):
    """Puts a game onto the bot queue."""
    message = { 'gameKey': gameKey, 'playerIndex': playerIndex, }
    _queue.send_message(
        MessageBody=json.dumps(message), DelaySeconds=_defaultDelaySeconds)

  def action(self, game, playerIndex):
    """Makes a move in a game for a bot player."""
    req = {
      'request': 'action',
      'gameState': game.gameState, 'gameSettings': game.gameSettings,
      'playerIndex': playerIndex,
    }
    rsp = _lambdaClient.invoke(
        FunctionName=self.bot.get('arn'), Payload=json.dumps(req))
    body = json.loads(rsp['Payload'].read())
    game.action(body.get('action'))

