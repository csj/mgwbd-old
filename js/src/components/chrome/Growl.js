import './Growl.scss';
import { Toast } from 'primereact/toast';
import React from 'react';


class GrowlElement extends React.Component {
  render() {
    return (
      <Toast
          ref={e => _el = e}
          className='el'
          baseZIndex={10000} />
    );
  }
}


class GrowlService {
  show(obj) {
    _el.show(obj);
  }
}


GrowlService.Factory = class {
  create() {
    return _instance;
  }
}


let _el = null;
const _instance = new GrowlService();


export {
  GrowlElement,
  GrowlService,
};

