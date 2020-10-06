import './GameSettingsDialog.scss';
import InfoDialog from 'components/chrome/InfoDialog';
import LabelValue from 'components/chrome/LabelValue';
import React, {useEffect, useState} from 'react';
import {Dropdown} from 'primereact/dropdown';


/**
 * props:
 *   settingsConfig
 *   settings
 *   onSettingsChange
 *   readOnly
 */
const GameSettingsDialog = props => {

  const [editedSettings, setEditedSettings] = useState({});

  useEffect(() => {
    onCancel();
  }, [props.settings]);

  const onCancel = () => {
    setEditedSettings({...props.settings});
  };

  const onCommit = () => {
    if (props.onSettingsChange) {
      props.onSettingsChange(editedSettings);
    }
  };

  const renderSettingValue = value => {
    if (typeof value === typeof true) {
      return value ? 'On' : 'Off';
    }
    return value;
  };

  const renderSettingSelector = settingConfig => {
    let canonicalName = settingConfig.canonicalName;
    let selectedValue = editedSettings[canonicalName];
    let options = settingConfig.values.map(value => ({
      label: renderSettingValue(value), value,
      className: 'GameSettingsDialog-option',
    }));
    return (
      <Dropdown
          value={selectedValue}
          options={options}
          disabled={props.readOnly}
          onChange={e => {
            setEditedSettings(
                Object.assign({}, editedSettings, {[canonicalName]: e.value}))
          }} />
    );
  };

  const renderSetting = settingConfig => {
    let label = (
      <LabelValue
          label={settingConfig.displayName}
          labelClassName='subsubtitle'
          value={settingConfig.description}
          valueClassName='settingDescription' />
    );
    return (
      <div className='setting' key={settingConfig.canonicalName}>
        <LabelValue
            label={label}
            value={renderSettingSelector(
                settingConfig,
                editedSettings[settingConfig.canonicalName])}
            styles={LabelValue.Style.LEFT_RIGHT} />
      </div>
    );
  };

  const readOnlyMessage = (
    <div className='readOnlyMessage'>
      You may modify settings between games.
    </div>
  );

  const renderSettings = () => {
    return (
      <div>
        {props.readOnly ? readOnlyMessage : ''}
        {props.settingsConfig.map(renderSetting)}
      </div>
    );
  };

  return (
    <InfoDialog
        dialogClassName={
            `GameSettingsDialog-dialogElement ${props.dialogClassName}`}
        header='Settings'
        footerButtons={[
          {
            label: 'Cancel', className: 'p-button-outlined', onClick: onCancel,
          },
          {label: 'OK', onClick: onCommit},
        ]}
        icon='pi-cog'
        {...props}
        content={renderSettings()} />
  );
}


export default GameSettingsDialog;

