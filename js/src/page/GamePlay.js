import './GamePlay.scss';
import { Button } from 'primereact/button';
import InfoDialog from 'components/chrome/InfoDialog';
import GameManager from 'games/GameManager';
import LabelValue from 'components/chrome/LabelValue';
import PlayerArea from 'components/player/PlayerArea';
import PlayerManager from 'players/PlayerManager';
import React from 'react';


class GamePlay extends React.Component {

  constructor(props) {
    super();
    let game = new props.game();
    game.setMoveHandler(this.onMove.bind(this));
    this.playerManager = new PlayerManager.Factory().create();
    this.gameManager = new GameManager.Factory().create();
    this.gameManager.setGame(game);
    this.gameManager.setGameStateChangeHandler(
        this.onGameStateChange.bind(this));
    this.state = {
      gameState: this.gameManager.getGameState(),
    };
  }

  onNewGame() {
    let playerNames = this.gameManager.getGame().getDefaultPlayerNames();
    this.playerManager.resetPlayers();
    this.playerManager.createLocalHumanPlayer(playerNames[0]);
    this.playerManager.createLocalHumanPlayer(playerNames[1]);
    this.gameManager.startGame();
  }

  onMove(gameState, action) {
    this.gameManager.onAction(action);
  }

  onGameStateChange(gameState) {
    this.setState({gameState});
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
          content={'Coming soon.'} />
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
            players={this.playerManager.getPlayers()}
            activePlayer={this.state.gameState.activePlayer} />
        <div className='section log'>
          Game log area
        </div>
      </div>
    );
  }
}


export default GamePlay;
