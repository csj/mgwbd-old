import './List.scss';
import React from 'react';


class List extends React.Component {
  render() {
    return (
      <div className={`List ${this.props.className}`}>
        {(this.props.items || []).map(i => <div key={i}>{i}</div>)}
      </div>
    );
  }
}


export default List;
