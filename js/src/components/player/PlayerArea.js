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
  
  const renderPlayer = (playerIndex, extraProps) => {
    let player = props.players[playerIndex];
    let avatar = (
      <img
          src={PlayerHelper.getAvatar(player)}
          className={extraProps.isActive ? 'active' : ''}
          alt='avatar' />
    );
    let scores = props.gameEnd && props.gameEnd.scores;
    let className = 'player ' +
        (extraProps.className || '') + ' ' +
        PlayerHelper.getStyleClass(player) + ' ' +
        (extraProps.isActive ? ' active ' : ' ');
    if (scores) {
      avatar = <div className='score'>{scores[playerIndex]}</div>;
    }
    return (
      <div key={playerIndex} className={className}>
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
      let classes = 'playersHolder';
      let extraProps = props.players.map((p, i) => ({className: `player${i}`}));

      if (Number.isInteger(props.activePlayerIndex)) {
        classes += ' playerActive';
        extraProps[props.activePlayerIndex].isActive = true;
      } else {
        extraProps.forEach(p => p.className += ' neutral');
      }
      content = (
        <div className={classes}>
          {props.players.map((p, i) => renderPlayer(i, extraProps[i]))}
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
