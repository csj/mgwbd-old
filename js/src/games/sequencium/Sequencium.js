import SequenciumCanvas from './SequenciumCanvas';
import SequenciumInstructions from './SequenciumInstructions';
import Game from 'games/Game';
import React from 'react';


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

  renderCanvas(gameState, gameSettings) {
    return (
      <SequenciumCanvas
          gameState={gameState}
          gameSettings={gameSettings}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


export default Sequencium;
