import Player from 'players/Player';
import face1 from 'images/face1.png';


class LocalHumanPlayer extends Player {
  getAvatar() {
    return face1;
  }

  getTypeName() {
    return 'Local player';
  }
}


export default LocalHumanPlayer;

