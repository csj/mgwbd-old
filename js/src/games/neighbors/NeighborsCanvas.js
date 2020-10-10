import './NeighborsCanvas.scss';
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


// TODO move to its own file
const Die = props => {
  // TODO useEffect for a 'rolling' animation, each time 'rolled' is set from false to true
  return (
    <div className={`Die ${props.className} d${props.sides}`}>
      {props.value}
    </div>
  );
};


// TODO move to its own file
const Grid = props => {

  const renderSquare = (squareData, i, j) => {
    let playerStyle = PlayerHelper.getStyleClass(props.player);
    return (
      <div className={`square ${playerStyle}`} key={`row${i}col${j}`}>
        <div className='value'>
          {squareData && squareData.value}
          {props.isTouchable && props.isTouchable(squareData) ?
              't': null}
          {props.isHighlighted && props.isHighlighted(squareData) ?
              'h': null}
        </div>
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
    <div className={`Grid ${props.className}`}>
      {props.grid.map(renderRow)}
    </div>
  );
};

const NeighborsCanvas = props => {
  const gameState = props.gameState;
  const gameSettings = props.gameSettings;
  const players = gameSettings.players;
  const grids = gameState.grids;
  const numRows = grids[0].length;
  const numCols = grids[0][0].length;
  const [tab, setTab] = useState(players.length);

  const onAction = value => {
    /*
    let [row, col] = targetSquare;
    props.onChooseMove({owner: gameState.activePlayerIndex, row, col, value});
  */
  };

  const isGridVisible = i => {
    return tab === i || tab === players.length;
  };

  const isSquareTouchable = (playerIndex, data) => {
    return !(data && data.value);
  };

  const isSquareHighlighted = (playerIndex, data) => {
    return data && data.value === 5;
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
          <Die sides={10} value={5} rolled={false} />
        </div>
      </div>
      <div className='grids p-grid'>
        {players.map((p, i) =>
          <Grid
              key={i}
              grid={gameState.grids[i]}
              player={players[i]}
              className={`
                p-col-${tab === players.length ? 6 : 12}
                ${PlayerHelper.getStyleClass(p)}
                ${isGridVisible(i) ? '' : ' hideGrid'}`
              }
              isTouchable={data => isSquareTouchable(i, data)}
              isHighlighted={data => isSquareHighlighted(i, data)}
              onTap={null}
              />
        )}
      </div>
    </div>
  );
};


export default NeighborsCanvas;
