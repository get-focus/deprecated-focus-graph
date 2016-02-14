import React, {Component, PropTypes} from 'react';
import {connect as connectToReduxStore } from 'react-redux';
import {connect as connectToDefinitions} from '../behaviours/definitions';
import {connect as connectToFieldHelpers} from '../behaviours/field';
import {loadEntity} from '../actions/entity';
// Dumb components
import Form from './form';
import Field from './field';
import Button from './button';
import Code from './code';


class SmartExampleComponent extends Component{
  constructor(props) {
    super(props);
    this.state = {fields: props.fields};
  }
  componentWillMount(){
    //this.props.loadEntity(this.props.id);
  }
  componentWillReceiveProps({fields}){
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
    const {onSubmit, onChange, fieldFor} = this.props;
    const {fields} = this.state;
    const _onSubmit = (e) => {
      e.preventDefault();
      onSubmit(fields);
    }
    return (
      <Form onSubmit={_onSubmit}>
        {/* Fields auto rendering to test onChange without definitions and redux */}
        <h3>{'Plain react stateless component'}</h3>
        {
          fields && Object.keys(fields).reduce((res, fieldName)=>{
            res.push(<Field key={fieldName} onChange={onChange.bind(this)} {...fields[fieldName]} />);
            return res;
          }, [])
        }
        {/*Field for as props i have to find a way to bind on this without use call*/}
        <h3>{'Use field and definition behaviour'}</h3>
        {fieldFor('lastName')}
        {fieldFor('firstName')}
        <Button onClick={_onSubmit}>{'Save'}</Button>
        {/*Debug purpose only show data functions are not displayed*/}
        <Code {...this.props} />
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

const FieldConnectedSmartExampleComponent = connectToFieldHelpers(SmartExampleComponent);

const ReduxAndFieldConnectedSmartExampleComponent = connectToReduxStore(
  ({entity:{data, isLoading}}) => ({fields: data, isLoading}),
  (dispatch) => ({
    loadEntity: (id) => {
      dispatch(loadEntity({id}));
    }
  })
)(FieldConnectedSmartExampleComponent);

const ConnectedSmartExampleComponent =  connectToDefinitions('user')(ReduxAndFieldConnectedSmartExampleComponent);

export default ConnectedSmartExampleComponent;
