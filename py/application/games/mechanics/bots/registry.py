

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
  entries = _REGISTRY.get(gameName, [])
  return [_sanitize(entry) for entry in entries]


def getEntry(gameName, botOwner):
  return next(
      filter(
          lambda i: i['owner'] == botOwner,
          _REGISTRY.get(gameName, [])),
      None)


def _sanitize(entry):
  return {k: v for k, v in entry.items() if k in ['name', 'owner']}

