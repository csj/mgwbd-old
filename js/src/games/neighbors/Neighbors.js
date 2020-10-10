import NeighborsCanvas from './NeighborsCanvas';
import NeighborsInstructions from './NeighborsInstructions';
import Game from 'games/Game';
import React from 'react';


class Neighbors extends Game {
  getCanonicalName() {
    return 'neighbors';
  }

  getDisplayName() {
    return 'Neighbors';
  }

  getInstructionCards() {
    return NeighborsInstructions.getInstructionCards();
  };

  renderCanvas(gameState, gameSettings, gamePhase, canMove) {
    return (
      <NeighborsCanvas
          gameState={gameState}
          gameSettings={gameSettings}
          gamePhase={gamePhase}
          canMove={canMove}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


export default Neighbors;
