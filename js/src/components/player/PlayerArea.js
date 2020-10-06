import './PlayerArea.scss';
import PlayerHelper from 'players/PlayerHelper';
import React from 'react';


/**
 * props:
 *   activePlayerIndex
 *   players
 *   gameEnd
 */
const PlayerArea = props => {
  
  const renderPlayer = playerIndex => {
    let player = props.players[playerIndex];
    let extraClasses = PlayerHelper.getStyleClass(player);
    let avatar = <img src={PlayerHelper.getAvatar(player)} alt='avatar' />;
    let scores = props.gameEnd && props.gameEnd.scores;
    if (scores) {
      avatar = <div className='score'>{scores[playerIndex]}</div>;
    }
    if (props.activePlayerIndex === playerIndex) {
      extraClasses += ' active';
    }
    return (
      <div
          key={playerIndex}
          className={`
              player player${playerIndex + 1}
              ${extraClasses}`}>
        {avatar}
        <div className='name'>{player.name}</div>
      </div>
    );
  };

  return (() => {
    let content;
    if (!props.players || props.players.length === 0) {
      content = '';
    }
    else if (props.players.length === 2) {
      let playersInOrder = [
          ...props.players.slice(props.activePlayerIndex),
          ...props.players.slice(0, props.activePlayerIndex)];
      let classes =
          'playersHolder ' +
          Number.isInteger(props.activePlayerIndex) ? 'playerActive' : '';
      content = (
        <div className={`playersHolder ${classes}`}>
          {playersInOrder.map((p, i) => renderPlayer(i))}
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
  })();
}


export default PlayerArea;
