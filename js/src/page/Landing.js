import React from 'react';
import {Redirect} from 'react-router';


class Landing extends React.Component {
  render() {
    return <Redirect to='/games' />;
  }
}


export default Landing;
