import React from 'react';
import moment from 'moment';


class Moment extends React.Component {
  render() {
    return (
      <div className='Moment'>
        {this.props.data ?
            moment(this.props.data).format(this.props.format) :
            this.props.nullValue}
      </div>
    );
  }
}


export default Moment;
