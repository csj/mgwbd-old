import './LabelValue.scss';
import InfoBubble from 'components/chrome/InfoBubble';
import React from 'react';


/**
 * Renders label-value pairs.
 *
 * Props:
 *   className
 *   styles
 *   label
 *   labelClassName
 *   labelInfoBubble
 *   labelTemplate
 *   value
 *   valueClassName
 *   valueInfoBubble
 *   valueTemplate
 */
class LabelValue extends React.Component {

  renderField(item, className, infoBubble, template) {
    return (
      <div className={className}>
        {(template || (i => i))(item)}
        {infoBubble ?  (<InfoBubble text={infoBubble} />) : ''}
      </div>
    );
  }

  getStyleClasses() {
    let styles = this.props.styles || [];
    if (typeof this.props.styles === typeof '') {
      styles = [this.props.styles];
    }
    return styles.reduce(
        (className, style) => className + style + ' ', '');
  }

  getClasses() {
    let className = (
        'LabelValue ' +
        this.props.className + ' ' +
        this.getStyleClasses(this.props.styles));
    return className;
  }

  render() {
    return (
      <div className={this.getClasses()}>
        {this.renderField(
          this.props.label,
          `label ${this.props.labelClassName}`,
          this.props.labelInfoBubble,
          this.props.labelTemplate,
        )}
        {this.renderField(
          this.props.value,
          `value ${this.props.valueClassName}`,
          this.props.valueInfoBubble,
          this.props.valueTemplate,
        )}
      </div>
    );
  }
}
LabelValue.Style = {
  LEFT_RIGHT: 'leftRight',
  LABEL_BOLD: 'labelBold',
  VALUE_BOLD: 'valueBold',
};


export default LabelValue;
