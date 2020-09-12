import './InfoBubble.scss';
import React from 'react';
import { Button } from 'primereact/button';


/**
 * Props
 *   text
 *   icon
 *   position
 *   className
 *   onClick
 */
class InfoBubble extends React.Component {

  constructor() {
    super();
    this.buttonRef = React.createRef();
  }

  defaultOnClick() {
    let evtEnter = new MouseEvent(
        'mouseenter', {'view': window, 'bubbles': true, 'cancelable': true,});
    let evtLeave = new MouseEvent(
        'mouseleave', {'view': window, 'bubbles': true, 'cancelable': true,});
    this.buttonRef.current.element.dispatchEvent(evtEnter);
    setTimeout(() => {
      if (this.buttonRef.current) {
        this.buttonRef.current.element.dispatchEvent(evtLeave);
      }
    }, 3000);
  }

  renderButton() {
    return (
      <Button
          label=''
          icon='pi'
          onClick={this.props.onClick || this.defaultOnClick.bind(this)}
          ref={this.buttonRef}
          tooltip={this.props.text}
          tooltipOptions={{
            className: 'InfoBubble-tooltip',
            position: this.props.position || 'right',
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
