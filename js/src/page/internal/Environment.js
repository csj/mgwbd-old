import './Environment.scss';
import Card from 'components/chrome/Card';
import Config from 'components/app/config';
import Http from 'components/http/Http';
import React from 'react';


const PATH = '/admin/internal/environment';


class Environment extends React.Component {

  constructor() {
    super();
    this.http = new Http.Factory().create();
    this.state = { loaded: false };
  }

  componentDidMount() {
    this.initialData();
  }

  async initialData() {
    let rsp;
    try {
      console.log(Config.serverEndpoint + PATH);
      rsp = await this.http.get(Config.serverEndpoint + PATH);
    } catch (err) {
      console.log(err);
    } finally {
      console.log(rsp);
      this.setState({ loaded: true, data: rsp.body });
    }
  }

  renderData(data) {
    return (
      <Card className='environmentCard' childrenPadded={true}>
        {JSON.stringify(data, undefined, 2)}
      </Card>
    );
  }

  render() {
    return (
      <div className='Environment page'>
        <div className='subtitle'>
          Environment
        </div>
        <div className='section'>
          {this.state.data && this.renderData(this.state.data['os.environ'])}
        </div>
      </div>
    );
  }
}


export default Environment;
