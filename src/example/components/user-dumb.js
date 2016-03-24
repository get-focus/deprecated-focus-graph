import React, {Component, PropTypes} from 'react';
import {connect as formConnect } from '../../behaviours/form';
import {connect as connectToDefinitions} from '../../behaviours/definitions';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {loadUserAction} from '../actions/user-actions';

// Dumb components
import Form from './form';
import Field from '../../components/field';
import Button from './button';
import Code from './code';
import compose from 'lodash/flowRight';

function UserDumbComponent({fields, onChange, onSubmit, fieldFor, createForm, loadEntity, id, ...otherProps}) {
    //console.log('dubm props', onChange, onSubmit)
    const _onSubmit = (e) => {
        e.preventDefault();
        onSubmit(fields);
    }
    return (
        <div>
            {/* Fields auto rendering to test direct rendering without helpers*/}
            <Button onClick={() => {loadEntity(id)}}>Load entity from server</Button>
            {fieldFor('uuid')}
            {fieldFor('firstName')}
            {fieldFor('lastName')}
            <Button onClick={_onSubmit}>{'Save'}</Button>
        </div>
    );
}

UserDumbComponent.displayName = UserDumbComponent;

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserDumbComponent = compose(
    connectToDefinitions('user'),
    formConnect('userForm', ['user'], {
        mapDispatchToProps: dispatch => ({
            loadEntity: (id) => dispatch(loadUserAction({id})),
            saveEntity:(id, json) => dispatch(loadUserAction(id, json))
        })
    }),
    connectToFieldHelpers()
)(UserDumbComponent);

export default ConnectedUserDumbComponent;
