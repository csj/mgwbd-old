import './Die.scss';
import LabelValue from 'components/chrome/LabelValue';
import die6 from 'images/die6.png';
import React, {useEffect, useState} from 'react';


const ROLL_DURATION_MS = 1000;


/**
 * props:
 *   onTouch
 *   className
 *   sides
 *   rolled
 *   value
 */
const Die = props => {
  const sides = props.sides;
  const [transientValue, setTransientValue] = useState(null);

  useEffect(() => {
    let timers = [];
    if (props.rolled) {
      for (let i = 100; i < ROLL_DURATION_MS - 100; i += 100) {
        timers.push(
            setTimeout(() => {
              let val = Math.floor(Math.random() * props.sides) + 1;
              setTransientValue(val);
            }, i));
        timers.push(setTimeout(setTransientValue, ROLL_DURATION_MS));
      }
    }
    return () => timers.forEach(clearTimeout);
  }, [props.rolled, props.sides]);

  return (
    <div className={`Die ${props.className}`} onClick={props.onTouch}>
      <LabelValue
          label={`d${sides}`}
          value={<div
              className={`die d${sides} ${props.rolled ? '' : 'rollable'}`}
              style={{backgroundImage: `url(${die6})`}}>
            <div className='dieValue'>{transientValue || props.value}</div>
          </div>} />
    </div>
  );
};


export default Die;
