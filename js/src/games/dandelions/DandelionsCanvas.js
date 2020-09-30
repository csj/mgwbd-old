import './DandelionsCanvas.scss';
import GamePieceHelper from 'games/GamePieceHelper';
import PlayerHelper from 'players/PlayerHelper';
import React from 'react';
import dandelionsCompass from './images/dandelions-compass.png';
import dandelionsWindNorth from './images/dandelions-wind-north-1.png';
import dandelionsWindNorthHighlighted from './images/dandelions-wind-north-highlighted.png';
import gamePieceAsterisk from 'images/game-piece-asterisk.png';
import gamePieceAsteriskHighlighted from 'images/game-piece-asterisk-highlighted.png';
import gamePieceDot from 'images/game-piece-dot.png';
import gamePieceDotHighlighted from 'images/game-piece-dot-highlighted.png';
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
class DandelionsCanvas extends React.Component {

  constructor() {
    super();
    this.state = {
      hover: {}, // { grid: { row: 1, col: 1} } or { compass: 'N' }
    };
  }

  onChooseMove(move) {
    this.props.onChooseMove(move);
  }

  getSquareImg(squareState, row, col) {
    let style = this.props.gameSettings.players[0].style;
    let type;
    switch (squareState) {
      case SquareStates.SEED:
        type = 'dot';
        break;
      case SquareStates.FLWR:
        type = 'asterisk';
        break;
      default:
        return;
    }
    return GamePieceHelper.getGamePiece(style, type, [row, col]);
  }

  getCompassImg(direction) {
    let style = this.props.gameSettings.players[1].style;
    return GamePieceHelper.getGamePiece(style, 'dot', direction);
  }

  renderGridSquare(data, rowIndex, colIndex) {
    let highlight = false;
    let isClickable =
        this.props.canMove &&
        this.props.gameState.activePlayer === 1 &&
        data !== SquareStates.FLWR;
    if (this.props.gameState.lastMove &&
        this.props.gameState.lastMove.grid[rowIndex][colIndex] != null) {
      data = this.props.gameState.lastMove.grid[rowIndex][colIndex];
      highlight = true;
    }
    if (isClickable &&
        this.state.hover.grid &&
        this.state.hover.grid.row === rowIndex &&
        this.state.hover.grid.col === colIndex) {
      data = SquareStates.FLWR;
      highlight = true;
    }
    //let url = this.getSquareImg(data, highlight);
    let url = this.getSquareImg(data, rowIndex, colIndex);
    let selection = {row: rowIndex, col: colIndex};
    let touchTarget = <div className='clickable'
        onMouseOver={() => this.setState({hover: {grid: selection}})}
        onMouseOut={() => this.setState({hover: {}})}
        onClick={() => 
            isClickable &&
            this.onChooseMove(Move.grid(rowIndex, colIndex))} />;

    return (
      <div className='square' key={`r${rowIndex}c${colIndex}`}>
        {highlight ? <div className='highlight' /> : null}
        <div className='image' style={{backgroundImage: `url(${url})`}} />
        {isClickable ? touchTarget : null}
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

  renderCompassPoint(keyPrefix, direction, isHighlighted) {
    let url = this.getCompassImg(direction);
    let highlight = <div className='compassPoint highlight' />;

    return (
      <div
          key={`${keyPrefix} ${direction}`}
          className={`directionHolderInner dir${direction} ${keyPrefix}`}>
        <div
            className='compassPoint'
            style={{backgroundImage: `url(${url})`}} />
        {isHighlighted ? highlight : null}
      </div>
    );
  }

  renderCompassTouchTarget(direction) {
    if (this.props.gameState.compass.directions.indexOf(direction) >= 0 ||
        this.props.gameState.activePlayer !== 2 ||
        !this.props.canMove) {
      return null;
    }

    return (
      <div
          key={direction}
          className={`directionHolderInner dir${direction}`}>
        <div
            className='touchTarget'
            onMouseOver={() => this.setState({hover: {compass: direction}})}
            onMouseOut={() => this.setState({hover: {}})}
            onClick={() => this.onChooseMove(Move.compass(direction))} />
      </div>
    );
  }

  renderCompass(gameState) {
    let directions = gameState.compass.directions;
    let highlightLastTurn = null;
    let highlightHover = null;
    if (gameState.lastMove && gameState.lastMove.compass) {
      let compass = gameState.lastMove.compass;
      let direction = compass.directions.length && compass.directions[0];
      if (direction) {
        highlightLastTurn = this.renderCompassPoint('last', direction, true);
      }
    }
    if (this.state.hover.compass && this.props.canMove) {
      highlightHover = this.renderCompassPoint(
          'hover', this.state.hover.compass, true);
    }
    let windPlayerStyleClass =
        PlayerHelper.getStyleClass(this.props.gameSettings.players[1]);
    return (
      <div className={`compass ${windPlayerStyleClass}`}>
        <div className='compassOverlay'
            style={{backgroundImage: `url(${dandelionsCompass})`}} />
        <div className='compassOverlay directionHolder'>
          {directions.map(d => this.renderCompassPoint('used', d, false))}
        </div>
        {highlightLastTurn}
        {highlightHover}
        <div className='compassOverlay directionHolder'>
          {AllDirections.map(
              d => this.renderCompassTouchTarget(d))}
        </div>
      </div>
    )
  }

  /**
   * props:
   *   gameState: Object
   *   gameSettings: Object
   *   gamePhase: Enum
   *   canMove: boolean
   */
  render() {
    let dandelionPlayerStyleClass =
        PlayerHelper.getStyleClass(this.props.gameSettings.players[0]);
    return (
      <div className='DandelionsCanvas'>
        {this.renderCompass(this.props.gameState)}
        <div className={`grid ${dandelionPlayerStyleClass}`}>
          {this.props.gameState.grid.map(this.renderGridRow, this)}
        </div>
      </div>
    );
  }
}


export default DandelionsCanvas;
