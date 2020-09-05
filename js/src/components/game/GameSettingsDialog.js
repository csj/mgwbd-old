import './GameSettingsDialog.scss';
import InfoDialog from 'components/chrome/InfoDialog';
import LabelValue from 'components/chrome/LabelValue';
import React from 'react';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';


/**
 * props:
 *   settingsConfig
 *   settings
 *   onSettingsChange
 */
class GameSettingsDialog extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.dialogRef = React.createRef();
  }

  componentWillMount() {
    this.setState({
      settings: Object.assign({}, this.props.settings),
    });
  }

  onCancel() {
    this.closeDialog();
  }

  onCommit() {
    if (this.props.onSettingsChange) {
      this.props.onSettingsChange(this.state.settings);
    }
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.current.onExit();
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
          onChange={e => {
            this.setState({
              settings: Object.assign(
                  {}, this.state.settings, {[canonicalName]: e.value})});
          }} />
    );
  }

  renderSetting(settingConfig) {
    return (
      <div className='setting' key={settingConfig.canonicalName}>
        <LabelValue
            label={settingConfig.displayName}
            value={this.renderSettingSelector(
                settingConfig,
                this.props.settings[settingConfig.canonicalName])}
            styles={LabelValue.Style.LEFT_RIGHT} />
      </div>
    );
  }

  renderSettings() {
    return (
      <div>
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
          dialogRef={this.dialogRef}
          header='Settings'
          footer={this.renderButtons()}
          icon='pi-cog'
          open={this.state.visible}
          {...this.props}
          content={this.renderSettings()} />
    );
  }
}


export default GameSettingsDialog;

