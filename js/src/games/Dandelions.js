import DandelionsCanvas from './DandelionsCanvas';
import Game from './Game';
import React from 'react';

/**
 * Game State looks like this:
 * {
 *   compass: {
 *     directions: ['N', 'E', ...],
 *   },
 *   grid: {
 *     ???
 *   },
 *   lastMove: {
 *     ???
 *   },
 *   playerTurn: 1, // 1 or 2
 * }
 */


/** Square states. */
const SquareStates = Object.freeze({
  NULL: null,
  FLWR: 'F',
  SEED: 'S',
});


class Dandelions extends Game {
  getCanonicalName() {
    return 'dandelions';
  }

  getDisplayName() {
    return 'Dandelions';
  }

  getBlankGameState() {
    let sq = SquareStates;
    return {
      compass: { directions: ['W', 'SE'] },
      grid: [
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
        [sq.NULL, sq.NULL, sq.NULL, sq.FLWR, sq.NULL],
        [sq.SEED, sq.SEED, sq.FLWR, sq.NULL, sq.SEED],
        [sq.NULL, sq.NULL, sq.NULL, sq.SEED, sq.NULL],
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.SEED],
      ],
      lastMove: {
        compass: 'SE',
        grid: [
          [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
          [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
          [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.SEED],
          [sq.NULL, sq.NULL, sq.NULL, sq.SEED, sq.NULL],
          [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.SEED],
        ],
      },
      playerTurn: null,
    };
  }

  static getAllDirections() {
    return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  }

  renderCanvas(gameState) {
    return (
      <DandelionsCanvas
          gameState={gameState}
          gameSettings={{}} />
    );
  }
}


Dandelions.SquareStates = SquareStates;


export default Dandelions;
