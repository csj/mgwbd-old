import './Default.scss';
import React from 'react';


const DEFAULT_CONTENT = 'Content.';


class Default extends React.Component {

  render() {
    return (
      <div className='Default'>
        {this.props.content || DEFAULT_CONTENT}
      </div>
    );
  }
}


export default Default;
