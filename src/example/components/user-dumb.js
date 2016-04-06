import React, {Component, PropTypes} from 'react';
import {connect as formConnect } from '../../behaviours/form';
import {connect as connectToDefinitions} from '../../behaviours/definitions';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {loadUserAction, saveUserAction} from '../actions/user-actions';
import {toggleFormSaving} from '../../actions/form';

// Dumb components
import Form from './form';
import Field from '../../components/field';
import Button from './button';
import Code from './code';
import compose from 'lodash/flowRight';

function UserDumbComponent({fields, onChange, onSubmit, fieldFor, createForm, loadEntity, saveEntity, id, ...otherProps}) {
    //console.log('dubm props', onChange, onSubmit)
    const save = () => saveEntity(fields.reduce((user, field) => ({...user, [field.name]: field.inputValue}), {}));
    return (
        <div>
            {/* Fields auto rendering to test direct rendering without helpers*/}
            <Button onClick={() => {loadEntity(id)}}>Load entity from server</Button>
            {fieldFor('uuid', {onChange: () => {console.log(fields)}})}
            {fieldFor('firstName')}
            {fieldFor('lastName')}
            <Button onClick={save}>{'Save'}</Button>
        </div>
    );
}

UserDumbComponent.displayName = UserDumbComponent;

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserDumbComponent = compose(
    connectToDefinitions('user'),
    formConnect('userForm', ['user'], {
        mapDispatchToProps: dispatch => ({
            loadEntity: id => dispatch(loadUserAction({id})),
            saveEntity: user => {
                dispatch(toggleFormSaving('userForm', true));
                dispatch(saveUserAction(user));
            }
        })
    }),
    connectToFieldHelpers()
)(UserDumbComponent);

export default ConnectedUserDumbComponent;
