import './GamePlay.scss';
import { Button } from 'primereact/button';
import InfoDialog from 'components/chrome/InfoDialog';
import LabelValue from 'components/chrome/LabelValue';
import PlayerArea from 'components/player/PlayerArea';
import PlayerManager from 'players/PlayerManager';
import React from 'react';


class GamePlay extends React.Component {

  constructor(props) {
    super();
    this.game = new props.game();
    this.playerManager = new PlayerManager.Factory().create();
    this.state = {
      gameState: this.game.getBlankGameState(),
    };
  }

  onNewGame() {
    let playerNames = this.game.getDefaultPlayerNames();
    this.playerManager.resetPlayers();
    this.playerManager.createLocalHumanPlayer(playerNames[0]);
    this.playerManager.createLocalHumanPlayer(playerNames[1]);
    this.setState({gameState: this.game.getNewGameState()});
  }

  renderInstructions() {
    return (
      <InfoDialog
          header='Instructions'
          content={this.game.renderInstructions()} />
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
    return this.game.renderCanvas(this.state.gameState);
  }

  render() {
    return (
      <div className='GamePlay page'>
        <div className='section subtitle'>
          {this.game.getDisplayName()}
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
