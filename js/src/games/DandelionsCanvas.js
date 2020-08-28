import './DandelionsCanvas.scss';
import Dandelions from './Dandelions';
import dandelionsCompass from 'images/dandelions-compass.png';
import dandelionsWindNorth from 'images/dandelions-wind-north-1.png';
import dandelionsWindNorthHighlighted from 'images/dandelions-wind-north-highlighted.png';
import gamePieceAsterisk from 'images/game-piece-asterisk.png';
import gamePieceAsteriskHighlighted from 'images/game-piece-asterisk-highlighted.png';
import gamePieceDot from 'images/game-piece-dot.png';
import gamePieceDotHighlighted from 'images/game-piece-dot-highlighted.png';
import React from 'react';


class DandelionsCanvas extends React.Component {

  constructor() {
    super();
    this.state = {
      compassHover: null,
      squareHover: { row: null, col: null },
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ compassHover: null, squareHover: { row: null, col: null }});
  }

  onChooseMove(move) {
    this.props.onChooseMove(this.props.gameState, move);
  }

  getSquareImg(squareState, isHighlighted) {
    if (squareState === Dandelions.SquareStates.SEED) {
      return isHighlighted ? gamePieceDotHighlighted : gamePieceDot;
    }
    if (squareState === Dandelions.SquareStates.FLWR) {
      return isHighlighted ? gamePieceAsteriskHighlighted : gamePieceAsterisk;
    }
  }

  renderGridSquare(data, rowIndex, colIndex) {
    let highlight = false;
    let isClickable = data !== Dandelions.SquareStates.FLWR;
    if (this.props.gameState.lastMove.grid[rowIndex][colIndex] != null) {
      data = this.props.gameState.lastMove.grid[rowIndex][colIndex];
      highlight = true;
    }
    if (isClickable &&
        this.state.squareHover.row === rowIndex &&
        this.state.squareHover.col === colIndex) {
      data = Dandelions.SquareStates.FLWR;
      highlight = true;
    }
    let url = this.getSquareImg(data, highlight);
    let selection = {row: rowIndex, col: colIndex};

    return (
      <div 
          className={`square ${isClickable ? 'clickable' : ''}`}
          key={`r${rowIndex}c${colIndex}`}
          style={{backgroundImage: `url(${url})`}}
          onMouseOver={() => this.setState({squareHover: selection})}
          onMouseOut={() =>
              this.setState({squareHover: {row: null, col: null}})}
          onClick={() => 
              isClickable &&
              this.onChooseMove(Dandelions.Move.grid(rowIndex, colIndex))} />
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
    let url = isHighlighted ?
        dandelionsWindNorthHighlighted : dandelionsWindNorth;
    return (
      <div key={`${keyPrefix} ${direction}`} className='compassOverlay'>
        <div
            className={`compassPoint dir${direction}`}
            style={{backgroundImage: `url(${url})`}} />
      </div>
    );
  }

  renderCompassTouchTarget(direction) {
    // TODO render these only if it's the wind's turn and gameplay is active

    if (this.props.gameState.compass.directions.indexOf(direction) !== -1) {
      return null;
    }

    return (
      <div
          key={direction}
          className={`touchTargetHolderInner dir${direction}`}>
        <div
            className='touchTarget'
            onMouseOver={() => this.setState({compassHover: direction})}
            onMouseOut={() => this.setState({compassHover: null})}
            onClick={() =>
                this.onChooseMove(Dandelions.Move.compass(direction))} />
      </div>
    );
  }

  renderCompass(gameState) {
    let directions = gameState.compass.directions;
    let highlightLastTurn = null;
    let highlightHover = null;
    if (gameState.lastMove && gameState.lastMove.compass) {
      let compass = gameState.lastMove.compass;
      console.log(compass);
      let direction = compass.directions.length && compass.directions[0];
      if (direction) {
        highlightLastTurn = this.renderCompassPoint('last', direction, true);
      }
    }
    if (this.state.compassHover !== null) {
      highlightHover = this.renderCompassPoint(
          'hover', this.state.compassHover, true);
    }
    return (
      <div className='compass'>
        <div className='compassOverlay'
            style={{backgroundImage: `url(${dandelionsCompass})`}} />
        {directions.map(d => this.renderCompassPoint('used', d, false))}
        {highlightLastTurn}
        {highlightHover}
        <div className='compassOverlay touchTargetHolder'>
          {Dandelions.getAllDirections().map(
              d => this.renderCompassTouchTarget(d))}
        </div>
      </div>
    )
  }

  render() {
    // this.props.gameState
    // this.props.gameSettings
    return (
      <div className='DandelionsCanvas'>
        {this.renderCompass(this.props.gameState)}
        <div className='grid'>
          {this.props.gameState.grid.map(this.renderGridRow, this)}
        </div>
      </div>
    );
  }
}


export default DandelionsCanvas;
