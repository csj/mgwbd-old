import './GameInstructionsDialog.scss';
import InfoDialog from 'components/chrome/InfoDialog';
import React from 'react';


class GameInstructionsDialog extends React.Component {
  render() {
    return (
      <InfoDialog
          dialogClassName={
              `GameInstructionsDialog-dialogElement
              ${this.props.dialogClassName}`}
          header='Play Instructions'
          {...this.props} />
    );
  }
}


export default GameInstructionsDialog;

