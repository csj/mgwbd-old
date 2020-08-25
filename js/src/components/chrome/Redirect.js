import React from 'react';
import { Redirect } from 'react-router';


class RedirectElement extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidUpdate() {
    if (this.state.target) {
      this.to();
    }
  }

  to(target) {
    this.setState({ target });
  }

  render() {
    if (!_el) {
      _el = this;
    }
    if (this.state.target) {
      return (
        <Redirect push to={this.state.target} />
      );
    }
    return null;
  }
}


class RedirectService {
  to(target) {
    _el.to(target);
  }
}


RedirectService.Factory = class {
  create() {
    return _instance;
  }
}


let _el = null;
const _instance = new RedirectService();


export {
  RedirectElement,
  RedirectService,
};

