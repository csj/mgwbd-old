import './Slider.scss';
import React, {createRef, useEffect, useState} from 'react';


/**
 * props:
 *   className
 *   snapTolerance
 *   onChange
*/
const Slider = props => {
  const [value, setValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const ref = createRef();

  useEffect(() => { // Snap tolerance.
    if (value < props.snapTolerance) {
      setValue(0);
    } else if (value > 100 - props.snapTolerance) {
      setValue(100);
    }
  }, [value, props.snapTolerance]);

  useEffect(() => { // onChange callback.
    props.onChange(value);
  });

  const onDrag = evt => {
    let rect = ref.current.getBoundingClientRect();
    let x = evt.clientX;
    if (evt.touches) {
      x = evt.touches[evt.touches.length - 1].clientX;
    }
    setValue(Math.round((x - rect.x) * 100 / rect.width));
  };

  return (
    <div className={`Slider ${props.className}`}>
      <div className='background'>
        <i className='pi pi-arrow-left' />
        <i className='pi pi-arrow-right' />
      </div>
      <div className='background'>
        <div className='spacer' style={{flexGrow: value}} />
        <div className='indicator' />
        <div className='spacer' style={{flexGrow: 100 - value}} />
      </div>
      <div className='foreground' ref={ref}
          onTouchStart={e => {
            setIsDragging(true);
            onDrag(e);
          }}
          onTouchMove={isDragging ? onDrag : null}
          onTouchEnd={() => setIsDragging(false)}
          onMouseDown={e => {
            setIsDragging(true);
            onDrag(e);
          }}
          onMouseMove={isDragging ? onDrag : null}
          onMouseUp={() => setIsDragging(false)}
          />
    </div>
  );
};


export default Slider;

