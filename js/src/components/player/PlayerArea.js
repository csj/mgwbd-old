import './PlayerArea.scss';
import React from 'react';
import faceA from 'images/faceA.png';
import faceB from 'images/faceB.png';
import faceC from 'images/faceC.png';
import faceD from 'images/faceD.png';
import faceE from 'images/faceE.png';


const FaceMap = {  // TODO make this and others into a utility/helper class
  'playerStyleA': faceA,
  'playerStyleB': faceB,
  'playerStyleC': faceC,
  'playerStyleD': faceD,
  'playerStyleE': faceE,
};


class PlayerArea extends React.Component {
  
  getPlayerStyleClass(player) {
    return `playerStyle${player.style}`;
  }

  getAvatar(player) {
    return FaceMap[this.getPlayerStyleClass(player)];
  }

  renderPlayer(index) {
    let player = this.props.players[index];
    let playerNumber = index + 1;
    let extraClasses = this.getPlayerStyleClass(player);
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
            src={this.getAvatar(player)}
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
