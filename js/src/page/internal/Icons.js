import './Icons.scss';
import Card from 'components/chrome/Card';
import React, {useEffect, useState} from 'react';
import PlayerHelper from 'players/PlayerHelper';


const NAMES = [
];

const MAP = {
};

const Icons = props => {
  const [importedIcons, setImportedIcons] = useState({});

  useEffect(() => {
    // Dandelions images.
    let imports = new Array(12).fill().map((_, i) => import(`games/dandelions/instructions/media/image${i+1}.png`));
    Promise.all(imports).then(
        imgs => {
          let iconMap = {};
          imgs.forEach(
              (result, i) =>
                  iconMap[`dandelions-instructions-${i+1}`] = result.default);
          setImportedIcons(importedIcons => Object.assign({}, importedIcons, iconMap));
        });
  }, []);


  const renderIcon = name => {
    return (
      <div className='container p-col-2' key={name}>
        <Card
            img={MAP[name]}
            text={name}
            />
      </div>
    );
  };

  const renderPlayerIcons = () => {
    return (
      <Card childrenPadded header='Player avatars'>
        {'ABCDE'.split('').map(i =>
          <div key={i}>
            <img src={PlayerHelper.getAvatar(i)} alt='avatar' />
            <img src={PlayerHelper.getAvatar(i, 1)} alt='avatar' />
          </div>
        )}
      </Card>
    );
  };

  const renderImportedIcons = () => {
    console.log(importedIcons);
    return (
      <Card childrenPadded header='Imports'>
        {Object.keys(importedIcons).map(key =>
            <img key={key} alt={key} src={importedIcons[key]} style={{'maxWidth': '200px', 'border': '1px solid gray'}} />)}
      </Card>
    );
  }

  return (
    <div className='section'>
      <div className='p-grid'>
        {renderImportedIcons()}
        {renderPlayerIcons()}
        {NAMES.map(renderIcon)}
      </div>
    </div>
  );
};


export default Icons;
