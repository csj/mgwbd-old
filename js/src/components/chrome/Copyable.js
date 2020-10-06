import './Copyable.scss';
import React, {useEffect, useState} from 'react';
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

  const copy = () => {
    let el = ref.current;
    let range = document.createRange();
    let windowSelection = window.getSelection();

    el.contentEditable = true;
    el.readOnly = false;
    el.setSelectionRange(0, 999999);
    range.selectNodeContents(el);
    windowSelection.removeAllRanges();
    windowSelection.addRange(range);
    document.execCommand('copy');
    windowSelection.empty();

    setCopied(true);
    setTimerId(setTimeout(() => setCopied(false), 2000));
  };

  useEffect(() => (() => clearTimeout(timerId)), [timerId]);

  return (
    <div className={`Copyable ${props.className}`}>
      <Button
          className='copyableButton'
          onClick={copy}
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
      <input className='copyableInput'
          contentEditable={true} readOnly={false}
          value={props.value} ref={ref} onChange={() => null} />
    </div>
  );
};


export default Copyable;
