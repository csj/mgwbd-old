import './Card.scss';
import { Button } from 'primereact/button';
import React from 'react';


const wrap = (cls, e) => (
  <div className={cls}>{e}</div>
);


/**
 * Renders a card in the UI.
 *
 * Props
 *   header
 *   text
 *   className
 *   direction ('vertical' or 'horizontal')
 *   img
 *   imgClassName
 *   imgPadded
 *   buttonPrimaryLabel
 *   buttonPrimaryAction
 *   children
 *   childrenPadded
 */
class Card extends React.Component {

  img() {
    if (this.props.img) {
      const html = (
        <div
            className={'img ' + this.props.imgClassName}
            style={{backgroundImage: `url(${this.props.img})`}} />
      );
      const wrapClasses =
          this.props.imgClassName + (this.props.imgPadded ? ' padded' : '');
      return wrap(wrapClasses, html);
    }
    return (
      <div className='noImg' />
    );
  }

  text() {
    if (this.props.header || this.props.text) {
      return wrap('padded', (
        <div>
          <div className='header'>{this.props.header}</div>
          {this.props.text ?
              <div className='text'>{this.props.text}</div> : ''}
        </div>
      ));
    }
    return null;
  }

  children() {
    let cls = 'children';
    if (this.props.childrenPadded) {
      cls += ' padded';
    }
    return wrap(cls, this.props.children);
  }

  buttons() {
    if (this.props.buttonPrimaryLabel) {
      return wrap('padded', (
        <div className='_buttons'>
          <Button
              label={this.props.buttonPrimaryLabel}
              icon='pi pi-chevron-right'
              iconPos='right'
              onClick={this.props.buttonPrimaryAction} />
        </div>
      ));
    }
    return null;
  }

  render() {
    const extraClasses = this.props.className;
    return (
      <div className={'Card ' + extraClasses}>
        <div className='shadow' />
        <div className={'card ' + (this.props.direction || 'vertical')}>
          {this.img()}
          <div className='content'>
            {this.text()}
            {this.children()}
            {this.buttons()}
          </div>
        </div>
      </div>
    );
  }
}


export default Card;
