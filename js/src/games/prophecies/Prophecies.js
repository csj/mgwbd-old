import PropheciesCanvas from './PropheciesCanvas';
import PropheciesInstructions from './PropheciesInstructions';
import Game from 'games/Game';
import React from 'react';


class Prophecies extends Game {
  getCanonicalName() {
    return 'prophecies';
  }

  getDisplayName() {
    return 'Prophecies';
  }

  getInstructionCards() {
    return PropheciesInstructions.getInstructionCards();
  };

  renderCanvas(gameState, gameSettings, gamePhase, canMove) {
    return (
      <PropheciesCanvas
          gameState={gameState}
          gameSettings={gameSettings}
          gamePhase={gamePhase}
          canMove={canMove}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


export default Prophecies;
