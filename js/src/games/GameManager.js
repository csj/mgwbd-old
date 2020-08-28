import Http from 'components/http/Http';


class GameManager {
  constructor() {
    this.http = new Http.Factory().create();
    this.game = null;
    this.gameState = {};
  }

  setGame(game) {
    this.game = game;
    this.gameState = game.getBlankGameState();
  }

  setGameStateChangeHandler(fn) {
    this.gameStateChangeHandler = fn;
  }

  setGameState(gameState) {
    this.gameState = gameState;
    if (this.gameStateChangeHandler) {
      this.gameStateChangeHandler(this.gameState);
    }
  }

  getGame() {
    return this.game;
  }

  getGameState() {
    return this.gameState;
  }

  startGame() {
    this.setGameState(this.game.getNewGameState());
  }

  onAction(action) {
    this.http.post('/gameplay/action')
        .send({
          gameType: this.game.getCanonicalName(),
          gameState: this.gameState,
          action,
        })
        .then(this.onActionResponse.bind(this), this.onActionError);
  }

  onActionResponse(rsp) {
    console.log(rsp);
    this.setGameState(rsp.body.gameState);
  }

  onActionError(error) {
    console.log(error);
  }
}


GameManager.Factory = class {
  create() {
    return _instance;
  }
}


const _instance = new GameManager();


export default GameManager;
