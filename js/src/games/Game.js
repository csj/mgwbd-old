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

  onChooseMove(gameState, move) {
    // Consider creating a game manager to orchestrate this.
    console.log(move);
  }

  renderCanvas(gameState) {
    return null;
  }
}


export default Game;
