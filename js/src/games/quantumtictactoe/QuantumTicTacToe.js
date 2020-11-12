import QuantumTicTacToeCanvas from './QuantumTicTacToeCanvas';
import QuantumTicTacToeInstructions from './QuantumTicTacToeInstructions';
import Game from 'games/Game';
import React from 'react';


class QuantumTicTacToe extends Game {
  getCanonicalName() {
    return 'quantumtictactoe';
  }

  getDisplayName() {
    return 'Quantum Tic-Tac-Toe';
  }

  getInstructionCards() {
    return QuantumTicTacToeInstructions.getInstructionCards();
  };

  renderCanvas(gameState, gameSettings, gamePhase, canMove) {
    return (
      <QuantumTicTacToeCanvas
          gameState={gameState}
          gameSettings={gameSettings}
          gamePhase={gamePhase}
          canMove={canMove}
          onChooseMove={this.onChooseMove.bind(this)} />
    );
  }
}


export default QuantumTicTacToe;

