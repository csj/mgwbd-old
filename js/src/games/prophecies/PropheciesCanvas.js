import './PropheciesCanvas.scss';
import GamePieceHelper from 'games/GamePieceHelper';
import PlayerHelper from 'players/PlayerHelper';
import React, {useEffect, useState} from 'react';
import {Button} from 'primereact/button';


/**
 * Example squareData:
 *   {
 *     owner: 1, // 1, 2, or null (automatic)
 *     value: 3, // positive integer, or 0 ("X")
 *   }
 * Example action:
 * {
 *   owner: 1, row: 1, col: 1, value: 1,
 * },
 */


// TODO: game-end (circle scores and stuff)


const PropheciesCanvas = props => {
  const gameState = props.gameState;
  const gameSettings = props.gameSettings;
  const grid = gameState.grid;
  const numRows = grid.length;
  const numCols = grid[0].length;
  const [targetSquare, setTargetSquare] = useState(null);

  const onAction = value => {
    let [row, col] = targetSquare;
    props.onChooseMove({owner: gameState.activePlayer, row, col, value});
    setTargetSquare(null);
  };

  const isSquareSelected = (row, col) => {
    return targetSquare && targetSquare[0] === row && targetSquare[1] === col;
  };

  const isSquareLastMove = (row, col) => {
    let lastMoves = gameState.lastMove;
    return lastMoves &&
        lastMoves.some(move => move.row === row && move.col === col);
  };

  const calculateValidNumbers = (row, col) => {
    let validNumbers = new Set(
        new Array(Math.max(numRows, numCols)).fill().map((v, i) => i + 1));
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
    let allNumbers =
        new Array(Math.max(numRows, numCols)).fill().map((v, i) => i + 1);
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

  const renderSquareValue = (value, player, row, col) => {
    if (value === undefined) {
      return null;
    }
    if (value === 0) {
      return 'X';
    }
    return value;
  };

  const renderSquare = (squareData, i, j) => {
    squareData = squareData || {};
    let playerNumber = (squareData.owner) || gameState.activePlayer;
    let player = gameSettings.players[playerNumber - 1];
    let playerStyle =
        squareData.owner === null ? '' : PlayerHelper.getStyleClass(player);
    let isLastMove = isSquareLastMove(i, j);
    let isTouchable = props.canMove && squareData.owner === undefined;

    let highlight = <div className='highlight' />;
    let touchTarget = <div
        className='touchTarget'
        onClick={() => setTargetSquare(isSquareSelected(i, j) ? null : [i, j])}
        />;

    return (
      <div className={`square ${playerStyle}`} key={`row${i}col${j}`}>
        <div className='value'>
          {renderSquareValue(squareData.value, player, i, j)}
        </div>
        {isLastMove ? highlight : null}
        {isSquareSelected(i, j) ? renderNumberSelector() : null}
        {isTouchable ? touchTarget : null}
      </div>
    );
  };

  const renderRow = (rowData, i) => {
    return (
      <div className='row' key={`row${i}`}>
        {rowData.map((row, j) => renderSquare(row, i, j))}
      </div>
    );
  };


  return (
    <div className='PropheciesCanvas'>
      <div className='grid'>
        {grid.map(renderRow)}
      </div>
    </div>
  );
};


export default PropheciesCanvas;
