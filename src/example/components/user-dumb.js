import React, {Component, PropTypes} from 'react';
import {connect as formConnect } from '../../behaviours/form';
import {connect as connectToDefinitions} from '../../behaviours/definitions';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {connect as connectToMasterData} from '../../behaviours/master-data';
import {loadUserAction, saveUserAction} from '../actions/user-actions';

// Dumb components
import Field from '../../components/field';
import Button from './button';
import compose from 'lodash/flowRight';





function UserDumbComponent({fields, fieldFor, load, save, id, getUserInput, toggleEdit, editing, loadMasterData, ...otherProps}) {
    const renderEditingButtons = () => (
        <div>
            <Button onClick={() => toggleEdit(false)}>Cancel</Button>
            <Button onClick={() => save(getUserInput())}>{'Save'}</Button>
        </div>
    );
    const renderConsultingButton = () => (
        <Button onClick={() => toggleEdit(true)}>Edit</Button>
    );
    return (
        <div>
            {editing && renderEditingButtons()}
            {!editing && renderConsultingButton()}
            {/* Fields auto rendering to test direct rendering without helpers*/}
            <Button onClick={() => {load({id})}}>Load entity from server</Button>
            {/* Load the  */}
            <Button onClick={() => loadMasterData()}>Load master data</Button>
            {fieldFor('uuid', {onChange: () => {console.log(fields)}})}
            {fieldFor('firstName')}
            {fieldFor('lastName')}

        </div>
    );
}

UserDumbComponent.displayName = UserDumbComponent;

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user'],
    loadAction: loadUserAction,
    saveAction: saveUserAction
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserDumbComponent = compose(
    connectToDefinitions(['user']),
    connectToMasterData(['civility']),
    formConnect(formConfig),
    connectToFieldHelpers()
)(UserDumbComponent);

export default ConnectedUserDumbComponent;
