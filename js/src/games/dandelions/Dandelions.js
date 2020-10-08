import DandelionsCanvas from './DandelionsCanvas';
import DandelionsInstructions from './DandelionsInstructions';
import Game from 'games/Game';
import React from 'react';


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

  getInstructionCards() {
    return DandelionsInstructions.getInstructionCards();
  };

  renderCanvas(gameState, gameSettings, gamePhase, canMove) {
    return (
      <DandelionsCanvas
          gameState={gameState}
          gameSettings={gameSettings}
          gamePhase={gamePhase}
          canMove={canMove}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


export default Dandelions;
