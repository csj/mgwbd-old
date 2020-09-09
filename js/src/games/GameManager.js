import GamePhase from './GamePhase';
import Http from 'components/http/Http';
import PlayerManager from 'players/PlayerManager';


class GameManager {
  constructor() {
    this.http = new Http.Factory().create();
    this.playerManager = new PlayerManager.Factory().create();
    this.game = null;
    this.gameKey = null;
    this.gameState = {};
    this.gameSettings = {};
    this.gamePhase = GamePhase.PRE_GAME;
  }

  setGame(game) {
    this.game = game;
    this.gameState = game.getBlankGameState();
    this.gamePhase = GamePhase.PRE_GAME;
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

  setGamePhase(gamePhase, msg) {
    this.gamePhase = gamePhase;
    if (this.gamePhaseChangeHandler) {
      this.gamePhaseChangeHandler(this.gamePhase);
    }
    if (msg) {
      this.sendMessage(msg);
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
    this.http.post('/gameplay/new')
        .send({
          hostDomain: document.location.hostname,
          gameType: this.game.getCanonicalName(),
          gameSettings: this.gameSettings,
        })
        .then(this.onStartGameResponse.bind(this), this.onError);
  }

  onStartGameResponse(rsp) {
    this.onActionResponse(rsp);
    this.gameKey = rsp.body.gameKey;
    this.setGamePhase(GamePhase.PLAYING);
    let firstPlayerName = this.getPlayerManager().getPlayer(1).getName();
    this.sendMessage(`Here we go! ${firstPlayerName} moves first.`);
  }

  onAction(action) {
    if (this.gamePhase !== GamePhase.PLAYING) {
      return;
    }
    this.http.post('/gameplay/action')
        .send({ gameKey: this.gameKey, action, })
        .then(this.onActionResponse.bind(this), this.onError);
  }

  onActionResponse(rsp) {
    let gameState = rsp.body.gameState;
    this.setGameState(gameState);
    if (gameState.gameEnd) {
      this.setGamePhase(GamePhase.POST_GAME);
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

  onError(error) {
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
