import './PlayerConfig.scss';
import React from 'react';
import randomString from 'random-string';


const PlayerConfig = props => {
  const renderPlayer = (player, index) => {
    return (
      <div>
        {'player ' + index}
      </div>
    );
  };

  const renderMoreInfo = () => (
    <div>
      more info!
    </div>
  );

  return (
    <div className={`hidden PlayerConfig ${props.className}`}>
      <div className='subsubtitle'>Players</div>
      {props.players.map(renderPlayer)}
      {renderMoreInfo()}
    </div>
  );
};


PlayerConfig.clientCode = randomString();
console.log(PlayerConfig.clientCode);


export default PlayerConfig;
