import './InfoDialog.scss';
import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


/**
 * Displays an icon which, when clicked, brings up a dialog.
 *
 * Props:
 *   className
 *   dialogClassName
 *   dialogRef
 *   icon
 *   header
 *   footer
 *   content
 *   open - whether to render as initially visible
 */
class InfoDialog extends React.Component {
  constructor() {
    super();
    this.state = {visible: false};
  }

  componentDidMount() {
    this.setState({visible: this.props.open});
  }

  show() {
    this.setState({visible: true});
  }

  render() {
    return (
      <div className={`InfoDialog ${this.props.className}`}>
        <i className={`pi ${this.props.icon || 'pi-info-circle'}`} />
        <Button
            className='target'
            label=''
            icon='pi'
            onClick={this.show.bind(this)}
            tooltipOptions={{
              className: 'InfoDialog-tooltip',
            }} />
        <Dialog
            className={`InfoDialog-element ${this.props.dialogClassName}`}
            ref={this.props.dialogRef}
            dismissableMask
            blockScroll
            baseZIndex={9999}
            appendTo={document.body}
            visible={this.state.visible}
            header={this.props.header || 'Information'}
            footer={this.props.footer}
            onHide={() => this.setState({visible: false})}>
          <div onClick={e => e.stopPropagation()}>
            {this.state.visible ? this.props.content : ''}
          </div>
        </Dialog>
      </div>
    );
  }
}


export default InfoDialog;
