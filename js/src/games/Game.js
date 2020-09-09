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
