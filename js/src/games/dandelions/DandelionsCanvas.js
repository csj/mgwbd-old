import './DandelionsCanvas.scss';
import GamePiece from 'components/game/GamePiece';
import Grid from 'components/game/Grid';
import PlayerHelper from 'players/PlayerHelper';
import React, {useState} from 'react';
import dandelionsCompass from './images/dandelions-compass.png';
import { SquareStates, AllDirections } from './Constants.js';


const Move = Object.freeze({
  grid: (row, col) => ({grid: {row, col}}),
  compass: d => ({compass: d}),
});


/**
 * props:
 *   gameState: Object
 *   gameSettings: Object
 *   gamePhase: Object
 *   canMove: boolean, Whether this client may make a move now.
 */
const DandelionsCanvas = props => {

  // { grid: { row: 1, col: 1} } or { compass: 'N' }
  const [hover, setHover] = useState({});

  const gameState = props.gameState;
  const dandelionPlayer = props.gameSettings.players[0];
  const windPlayer = props.gameSettings.players[1];

  const isSquareTouchable = data => {
    return (
      props.canMove &&
      gameState.activePlayerIndex === 0 &&
      data !== SquareStates.FLWR
    );
  };

  const isHighlighted = (data, i, j) => {
    return (
      gameState.lastMove &&
      gameState.lastMove.grid &&
      gameState.lastMove.grid[i][j] != null
    );
  };

  const onSquareTouch = (data, i, j) => {
    props.onChooseMove(Move.grid(i, j));
  };

  const renderSquareValue = (data, i, j) => {
    if (data) {
      let pieceType = data === SquareStates.FLWR ? 'asterisk' : 'dot';
      return (
        <GamePiece
            type={pieceType} player={dandelionPlayer} hashMaterial={[i, j]} />
      );
    }
    return null;
  };

  const renderCompassPoint = (keyPrefix, direction, isHighlighted) => {
    let point = (
      <GamePiece
          className='compassPoint' type='dot' player={windPlayer}
          hashMaterial={direction} />
    );
    let highlight = <div className='compassPoint highlight' />;

    return (
      <div
          key={`${keyPrefix} ${direction}`}
          className={`directionHolderInner dir${direction} ${keyPrefix}`}>
        {isHighlighted ? highlight : point}
      </div>
    );
  };

  const renderCompassTouchTarget = direction => {
    if (gameState.compass.directions.indexOf(direction) >= 0 ||
        gameState.activePlayerIndex !== 1 ||
        !props.canMove) {
      return null;
    }

    return (
      <div
          key={direction}
          className={`directionHolderInner dir${direction}`}>
        <div
            className='touchTarget'
            onMouseOver={() => setHover({compass: direction})}
            onMouseOut={() => setHover({})}
            onClick={() => props.onChooseMove(Move.compass(direction))} />
      </div>
    );
  };

  const renderCompass = gameState => {
    let directions = gameState.compass.directions;
    let highlightLastTurn = null;
    let highlightHover = null;
    if (gameState.lastMove && gameState.lastMove.compass) {
      let compass = gameState.lastMove.compass;
      let direction = compass.directions.length && compass.directions[0];
      if (direction) {
        highlightLastTurn = renderCompassPoint('last', direction, true);
      }
    }
    if (hover.compass && props.canMove) {
      highlightHover = renderCompassPoint('hover', hover.compass, true);
    }
    let windPlayerStyleClass = PlayerHelper.getStyleClass(windPlayer);
    return (
      <div className={`compass ${windPlayerStyleClass}`}>
        <div className='compassOverlay'
            style={{backgroundImage: `url(${dandelionsCompass})`}} />
        <div className='compassOverlay directionHolder'>
          {directions.map(d => renderCompassPoint('used', d, false))}
        </div>
        <div className='compassOverlay directionHolder'>
          {highlightLastTurn}
          {highlightHover}
          {AllDirections.map(d => renderCompassTouchTarget(d))}
        </div>
      </div>
    )
  };

  /**
   * props:
   *   gameState: Object
   *   gameSettings: Object
   *   gamePhase: Enum
   *   canMove: boolean
   */
  const render = () => {
    let dandelionPlayerStyleClass = PlayerHelper.getStyleClass(dandelionPlayer);
    return (
      <div className='DandelionsCanvas'>
        {renderCompass(gameState)}
        <div className='grid'>
          <Grid
              grid={gameState.grid}
              squareStyle={() => dandelionPlayerStyleClass}
              renderSquareValue={renderSquareValue}
              isTouchable={isSquareTouchable}
              isHighlighted={isHighlighted}
              onTouch={onSquareTouch} />
        </div>
      </div>
    );
  };

  return render();
}


export default DandelionsCanvas;
