import './Icons.scss';
import Card from 'components/chrome/Card';
import React from 'react';


const NAMES = [
];

const MAP = {
};

const Icons = props => {
  const renderIcon = name => {
    return (
      <div className='container p-col-2' key={name}>
        <Card
            img={MAP[name]}
            text={name}
            />
      </div>
    );
  };

  return (
    <div className='section'>
      <div className='p-grid'>
        {NAMES.map(renderIcon)}
      </div>
    </div>
  );
};


export default Icons;
