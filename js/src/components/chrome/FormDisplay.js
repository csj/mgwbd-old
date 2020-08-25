import './FormDisplay.scss';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React from 'react';


const idFor = field => 'form-element-' + field.name;


class FormDisplay extends React.Component {

  getValueFromState(name) {
    const value = this.props.parentState && this.props.parentState[name];
    return value || '';
  }

  renderField(field) {
    const ref = React.createRef();
    this.fieldRefs[field.name] = ref;
    switch (field.type) {
      case 'StringField':
      case 'PasswordField':
        const fieldTypeStr =
            field.type === 'PasswordField' ? 'password' : 'text';
        return (
          <div key={idFor(field)}>
            <div className='p-float-label'>
              <InputText
                  id={idFor(field)}
                  ref={ref}
                  type={fieldTypeStr}
                  onKeyPress={e => e.which === 13 && this.submit()}
                  onChange={e => this.props.onUpdate(field.name, e.target.value)}
                  value={this.getValueFromState(field.name)} />
              <label htmlFor={idFor(field)}>{field.label}</label>
            </div>
            {field.errors.map((error, i) => (
              <div key={i} className='warn below'>
                {error}
              </div>))}
          </div>
        );
      case 'CSRFTokenField':
        return (
          <input
              key={idFor(field)} ref={ref} type='hidden' name={field.name}
              value={field.current_token} />
        );
      case 'SubmitField':
        delete this.fieldRefs[field.name];
        return (
          <div key={idFor(field)}>
            {this.props.warn ? 
                <div className='warn above'>{this.props.warn}</div>
                : ''}
            <Button
                label={field.label} icon='pi pi-chevron-right' iconPos='right'
                onClick={this.submit.bind(this)} />
          </div>
        );

      default:
        console.log('Unknown field type.');
        return null;
    }
  }

  getFieldValue(field) {
    switch (field.type) {
      case 'StringField':
      case 'PasswordField':
        return this.fieldRefs[field.name].current.element.value;
      case 'CSRFTokenField':
        return this.fieldRefs[field.name].current.value;
      case 'SubmitField':
      default:
        return undefined;
    }
  }

  submit() {
    let data = {};
    this.fields.map(
        field => data[field.name] = this.getFieldValue(field));
    this.props.onSubmit(data);
  }

  render() {
    const subtitle = this.props.title;
    const msg = this.props.msg;
    this.fields = this.props.fields || [];
    this.fieldRefs = {};

    return (
      <div className='FormDisplay'>
        <div className='subtitle'>{subtitle}</div>
        {msg ? <div className='msg'>{msg}</div> : ''}
        <div className='form' onSubmit={this.submit.bind(this)}>
          {this.fields.map(this.renderField.bind(this))}
        </div>
      </div>
    );
  }
}


export default FormDisplay;
