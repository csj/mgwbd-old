import Card from 'components/chrome/Card';
import Http from 'components/http/Http';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import React, {useEffect, useState} from 'react';
import {InputText} from 'primereact/inputtext';


const GameLookup = props => {
  const [gameKey, setGameKey] = useState('');
  const [gameData, setGameData] = useState('');
  const http = new Http.Factory().create();

  useEffect(() => {
    let match = /\w+$/.exec(gameKey);
    if (match) {
      setGameKey(match[0]);
    }
  }, [gameKey]);

  const onKeyEvent = async () => {
    http.get('/gameplay/poll')
        .query({ gameKey, lastSeenMillis: 0 })
        .then(rsp => {
          setGameData(rsp.body);
        }, err => {
          setGameData('Not found.');
        });
  };

  return (
    <div className='GameLookup page'>
      <div className='subtitle'>Game Lookup</div>
      <KeyboardEventHandler
          handleKeys={['enter']} handleFocusableElements={true}
          onKeyEvent={onKeyEvent}>
        <div className='p-float-label'>
          <InputText
              id='GameLookup-gameKeyInput'
              value={gameKey} onChange={e => setGameKey(e.target.value)} />
          <label htmlFor='GameLookup-gameKeyInput'>Game key</label>
        </div>
      </KeyboardEventHandler>
      <Card className='section json' childrenPadded={true}>
        {gameData ? JSON.stringify(gameData, undefined, 2) : ''}
      </Card>
    </div>
  );
};


export default GameLookup;
