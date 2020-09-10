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

  renderInstructions() {
    return <DandelionsInstructions />;
  }

  renderCanvas(gameState, gameSettings) {
    return (
      <DandelionsCanvas
          gameState={gameState}
          gameSettings={gameSettings}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


export default Dandelions;
