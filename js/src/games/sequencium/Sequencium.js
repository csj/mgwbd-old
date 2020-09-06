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
const Sq = (playerNumber, value, from) => ({playerNumber, value, from});
const Settings = [
  {
    canonicalName: 'handDrawnGrid',
    displayName: 'Hand-drawn grid',
    description: 'Displays the game grid as a drawing.',
    values: [true, false],
    defaultValue: true,
  },
  {
    canonicalName: 'doubleMoves',
    displayName: 'Players move twice',
    description: 'Starting with the second player’s first turn, each player moves twice per turn.',
    values: [true, false],
    defaultValue: false,
  },
];


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
      ],
      lastMove: {
        // row: 3, col: 3,
      },
      activePlayer: null,
    };
  }

  getSettingsConfig() {
    return Settings;
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
