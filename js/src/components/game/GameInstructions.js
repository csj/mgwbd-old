import './GameInstructions.scss';
import InfoDialog from 'components/chrome/InfoDialog';
import React from 'react';


class GameInstructions extends React.Component {
  render() {
    return (
      <InfoDialog
          dialogClassName={
              `GameInstructionsDialog-dialogElement
              ${this.props.dialogClassName}`}
          {...this.props} />
    );
  }
}


export default GameInstructions;

