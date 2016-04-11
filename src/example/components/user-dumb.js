import React, {Component, PropTypes} from 'react';
import {connect as formConnect } from '../../behaviours/form';
import {connect as connectToDefinitions} from '../../behaviours/definitions';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {loadUserAction, saveUserAction} from '../actions/user-actions';

// Dumb components
import Form from './form';
import Field from '../../components/field';
import Button from './button';
import Code from './code';
import compose from 'lodash/flowRight';

function UserDumbComponent({fields, fieldFor, load, save, id, getUserInput, ...otherProps}) {
    return (
        <div>
            {/* Fields auto rendering to test direct rendering without helpers*/}
            <Button onClick={() => {load({id})}}>Load entity from server</Button>
            {fieldFor('uuid', {onChange: () => {console.log(fields)}})}
            {fieldFor('firstName')}
            {fieldFor('lastName')}
            <Button onClick={() => save(getUserInput())}>{'Save'}</Button>
        </div>
    );
}

UserDumbComponent.displayName = UserDumbComponent;

const formConfig = {
    name: 'userForm',
    entityPathArray: ['user'],
    loadAction: loadUserAction,
    saveAction: saveUserAction
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserDumbComponent = compose(
    connectToDefinitions('user'),
    formConnect(formConfig),
    connectToFieldHelpers()
)(UserDumbComponent);

export default ConnectedUserDumbComponent;
