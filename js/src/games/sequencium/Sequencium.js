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

  renderCanvas(gameState, gameSettings, playerManager) {
    gameSettings = Object.assign({}, gameSettings, {
      playerStyleClasses:
          playerManager.getPlayers().map(p => p.getPlayerStyleClass()),
    });
    return (
      <SequenciumCanvas
          gameState={gameState}
          gameSettings={gameSettings}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


export default Sequencium;
