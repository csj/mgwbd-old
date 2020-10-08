import './InfoBubble.scss';
import React from 'react';
import {Button} from 'primereact/button';


const TIMEOUT_MS = 3000;


/**
 * Props
 *   text
 *   icon
 *   position
 *   className
 *   onClick
 */
const InfoBubble = props => {

  const buttonRef = React.createRef();

  const onClick = () => {
    let evtEnter = new MouseEvent(
        'mouseenter', {'view': window, 'bubbles': true, 'cancelable': true,});
    let evtLeave = new MouseEvent(
        'mouseleave', {'view': window, 'bubbles': true, 'cancelable': true,});
    let el = buttonRef.current.element;
    el.dispatchEvent(evtEnter);
    setTimeout(
        () => el && el.offsetParent && el.dispatchEvent(evtLeave), TIMEOUT_MS);

    if (props.onClick) {
      props.onClick();
    }
  };

  const renderButton = () => {
    return (
      <Button
          label=''
          icon='pi'
          onClick={onClick}
          ref={buttonRef}
          tooltip={props.text}
          tooltipOptions={{
            className: 'InfoBubble-tooltip',
            position: props.position || 'right',
          }} />
    );
  };

  return (
    <div className={`InfoBubble ${props.className}`}>
      <i className={`pi ${props.icon || 'pi-info-circle'}`} />
      {renderButton()}
    </div>
  );
}


export default InfoBubble;
