

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

  setHueShift(hueShift) {
    this.hueShift = hueShift;
  }

  getHueShift() {
    return this.hueShift;
  }
}


export default Player;
