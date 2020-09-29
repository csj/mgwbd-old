import './GameStatusDisplay.scss';
import GamePhase from 'games/GamePhase';
import React from 'react';


const GameStatusDisplay = props => {
  const gameState = props.gameState;
  let message = '';
  let players = [];
  let player = null;

  switch (props.gamePhase) {
    case GamePhase.PRE_GAME:
      message = <div>Click <em>Start Game</em> to get going!</div>;
      break;
    case GamePhase.PLAYING:
      players = props.gameSettings.players;
      player = players[gameState.activePlayer - 1];
      message = <div><em>{player.name}</em> to play</div>;
      break;
    case GamePhase.POST_GAME:
      players = props.gameSettings.players;
      let gameEnd = gameState.gameEnd;
      if (!gameEnd) {
        message = <div>Game over!</div>;
      } else if (gameEnd.draw) {
        message = <div>It’s a draw! How about another?</div>;
      } else if (gameEnd.win) {
        player = players[gameEnd.win - 1];
        message = (
            <div>
              Wow! <em>{player.name}</em> is the winner! How about another?
            </div>);
      }
      break;
    default:
      break;
  }

  return (
    <div className='GameStatusDisplay'>
      {message}
    </div>
  );
};


export default GameStatusDisplay;
