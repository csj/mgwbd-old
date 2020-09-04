

class Player {
  constructor(name) {
    this.name = name;
  }

  getAvatar() {
    return null;
  }

  getName() {
    return this.name;
  }

  getTypeName() {
    return 'Player';
  }

  setPlayerStyleClass(playerStyleClass) {
    this.playerStyleClass = playerStyleClass;
  }

  getPlayerStyleClass() {
    return this.playerStyleClass;
  }
}


export default Player;
