import React, {Component, PropTypes} from 'react';

// Dumb components
import Form from './form';
import Field from './field';
import Button from './button';

class SmartExampleComponent extends Component{
  constructor(props) {
    super(props);
    this.state = {fields: props.fields};
  }
  render(){
    const {onSubmit, onChange} = this.props;
    const {fields} = this.state;
    const _onSubmit = (e) => {
      e.preventDefault();
      onSubmit(fields);
    }
    return (
      <Form onSubmit={_onSubmit}>
        {
          Object.keys(fields).reduce((res, fieldName)=>{
            const field = fields[fieldName];
            res.push(<Field key={fieldName} onChange={onChange.bind(this)} {...field} />);
            return res;
          }, [])
        }
        <Button onClick={_onSubmit}>{'Save'}</Button>
      </Form>
    );
  }
}
SmartExampleComponent.displayName = SmartExampleComponent;
SmartExampleComponent.defaultProps = {
  onSubmit(data){
    console.log('submit', data);
  },
  onChange({name, value}){
      const {fields} = this.state;
      if(fields[name] !== value){
        fields[name] = {name, value, error};
        this.setState({fields});
      }
  }
}

export default SmartExampleComponent;
