import faceA from 'images/faceA.png';
import faceB from 'images/faceB.png';
import faceC from 'images/faceC.png';
import faceD from 'images/faceD.png';
import faceE from 'images/faceE.png';


const _avatarMap = {
  'A': faceA,
  'B': faceB,
  'C': faceC,
  'D': faceD,
  'E': faceE,
};


const PlayerHelper = {};

PlayerHelper.getStyleClass = player =>
    `playerStyle${player ? player.style : ''}`;

PlayerHelper.getAvatar = player => _avatarMap[player.style];


export default PlayerHelper;
