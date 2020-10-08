import './Icons.scss';
import Card from 'components/chrome/Card';
import React from 'react';
import PlayerHelper from 'players/PlayerHelper';


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

  const renderPlayerIcons = () => {
    return (
      <Card childrenPadded header='Player avatars'>
        {'ABCDE'.split('').map(i =>
          <div key={i}>
            <img src={PlayerHelper.getAvatar(i)} alt='avatar' />
            <img src={PlayerHelper.getAvatar(i, 1)} alt='avatar' />
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className='section'>
      <div className='p-grid'>
        {renderPlayerIcons()}
        {NAMES.map(renderIcon)}
      </div>
    </div>
  );
};


export default Icons;
