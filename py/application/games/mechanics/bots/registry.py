

_REGISTRY = {
  'prophecies': [
    {
      'name': 'Unpredictabot',
      'owner': 'prophecies-random-bot',
      'arn': 'arn:aws:lambda:us-west-1:679683973944:function:mgwbd-prophecies-bot-random',
    },
  ],
}


def getList(gameName):
  return _REGISTRY.get(gameName, [])


def getEntry(gameName, botOwner):
  return next(
      filter(
          lambda i: i['owner'] == botOwner,
          getList(gameName)),
      None)

