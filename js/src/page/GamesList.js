import './GamesList.scss';
import Card from 'components/chrome/Card';
import React from 'react';
import dandelionsPreviewImg from 'images/dandelions-preview.png';
import neighborsPreviewImg from 'images/neighbors-preview.png';
import propheciesPreviewImg from 'images/prophecies-preview.png';
import sequenciumPreviewImg from 'images/sequencium-preview.png';
import { NavLink } from 'react-router-dom';


const GAMES = [
  {
    name: 'Dandelions',
    path: '/games/dandelions',
    tagline: 'The ancient rivalry of wind and flower.',
    image: dandelionsPreviewImg,
  },
  {
    name: 'Sequencium',
    path: '/games/sequencium',
    tagline: 'A battle of the vines.',
    image: sequenciumPreviewImg,
  },
  {
    name: 'Prophecies',
    path: '/games/prophecies',
    tagline: 'A game of self-fulfilling (and self-defeating) predictions.',
    image: propheciesPreviewImg,
  },
  {
    name: 'Neighbors',
    path: '/games/neighbors',
    tagline: 'A numerical make-your-own sundae bar.',
    image: neighborsPreviewImg,
  },
];


class GamesList extends React.Component {
  renderGameCard(game) {
    return (
      <div className='p-col-12 p-md-6 p-lg-4' key={game.name}>
        <NavLink to={game.path} className='gameCardWrapper'>
          <Card
              img={game.image}
              header={game.name}
              text={game.tagline} />
        </NavLink>
      </div>
    );
  }

  render() {
    return (
      <div className='GamesList page'>
        <div className='subtitle'>
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
