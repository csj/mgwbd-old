import './JoinGame.scss';
import React from 'react';
import {useParams} from 'react-router';


/**
 * props:
 *   gameKey
 */
const JoinGame = props => {
  console.log(useParams());
  return (
    <div className='JoinGame'>
      Join Game! ({props.gameKey}, {useParams().gameKey})
    </div>
  );
};


export default JoinGame;
