import './Grid.scss';
import React, {forwardRef, useState} from 'react';


/**
 * props:
 *   className
 *   grid
 *   children
 *   squareStyle: function(squareData) => string
 *   squareOverlay: function(squareData) => <div />
 *   onTouch: function(squareData, rowIndex, colIndex)
 *   isHighlighted: function(squareData, rowIndex, colIndex)
 *   isTouchable: function(squareData, rowIndex, colIndex)
 */
const Grid = forwardRef((props, ref) => {
  const [isClick, setIsClick] = useState(true);

  const renderSquare = (squareData, i, j) => {
    let squareStyle = props.squareStyle && props.squareStyle(squareData);
    let overlay = props.squareOverlay && props.squareOverlay(squareData);
    let highlight = <div className='highlight' />;
    let touchTarget = <div
        className={`touchTarget ${isClick ? 'clickable ' : ''}`}
        onTouchStart={() => setIsClick(false)}
        onClick={() => props.onTouch(squareData, i, j)} />;
    return (
      <div className={`square ${squareStyle}`} key={`row${i}col${j}`}>
        {props.isHighlighted && props.isHighlighted(squareData, i, j) ?
            highlight : null}
        <div className='value'>
          {squareData && squareData.value}
        </div>
        <div className='overlay'>
          {overlay}
        </div>
        {props.isTouchable && props.isTouchable(squareData, i, j) ? 
            touchTarget : null}
      </div>
    );
  };

  const renderRow = (rowData, i) => {
    return (
      <div className='row' key={`row${i}`}>
        {rowData.map((row, j) => renderSquare(row, i, j))}
      </div>
    );
  };

  return (
    <div className={`Grid ${props.className}`} ref={ref}>
      {props.grid.map(renderRow)}
      {props.children}
    </div>
  );
});


export default Grid;

