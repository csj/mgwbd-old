import './SequenciumCanvas.scss';
import grid66 from 'images/grid-6-6.png';
import PlayerHelper from 'players/PlayerHelper';
import React, { useState } from 'react';


/**
 * props:
 *   gameState: Object
 *   gameSettings: Object
 *   gamePhase: Object
 *   canMove: boolean, Whether this client may make a move now.
 */
const SequenciumCanvas = props => {
  const [moveFrom, setMoveFrom] = useState({}); // {row: 1, col: 1}

  const activePlayerIndex = props.gameState.activePlayerIndex;
  const grid = props.gameState.grid;
  const numRows = grid.length;
  const numCols = grid[0].length;
  const validFrom = [...Array(numRows)].map(r => Array(numCols).fill(null));
  const validTo = [...Array(numRows)].map(r => Array(numCols).fill(null));
  let maxScores = [0, 0];

  (() => { // Populate grid metadata (validFrom, validTo, maxScores)
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        let square = grid[row][col];
        let value = square && square.value;
        let playerIndex = square && square.playerIndex;
        if (Number.isInteger(playerIndex)) {
          maxScores[playerIndex] = Math.max(maxScores[playerIndex], value);
        }
        if (Number.isInteger(playerIndex) &&
            playerIndex === activePlayerIndex) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (row + i < 0 || row + i >= numRows ||
                  col + j < 0 || col + j >= numCols ||
                  grid[row + i][col + j]) {
                continue;
              }
              validFrom[row][col] = true;
              if (!validTo[row + i][col + j] ||
                  validTo[row + i][col + j].value < value + 1) {
                validTo[row + i][col + j] = {
                    fromRow: row, fromCol: col, value: value + 1 };
              }
            }
          }
        }
      }
    }
  })();

  const chooseMove = (playerIndex, rowFrom, colFrom, rowTo, colTo) => {
    props.onChooseMove({ playerIndex, rowFrom, colFrom, rowTo, colTo });
  };

  const onMouseUp = (rowTo, colTo) => {
    if (rowTo === undefined || colTo === undefined) {
      setMoveFrom({});
      return;
    }
    let rowFrom = moveFrom.row === undefined ?  rowTo : moveFrom.row;
    let colFrom = moveFrom.col === undefined ?  colTo : moveFrom.col;
    if (rowFrom - rowTo < -1 || rowFrom - rowTo > 1 ||
        colFrom - colTo < -1 || colFrom - colTo > 1 ||
        !validTo[rowTo][colTo] ||
        grid[rowTo][colTo] !== null) {
      setMoveFrom({});
      return;
    }
    if (rowTo === rowFrom && colTo === colFrom) {
      rowFrom = validTo[rowTo][colTo].fromRow;
      colFrom = validTo[rowTo][colTo].fromCol;
    }
    setMoveFrom({});
    chooseMove(
        props.gameState.activePlayerIndex, rowFrom, colFrom, rowTo, colTo);
  };

  const renderGridSquare = (data, row, col) => {
    let playerIndex = Number.isInteger(data && data.playerIndex) ?
        data.playerIndex : props.gameState.activePlayerIndex;
    let isLastMove =
      props.gameState.lastMove.row === row &&
      props.gameState.lastMove.col === col;
    let isMaxScore = (data && data.value) === maxScores[playerIndex];
    let isTouchable =
        props.canMove && (validFrom[row][col] || validTo[row][col]);
    let isActive = moveFrom.row === row && moveFrom.col === col;
    let designStyleClass =
        props.gameSettings.handDrawnGrid ? null : 'squareOutline';

    let outerClassName = `square ${designStyleClass} `;
    if (Number.isInteger(playerIndex) && props.gameSettings.players) {
      let playerStyleClass = PlayerHelper.getStyleClass(
          props.gameSettings.players[playerIndex]);
      outerClassName += `${playerStyleClass} `;
    }
    return (
      <div key={`r${row}c${col}`} className={outerClassName}>
        <div className={`squareOverlay ${isLastMove ? 'lastMove' : ''}`}>
          {(data && data.value) || ''}
        </div>
        <div className={`squareOverlay ${isMaxScore ? 'maxScore' : ''}`} />
        <div className={`squareOverlay linkLineHolder ${data && data.from}`}>
          <div className='linkLine' />
        </div>
        <div
            className={`squareOverlay ${isActive ? 'active' : ''} ${isTouchable ? 'touchable' : ''}`}
            data-row={row}
            data-col={col}
            onMouseDown={() => setMoveFrom({row, col})}
            onMouseUp={() => onMouseUp(row, col)}
            onTouchStart={() => setMoveFrom({row, col})}
            onTouchEnd={e => {
                let endTouch = e.changedTouches[e.changedTouches.length - 1];
                let el = document.elementFromPoint(
                    endTouch.pageX, endTouch.pageY);
                if ('row' in el.dataset && 'col' in el.dataset) {
                  onMouseUp(
                      parseInt(el.dataset.row, 10),
                      parseInt(el.dataset.col, 10));
                }
              }
            } />
      </div>
    );
  };

  const renderGridRow = (rowData, row) => {
    return (
      <div className='row' key={row}>
        {rowData.map((data, col) => renderGridSquare(data, row, col))}
      </div>
    );
  };

  const render = () => {
    let gridBgUrl = props.gameSettings.handDrawnGrid ? grid66 : null;
    return (
      <div className='SequenciumCanvas'>
        <div
            className={`grid gamePhase${props.gamePhase}`}
            style={{backgroundImage: `url(${gridBgUrl})`}}>
          {grid.map(renderGridRow)}
        </div>
      </div>
    );
  };

  return render();
}


export default SequenciumCanvas;
