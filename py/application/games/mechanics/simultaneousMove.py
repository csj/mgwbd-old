from application.games.mechanics.partialMoveEncoder import PartialMoveEncoder


pme = PartialMoveEncoder()


# Decorator
def simultaneousMove(isValidFn=None):
  """Decorator implementing a simultaneous move action.

  Decorate an 'action' method, with the following guidelines:
  - isValidFn is an instance method which returns True if `action` is valid
  - Caller of decorated method should pass `action` as the first parameter
    - `action` is a dict which contains key `playerIndex` indicating which
      player has made this move
  - The decorated method's body will be called once all player actions are in,
    with a list of actions as its first arg.
  - Pending moves are stored in `inst.gameState['pendingMove']`.
  - Method returns `True` if the move was accepted.
  """
  def decorator(f):

    def action(inst, action, *args, **kwargs):
      gameState = inst.gameState
      playerCount = len(inst.gameSettings['players'])
      if 'pendingMove' not in gameState:
        gameState['pendingMove'] = {}
      pendingMoves = gameState['pendingMove']
      playerIndex = str(action['playerIndex'])

      if not getattr(inst, isValidFn)(action, *args, **kwargs):
        # Invalid move.
        return False

      if playerIndex not in pendingMoves:
        pendingMoves[str(playerIndex)] = pme.encode(action)

      if set(pendingMoves.keys()).issuperset(
          set(str(i) for i in range(playerCount))):
        actionList = [
            pme.decode(pendingMoves[str(i)]) for i in range(playerCount)]
        gameState['pendingMove'] = {}
        return f(inst, actionList, *args, **kwargs)

      return True

    return action
  return decorator

