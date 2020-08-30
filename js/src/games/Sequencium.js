import SequenciumCanvas from './SequenciumCanvas';
import Game from './Game';
import React from 'react';

/**
 * Game State looks like this:
 * {
 *   grid: [
 *     [Square, null, null, null, null, null],
 *     [null, Square, null, null, null, null],
 *     [null, null, Square, null, null, null],
 *     [null, null, null, Square, null, null],
 *     [null, null, null, null, Square, null],
 *     [null, null, null, null, null, Square],
 *   ],
 *   lastMove: {
 *     row: rowId,
 *     col: colId,
 *   },
 *   playerTurn: 1, // 1 or 2
 * }
 *
 * typedef Square = {
 *   playerNumber: 1, // or 2
 *   value: 1, // 2, 3, 4, ...
 *   from: 'SW', // N, NE, E, SE, S, SW, W, NW, null
 * }
 */


const Move = (playerNumber, rowFrom, colFrom, rowTo, colTo) => ({
    playerNumber, rowFrom, colFrom, rowTo, colTo});
const Sq = (playerNumber, value, from) => ({playerNumber, value, from});


class Sequencium extends Game {
  getCanonicalName() {
    return 'sequencium';
  }

  getDisplayName() {
    return 'Sequencium';
  }

  getBlankGameState() {
    return {
      grid: [
        [Sq(1, 1, null), null, null, null, null, null],
        [null, Sq(1, 2, 'NW'), null, null, null, null],
        [null, null, Sq(1, 3, 'NW'), null, null, null],
        [null, null, null, Sq(2, 3, 'SE'), null, null],
        [null, null, null, null, Sq(2, 2, 'SE'), null],
        [null, null, null, null, null, Sq(2, 1, null)],
        /*
        [Sq(1, 1, null), Sq(1, 2, 'W'), Sq(1, 2, 'W'), Sq(1, 2, 'W'), Sq(1, 2, 'W'), Sq(1, 2, 'W')],
        [Sq(1, 1, null), Sq(1, 2, 'W'), Sq(1, 2, 'W'), Sq(1, 3, 'W'), Sq(1, 2, 'W'), Sq(1, 2, 'W')],
        [Sq(1, 1, null), Sq(1, 2, 'W'), Sq(1, 2, 'W'), Sq(1, 2, 'W'), null, null],
        [Sq(2, 1, 'E'), Sq(2, 2, 'E'), Sq(2, 2, 'E'), Sq(2, 2, 'E'), Sq(2, 2, 'E'), Sq(2, 2, null)],
        [Sq(2, 1, 'E'), Sq(2, 2, 'E'), Sq(2, 2, 'E'), Sq(2, 2, 'E'), Sq(2, 2, 'E'), Sq(2, 2, null)],
        [Sq(2, 1, 'E'), Sq(2, 2, 'E'), Sq(2, 2, 'E'), Sq(2, 2, 'E'), Sq(2, 2, 'E'), Sq(2, 1, null)],
        */
      ],
      lastMove: {
        // row: 3, col: 3,
      },
      activePlayer: null,
    };
  }

  renderCanvas(gameState, playerManager) {
    return (
      <SequenciumCanvas
          gameState={gameState}
          gameSettings={{
            playerHues: playerManager.getPlayers().map(p => p.getHueShift()),
          }}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


Sequencium.Move = Move;


export default Sequencium;
