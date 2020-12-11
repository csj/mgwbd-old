import './PickTacToeCanvas.scss';
import GamePhase from 'games/GamePhase';
import Grid from 'components/game/Grid';
import PlayerHelper from 'players/PlayerHelper';
import React, {useEffect, useState} from 'react';


const symbols = ['X', 'O'];


const PickTacToeCanvas = props => {
  const gamePhase = props.gamePhase;
  const gameState = props.gameState;
  const gameSettings = props.gameSettings;
  const players = gameSettings.players;
  const activePlayerIndex = gameState.activePlayerIndex;

  const onSquareTouch = (value, i, j) => {
  };

  const onAction = value => {
  //  props.onChooseMove({owner: gameState.activePlayerIndex, ...value});
  };

  const getSquareStyle = data => {
  };

  const renderSquareValue = (data, i, j) => {
  };

  const isActivePlayerLocal = () => {
    let player = players[activePlayerIndex];
    return PlayerHelper.isOwnedByMe(player);
  };

  const isSquareTouchable = squareData => {
  };

  return (
    <div className='PickTacToeCanvas'>
      <div className='gridContainer'>
        {/*
        <Grid
            className='grid'
            lineClassName='gridLine'
            grid={gameState.grid}
            renderSquareValue={renderSquareValue}
            squareStyle={getSquareStyle}
            isHighlighted={isSquareHighlighted}
            isTouchable={isSquareTouchable}
            onTouch={onSquareTouch}>
        </Grid>
        */}
      </div>
    </div>
  );
};


export default PickTacToeCanvas;
