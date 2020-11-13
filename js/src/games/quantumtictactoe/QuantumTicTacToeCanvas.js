import './QuantumTicTacToeCanvas.scss';
import GamePhase from 'games/GamePhase';
import Grid from 'components/game/Grid';
import PlayerHelper from 'players/PlayerHelper';
import React, {useEffect, useState} from 'react';
import Slider from './Slider';
import Tunnel from './Tunnel';
import {Button} from 'primereact/button';


const symbols = ['X', 'O'];


const QuantumTicTacToeCanvas = props => {
  const gamePhase = props.gamePhase;
  const gameState = props.gameState;
  const gameSettings = props.gameSettings;
  const players = gameSettings.players;
  const squares = gameState.squares;
  const tunnels = gameState.tunnels;
  const [gridRef, setGridRef] = useState(null);
  const tunnelEndpointRects = tunnels.map(t => [null, null]);
  const [sliderValue, setSliderValue] = useState(50);
  const [cyclePrimaryTunnels, setCyclePrimaryTunnels] = useState({});  // tunnelIndex: 1 or 0
  const [cycleSecondaryTunnels, setCycleSecondaryTunnels] = useState({});  // tunnelIndex: 1 or 0
  const [selectedSquare, setSelectedSquare] = useState(null);

  useEffect(() => {
    let squareSet = new Set(gameState.cycle || []);
    if (squareSet.size > 0) {
      let tunnelMap = {};
      let cycleTunnels = tunnels.map((tunnel, index) => ({index, ...tunnel}))
          .filter(tunnel => tunnel.squares)
          .filter(tunnel => (
              squareSet.has(tunnel.squares[0]) &&
              squareSet.has(tunnel.squares[1])));
      let firstTunnel = cycleTunnels.pop();
      let squareCursor = firstTunnel.squares[1];
      tunnelMap[firstTunnel.index] = 1;
      let getNextTunnelIndex = (cycleTunnels, squareCursor) =>
          cycleTunnels.findIndex(
              tunnel => tunnel.squares.indexOf(squareCursor) !== -1);

      while (cycleTunnels.length) {
        let nextTunnelIndex = getNextTunnelIndex(cycleTunnels, squareCursor);
        let nextTunnel = cycleTunnels[nextTunnelIndex];
        tunnelMap[nextTunnel.index] =
            nextTunnel.squares[0] === squareCursor ? 1 : 0;
        squareCursor =
            nextTunnel.squares[0] === squareCursor ?
                nextTunnel.squares[1] : nextTunnel.squares[0];
        cycleTunnels.splice(nextTunnelIndex, 1);
      }
      setCyclePrimaryTunnels(tunnelMap);
      setCycleSecondaryTunnels({});
    } else {
      setCyclePrimaryTunnels({});
    }
  }, [gamePhase, gameState.cycle, tunnels]);

  useEffect(() => {
    let cycleAndSecondarySquares = {};
    let addedTunnels = {};

    tunnels.forEach((tunnel, i) => {
      if (!tunnel.squares) {
        return;
      }
      if (i in cyclePrimaryTunnels || i in cycleSecondaryTunnels) {
        cycleAndSecondarySquares[tunnel.squares[0]] = true;
        cycleAndSecondarySquares[tunnel.squares[1]] = true;
      }
    });
    tunnels.forEach((tunnel, i) => {
      if (!tunnel.squares) {
        return;
      }
      let a = tunnel.squares[0] in cycleAndSecondarySquares;
      let b = tunnel.squares[1] in cycleAndSecondarySquares;
      if (i in cyclePrimaryTunnels || i in cycleSecondaryTunnels) {
        return;
      }
      if (a || b) {
        addedTunnels[i] = a ? 1 : 0;
      }
    });
    if (Object.keys(addedTunnels).length) {
      setCycleSecondaryTunnels({...addedTunnels, ...cycleSecondaryTunnels});
    }
  }, [tunnels, cyclePrimaryTunnels, cycleSecondaryTunnels]);

  const onSquareTouch = (value, i, j) => {
    let squareIndex = 3 * i + j;
    if (selectedSquare === null) {
      setSelectedSquare(squareIndex);
      return;
    }
    if (squareIndex === selectedSquare) {
      setSelectedSquare(null);
      return;
    }
    onAction({tunnel: {squares: [selectedSquare, squareIndex]}});
    setSelectedSquare(null);
    // TODO show visual for selected square
    // TODO show visual for 'last move' tunnel
    // TODO detect endgame and display it
  };

  const onAction = value => {
    props.onChooseMove({owner: gameState.activePlayerIndex, ...value});
  };

  const getResolvePct = tunnelIndex => {
    if (!gameState.cycle) {
      return null;
    }

    let direction = null;
    if (tunnelIndex in cyclePrimaryTunnels) {
      direction = cyclePrimaryTunnels[tunnelIndex];
    } else if (tunnelIndex in cycleSecondaryTunnels) {
      direction = cycleSecondaryTunnels[tunnelIndex];
    }

    if (direction === null) {
      return null;
    }
    let value = direction === 1 ? sliderValue : 100 - sliderValue;

    if (tunnelIndex in cycleSecondaryTunnels) {
    // TODO bug here
      value = direction === 1 ?
          Math.max(value, 100 - value, 67) :
          Math.min(value, 100 - value, 33);
    }

    return value;
  };

  const setTunnelRef = (tunnelIndex, squareIndex, ref) => {
    let pairIndex = tunnels[tunnelIndex].squares.indexOf(squareIndex);
    tunnelEndpointRects[tunnelIndex][pairIndex] = ref ?
        ref.getBoundingClientRect() : null;
  };

  const renderTunnelEndpoint = (tunnelIndex, squareIndex) => {
    let key = `${tunnelIndex}-${squareIndex}`;
    return (
      <div
          key={key} className='tunnelEndpoint'
          ref={ref => setTunnelRef(tunnelIndex, squareIndex, ref)} />
    );
  };

  const renderTunnel = (tunnel, i) => {
    if (!tunnel.squares) {
      return;
    }
    return (
      <Tunnel
          key={i}
          containerBoundingClientRect={
              gridRef && gridRef.getBoundingClientRect()}
          boundingClientRects={tunnelEndpointRects[i]}
          playerStyle={PlayerHelper.getStyleClass(players[tunnel.owner])}
          resolvePct={getResolvePct(i)}
          symbol={symbols[tunnel.owner]}
          highlight={isTunnelHighlighted(i)} />
    );
  };


  const getSquareStyle = data => {
    let playerIndex = gameState.activePlayerIndex;
    if (data.status === 'occupied') {
      playerIndex = data.owner;
    }
    return PlayerHelper.getStyleClass(players[playerIndex]);
  };

  const renderSquareValue = (data, i, j) => {
    // Square data types:
    //   {status: 'occupied', owner: 1}, # owner is 0 or 1
    //   {status: 'available', tunnels: []}, # list of tunnel indices
    if (data.status === 'occupied') {
      return (
        <div className='squareValue'>{symbols[data.owner]}</div>
      );
    }
    let squareIndex = 3 * i + j;
    return (
      <div className='squareValue'>
        {data.tunnels.map(i => renderTunnelEndpoint(i, squareIndex))}
      </div>
    );
  };

  const onResolve = () => {
    let indexFn = i => sliderValue ? i : 1 - i;
    let squareTunnelArray = [];
    Object.keys(cyclePrimaryTunnels).forEach(
        tunnelIndex => {
          let tunnel = tunnels[tunnelIndex];
          let square = tunnel.squares[
              indexFn(cyclePrimaryTunnels[tunnelIndex])];
          let squareIndex = gameState.cycle.indexOf(square);
          squareTunnelArray[squareIndex] = tunnelIndex;
        });
    onAction({collapse: squareTunnelArray});
  };

  const renderSlider = () => {
    let isDisabled = sliderValue > 0 && sliderValue < 100;
    return (
      <div className='sliderContainer'>
        <Slider
            snapTolerance={20} className='slider'
            onChange={setSliderValue} />
        <Button
            label='Commit' icon='pi pi-check' disabled={isDisabled}
            onClick={onResolve} />
      </div>
    );
  };

  const renderCancelButton = () => <Button
      label='Cancel' disabled={selectedSquare == null}
      icon='pi pi-undo'
      onClick={() => setSelectedSquare(null)} />;

  const isSquareHighlighted = (squareData, i, j) => (
    gameState.lastMove &&
    gameState.lastMove.squares &&
    gameState.lastMove.squares.indexOf(i * 3 + j) >= 0
  );

  const isTunnelHighlighted = tunnelIndex => (
      gameState.lastMove && gameState.lastMove.tunnel === tunnelIndex);

  const isSquareTouchable = squareData => (
      gamePhase === GamePhase.PLAYING &&
      !gameState.cycle && squareData.status !== 'occupied');

  return (
    <div className='QuantumTicTacToeCanvas'>
      <Grid
          ref={setGridRef}
          className='grid'
          lineClassName='gridLine'
          grid={[squares.slice(0, 3), squares.slice(3, 6), squares.slice(6, 9)]}
          renderSquareValue={renderSquareValue}
          squareStyle={getSquareStyle}
          isHighlighted={isSquareHighlighted}
          isTouchable={isSquareTouchable}
          onTouch={onSquareTouch}
          >
        {tunnels.map(renderTunnel)}
      </Grid>
      <div className='controls'>
        {selectedSquare !== null ? renderCancelButton() : null}
        {gameState.cycle ? renderSlider() : null}
      </div>
    </div>
  );
};


export default QuantumTicTacToeCanvas;
