

_REGISTRY = {
  'prophecies': [
    {
      'name': 'Random Bot',
      'arn': 'arn:aws:lambda:us-west-1:679683973944:function:mgwbd-prophecies-bot-random',
    },
  ],
}


def getList(gameName):
  return _REGISTRY.get(gameName, [])


def getEntry(gameName, botName):
  return next(
      filter(
          lambda i: i['name'] == botName,
          getList(gameName)),
      None)

