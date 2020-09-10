import './GamePlay.scss';
import { Button } from 'primereact/button';
import GameInstructionsDialog from 'components/game/GameInstructionsDialog';
import GameManager from 'games/GameManager';
import GamePhase from 'games/GamePhase';
import GameSettingsDialog from 'components/game/GameSettingsDialog';
import LabelValue from 'components/chrome/LabelValue';
import PlayerArea from 'components/player/PlayerArea';
import React, { useState, useEffect } from 'react';


const GamePlay = props => {
  const game = props.game;
  const gameManager = new GameManager.Factory().create();
  const [gameState, setGameState] = useState({});
  const [gamePhase, setGamePhase] = useState(GamePhase.PRE_GAME);
  const [gameSettings, setGameSettings] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    gameManager.setGame(game);
    gameManager.setGameStateChangeHandler(setGameState);
    gameManager.setGamePhaseChangeHandler(setGamePhase);
    gameManager.setGameSettingsChangeHandler(setGameSettings);
    gameManager.setMessageHandler(m => setMessages(ms => ms.concat(m)));
  }, [game, gameManager]);

  const onStartGame = () => gameManager.startGame();
  const onEndGame = () =>
    gameManager.setGamePhase(GamePhase.POST_GAME, 'Game aborted!');

  const onModifyPlayers = () => {
    console.log('oh, so you want to change things up do ya?');
  }

  const renderInstructions = () =>
      <GameInstructionsDialog
          open={true} content={game.renderInstructions()} />;

  const renderGameSettings = () => {
    if (gameSettings && Object.keys(gameSettings).length) {
      return (
        <GameSettingsDialog
            settingsConfig={gameManager.getGameSettingsConfig()}
            settings={gameSettings}
            readOnly={gamePhase === GamePhase.PLAYING}
            onSettingsChange={s => gameManager.setGameSettings(s)} />
      );
    }
    return null;
  };

  const renderGameMenuButtons = () => {
    let startGameButton = <Button label='Start Game' onClick={onStartGame} />;
    let quitGameButton = <Button label='Quit Game' onClick={onEndGame} />;
    /*
    let modifyPlayersButton =
        <Button
            label='Modify Players' className='p-button-outlined'
            onClick={onModifyPlayers} />;
            */
    if (gamePhase === GamePhase.PRE_GAME) {
      return ( <div> {startGameButton} </div>);
    }
    if (gamePhase === GamePhase.PLAYING) {
      return ( <div> {quitGameButton} </div>);
    }
    if (gamePhase === GamePhase.POST_GAME) {
      return ( <div> {startGameButton} </div>);
    }
    return null;
  };

  const renderGameMenu = () => 
      <LabelValue
          className='gameMenu'
          label={renderGameMenuButtons()}
          labelClassName='gameMenuButtons'
          value={
            <div>
              {renderInstructions()}
              {renderGameSettings()}
            </div>
          }
          styles={LabelValue.Style.LEFT_RIGHT} />;

  const renderLoading = () => <div className='section'>{renderGameMenu()}</div>;

  const renderLoaded = () =>
      <div className='section'>
        {renderGameMenu()}
        <div className='gameCanvas'>
          {game.renderCanvas(gameState, gameSettings, gamePhase)}
        </div>
        <PlayerArea
            players={gameSettings && gameSettings.players}
            activePlayer={gameState.activePlayer} />
        <div className='section log'>
          {messages.map(
              (m, i) => <div key={i} className='message'>{m}</div>)}
        </div>
      </div>;

  const render = () => {
    return (
      <div className='GamePlay page'>
        <div className='section subtitle'>
          {game.getDisplayName()}
        </div>
        {Object.keys(gameState).length ? renderLoaded() : renderLoading()}
      </div>
    );
  };

  return render();
}


export default GamePlay;
