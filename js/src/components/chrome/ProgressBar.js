import './ProgressBar.scss';
import React from 'react';


/*
 * Props
 *   className
 *   done
 *   total
 */
class ProgressBar extends React.Component {

  renderStats(segments) {
    let overallPercentageDiv = null;
    if (this.props.total) {
      overallPercentageDiv = (
        <div className='overallPercentage'>
          ({Math.floor(this.props.done * 100 / this.props.total)}%)
        </div>
      );
    }
    return (
      <div className='stats'>
        <div className='details'>
          {this.props.done.toLocaleString()}
          &nbsp;/&nbsp;
          {this.props.total.toLocaleString()}
        </div>
        {overallPercentageDiv}
      </div>
    );
  }

  renderSegment(segment) {
    return (
      <div
          key={segment.name}
          className={`segment ${segment.className}`}
          style={{width: `${segment.percentage}%`}}
          />
    );
  }

  render() {
    let segments = [
      {
        name: 'done',
        className: 'done',
        percentage: Math.floor(this.props.done * 100 / this.props.total),
      },
      {
        name: 'pending',
        className: 'pending',
        percentage: Math.floor(
            (this.props.total - this.props.done) * 100 / this.props.total),
      },
    ];
    return (
      <div className='ProgressBar'>
        {this.renderStats(segments)}
        <div className='bar'>
          {segments.map(this.renderSegment.bind(this))}
        </div>
      </div>
    );
  }
}


export default ProgressBar;
