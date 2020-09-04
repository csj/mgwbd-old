import Player from 'players/Player';
import face1 from 'images/face1.png';
import faceA from 'images/faceA.png';
import faceB from 'images/faceB.png';
import faceC from 'images/faceC.png';
import faceD from 'images/faceD.png';
import faceE from 'images/faceE.png';


const FaceMap = {
  'playerStyleA': faceA,
  'playerStyleB': faceB,
  'playerStyleC': faceC,
  'playerStyleD': faceD,
  'playerStyleE': faceE,
};


class LocalHumanPlayer extends Player {
  getAvatar() {
    return FaceMap[this.getPlayerStyleClass()];
  }

  getTypeName() {
    return 'Local player';
  }
}


export default LocalHumanPlayer;

