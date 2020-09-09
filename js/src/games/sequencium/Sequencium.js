import SequenciumCanvas from './SequenciumCanvas';
import SequenciumInstructions from './SequenciumInstructions';
import Game from 'games/Game';
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


class Sequencium extends Game {
  getCanonicalName() {
    return 'sequencium';
  }

  getDisplayName() {
    return 'Sequencium';
  }

  renderInstructions() {
    return <SequenciumInstructions />;
  }

  renderCanvas(gameState, gameSettings, playerManager) {
    gameSettings = Object.assign({}, gameSettings, {
      playerStyleClasses:
          playerManager.getPlayers().map(p => p.getPlayerStyleClass()),
    });
    return (
      <SequenciumCanvas
          gameState={gameState}
          gameSettings={gameSettings}
          createMove={Move}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


export default Sequencium;
