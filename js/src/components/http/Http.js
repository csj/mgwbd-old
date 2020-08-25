/** Lightweight wrapper around superagent. */

import superagent from 'superagent';
import Config from 'components/app/config';


const _abs_path = path =>
    path.startsWith('http') ? path : Config.serverEndpoint + path;


class Http {

  constructor() {
    this.csrfFn = () => 'not set';
    this.responseInterceptors = [];
  }


  setCsrfFn(csrfFn) {
    this.csrfFn = csrfFn;
  }

  responseInterceptor(callback) {
    this.responseInterceptors.push(callback);
  }

  _base(agent) {
    if (Config.withCredentials) {
      agent = agent.withCredentials();
    }
    const agentThen = agent.then.bind(agent);
    agent.then = (resolve, reject) => {
      agentThen(rsp => {
        this.responseInterceptors.forEach(i => i(rsp));
        resolve(rsp);
      }, reject);
    };
    return agent;
  }

  get(path) {
    let agent = superagent.get(_abs_path(path));
    return this._base(agent);
  }

  post(path) {
    let agent = superagent
      .post(_abs_path(path))
      .set('X-CSRFToken', this.csrfFn());
    return this._base(agent);
  }
}


Http.Factory = class {
  create() {
    return _instance;
  }
}


const _instance = new Http();


export default Http;

