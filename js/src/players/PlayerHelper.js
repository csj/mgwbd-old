import faceA from 'images/faceA.png';
import faceB from 'images/faceB.png';
import faceC from 'images/faceC.png';
import faceD from 'images/faceD.png';
import faceE from 'images/faceE.png';
import randomString from 'random-string';


const _avatarMap = {
  'A': faceA,
  'B': faceB,
  'C': faceC,
  'D': faceD,
  'E': faceE,
};


const PlayerHelper = {};

PlayerHelper.getAllStyles = () => Object.keys(_avatarMap);

PlayerHelper.getStyleClass = player =>
    `playerStyle${player ? player.style : ''}`;

PlayerHelper.getAvatar = playerOrStyle => {
  let key = playerOrStyle;
  if (typeof playerOrStyle === typeof {}) {
    key = playerOrStyle.style;
  }
  return _avatarMap[key];
}

PlayerHelper.getType = player => {
  // We only support human players for now.
  if (player.owner === PlayerHelper.clientCode) {
    return 'This device';
  }
  if (!player.owner) {
    return 'Open seat';
  }
  return 'Other device';
};


PlayerHelper.clientCode = randomString();
PlayerHelper.claimPlayer = player => player.owner = PlayerHelper.clientCode;
PlayerHelper.unclaimPlayer = player => player.owner = null;
PlayerHelper.isClaimedByMe = player => player.owner === PlayerHelper.clientCode;


export default PlayerHelper;
