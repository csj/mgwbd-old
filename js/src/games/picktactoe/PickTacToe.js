import PickTacToeCanvas from './PickTacToeCanvas';
import PickTacToeInstructions from './PickTacToeInstructions';
import Game from 'games/Game';
import React from 'react';


class PickTacToe extends Game {
  getCanonicalName() {
    return 'picktactoe';
  }

  getDisplayName() {
    return 'Pick-Tac-Toe';
  }

  getInstructionCards() {
    return PickTacToeInstructions.getInstructionCards();
  };

  renderCanvas(gameState, gameSettings, gamePhase, canMove) {
    return (
      <PickTacToeCanvas
          gameState={gameState}
          gameSettings={gameSettings}
          gamePhase={gamePhase}
          canMove={canMove}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


export default PickTacToe;

