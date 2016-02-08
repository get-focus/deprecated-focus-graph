import React, {Component, PropTypes} from 'react';
import { connect as connectToReduxStore } from 'react-redux';
import {connect as connectToDefinitions} from '../behaviours/definitions';

import {fetchEntity} from '../actions';
// Dumb components
import Form from './form';
import Field from './field';
import Button from './button';


class SmartExampleComponent extends Component{
  constructor(props) {
    super(props);
    this.state = {fields: props.fields};
  }
  componentWillMount(){
    this.props.loadEntity(this.props.id);
  }
  componentWillReceiveProps({fields}){
    console.log('FIELDS RECEIVED', fields);
    if(!fields){
      return;
    }
    const newFields = Object.keys(fields).reduce((res, fieldName)=>{
      res[fieldName] = {name: fieldName, value: fields[fieldName]};
      return res;
    }, {});
    return this.setState({fields: newFields});
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
        <pre>
          <code>
            {JSON.stringify(this.props)}
          </code>
        </pre>
        {
          fields && Object.keys(fields).reduce((res, fieldName)=>{
            res.push(<Field key={fieldName} onChange={onChange.bind(this)} {...fields[fieldName]} />);
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
const DefinitionConnectedSmartExampleComponent = connectToDefinitions('user')(SmartExampleComponent);

const ConnectedSmartExampleComponent = connectToReduxStore(
  ({entity:{data, isLoading}}) => ({fields: data, isLoading}),
  (dispatch) => ({
    loadEntity: (id) => {
      dispatch(fetchEntity({id}));
    }
  })
)(DefinitionConnectedSmartExampleComponent);

export default ConnectedSmartExampleComponent;
