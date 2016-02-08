import React, {Component, PropTypes} from 'react';
import Form from './form';
import Field from './field';

class SmartExampleComponent extends Component{
  constructor(props) {
    super(props);
    this.state = {fields: props.fields};
  }
  render(){
    const {onSubmit, onChange} = this.props;
    const {fields} = this.state;
    return (
      <Form onSubmit={()=>{onSubmit(fields)}}>
        {
          Object.keys(fields).reduce((res, fieldName)=>{
            res.push(<Field key={fieldName} name={fieldName} value={fields[fieldName]} onChange={onChange.bind(this)} />);
            console.log(res);
            return res;
          }, [])
        }
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
        fields[name] = value;
        this.setState({fields});
      }
  }
}

export default SmartExampleComponent;
