import './Icons.scss';
import Card from 'components/chrome/Card';
import LabelValue from 'components/chrome/LabelValue';
import React, {useEffect, useState} from 'react';
import PlayerHelper from 'players/PlayerHelper';


const imp = {
  'games/': path => import(`games/${path}`),
};

const dynamicImport = async (path, callback) => {
  // Need to have path start with literal for webpack static analysis.
  let match = /(\w+\/)(.*)/.exec(path);
  imp[match[1]](match[2]).then(module => callback(module.default), err => null);
};

const dynImp = async (card, label, path, setFn) => {
  dynamicImport(path, url => {
    setFn(oldVal => {
      if (oldVal[card] && oldVal[card].find(i => i.path === path)) {
        return oldVal;
      }
      let newVal = Object.assign({}, oldVal);
      newVal[card] = newVal[card] || [];
      newVal[card].push({path, label, url});
      return newVal;
    });
  });
};


const Icons = props => {
  const [importedIcons, setImportedIcons] = useState({});

  useEffect(() => {
    ['dandelions', 'prophecies', 'sequencium'].forEach(gameName =>
      new Array(12).fill().map((_, i) => dynImp(
          `${gameName} Instructions`,
          `${gameName} - image${i + 1}`,
          `games/${gameName}/instructions/media/image${i + 1}.png`,
          setImportedIcons))
    );
  }, []);

  const renderPlayerIcons = () => {
    return (
      <Card childrenPadded header='Player avatars'>
        {'ABCDE'.split('').map(style =>
          <div key={style}>
            <img src={PlayerHelper.getAvatar({style})} alt='avatar' />
            <img src={PlayerHelper.getAvatar({style}, 1)} alt='avatar' />
            <img
                src={PlayerHelper.getAvatar({style, playerType: 'bot'})}
                alt='avatar' />
          </div>
        )}
      </Card>
    );
  };

  const renderImportedIconsCard = cardName => {
    let cardData = importedIcons[cardName].sort((a, b) => a.label > b.label);
    return (
      <Card childrenPadded header={cardName} key={cardName}>
        {cardData.map(cd => (
          <LabelValue
              key={cd.label}
              label={<img
                  alt={cd.label} src={cd.url}
                  style={{'border': '1px solid gray'}} />}
              value={cd.label}
              />
        ))}
      </Card>
    );
  };

  const renderImportedIcons = () => {
    let cards = Object.keys(importedIcons).sort().map(renderImportedIconsCard);
    return <div>{cards}</div>;
  };

  return (
    <div className='section'>
      <div className='p-grid'>
        <div className='p-col-12'>
          {renderImportedIcons()}
        </div>
        <div className='p-col-12'>
          {renderPlayerIcons()}
        </div>
      </div>
    </div>
  );
};


export default Icons;
