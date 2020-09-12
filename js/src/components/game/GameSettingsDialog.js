import './GameSettingsDialog.scss';
import InfoDialog from 'components/chrome/InfoDialog';
import LabelValue from 'components/chrome/LabelValue';
import PlayerConfig from 'components/player/PlayerConfig';
import React from 'react';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';


/**
 * props:
 *   settingsConfig
 *   settings
 *   onSettingsChange
 *   readOnly
 */
class GameSettingsDialog extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(props, state) {
    return { settings: Object.assign({}, props.settings, state.settings) };
  }

  onCancel() {
    this.setState({settings: this.props.settings});
  }

  onCommit() {
    if (this.props.onSettingsChange) {
      this.props.onSettingsChange(this.state.settings);
    }
  }

  renderSettingValue(value) {
    if (typeof value === typeof true) {
      return value ? 'On' : 'Off';
    }
    return value;
  }

  renderSettingSelector(settingConfig) {
    let canonicalName = settingConfig.canonicalName;
    let selectedValue = this.state.settings[canonicalName];
    let options = settingConfig.values.map(value => ({
      label: this.renderSettingValue(value), value,
      className: 'GameSettingsDialog-option',
    }));
    return (
      <Dropdown
          value={selectedValue}
          options={options}
          disabled={this.props.readOnly}
          onChange={e => {
            this.setState({
              settings: Object.assign(
                  {}, this.state.settings, {[canonicalName]: e.value})});
          }} />
    );
  }

  renderSetting(settingConfig) {
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
            value={this.renderSettingSelector(
                settingConfig,
                this.props.settings[settingConfig.canonicalName])}
            styles={LabelValue.Style.LEFT_RIGHT} />
      </div>
    );
  }

  renderReadOnlyMessage() {
    return (
      <div className='readOnlyMessage'>
        You may modify settings between games.
      </div>
    );
  }

  renderSettings() {
    return (
      <div>
        {this.props.readOnly ? this.renderReadOnlyMessage() : ''}
        {this.props.settingsConfig.map(this.renderSetting.bind(this))}
      </div>
    );
  }

  renderButtons() {
    return (
      <div className='buttons'>
        <Button label='Cancel' className='p-button-outlined' onClick={this.onCancel.bind(this)} />
        <Button label='OK' onClick={this.onCommit.bind(this)} />
      </div>
    );
  }

  render() {
    return (
      <InfoDialog
          dialogClassName={
              `GameSettingsDialog-dialogElement
              ${this.props.dialogClassName}`}
          header='Settings'
          footerButtons={[
            {
              label: 'Cancel', className: 'p-button-outlined',
              onClick: this.onCancel.bind(this),
            },
            {label: 'OK', onClick: this.onCommit.bind(this)},
          ]}
          icon='pi-cog'
          {...this.props}
          content={this.renderSettings()} />
    );
  }
}


export default GameSettingsDialog;

