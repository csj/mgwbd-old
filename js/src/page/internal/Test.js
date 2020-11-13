import './Test.scss';
import Grid from 'components/game/Grid';
import React from 'react';


const makeGrid = (rows, cols) => {
  let row = new Array(cols).fill(null);
  let grid = new Array(rows).fill(row);
  return grid;
};


const Test = props => {
  const ref1 = React.createRef();
  const ref2 = React.createRef();
  return (
    <div className='Test page'>
      <div className='section section1'>
        <Grid className='grid' grid={makeGrid(5, 5)} isTouchable={() => true} ref={ref1} />
      </div>
      <div className='section section2'>
        <Grid className='grid' grid={makeGrid(5, 5)} isTouchable={() => true} ref={ref2} />
      </div>
      {/*
      */}
    </div>
  );
};


export default Test;
