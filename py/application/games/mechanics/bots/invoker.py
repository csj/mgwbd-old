from . import registry
import boto3
import json
import os


BOT_SQS_ARN = os.environ.get('BOT_SQS_ARN', None)
_boto3Region = 'us-west-1'
_defaultDelaySeconds = 0


if not BOT_SQS_ARN:
  raise ValueError('BOT_SQS_ARN environment variable is not set.')


_lambdaClient = boto3.client('lambda', region_name=_boto3Region)
_sqsResource = boto3.resource('sqs', region_name=_boto3Region)
_queue = _sqsResource.get_queue_by_name(QueueName=BOT_SQS_ARN.split(':')[-1])


class Invoker():

  def __init__(self, gameType, gameKey):
    self.gameType = gameType
    self.gameKey = gameKey

  def isGameAwaitingBotAction(self, game, playerIndex):
    """Determins whether to put an action onto the bot queue."""
    if playerIndex is None:
      return False
    return (
        game.canPlayerAct(playerIndex) and
        game.gameSettings['players'][playerIndex]['playerType'] == 'bot')

  def receive(self, game):
    """Receives a message from the bot queue."""
    update = False
    for item in _queue.receive_messages():
      message = json.loads(item.body)
      if message['gameKey'] != self.gameKey:
        continue
      playerIndex = message['playerIndex']
      player = game.gameSettings['players'][playerIndex]
      self.action(game, playerIndex, player.get('owner'))
      item.delete()
      update = True
    return update

  def putIf(self, game):
    nextPlayerIndex = game.gameState.get('activePlayerIndex')
    if self.isGameAwaitingBotAction(game, nextPlayerIndex):
      self.put(nextPlayerIndex)

  def put(self, playerIndex):
    """Puts a game onto the bot queue."""
    message = { 'gameKey': self.gameKey, 'playerIndex': playerIndex, }
    _queue.send_message(
        MessageBody=json.dumps(message), DelaySeconds=_defaultDelaySeconds)

  def action(self, game, playerIndex, botOwner):
    """Makes a move in a game for a bot player."""
    botConfig = registry.getEntry(self.gameType, botOwner)
    req = {
      'request': 'action',
      'gameState': game.gameState, 'gameSettings': game.gameSettings,
      'playerIndex': playerIndex,
    }
    rsp = _lambdaClient.invoke(
        FunctionName=botConfig.get('arn'), Payload=json.dumps(req))
    body = json.loads(rsp['Payload'].read())
    game.action(body.get('action'))
    self.putIf(game)

