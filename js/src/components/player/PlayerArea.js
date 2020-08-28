import './PlayerArea.scss';
import React from 'react';


class PlayerArea extends React.Component {
  renderPlayer(player, index, extraClasses) {
    return (
      <div className={`player player${index} ${extraClasses}`}>
        <img
            src={player.getAvatar()}
            alt={`Player {$index} avatar`}
            style={{filter: `hue-rotate(${player.getHueShift()}deg)`}} />
        <div className='name'>{player.getName()}</div>
      </div>
    );
  }

  render() {
    let content;
    if (this.props.players.length === 0) {
      content = '';
    }
    else if (this.props.players.length === 2) {
      content = (
        <div className='playersHolder'>
          {this.renderPlayer(
              this.props.players[0],
              1,
              this.props.activePlayer === 1 ? 'active' : '')}
          {this.renderPlayer(
              this.props.players[1],
              2,
              this.props.activePlayer === 2 ? 'active' : '')}
        </div>
      );
    } else {
      content = 'Don\'t know how to render this yet!';
    }
    return (
      <div className='PlayerArea'>
        {content}
      </div>
    );
  }
}


export default PlayerArea;
