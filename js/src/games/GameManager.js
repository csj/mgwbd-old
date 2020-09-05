import Http from 'components/http/Http';
import PlayerManager from 'players/PlayerManager';


const Phase = {
  PRE_GAME: 1,
  PLAYING: 2,
  POST_GAME: 3,
};


class GameManager {
  constructor() {
    this.http = new Http.Factory().create();
    this.playerManager = new PlayerManager.Factory().create();
    this.game = null;
    this.gameState = {};
    this.gameSettings = {};
    this.gamePhase = Phase.PRE_GAME;
  }

  setGame(game) {
    this.game = game;
    this.gameState = game.getBlankGameState();
    this.gameSettings = game.getSettingsConfig()
        .reduce(
            (result, item) => {
              result[item.canonicalName] = item.defaultValue;
              return result;
            }, {});
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

  setGamePhaseChangeHandler(fn) {
    this.gamePhaseChangeHandler = fn;
  }

  setGamePhase(gamePhase) {
    this.gamePhase = gamePhase;
    if (this.gamePhaseChangeHandler) {
      this.gamePhaseChangeHandler(this.gamePhase);
    }
  }

  setGameSettingsChangeHandler(fn) {
    this.gameSettingsChangeHandler = fn;
  }

  setGameSettings(gameSettings) {
    this.gameSettings = gameSettings;
    if (this.gameSettingsChangeHandler) {
      this.gameSettingsChangeHandler(this.gameSettings);
    }
  }

  setMessageHandler(fn) {
    this.messageHandler = fn;
  }

  sendMessage(msg) {
    if (this.messageHandler) {
      this.messageHandler(msg);
    }
  }

  getGame() {
    return this.game;
  }

  getGameState() {
    return this.gameState;
  }

  getGameSettings() {
    return this.gameSettings;
  }

  getGamePhase() {
    return this.gamePhase;
  }

  getPlayerManager() {
    return this.playerManager;
  }

  startGame() {
    this.setGameState(this.game.getNewGameState());
    this.setGamePhase(Phase.PLAYING);
    let firstPlayerName = this.getPlayerManager().getPlayer(1).getName();
    this.sendMessage(`Here we go! ${firstPlayerName} moves first.`);
  }

  onAction(action) {
    if (this.gamePhase !== Phase.PLAYING) {
      return;
    }
    this.http.post('/gameplay/action')
        .send({
          gameType: this.game.getCanonicalName(),
          gameState: this.gameState,
          action,
        })
        .then(this.onActionResponse.bind(this), this.onActionError);
  }

  onActionResponse(rsp) {
    let gameState = rsp.body.gameState;
    this.setGameState(gameState);
    if (gameState.gameEnd) {
      this.setGamePhase(Phase.POST_GAME);
      if (gameState.gameEnd.tie) {
        this.sendMessage("Incredible, it's a tie! How about another?");
        return;
      }
      let winningPlayerName =
          this.getPlayerManager().getPlayer(gameState.gameEnd.win).getName();
      this.sendMessage(
          `Wow! ${winningPlayerName} is the winner! How about another?`);
    }
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


GameManager.Phase = Phase;


export default GameManager;
