import Dandelions from 'games/dandelions/Dandelions';
import Prophecies from 'games/prophecies/Prophecies';
import Sequencium from 'games/sequencium/Sequencium';
import Neighbors from 'games/neighbors/Neighbors';


const GameTypeMap = {
  'sequencium': Sequencium,
  'dandelions': Dandelions,
  'prophecies': Prophecies,
  'neighbors': Neighbors,
};


export default GameTypeMap;
