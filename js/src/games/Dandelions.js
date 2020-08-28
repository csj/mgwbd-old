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

  getDefaultPlayerNames() {
    return [ 'Dandelions', 'Wind', ];
  }

  getBlankGameState() {
    let sq = SquareStates;
    return {
      compass: { directions: [] },
      grid: [
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
        [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
      ],
      lastMove: {
        compass: null,
        grid: [
          [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
          [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
          [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
          [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
          [sq.NULL, sq.NULL, sq.NULL, sq.NULL, sq.NULL],
        ],
      },
      activePlayer: null,
    };
  }

  static getAllDirections() {
    return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  }

  onChooseMove(gameState, move) {
    // TODO for now, just allow the move and update the game state.
    console.log(gameState);
    console.log(move);

  }

  renderCanvas(gameState) {
    return (
      <DandelionsCanvas
          gameState={gameState}
          gameSettings={{}}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


Dandelions.SquareStates = SquareStates;


export default Dandelions;
