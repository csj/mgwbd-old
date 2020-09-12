import './Copyable.scss';
import React from 'react';
import { Button } from 'primereact/button';


/**
 * Props
 *   value
 *   label
 *   className
 */
class Copyable extends React.Component {
  constructor() {
    super();
    this.ref = React.createRef();
    this.state = { copied: false };
  }

  copy() {
    const range = document.createRange();
    range.selectNode(this.ref.current);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().empty();
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  }

  renderLabel() {
    if (this.props.label) {
      return (
        <div className='copyableLabel'>
          {this.props.label}
        </div>
      );
    }
  }

  render() {
    return (
      <div className={`Copyable ${this.props.className}`}>
        <Button
            className='copyableButton'
            onClick={this.copy.bind(this)}
            tooltip={
              this.state.copied ?
                  'Copied to clipboard' : 'Click to copy value to clipboard'
            }
            tooltipOptions={{
              className: 'Copyable-tooltip',
              position: this.props.position || 'bottom',
            }} />
        <div className='copyableInner'>
          <div className='copyableValue' ref={this.ref}>
            {this.props.value}
          </div>
          {this.renderLabel()}
        </div>
      </div>
    );
  }
}


export default Copyable;
