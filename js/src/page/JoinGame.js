import './JoinGame.scss';
import GameManager from 'games/GameManager';
import React, {useEffect, useState} from 'react';
import {Redirect, useParams} from 'react-router';


/**
 * props:
 *   gameKey
 */
const JoinGame = props => {
  const gameManager = new GameManager.Factory().create();
  const gameKey = useParams().gameKey;
  const [gameType, setGameType] = useState(undefined);

  useEffect(() => {
    if (!gameKey) {
      setGameType(null);
    }
    if (gameType === undefined) {
      gameManager.joinGame(gameKey, rsp => setGameType(rsp.gameType || null));
    }
  }, [gameKey, gameManager, gameType]);

  if (gameType) {
    return (
      <Redirect to={`/games/${gameType}`} />
    );
  }

  return (
    <div className='JoinGame'>
      <div className='section'>
        <div className='subtitle'>
          {gameType === null ? 'Game not found' : 'Joining game...'}
        </div>
      </div>
    </div>
  );
};


export default JoinGame;
