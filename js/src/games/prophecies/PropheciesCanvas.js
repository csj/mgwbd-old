import './PropheciesCanvas.scss';
import Grid from 'components/game/Grid';
import PlayerHelper from 'players/PlayerHelper';
import React, {useState} from 'react';


/**
 * Example squareData:
 *   {
 *     owner: 1, // 0, 1, or null (automatic)
 *     value: 3, // positive integer, or 0 ("X")
 *   }
 * Example action:
 * {
 *   owner: 1, row: 1, col: 1, value: 1,
 * },
 */


const PropheciesCanvas = props => {
  const gameState = props.gameState;
  const gameSettings = props.gameSettings;
  const grid = gameState.grid;
  const numRows = grid.length;
  const numCols = grid[0].length;
  const [targetSquare, setTargetSquare] = useState(null);

  const onAction = value => {
    let [row, col] = targetSquare;
    props.onChooseMove({owner: gameState.activePlayerIndex, row, col, value});
    setTargetSquare(null);
  };

  const isSquareSelected = (row, col) => {
    return targetSquare && targetSquare[0] === row && targetSquare[1] === col;
  };

  const rowWinners = (() => {
    let rowWinners = [];
    for (let i = 0; i < numRows; i++) {
      let isRowFilled = true;
      let rowScore = 0;
      for (let j = 0; j < numCols; j++) {
        let square = grid[i][j];
        let value = square && square.value;
        if (value !== null) {
          if (gameSettings.xProphecies) {
            rowScore += value ? 0 : 1;
          } else {
            rowScore += value ? 1 : 0;
          }
        } else {
          isRowFilled = false;
        }
      }
      rowWinners.push(isRowFilled ? rowScore : null);
    }
    return rowWinners;
  })();

  const colWinners = (() => {
    let colWinners = [];
    for (let j = 0; j < numCols; j++) {
      let isColFilled = true;
      let colScore = 0;
      for (let i = 0; i < numRows; i++) {
        let square = grid[i][j];
        let value = square && square.value;
        if (value !== null) {
          if (gameSettings.xProphecies) {
            colScore += value ? 0 : 1;
          } else {
            colScore += value ? 1 : 0;
          }
        } else {
          isColFilled = false;
        }
      }
      colWinners.push(isColFilled ? colScore : null);
    }
    return colWinners;
  })();

  const calculateValidNumbers = (row, col) => {
    let validNumbers = new Set(
        new Array(Math.max(numRows, numCols)).fill().map((v, i) => i + 1));
    if (gameSettings.xProphecies) {
      validNumbers.delete(Math.max(numRows, numCols));
    }
    for (let i = 0; i < numRows; i++) {
      let sq = grid[i][col];
      if (sq && sq.value) {
        validNumbers.delete(sq.value);
      }
    }
    for (let j = 0; j < numCols; j++) {
      let sq = grid[row][j];
      if (sq && sq.value) {
        validNumbers.delete(sq.value);
      }
    }
    return validNumbers;
  };

  const renderNumberSelector = () => {
    if (!targetSquare) {
      return;
    }
    let max = Math.max(numRows, numCols);
    if (gameSettings.xProphecies) {
      max--;
    }
    let allNumbers = new Array(max).fill().map((v, i) => i + 1);
    let validNumbers = calculateValidNumbers(...targetSquare);
    return (
      <div className='numberSelector shadow'>
        {allNumbers.map(v => (
          <div
              className={`option ${validNumbers.has(v) ? 'valid' : ''}`}
              key={v}
              onClick={() => validNumbers.has(v) && onAction(v)}>
            {v}
          </div>
        ))}
        <div className='option valid' onClick={() => onAction(0)}>X</div>
        <div className='option valid' onClick={setTargetSquare}>back</div>
      </div>
    );
  };

  const renderSquareValue = squareData => {
    let value = squareData && squareData.value;
    if (!Number.isInteger(value)) {
      return null;
    }
    return value === 0 ? 'X' : value;
  };

  const getSquareStyle = squareData => {
    let playerIndex = Number.isInteger(squareData && squareData.owner) ?
        squareData.owner : gameState.activePlayerIndex;
    return PlayerHelper.getStyleClass(gameSettings.players[playerIndex]);
  };

  const isHighlighted = (squareData, i, j) => {
    let lastMoves = gameState.lastMove;
    return lastMoves &&
        lastMoves.some(move => move.row === i && move.col === j);
  };

  const isTouchable = squareData => {
    return props.canMove && (squareData || {}).owner === undefined;
  };

  const onTouch = (data, i, j) => {
    setTargetSquare(isSquareSelected(i, j) ? null : [i, j]);
  };

  const renderSquareOverlay = (squareData, i, j) => {
    let isRowWinner = rowWinners[i] && rowWinners[i] === squareData.value;
    let isColWinner = colWinners[j] && colWinners[j] === squareData.value;
    let winner = <div className='winner overlay' />;
    let doubleWinner = <div className='doubleWinner overlay' />;
    return (
      <div className='overlay'>
        {(isRowWinner || isColWinner) ? winner : null}
        {(isRowWinner && isColWinner) ? doubleWinner : null}
        {isSquareSelected(i, j) ? renderNumberSelector() : null}
      </div>
    );
  };

  return (
    <div className='PropheciesCanvas'>
      <Grid
          className='grid'
          grid={gameState.grid}
          squareStyle={getSquareStyle}
          isHighlighted={isHighlighted}
          isTouchable={isTouchable}
          onTouch={onTouch}
          renderSquareValue={renderSquareValue}
          renderSquareOverlay={renderSquareOverlay} />
    </div>
  );
};


export default PropheciesCanvas;
