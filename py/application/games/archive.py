from application import db
from application.models import ArchivedGameInstance, GameInstance
from .constants import GamePhase


def archiveGameInstance(gameInstance, defaultResult='quit'):
  gi = gameInstance  # Sqlalchemy model
  # gameDriver = gameMap.get(gi.gameType)()  # place to get custom scores later

  gamePhase = gi.gamePhase
  result = defaultResult
  winningScore = None
  secondPlaceScore = None
  player1Type = None
  player2Type = None
  player3Type = None
  player4Type = None
  isMultiDevice = False

  try:
    if gamePhase == GamePhase.POST_GAME.value and gi.gameState:
      gameEnd = gi.gameState.get('gameEnd', {})
      if 'win' in gameEnd:
        result = 'win'
      elif 'draw' in gameEnd:
        result = 'draw'
      scores = gameEnd.get('scores', [])
      scores.sort()
      if len(scores) > 0:
        winningScore = scores[-1]
      if len(scores) > 1:
        secondPlaceScore = scores[-2]

    players = gi.gameSettings.get('players', [])
    if len(players) > 0:
      player1Type = players[0].get('playerType')
    if len(players) > 1:
      player2Type = players[1].get('playerType')
    if len(players) > 2:
      player3Type = players[2].get('playerType')
    if len(players) > 3:
      player4Type = players[3].get('playerType')

    if len(set(filter(lambda o: o, [p.get('owner') for p in players]))) > 1:
      isMultiDevice = True
  except:
    pass

  agi = ArchivedGameInstance.create(
      db.session,
      hostDomain=gi.hostDomain,
      gameType=gi.gameType,
      gameSettings=gi.gameSettings,
      gamePhase=gi.gamePhase,
      gameStart=gi.date_created,
      gameEnd=gi.date_modified,
      result=result,
      winningScore=winningScore,
      secondPlaceScore=secondPlaceScore,
      player1Type=player1Type,
      player2Type=player2Type,
      player3Type=player3Type,
      player4Type=player4Type,
      isMultiDevice=isMultiDevice,
      )
  db.session.delete(gameInstance)

