import './SequenciumCanvas.scss';
import grid66 from 'images/grid-6-6.png';
import Grid from 'components/game/Grid';
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
  const [moveFrom, setMoveFrom] = useState({}); // {i: 1, j: 1}

  const activePlayerIndex = props.gameState.activePlayerIndex;
  const players = props.gameSettings.players;
  const activePlayer = players[activePlayerIndex];
  const grid = props.gameState.grid;
  const numRows = grid.length;
  const numCols = grid[0].length;
  const validFrom = [...Array(numRows)].map(r => Array(numCols).fill(null));
  const validTo = [...Array(numRows)].map(r => Array(numCols).fill(null));
  let maxScores = props.gameSettings.players.map(() => 0);

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
    let rowFrom = moveFrom.i === undefined ?  rowTo : moveFrom.i;
    let colFrom = moveFrom.j === undefined ?  colTo : moveFrom.j;
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

  const getSquareStyle = data => {
    return PlayerHelper.getStyleClass(
        data ? players[data.playerIndex] : activePlayer);
  };

  const getSquareOverlay = data => {
    let classes = [];
    return (
      <div className='overlay'>
        {renderConnectingLine(data)}
        {renderMaxScoreCircle(data)}
      </div>
    );
  };

  const renderConnectingLine = data => {
    return (
      <div className={`overlay linkLineHolder ${data && data.from}`}>
        <div className='linkLine' />
      </div>
    );
  };

  const renderMaxScoreCircle = data => {
    if (!data) {
      return;
    }
    let maxScore = maxScores[data.playerIndex];
    return data.value === maxScore ?
        <div className='overlay maxScore' /> : null;
  };

  const isSquareTouchable = (data, i, j) => {
    return validTo[i][j];
  };

  const isHighlighted = (data, i, j) => {
    let lastMove = props.gameState.lastMove;
    return lastMove.row === i && lastMove.col === j;
  };

  const isCircled = (data, i, j) => {
  };

  const onSquareTouch = (data, i, j) => {
    if (data) {
      setMoveFrom({i, j});
    } else {
      onMouseUp(i, j);
    }
  };

  const render = () => {
    let gridBgUrl = grid66;
    return (
      <div className='SequenciumCanvas'>
        <Grid className={`grid gamePhase${props.gamePhase}`}
            grid={grid}
            squareStyle={getSquareStyle}
            isTouchable={isSquareTouchable}
            isHighlighted={isHighlighted}
            squareOverlay={getSquareOverlay}
            onTouch={onSquareTouch} />
      </div>
    );
  };

  return render();
}


export default SequenciumCanvas;
