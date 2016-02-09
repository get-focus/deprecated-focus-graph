import React, {Component, PropTypes} from 'react';
import {connect as connectToReduxStore } from 'react-redux';
import {connect as connectToDefinitions} from '../behaviours/definitions';
import {connect as connectToFieldHelpers} from '../behaviours/field';
import {connect as connectSmartData} from '../behaviours/smart-data';
import {fetchEntity} from '../actions';
// Dumb components
import Form from './form';
import Field from './field';
import Button from './button';
import Code from './code';
import compose from 'lodash/flowRight';
function DumbExampleComponent({fields, onChange, onSubmit, fieldFor, ...otherProps}){
  //console.log('dubm props', onChange, onSubmit)
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
          res.push(<Field key={fieldName} onChange={onChange} {...fields[fieldName]} />);
          return res;
        }, [])
      }
      {/*Field for as props i have to find a way to bind on this without use call*/}
      <h3>{'Use field and definition behaviour'}</h3>
      {fieldFor('lastName')}
      {fieldFor('firstName')}
      <Button onClick={_onSubmit}>{'Save'}</Button>
      {/*Debug purpose only show data functions are not displayed*/}
      <Code {...{fields, ...otherProps}} />
    </Form>
  );
}

DumbExampleComponent.displayName = DumbExampleComponent;

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedDumbExampleComponent = compose(
  connectToDefinitions('user'),
  connectToReduxStore(
    ({entity:{data, isLoading}}) => ({fields: data, isLoading}),
    (dispatch) => ({
      loadEntity: (id) => {
        dispatch(fetchEntity({id}));
      }
    })
  ),
  connectSmartData(),
  connectToFieldHelpers
)(DumbExampleComponent);

export default ConnectedDumbExampleComponent;
