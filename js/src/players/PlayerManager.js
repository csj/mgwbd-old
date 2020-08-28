import LocalHumanPlayer from 'players/LocalHumanPlayer';


class PlayerManager {
  constructor() {
    this.players = [];
  }

  createLocalHumanPlayer(name) {
    let player = new LocalHumanPlayer(name);
    player.setHueShift(Math.floor(Math.random()*360));
    this.players.push(player);
  }

  resetPlayers() {
    this.players = [];
  }

  getPlayers() {
    return this.players;
  }
}


PlayerManager.Factory = class {
  create() {
    return _instance;
  }
}


const _instance = new PlayerManager();


export default PlayerManager;
