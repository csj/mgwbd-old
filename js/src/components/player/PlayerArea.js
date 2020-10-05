import './PlayerArea.scss';
import PlayerHelper from 'players/PlayerHelper';
import React from 'react';


const PlayerArea = props => {
  
  const renderPlayer = playerIndex => {
    let player = props.players[playerIndex];
    let extraClasses = PlayerHelper.getStyleClass(player);
    if (props.activePlayerIndex === playerIndex) {
      extraClasses += ' active';
    }
    return (
      <div
          key={playerIndex}
          className={`
              player player${playerIndex + 1}
              ${extraClasses}`}>
        <img
            src={PlayerHelper.getAvatar(player)}
            alt='avatar' />
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
          'playersHolder ' +
          Number.isInteger(props.activePlayerIndex) ? 'playerActive' : '';
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
