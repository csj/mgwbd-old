import DandelionsCanvas from './DandelionsCanvas';
import Game from './Game';
import React from 'react';


class Dandelions extends Game {
  constructor() {
    super();
    this.gridHeight = 5;
    this.gridWidth = 4;
  }

  getCanonicalName() {
    return 'dandelions';
  }

  getDisplayName() {
    return 'Dandelions';
  }

  renderCanvas(gameState) {
    return (
      <DandelionsCanvas
          gameState={gameState}
          gameSettings={{
            gridHeight: this.gridHeight,
            gridWidth: this.gridWidth,
          }} />
    );
  }
}


export default Dandelions;
