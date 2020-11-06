import './PlayerSettingsDialog.scss';
import InfoDialog from 'components/chrome/InfoDialog';
import PlayerConfig from 'components/player/PlayerConfig';
import React from 'react';


/**
 * props:
 *   gameType
 *   settings
 *   settingsConfig
 *   onSettingsChange
 *   readOnly
 */
const PlayerSettingsDialog = props => {

  const settings = props.settings || {};
  const settingsConfig = props.settingsConfig || [];

  const onCommit = players => {
    if (props.onSettingsChange) {
      props.onSettingsChange(Object.assign({}, settings, {players}));
    }
  };

  const getAllowedPlayerCounts = () => {
    const playerCountConfig =
        settingsConfig.find(i => i.canonicalName === 'players:playerCount');
    if (!playerCountConfig) {
      return null;
    }
    return playerCountConfig.values;
  };

  const renderContent = () =>
      <PlayerConfig
          players={settings.players || []}
          allowedPlayerCounts={getAllowedPlayerCounts()}
          gameType={props.gameType}
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

