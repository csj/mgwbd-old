import './NeighborsCanvas.scss';
import Die from 'components/game/Die';
import GamePhase from 'games/GamePhase';
import Grid from 'components/game/Grid';
import PlayerHelper from 'players/PlayerHelper';
import React, {useEffect, useState} from 'react';


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


const NeighborsCanvas = props => {
  const gamePhase = props.gamePhase;
  const gameState = props.gameState;
  const gameSettings = props.gameSettings;
  const players = gameSettings.players;
  const grids = gameState.grids;
  const numRows = grids[0].length;
  const numCols = grids[0][0].length;
  const [tab, setTab] = useState(players.length);
  const [pendingMoves, setPendingMoves] = useState({});

  useEffect(() => {
    if (gameState.lastMove && gameState.lastMove.players) {
      setPendingMoves({});
    }
    if (gamePhase !== GamePhase.PLAYING) {
      setPendingMoves({});
    }
  }, [gameState, gamePhase]);

  useEffect(() => { // Reset view when player count changes.
    setTab(players.length);
  }, [players.length]);

  const onAction = value => {
    props.onChooseMove(value);
  };

  const circlesData = (() => {
    let circlesData = [];
    for (let i = 0; i < players.length; i++) {
      let circleData = [];
      let grid = grids[i];
      for (let row = 0; row < numRows; row++) {
        let chain = { rowFrom: row, rowTo: row, value: null, size: 0 };
        for (let col = 0; col < numCols; col++) {
          let value = grid[row][col] && grid[row][col].value;
          if (value && value === chain.value) {
            Object.assign(chain, {colTo: col, size: chain.size + 1});
          } else {
            if (chain.size > 1) {
              circleData.push({...chain, key: `r-${row}-${chain.value}`});
            }
            Object.assign(chain, {colFrom: col, value, size: 1});
          }
        }
        if (chain.size > 1) {
          circleData.push({...chain, key: `r-${row}-${chain.value}`});
        }
      }
      for (let col = 0; col < numCols; col++) {
        let chain = { colFrom: col, colTo: col, value: null, size: 0 };
        for (let row = 0; row < numRows; row++) {
          let value = grid[row][col] && grid[row][col].value;
          if (value && value === chain.value) {
            Object.assign(chain, {rowTo: row, size: chain.size + 1});
          } else {
            if (chain.size > 1) {
              circleData.push({...chain, key: `c-${col}-${chain.value}`});
            }
            Object.assign(chain, {rowFrom: row, value, size: 1});
          }
        }
        if (chain.size > 1) {
          circleData.push({...chain, key: `c-${col}-${chain.value}`});
        }
      }
      circlesData.push(circleData);
    }
    return circlesData;
  })();

  const isGridVisible = i => {
    return tab === i || tab === players.length;
  };

  const isSquareTouchable = (playerIndex, data) => {
    return (
      gamePhase === GamePhase.PLAYING &&
      gameState.die.rolled &&
      !(data && data.value) &&
      (PlayerHelper.isOwnedByMe(players[playerIndex]) ||
       PlayerHelper.isUnowned(players[playerIndex])) &&
      !pendingMoves[playerIndex]
    );
  };

  const isSquareHighlighted = (playerIndex, data, row, col) => {
    if (gamePhase === GamePhase.PLAYING &&
        gameState.lastMove.players) {
      let highlightedSquare = gameState.lastMove.players[playerIndex];
      return highlightedSquare.row === row && highlightedSquare.col === col;
    }

    if (gamePhase === GamePhase.PLAYING &&
        gameState.lastMove.die) {
      let highlightedSquare = pendingMoves[playerIndex] || {};
      return highlightedSquare.row === row && highlightedSquare.col === col;
    }
    return false;
  };


  const onSquareTouch = (playerIndex, data, row, col) => {
    if (!isSquareTouchable(playerIndex, data)) {
      return;
    }
    onAction({ playerIndex, row, col });
    setPendingMoves(
        Object.assign({}, pendingMoves, {[playerIndex]: {row, col}}));
  };

  const rollDie = () => {
    if (gamePhase !== GamePhase.PLAYING || gameState.die.rolled) {
      return;
    }
    onAction({ roll: true });
  };

  const renderCircle = (circleData, i) => {
    let left = `${100 * circleData.colFrom / numCols}%`;
    let right = `${100 * (numCols - circleData.colTo - 1) / numCols}%`;
    let topPx = `${100 * circleData.rowFrom / numRows}%`;
    let bottom = `${100 * (numRows - circleData.rowTo - 1) / numRows}%`;
    return (
      <div
          className='circle' key={circleData.key}
          style={{top: topPx, left, right, bottom}} />
    );
  };

  const renderGrid = (player, playerIndex) => {
    return (
      <div 
          key={playerIndex}
          className={`
              gridContainer
              p-col-${tab === players.length ? 6 : 12}
              ${PlayerHelper.getStyleClass(player)}
              ${isGridVisible(playerIndex) ? '' : ' hideGrid'}
          `}>
        <Grid
            className='grid'
            grid={gameState.grids[playerIndex]}
            squareStyle={() => PlayerHelper.getStyleClass(player)}
            isTouchable={data => isSquareTouchable(playerIndex, data)}
            isHighlighted={
                (data, i, j) => isSquareHighlighted(playerIndex, data, i, j)}
            onTouch={(data, i, j) => onSquareTouch(playerIndex, data, i, j)}
            hashMaterial={[playerIndex]}
            >
          <div className='circles'>
            {circlesData[playerIndex].map(renderCircle)}
          </div>
        </Grid>
      </div>
    );
  };

  return (
    <div className='NeighborsCanvas'>
      <div className='tabs'>
        {players.map((p, i) =>
          <div
              className={`
                playerTab
                ${tab === i ? 'active' : ''}
                ${PlayerHelper.getStyleClass(p)}
              `}
              key={i}
              onClick={() => setTab(i)}>
            <img src={PlayerHelper.getAvatar(p)} alt='avatar' />
          </div>
        )}
        <div
            className={`playerTab ${tab === players.length ? 'active' : ''}`}
            key={players.length}
            onClick={() => setTab(players.length)}>
          all
        </div>
        <div className='die'>
          <Die
              sides={10}
              value={gameState.die.value}
              rolled={gamePhase !== GamePhase.PLAYING || gameState.die.rolled}
              onTouch={rollDie} />
        </div>
      </div>
      <div className='grids p-grid'>
        {players.map(renderGrid)}
      </div>
    </div>
  );
};


export default NeighborsCanvas;
