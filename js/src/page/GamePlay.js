import './GamePlay.scss';
import { Button } from 'primereact/button';
import GameInstructionsDialog from 'components/game/GameInstructionsDialog';
import GameManager from 'games/GameManager';
import GamePhase from 'games/GamePhase';
import GameSettingsDialog from 'components/game/GameSettingsDialog';
import LabelValue from 'components/chrome/LabelValue';
import PlayerArea from 'components/player/PlayerArea';
import React from 'react';


class GamePlay extends React.Component {

  constructor(props) {
    super();
    let game = new props.game();
    game.setMoveHandler(this.onMove.bind(this));
    this.gameManager = new GameManager.Factory().create();
    this.gameManager.setGame(game);
    this.gameManager.setGameStateChangeHandler(
        this.onGameStateChange.bind(this));
    this.gameManager.setGamePhaseChangeHandler(
        this.onGamePhaseChange.bind(this));
    this.gameManager.setGameSettingsChangeHandler(
        this.onGameSettingsChange.bind(this));
    this.gameManager.setMessageHandler(this.onGameMessage.bind(this));
    this.state = {
      gameState: this.gameManager.getGameState(),
      gameSettings: this.gameManager.getGameSettings(),
      gamePhase: this.gameManager.getGamePhase(),
      messages: [],
    };
  }

  onNewGame() {
    let playerNames = this.gameManager.getGame().getDefaultPlayerNames();
    let playerManager = this.gameManager.getPlayerManager();
    playerManager.resetPlayers();
    playerManager.createLocalHumanPlayer(playerNames[0]);
    playerManager.createLocalHumanPlayer(playerNames[1]);
    this.gameManager.startGame();
  }

  onEndGame() {
    this.gameManager.setGamePhase(GamePhase.POST_GAME, 'Game aborted!');
  };

  onMove(gameState, action) {
    this.gameManager.onAction(action);
  }

  onGameStateChange(gameState) {
    this.setState({gameState});
  }

  onGamePhaseChange(gamePhase) {
    this.setState({gamePhase});
  }

  onGameSettingsChange(gameSettings) {
    this.setState({gameSettings});
  }

  onGameMessage(msg) {
    this.setState({messages: this.state.messages.concat(msg)});
  }

  renderInstructions() {
    return (
      <GameInstructionsDialog
          open={true}
          content={this.gameManager.getGame().renderInstructions()} />
    );
  }

  renderSettings() {
    let settingsConfig = this.gameManager.getGame().getSettingsConfig();
    if (settingsConfig.length > 0) {
      return (
        <GameSettingsDialog
            settingsConfig={settingsConfig}
            settings={this.state.gameSettings}
            readOnly={this.state.gamePhase === GamePhase.PLAYING}
            onSettingsChange={
              settings => this.gameManager.setGameSettings(settings)
            } />
      );
    }
    return null;
  }

  renderGameCanvas() {
    return this.gameManager.getGame().renderCanvas(
        this.state.gameState,
        this.state.gameSettings,
        this.gameManager.getPlayerManager());
  }

  renderGameMenuButtons() {
    if (this.state.gamePhase === GamePhase.PRE_GAME) {
      return (
        <Button label='New Game' onClick={this.onNewGame.bind(this)} />
      );
    }
    if (this.state.gamePhase === GamePhase.PLAYING) {
      return (
        <Button label='Quit Game' onClick={this.onEndGame.bind(this)} />
      );
    }
    if (this.state.gamePhase === GamePhase.POST_GAME) {
      return (
        <Button label='New Game' onClick={this.onNewGame.bind(this)} />
      );
    }
    return null;
  }

  render() {
    return (
      <div className='GamePlay page'>
        <div className='section subtitle'>
          {this.gameManager.getGame().getDisplayName()}
        </div>
        <div className='section'>
          <div className='gameMenu'>
            <LabelValue
                label={this.renderGameMenuButtons()}
                value={
                  <div>
                    {this.renderInstructions()}
                    {this.renderSettings()}
                  </div>
                }
                styles={LabelValue.Style.LEFT_RIGHT} />
          </div>
          <div className='gameCanvas'>
            {this.renderGameCanvas()}
          </div>
        </div>
        <PlayerArea
            players={this.gameManager.getPlayerManager().getPlayers()}
            activePlayer={this.state.gameState.activePlayer} />
        <div className='section log'>
          {this.state.messages.map(
              (m, i) => <div key={i} className='message'>{m}</div>)}
        </div>
      </div>
    );
  }
}


export default GamePlay;
