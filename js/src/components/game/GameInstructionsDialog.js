import './GameInstructionsDialog.scss';
import InfoDialog from 'components/chrome/InfoDialog';
import React from 'react';


const GameInstructionsDialog = props => {
  return (
    <InfoDialog
        dialogClassName={
            `GameInstructionsDialog-dialogElement ${props.dialogClassName}`}
        header={`${props.game.getDisplayName()} instructions`}
        footerButtons={[{label: 'Close'}]}
        {...props} />
  );
}


export default GameInstructionsDialog;

