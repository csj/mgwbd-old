import './Icons.scss';
import Card from 'components/chrome/Card';
import React from 'react';


const NAMES = [
];

const MAP = {
};

class Icons extends React.Component {
  renderIcon(name) {
    return (
      <div className='container p-col-2' key={name}>
        <Card
            img={MAP[name]}
            text={name}
            />
      </div>
    );
  }

  render() {
    return (
      <div className='section'>
        <div className='p-grid'>
          {NAMES.map(this.renderIcon)}
        </div>
      </div>
    );
  }
}


export default Icons;
