import './GamesList.scss';
import Card from 'components/chrome/Card';
import React from 'react';
import game1img from 'images/sequencium-preview.jpg';


const GAMES = [
  {
    name: 'Dandelions',
    path: '/games/dandelions',
    tagline: 'This is a great tagline for game 1',
    image: game1img,
  },
  {
    name: 'Sequencium',
    path: '/games/sequencium',
    tagline: 'This is a great tagline for game 2',
    image: game1img,
  },
  {
    name: 'Prophecies',
    path: '/games/prophecies',
    tagline: 'This is a great tagline for game 3',
    image: game1img,
  },
  {
    name: 'Neighbors',
    path: '/games/neighbors',
    tagline: 'This is a great tagline for game 4',
    image: game1img,
  },
];


class GamesList extends React.Component {
  renderGameCard(game) {
    return (
      <div className='p-col-12 p-md-6' key={game.name}>
        <div
            className='gameCardWrapper'
            onClick={_ => document.location = game.path}>
          <Card
              img={game.image}
              header={game.name}
              text={game.tagline} />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className='GamesList page'>
        <div className='title'>
          Games List
        </div>
        <p>
          Here are some games.
        </p>
        <div className='section'>
          <div className='p-grid'>
            {GAMES.map(this.renderGameCard)}
          </div>
        </div>
      </div>
    );
  }
}


export default GamesList;
