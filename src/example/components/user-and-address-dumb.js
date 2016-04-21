import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from '../../behaviours/form';
import {connect as connectToMetadata} from '../../behaviours/metadata';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {connect as connectToMasterData} from '../../behaviours/master-data';
import {loadMixedAction, saveUserAction} from '../actions/user-actions';

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
            {/* Load both address and user.  */}
            <Button onClick={() => loadMasterData()}>Load master data</Button>
            {/* I shouldn't have to specify the entityPath it could be done automatically*/}
            {fieldFor('uuid', {onChange: () => {console.log(fields)}, entityPath: 'user'})}
            {fieldFor('firstName', {entityPath: 'user'})}
            {fieldFor('lastName', {entityPath: 'user'})}
            {fieldFor('date', {entityPath: 'user'})}
            {fieldFor('city', {entityPath: 'address'})}
        </div>
    );
}

UserDumbComponent.displayName = UserDumbComponent;

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user', 'address'],
    loadAction: loadMixedAction,
    saveAction: saveUserAction,
    nonValidatedFields: ['user.firstName']
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserDumbComponent = compose(
    connectToMetadata(['user', 'address']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserDumbComponent);

export default ConnectedUserDumbComponent;
