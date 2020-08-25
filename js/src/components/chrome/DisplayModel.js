import './DisplayModel.scss';
import LabelValue from 'components/chrome/LabelValue';
import React from 'react';
import moment from 'moment';


const DEFAULT_DATE_FORMAT = 'LLL';


class DisplayModel extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (this.props.load) {
      this.load();
    } else {
      this.setState({ isLoaded: true });
    }
  }

  load() {
    // Loads a model data by classname and id.
    this.setState({ isLoaded: false });
    setTimeout(() => this.setState({ isLoaded: true }), 400);
  }

  renderValue(value, properties) {
    properties = properties || {};
    if (properties.template) {
      return properties.template(value);
    }
    if (moment.isMoment(value)) {
      return value.format(DEFAULT_DATE_FORMAT);
    }
    if (moment.isDate(value)) {
      return moment(value).format(DEFAULT_DATE_FORMAT);
    }
    if (Array.isArray(value)) {
      return value.map(this.renderValue.bind(this)).join(', ');
    }
    if (typeof value === typeof true) {
      return value ? 'True' : 'False';
    }
    if (value === null) {
      return 'N/A';
    }
    if (typeof value === typeof {}) {
      // we don't know how to display this.
      console.log('Unknown how to render object.');
      console.log(value);
      return '[Object]';
    }
    return value;
  }

  renderOptionalItem(properties, value) {
    const label = properties.name;
    const renderedValue = this.renderValue(value, properties);
    if (renderedValue) {
      return (
        <LabelValue
            className='summaryItem'
            key={label}
            label={label}
            value={renderedValue} />
      );
    }
    return null;
  }

  render() {
    if (this.state.isLoaded) {
      const data = this.props.data;
      let properties = data.constructor.getWhitelistedProperties();
      properties = Object.keys(properties).reduce(
          (obj, k) => {
            const property = properties[k];
            if (property.isUserDisplayable !== false) {
              obj[k] = property;
            }
            return obj;
          },
          {});
      return (
        <div className='DisplayModel'>
          {Object.keys(properties).map(
              k => this.renderOptionalItem(properties[k], data[k]))}
        </div>
      );
    } else {
      return (
        <div className='DisplayModel loading'>
          Loading…
        </div>
      );
    }
  }
}


export default DisplayModel;
