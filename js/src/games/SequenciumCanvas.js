import './SequenciumCanvas.scss';
import Sequencium from './Sequencium';
import React from 'react';


class SequenciumCanvas extends React.Component {

  constructor() {
    super();
    this.state = {
      mouseDown: {}, // { row: 1, col: 1}
    };
  }

  onChooseMove(move) {
    this.props.onChooseMove(this.props.gameState, move);
  }

  onMouseUp(rowTo, colTo) {
    let rowFrom = this.state.mouseDown.row || rowTo;
    let colFrom = this.state.mouseDown.col || colTo;
    if (rowFrom - rowTo < -1 || rowFrom - rowTo > 1 ||
        colFrom - colTo < -1 || colFrom - colTo > 1 ||
        !this.validTo[rowTo][colTo] ||
        this.props.gameState.grid[rowTo][colTo] !== null) {
      this.setState({mouseDown: {}});
      return;
    }
    if (rowTo === rowFrom && colTo === colFrom) {
      rowFrom = this.validTo[rowTo][colTo].fromRow;
      colFrom = this.validTo[rowTo][colTo].fromCol;
    }
    this.setState({mouseDown: {}});
    this.onChooseMove(Sequencium.Move(
      this.props.gameState.activePlayer, rowFrom, colFrom, rowTo, colTo));
  }

  calculateValidMoves(activePlayer, grid) {
    let numRows = grid.length;
    let numCols = grid[0].length;
    this.validFrom = [...Array(numRows)].map(r => Array(numCols).fill(null));
    this.validTo = [...Array(numRows)].map(r => Array(numCols).fill(null));
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col] && grid[row][col].playerNumber === activePlayer) {
          let value = grid[row][col].value;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (row + i < 0 || row + i >= numRows ||
                  col + j < 0 || col + j >= numCols ||
                  grid[row + i][col + j]) {
                continue;
              }
              this.validFrom[row][col] = true;
              if (!this.validTo[row + i][col + j] ||
                  this.validTo[row + i][col + j].value < value + 1) {
                this.validTo[row + i][col + j] = {
                    fromRow: row, fromCol: col, value: value + 1 };
              }
            }
          }
        }
      }
    }
  }

  getPlayerStyle(playerNumber) {
    if (!playerNumber) {
      return null;
    }
    let hue = this.props.gameSettings.playerHues[playerNumber];
    if (hue) {
      return {
        color: 'red',
        filter: `hue-rotate(${hue}deg)`,
      };
    }
    return null;
  }

  renderGridSquare(data, rowIndex, colIndex) {
    let touchable =
      this.validFrom[rowIndex][colIndex] || this.validTo[rowIndex][colIndex];
    let isLastMove =
      this.props.gameState.lastMove.row === rowIndex &&
      this.props.gameState.lastMove.col === colIndex;
    return (
      <div key={`r${rowIndex}c${colIndex}`}
          className={`
              square
              player${data && data.playerNumber}
              ${isLastMove ? 'lastMove' : ''}`}
          style={/* TODO this.getPlayerStyle(data && data.playerNumber) */null}>
        <div className='squareOverlay'>
          {(data && data.value) || ''}
        </div>
        <div className={`squareOverlay linkLineHolder ${data && data.from}`}>
          <div className='linkLine' />
        </div>
        <div
            className={`squareOverlay ${touchable ? 'touchable' : ''}`}
            style={{backgroundImage: `url(${0})`}}
            onMouseDown={() =>
                this.setState({mouseDown: {row: rowIndex, col: colIndex}})}
            onMouseUp={() => this.onMouseUp(rowIndex, colIndex)}>
        </div>
      </div>
    );
  }

  renderGridRow(row, rowIndex) {
    return (
      <div className='row' key={rowIndex}>
        {row.map(
            (data, colIndex) =>
                this.renderGridSquare(data, rowIndex, colIndex))}
      </div>
    );
  }

  /**
   * props:
   *   gameState: Object
   *   gameSettings: Object
   */
  render() {
    this.calculateValidMoves(
        this.props.gameState.activePlayer, this.props.gameState.grid);
    return (
      <div className='SequenciumCanvas'>
        <div className='grid'>
          {this.props.gameState.grid.map(this.renderGridRow, this)}
        </div>
      </div>
    );
  }
}


export default SequenciumCanvas;
