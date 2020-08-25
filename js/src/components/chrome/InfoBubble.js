import './InfoBubble.scss';
import React from 'react';
import { Button } from 'primereact/button';


/**
 * Props
 *   text
 *   icon
 *   className
 *   onClick
 */
class InfoBubble extends React.Component {
  renderButton() {
    return (
      <Button
          label=''
          icon='pi'
          onClick={this.props.onClick}
          tooltip={this.props.text}
          tooltipOptions={{
            className: 'InfoBubble-tooltip',
          }} />
    );
  }

  render() {
    return (
      <div className={`InfoBubble ${this.props.className}`}>
        <i className={`pi ${this.props.icon || 'pi-info-circle'}`} />
        {this.renderButton()}
      </div>
    );
  }
}


export default InfoBubble;
