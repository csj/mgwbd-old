import './GamePlay.scss';
import { Button } from 'primereact/button';
import InfoDialog from 'components/chrome/InfoDialog';
import GameManager from 'games/GameManager';
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
    this.gameManager.setMessageHandler(this.onGameMessage.bind(this));
    this.state = {
      gameState: this.gameManager.getGameState(),
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

  onMove(gameState, action) {
    this.gameManager.onAction(action);
  }

  onGameStateChange(gameState) {
    this.setState({gameState});
  }

  onGamePhaseChange(gamePhase) {
    this.setState({gamePhase});
  }

  onGameMessage(msg) {
    this.setState({messages: this.state.messages.concat(msg)});
  }

  renderInstructions() {
    return (
      <InfoDialog
          header='Instructions'
          content={this.gameManager.getGame().renderInstructions()} />
    );
  }

  renderSettings() {
    return (
      <InfoDialog
          header='Settings'
          icon='pi-cog'
          content={'Settings go here'} />
    );
  }

  renderGameCanvas() {
    return this.gameManager.getGame().renderCanvas(this.state.gameState);
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
                label={
                  <Button
                      label='New Game' onClick={this.onNewGame.bind(this)} />
                }
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
