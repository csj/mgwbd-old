import gamePieceAsterisk from 'images/game-piece-asterisk.png';
import gamePieceDotA01 from 'images/game-piece-dot-A-01.png';
import gamePieceDotA02 from 'images/game-piece-dot-A-02.png';
import gamePieceDotA03 from 'images/game-piece-dot-A-03.png';
import gamePieceDotA04 from 'images/game-piece-dot-A-04.png';
import gamePieceDotA05 from 'images/game-piece-dot-A-05.png';
import gamePieceDotA06 from 'images/game-piece-dot-A-06.png';
import gamePieceDotA07 from 'images/game-piece-dot-A-07.png';
import gamePieceDotA08 from 'images/game-piece-dot-A-08.png';
import gamePieceDotB01 from 'images/game-piece-dot-B-01.png';
import gamePieceDotB02 from 'images/game-piece-dot-B-02.png';
import gamePieceDotB03 from 'images/game-piece-dot-B-03.png';
import gamePieceDotB04 from 'images/game-piece-dot-B-04.png';
import gamePieceDotB05 from 'images/game-piece-dot-B-05.png';
import gamePieceDotB06 from 'images/game-piece-dot-B-06.png';
import gamePieceDotB07 from 'images/game-piece-dot-B-07.png';
import gamePieceDotB08 from 'images/game-piece-dot-B-08.png';
import gamePieceDotC01 from 'images/game-piece-dot-C-01.png';
import gamePieceDotC02 from 'images/game-piece-dot-C-02.png';
import gamePieceDotC03 from 'images/game-piece-dot-C-03.png';
import gamePieceDotC04 from 'images/game-piece-dot-C-04.png';
import gamePieceDotC05 from 'images/game-piece-dot-C-05.png';
import gamePieceDotC06 from 'images/game-piece-dot-C-06.png';
import gamePieceDotC07 from 'images/game-piece-dot-C-07.png';
import gamePieceDotC08 from 'images/game-piece-dot-C-08.png';
import gamePieceDotD01 from 'images/game-piece-dot-D-01.png';
import gamePieceDotD02 from 'images/game-piece-dot-D-02.png';
import gamePieceDotD03 from 'images/game-piece-dot-D-03.png';
import gamePieceDotD04 from 'images/game-piece-dot-D-04.png';
import gamePieceDotD05 from 'images/game-piece-dot-D-05.png';
import gamePieceDotD06 from 'images/game-piece-dot-D-06.png';
import gamePieceDotD07 from 'images/game-piece-dot-D-07.png';
import gamePieceDotD08 from 'images/game-piece-dot-D-08.png';
import gamePieceDotE01 from 'images/game-piece-dot-E-01.png';
import gamePieceDotE02 from 'images/game-piece-dot-E-02.png';
import gamePieceDotE03 from 'images/game-piece-dot-E-03.png';
import gamePieceDotE04 from 'images/game-piece-dot-E-04.png';
import gamePieceDotE05 from 'images/game-piece-dot-E-05.png';
import gamePieceDotE06 from 'images/game-piece-dot-E-06.png';
import gamePieceDotE07 from 'images/game-piece-dot-E-07.png';
import gamePieceDotE08 from 'images/game-piece-dot-E-08.png';


const _imageLibrary = {
  'A': {
    'asterisk': [gamePieceAsterisk],
    'dot': [
      gamePieceDotA01, gamePieceDotA02, gamePieceDotA03, gamePieceDotA04,
      gamePieceDotA05, gamePieceDotA06, gamePieceDotA07, gamePieceDotA08,
    ],
  },
  'B': {
    'asterisk': [gamePieceAsterisk],
    'dot': [
      gamePieceDotB01, gamePieceDotB02, gamePieceDotB03, gamePieceDotB04,
      gamePieceDotB05, gamePieceDotB06, gamePieceDotB07, gamePieceDotB08,
    ],
  },
  'C': {
    'asterisk': [gamePieceAsterisk],
    'dot': [
      gamePieceDotC01, gamePieceDotC02, gamePieceDotC03, gamePieceDotC04,
      gamePieceDotC05, gamePieceDotC06, gamePieceDotC07, gamePieceDotC08,
    ],
  },
  'D': {
    'asterisk': [gamePieceAsterisk],
    'dot': [
      gamePieceDotD01, gamePieceDotD02, gamePieceDotD03, gamePieceDotD04,
      gamePieceDotD05, gamePieceDotD06, gamePieceDotD07, gamePieceDotD08,
    ],
  },
  'E': {
    'asterisk': [gamePieceAsterisk],
    'dot': [
      gamePieceDotE01, gamePieceDotE02, gamePieceDotE03, gamePieceDotE04,
      gamePieceDotE05, gamePieceDotE06, gamePieceDotE07, gamePieceDotE08,
    ],
  },
};


const _randSeed = Math.floor(Math.random() * 1000000);
const _digest = (state, material) => {
  if (material === null || material === undefined) {
    return state;
  }
  if (typeof material === typeof 0) {
    return state * 29 + (material + 23) * 13;
  }
  if (typeof material === typeof '') {
    for (let i = 0; i < material.length; i++) {
      state = _digest(state, material.charCodeAt(i));
    }
    return state;
  }
  if (Array.isArray(material)) {
    for (let i = 0; i < material.length; i++) {
      state = _digest(state, material[i]);
    }
    return state;
  }
};


const GamePieceHelper = {};

GamePieceHelper.getGamePiece = (style, type, hashMaterial) => {
  let candidates = _imageLibrary[style][type];
  let hash = _digest(_randSeed, hashMaterial) % candidates.length;
  return candidates[hash];
};

GamePieceHelper.Type = { ASTERISK: 'asterisk', DOT: 'dot', };


export default GamePieceHelper;
