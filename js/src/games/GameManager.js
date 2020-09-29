import GamePhase from './GamePhase';
import GameTypeMap from 'games/GameTypeMap';
import Http from 'components/http/Http';
import PlayerHelper from 'players/PlayerHelper';


class GameManager {
  constructor() {
    this.http = new Http.Factory().create();
    this.game = null;
    this.gameKey = null;
    this.gameState = null;
    this.gameSettings = null;
    this.gameSettingsConfig = null;
    this.gamePhase = GamePhase.PRE_GAME;
    this.pollIntervalId = setInterval(this.poll.bind(this), 1000);
  }

  poll() {
    // See if we need to poll.
    if (!this.gameSettings ||
        !this.gameSettings.players) {
      return;
    }
    let allLocal =
        this.gameSettings.players.reduce(
            (result, p) => PlayerHelper.isOwnedByMe(p) && result, true);
    if (allLocal) {
      return; // No need to poll.
    }
    this.http.get('/gameplay/poll')
        .query({ gameKey: this.gameKey, lastSeenMillis: this.lastSeenMillis, })
        .then(this.onActionResponse.bind(this), this.onError);
  }

  isReady() {
    return !!(this.game && this.gameState && this.gameSettings);
  }

  setChangeHandler(fn) {
    this.changeHandler = fn;
  }

  onChanged() {
    this.changeHandler && this.changeHandler({});
  }

  setGame(game) {
    this.game = game;
    this.gameState = null;
    this.gameSettings = null;
    this.gameSettingsConfig = null;
    // TODO this should work a different way.
    this.game.setMoveHandler(this.onAction.bind(this));
    this.onChanged();
  }

  setGameState(gameState) {
    this.gameState = gameState;
  }

  setGamePhase(gamePhase, fromServer) {
    this.gamePhase = gamePhase;
    if (!fromServer) {
      this.onGamePhase(this.gamePhase);
    }
  }

  setGameSettings(gameSettings, fromServer) {
    this.gameSettings = gameSettings;
    if (!fromServer) {
      this.onGameSettings(this.gameSettings);
    }
  }

  getGame() {
    return this.game;
  }

  getGameKey() {
    return this.gameKey;
  }

  getGameState() {
    return this.gameState;
  }

  getGameSettingsConfig() {
    return this.gameSettingsConfig;
  }

  getGameSettings() {
    return this.gameSettings;
  }

  getGamePhase() {
    return this.gamePhase;
  }

  getJoinLink() {
    // TODO may want to move this to a helper/util/manager class.
    return `${document.location.origin}/join/${this.gameKey}`;
  }

  canMove() {
    let activePlayer = this.gameState.activePlayer;
    if (this.gamePhase !== GamePhase.PLAYING || !activePlayer) {
      return false;
    }
    let player = this.gameSettings.players[activePlayer - 1];
    let canMove =
        PlayerHelper.isOwnedByMe(player) || PlayerHelper.isUnowned(player);
    return canMove;
  }

  newGame() {
    this.gameState = null;
    this.gamePhase = GamePhase.PRE_GAME;
    this.http.post('/gameplay/new')
        .send({
          hostDomain: document.location.hostname,
          gameType: this.game.getCanonicalName(),
        })
        .then(this.onNewGameResponse.bind(this), this.onError);
  }

  joinGame(gameKey, callbackFn) {
    this.http.get('/gameplay/query')
        .query({gameKey})
        .then(
            rsp => {
              let canonicalName = rsp.body.gameType;
              let game = new GameTypeMap[canonicalName]();
              this.setGame(game);
              this.onNewGameResponse(rsp);
              callbackFn && callbackFn(rsp.body);
            },
            this.onError);
    this.gameKey = gameKey;
  }

  startGame() {
    this.http.post('/gameplay/start')
        .send({gameKey: this.gameKey, gameSettings: this.gameSettings})
        .then(this.onActionResponse.bind(this), this.onError);
  }

  onNewGameResponse(rsp) {
    this.onActionResponse(rsp);
    this.claimUnownedPlayers();
  }

  claimUnownedPlayers() {
    let playersModified = false;
    if (this.gameSettings) {
      let players = this.gameSettings.players || [];
      players.forEach(
        player => {
          if (!player.owner) {
            PlayerHelper.claimPlayer(player);
            playersModified = true;
          }
        }
      );
    }
    if (playersModified) {
      this.setGameSettings(this.gameSettings);
    }
  }

  onGameSettings(gameSettings) {
    this.http.post('/gameplay/setsettings')
        .send({gameKey: this.gameKey, gameSettings})
        .then(this.onActionResponse.bind(this), this.onError);
  }

  onGamePhase(gamePhase) {
    this.http.post('/gameplay/setphase')
        .send({gameKey: this.gameKey, gamePhase})
        .then(this.onActionResponse.bind(this), this.onError);
  }

  onAction(action) {
    if (this.gamePhase !== GamePhase.PLAYING) {
      return;
    }
    this.http.post('/gameplay/action')
        .send({
            gameKey: this.gameKey,
            clientCode: PlayerHelper.clientCode,
            action,
        })
        .then(this.onActionResponse.bind(this), this.onError);
  }

  onActionResponse(rsp) {
    if (!rsp || !rsp.body) {
      return;
    }
    if (rsp.body.gameState) {
      this.setGameState(rsp.body.gameState);
    }
    if (rsp.body.gameKey) {
      this.gameKey = rsp.body.gameKey;
    }
    if (rsp.body.gameSettingsConfig) {
      this.gameSettingsConfig = rsp.body.gameSettingsConfig;
    }
    if (rsp.body.gamePhase) {
      this.setGamePhase(rsp.body.gamePhase, true);
    }
    if (rsp.body.gameSettings) {
      this.setGameSettings(rsp.body.gameSettings, true);
    }
    if (rsp.body.lastSeenMillis) {
      this.lastSeenMillis = rsp.body.lastSeenMillis;
    }
    this.onChanged();
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
