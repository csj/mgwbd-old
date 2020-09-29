import './PlayerArea.scss';
import PlayerHelper from 'players/PlayerHelper';
import React from 'react';


const PlayerArea = props => {
  
  const renderPlayer = index => {
    let player = props.players[index];
    let playerNumber = index + 1;
    let extraClasses = PlayerHelper.getStyleClass(player);
    if (props.activePlayer === playerNumber) {
      extraClasses += ' active';
    }
    return (
      <div
          key={playerNumber}
          className={`
              player player${playerNumber}
              ${extraClasses}`}>
        <img
            src={PlayerHelper.getAvatar(player)}
            alt={`Player {$playerNumber} avatar`} />
        <div className='name'>{player.name}</div>
      </div>
    );
  };

  const render = () => {
    let content;
    if (!props.players || props.players.length === 0) {
      content = '';
    }
    else if (props.players.length === 2) {
      let classes =
          'playersHolder ' + props.activePlayer ? 'playerActive' : '';
      content = (
        <div className={`playersHolder ${classes}`}>
          {props.players.map((p, i) => renderPlayer(i))}
        </div>
      );
    } else {
      content = 'Don\'t know how to render this yet!';
      // But it's probably not too hard to do later.
    }
    return (
      <div className='PlayerArea'>
        {content}
      </div>
    );
  };

  return render();
}


export default PlayerArea;
