import './SequenciumCanvas.scss';
import grid66 from 'images/grid-6-6.png';
import React from 'react';


const Move = (playerNumber, rowFrom, colFrom, rowTo, colTo) => ({
    playerNumber, rowFrom, colFrom, rowTo, colTo});


class SequenciumCanvas extends React.Component {

  constructor() {
    super();
    this.state = {
      moveFrom: {}, // { row: 1, col: 1}
    };
  }

  onChooseMove(move) {
    this.props.onChooseMove(move);
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
    this.onChooseMove(Move(
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
    return this.props.gameSettings.playerStyleClasses[playerNumber - 1];
  }

  renderGridSquare(data, rowIndex, colIndex) {
    let isLastMove =
      this.props.gameState.lastMove.row === rowIndex &&
      this.props.gameState.lastMove.col === colIndex;
    let playerNumber= data && data.playerNumber;
    let touchable =
      this.validFrom[rowIndex][colIndex] || this.validTo[rowIndex][colIndex];
    let active =
        this.state.moveFrom.row === rowIndex &&
        this.state.moveFrom.col === colIndex;
    let playerStyleClass =
        this.getPlayerStyle(playerNumber || this.props.gameState.activePlayer);
    let designStyleClass =
        this.props.gameSettings.handDrawnGrid ? null : 'squareOutline';

    let outerClassName = `square ${playerStyleClass} ${designStyleClass} `;
    if (playerNumber) {
      outerClassName += `player${playerNumber}`;
    }
    return (
      <div key={`r${rowIndex}c${colIndex}`} className={outerClassName}>
        <div className={`squareOverlay ${isLastMove ? 'lastMove' : ''}`}>
          {(data && data.value) || ''}
        </div>
        <div className={`squareOverlay linkLineHolder ${data && data.from}`}>
          <div className='linkLine' />
        </div>
        <div
            className={`squareOverlay ${active ? 'active' : ''} ${touchable ? 'touchable' : ''}`}
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
    let gridBgUrl = this.props.gameSettings.handDrawnGrid ? grid66 : null;
    return (
      <div className='SequenciumCanvas'>
        <div className='grid'
            style={{backgroundImage: `url(${gridBgUrl})`}}>
          {this.props.gameState.grid.map(this.renderGridRow, this)}
        </div>
      </div>
    );
  }
}


export default SequenciumCanvas;
