import './PlayerSettingsDialog.scss';
import InfoDialog from 'components/chrome/InfoDialog';
import PlayerConfig from 'components/player/PlayerConfig';
import React from 'react';


/**
 * props:
 *   settings
 *   onSettingsChange
 *   readOnly
 */
const PlayerSettingsDialog = props => {

  const onCommit = players => {
    if (props.onSettingsChange) {
      props.onSettingsChange(Object.assign({}, props.settings, {players}));
    }
  };

  const renderContent = () =>
      <PlayerConfig
          players={props.settings.players || []}
          readOnly={props.readOnly}
          onCommit={onCommit}
          />;

  const render = () => {
    return (
      <InfoDialog
          dialogClassName={
              `PlayerSettingsDialog-dialogElement
              ${props.dialogClassName}`}
          header='Players'
          footerButtons={[{label: 'Close'}]}
          icon='pi-users'
          {...props}
          content={renderContent()} />
    );
  };

  return render();
};


export default PlayerSettingsDialog;

