import './Copyable.scss';
import React, {useEffect, useState} from 'react';
import copy from 'copy-text-to-clipboard';
import { Button } from 'primereact/button';


/**
 * Props
 *   value
 *   label
 *   className
 */
const Copyable = props => {
  const ref = React.createRef();
  const [copied, setCopied] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const doCopy = () => {
    copy(props.value);
    setCopied(true);
    setTimerId(setTimeout(() => setCopied(false), 3000));
  };

  useEffect(() => (() => clearTimeout(timerId)), [timerId]);

  return (
    <div className={`Copyable ${props.className}`}>
      <Button
          className='copyableButton'
          onClick={doCopy}
          tooltip={
            copied ?  'Copied to clipboard' : 'Click to copy value to clipboard'
          }
          tooltipOptions={{
            className: 'Copyable-tooltip',
            position: props.position || 'bottom',
          }} />
      <div className='copyableInner'>
        <div className='copyableValue'>{props.value}</div>
        {props.label ?
            <div className='copyableLabel'>{props.label}</div> : null}
      </div>
    </div>
  );
};


export default Copyable;
