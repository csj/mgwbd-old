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
import faceBotA from 'images/faceBotA.png';
import faceBotB from 'images/faceBotB.png';
import faceBotC from 'images/faceBotC.png';
import faceBotD from 'images/faceBotD.png';
import faceBotE from 'images/faceBotE.png';
import randomString from 'random-string';


const AvatarType = { DEFAULT: 0, VICTORY: 1, };
const _avatarMap = {
  'A': {
    'human': {
      [AvatarType.DEFAULT]: faceA,
      [AvatarType.VICTORY]: faceAvictory,
    },
    'bot': {
      [AvatarType.DEFAULT]: faceBotA,
      [AvatarType.VICTORY]: faceBotA,
    },
  },
  'B': {
    'human': {
      [AvatarType.DEFAULT]: faceB,
      [AvatarType.VICTORY]: faceBvictory,
    },
    'bot': {
      [AvatarType.DEFAULT]: faceBotB,
      [AvatarType.VICTORY]: faceBotB,
    },
  },
  'C': {
    'human': {
      [AvatarType.DEFAULT]: faceC,
      [AvatarType.VICTORY]: faceCvictory,
    },
    'bot': {
      [AvatarType.DEFAULT]: faceBotC,
      [AvatarType.VICTORY]: faceBotC,
    },
  },
  'D': {
    'human': {
      [AvatarType.DEFAULT]: faceD,
      [AvatarType.VICTORY]: faceDvictory,
    },
    'bot': {
      [AvatarType.DEFAULT]: faceBotD,
      [AvatarType.VICTORY]: faceBotD,
    },
  },
  'E': {
    'human': {
      [AvatarType.DEFAULT]: faceE,
      [AvatarType.VICTORY]: faceEvictory,
    },
    'bot': {
      [AvatarType.DEFAULT]: faceBotE,
      [AvatarType.VICTORY]: faceBotE,
    },
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

PlayerHelper.getAvatar = (player, flavor=AvatarType.DEFAULT) => {
  let styleKey = player.style;
  let playerTypeKey = player.playerType || 'human';
  return _avatarMap[styleKey][playerTypeKey][flavor];
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


const clientCode = randomString();
const _oa = (player, ...mods) =>
    Object.assign(player, {playerType: 'human'}, ...mods);


PlayerHelper.clientCode = clientCode;
PlayerHelper.claimPlayer = player => _oa(player, {owner: clientCode});
PlayerHelper.unclaimPlayer = player => _oa(player, {owner: null});
PlayerHelper.setAsBot = (player, bot) => _oa(player, {playerType: 'bot'}, bot);
PlayerHelper.isOwnedByMe = player => player.owner === PlayerHelper.clientCode;
PlayerHelper.isUnowned = player => player.owner === null;
PlayerHelper.isBot = player => player.playerType === 'bot';


export default PlayerHelper;
