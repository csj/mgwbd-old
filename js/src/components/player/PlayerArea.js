import './PlayerArea.scss';
import PlayerHelper from 'players/PlayerHelper';
import React from 'react';


class PlayerArea extends React.Component {
  
  renderPlayer(index) {
    let player = this.props.players[index];
    let playerNumber = index + 1;
    let extraClasses = PlayerHelper.getStyleClass(player);
    if (this.props.activePlayer === playerNumber) {
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
  }

  render() {
    let content;
    if (!this.props.players || this.props.players.length === 0) {
      content = '';
    }
    else if (this.props.players.length === 2) {
      content = (
        <div className='playersHolder'>
          {this.props.players.map((p, i) => this.renderPlayer(i))}
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
  }
}


export default PlayerArea;
