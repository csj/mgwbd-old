import './Tag.scss';
import React from 'react';


/*
 * Props
 *   className
 *   label
 *   size: ['medium', 'small'] default medium
 *   darkText: bool, default false
 */
class Tag extends React.Component {
  render() {
    let tagClasses = 'Tag';
    tagClasses += ' ' + this.props.className;
    tagClasses += ' size' + (this.props.size || 'medium');
    const labelClasses =
        'label ' + (this.props.darkText ? 'darkText' : 'lightText');
    return (
      <div className={tagClasses} onClick={this.props.onClick}>
        <div className={labelClasses}>
          {this.props.label}
        </div>
      </div>
    );
  }
}


export default Tag;
