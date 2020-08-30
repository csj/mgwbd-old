import DandelionsCanvas from './DandelionsCanvas';
import Game from 'games/Game';
import React from 'react';
import { SquareStates, AllDirections } from './Constants.js';

/**
 * Game State looks like this:
 * {
 *   compass: {
 *     directions: ['N', 'E', ...],
 *   },
 *   grid: [
 *     [null, 'F', 'S', 'S', 'S'],
 *     [null, null, null, null, null],
 *     [null, null, null, null, null],
 *     [null, null, null, null, null],
 *     [null, null, null, null, null],
 *   ],
 *   lastMove: {
 *     compass: ...
 *     grid: ...
 *   },
 *   playerTurn: 1, // 1 or 2
 * }
 */


const Move = Object.freeze({
  grid: (row, col) => ({grid: {row, col}}),
  compass: d => ({compass: d}),
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

  renderCanvas(gameState) {
    return (
      <DandelionsCanvas
          gameState={gameState}
          gameSettings={{}}
          createMove={Move}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


export default Dandelions;
