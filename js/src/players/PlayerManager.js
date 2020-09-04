import LocalHumanPlayer from 'players/LocalHumanPlayer';


const PlayerStyleClasses = [
  'playerStyleA',
  'playerStyleB',
  'playerStyleC',
  'playerStyleD',
  'playerStyleE',
];


class PlayerManager {
  constructor() {
    this.resetPlayers();
  }

  chooseRandomPlayerStyle() {
    let count = this.availableStyles.length;
    let index = Math.floor(Math.random() * count);
    return this.availableStyles.splice(index, 1)[0];
  }

  createLocalHumanPlayer(name) {
    let player = new LocalHumanPlayer(name);
    player.setPlayerStyleClass(this.chooseRandomPlayerStyle());
    this.players.push(player);
  }

  resetPlayers() {
    this.players = [];
    this.availableStyles = [...PlayerStyleClasses];
  }

  getPlayers() {
    return this.players;
  }

  getPlayer(index) {
    // Gets player by Player Number, which is different from array index by one.
    return this.players[index - 1];
  }
}


PlayerManager.Factory = class {
  create() {
    return _instance;
  }
}


const _instance = new PlayerManager();


export default PlayerManager;
