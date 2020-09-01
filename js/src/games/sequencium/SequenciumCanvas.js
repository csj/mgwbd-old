import './SequenciumCanvas.scss';
import React from 'react';


class SequenciumCanvas extends React.Component {

  constructor() {
    super();
    this.state = {
      moveFrom: {}, // { row: 1, col: 1}
    };
  }

  onChooseMove(move) {
    this.props.onChooseMove(this.props.gameState, move);
  }

  onMouseUp(rowTo, colTo) {
    if (rowTo === undefined || colTo === undefined) {
      this.setState({moveFrom: {}});
      return;
    }
    let rowFrom = this.state.moveFrom.row === undefined ?
        rowTo : this.state.moveFrom.row;
    let colFrom = this.state.moveFrom.col === undefined ?
        colTo : this.state.moveFrom.col;
    if (rowFrom - rowTo < -1 || rowFrom - rowTo > 1 ||
        colFrom - colTo < -1 || colFrom - colTo > 1 ||
        !this.validTo[rowTo][colTo] ||
        this.props.gameState.grid[rowTo][colTo] !== null) {
      this.setState({moveFrom: {}});
      return;
    }
    if (rowTo === rowFrom && colTo === colFrom) {
      rowFrom = this.validTo[rowTo][colTo].fromRow;
      colFrom = this.validTo[rowTo][colTo].fromCol;
    }
    this.setState({moveFrom: {}});
    this.onChooseMove(this.props.createMove(
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
            data-row={rowIndex}
            data-col={colIndex}
            onMouseDown={() =>
                this.setState({moveFrom: {row: rowIndex, col: colIndex}})}
            onMouseUp={() => this.onMouseUp(rowIndex, colIndex)}
            onTouchStart={() =>
                this.setState({moveFrom: {row: rowIndex, col: colIndex}})}
            onTouchEnd={e => {
                let endTouch = e.changedTouches[e.changedTouches.length - 1];
                let el = document.elementFromPoint(
                    endTouch.pageX, endTouch.pageY);
                if ('row' in el.dataset && 'col' in el.dataset) {
                  this.onMouseUp(
                      parseInt(el.dataset.row, 10),
                      parseInt(el.dataset.col, 10));
                }
              }
            } />
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
