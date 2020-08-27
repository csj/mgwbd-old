import InfoDialog from 'components/chrome/InfoDialog';
import LabelValue from 'components/chrome/LabelValue';
import React from 'react';


class GamePlay extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  renderInstructions() {
    return (
      <InfoDialog
          header='Instructions'
          content={this.game.getInstructionsJsx()} />
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
    this.game = new this.props.game();
    return (
      <div className='GamePlay page'>
        <div className='section subtitle'>
          {this.game.getDisplayName()}
        </div>
        <div className='section'>
          <div className='gameMenu'>
            <LabelValue
                label={this.renderInstructions()}
                value={this.renderSettings()}
                styles={LabelValue.Style.LEFT_RIGHT} />
          </div>
          <div className='gameCanvas'>
            {this.renderGameCanvas()}
          </div>
        </div>
        <div className='section players'>
          Players area
        </div>
        <div className='section log'>
          Game log area
        </div>
      </div>
    );
  }
}


export default GamePlay;
