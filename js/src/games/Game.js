import React from 'react';


class Game {
  getCanonicalName() {
  }

  getDisplayName() {
  }

  getDefaultPlayerNames() {
    return [ 'Player 1', 'Player 2', ];
  }

  renderInstructions() {
    return (
      <div>Instructions</div>
    );
  }

  getBlankGameState() {
    return {};
  }

  getNewGameState() {
    return Object.assign(
        {},
        this.getBlankGameState(),
        {activePlayer: 1});
  }

  getSettingsConfig() {
    return [];
  }

  onChooseMove(gameState, move) {
    if (this.moveHandler) {
      this.moveHandler(gameState, move);
    }
  }

  setMoveHandler(fn) {
    this.moveHandler = fn;
  }

  renderCanvas(gameState, gameSettings) {
    return null;
  }
}


export default Game;
