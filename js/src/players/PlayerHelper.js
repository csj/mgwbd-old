import faceA from 'images/faceA.png';
import faceAvictory from 'images/faceA-victory.png';
import faceB from 'images/faceB.png';
import faceBvictory from 'images/faceB-victory.png';
import faceC from 'images/faceC.png';
import faceCvictory from 'images/faceC-victory.png';
import faceD from 'images/faceD.png';
import faceDvictory from 'images/faceD-victory.png';
import faceE from 'images/faceE.png';
import faceEvictory from 'images/faceE-victory.png';
import randomString from 'random-string';


const AvatarType = { DEFAULT: 0, VICTORY: 1, };
const _avatarMap = {
  'A': {
    [AvatarType.DEFAULT]: faceA,
    [AvatarType.VICTORY]: faceAvictory,
  },
  'B': {
    [AvatarType.DEFAULT]: faceB,
    [AvatarType.VICTORY]: faceBvictory,
  },
  'C': {
    [AvatarType.DEFAULT]: faceC,
    [AvatarType.VICTORY]: faceCvictory,
  },
  'D': {
    [AvatarType.DEFAULT]: faceD,
    [AvatarType.VICTORY]: faceDvictory,
  },
  'E': {
    [AvatarType.DEFAULT]: faceE,
    [AvatarType.VICTORY]: faceEvictory,
  },
};


const PlayerHelper = {};

PlayerHelper.getAllStyles = () => Object.keys(_avatarMap);

PlayerHelper.getStyleClass = playerOrStyle => {
  let suffix = '';
  if (typeof playerOrStyle === typeof {}) {
    suffix = playerOrStyle.style;
  } else if (typeof playerOrStyle === typeof '') {
    suffix = playerOrStyle;
  }
  return `playerStyle${suffix}`;
};

PlayerHelper.getAvatar = (playerOrStyle, flavor=AvatarType.DEFAULT) => {
  let key = playerOrStyle;
  if (typeof playerOrStyle === typeof {}) {
    key = playerOrStyle.style;
  }
  return _avatarMap[key][flavor];
}

PlayerHelper.AvatarType = AvatarType;

PlayerHelper.getType = player => {
  if (player.owner === PlayerHelper.clientCode) {
    return 'This Device';
  }
  if (player.playerType === 'bot') {
    return 'Bot';
  }
  if (!player.owner) {
    return 'Open Seat';
  }
  return 'Other Device';
};


PlayerHelper.clientCode = randomString();
PlayerHelper.claimPlayer = player => player.owner = PlayerHelper.clientCode;
PlayerHelper.unclaimPlayer = player => player.owner = null;
PlayerHelper.isOwnedByMe = player => player.owner === PlayerHelper.clientCode;
PlayerHelper.isUnowned = player => player.owner === null;


export default PlayerHelper;
