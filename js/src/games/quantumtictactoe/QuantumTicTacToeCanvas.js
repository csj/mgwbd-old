import './QuantumTicTacToeCanvas.scss';
import Tunnel from './Tunnel';
import Grid from 'components/game/Grid';
import PlayerHelper from 'players/PlayerHelper';
import React, {useState} from 'react';


const symbols = ['X', 'O'];


const QuantumTicTacToeCanvas = props => {
  const gameState = props.gameState;
  const gameSettings = props.gameSettings;
  const players = gameSettings.players;
  const squares = gameState.squares;
  const tunnels = gameState.tunnels;
  const [gridRef, setGridRef] = useState(null);
  const tunnelEndpointRects = tunnels.map(t => [null, null]);

  const onAction = value => {
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
    return (
      <Tunnel
          key={i}
          containerBoundingClientRect={
              gridRef && gridRef.getBoundingClientRect()}
          boundingClientRects={tunnelEndpointRects[i]}
          playerStyle={PlayerHelper.getStyleClass(players[tunnel.owner])}
          resolvePct={null}
          symbol={symbols[tunnel.owner]}
          highlight={false} />
    );
  };


  const getSquareStyle = data => {
    if (data.status === 'occupied') {
      return PlayerHelper.getStyleClass(players[data.owner]);
    }
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

  return (
    <div className='QuantumTicTacToeCanvas'>
      <Grid
          ref={setGridRef}
          className='grid'
          lineClassName='gridLine'
          grid={[squares.slice(0, 3), squares.slice(3, 6), squares.slice(6, 9)]}
          renderSquareValue={renderSquareValue}
          squareStyle={getSquareStyle}
          >
        {tunnels.map(renderTunnel)}
      </Grid>
 {/*
 *   children
 *   squareStyle: function(squareData) => string
 *   renderSquareValue: function(squareData) => <div />
 *   renderSquareOverlay: function(squareData) => <div />
 *   onTouch: function(squareData, rowIndex, colIndex)
 *   isHighlighted: function(squareData, rowIndex, colIndex)
 *   isTouchable: function(squareData, rowIndex, colIndex)
 *   hashMaterial: array
 *   */}
 
    </div>
  );
};


export default QuantumTicTacToeCanvas;
