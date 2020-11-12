import Dandelions from 'games/dandelions/Dandelions';
import Prophecies from 'games/prophecies/Prophecies';
import Sequencium from 'games/sequencium/Sequencium';
import Neighbors from 'games/neighbors/Neighbors';
import QuantumTicTacToe from 'games/quantumtictactoe/QuantumTicTacToe';


const GameTypeMap = {
  'sequencium': Sequencium,
  'dandelions': Dandelions,
  'prophecies': Prophecies,
  'neighbors': Neighbors,
  'quantumtictactoe': QuantumTicTacToe,
};


export default GameTypeMap;
