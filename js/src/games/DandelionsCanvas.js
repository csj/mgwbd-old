import './DandelionsCanvas.scss';
import React from 'react';


class DandelionsCanvas extends React.Component {

  renderGridSquare(rowIndex, colIndex) {
    return (
      <div className='square'
          key={`r${rowIndex}c${colIndex}`}
          onClick={() => console.log(`clicked on row ${rowIndex}, col ${colIndex}`)}
          >
          X
      </div>
    );
  }

  renderGridRow(rowIndex) {
    return (
      new Array(this.props.gameSettings.gridWidth)
          .fill(null).map((i, j) => j)
          .map(colIndex => this.renderGridSquare(rowIndex, colIndex))
    );
  }

  render() {
    // this.props.gameState
    // this.props.gameSettings
    return (
      <div className='DandelionsCanvas'>
        <div className='compass'>
        </div>
        <div className='grid'>
          {new Array(this.props.gameSettings.gridHeight)
              .fill(null).map((i, j) => j).map(this.renderGridRow, this)}
        </div>
      </div>
    );
  }
}


export default DandelionsCanvas;
