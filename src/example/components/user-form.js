import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from '../../behaviours/form';
import {connect as connectToMetadata} from '../../behaviours/metadata';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {connect as connectToMasterData} from '../../behaviours/master-data';
import {loadUserAction, saveUserAction} from '../actions/user-actions';

// Dumb components
import Field from '../../components/field';
import Button from './button';
import compose from 'lodash/flowRight';

class UserForm extends Component {
    componentWillMount() {
        const {id, load, loadMasterData} = this.props;
        load({id});
        loadMasterData();
    }

    renderConsultingButton = () => {
        const {toggleEdit} = this.props;
        return (
            <Button onClick={() => toggleEdit(true)}>Edit</Button>
        );
    };

    renderEditingButtons = () => {
        const {toggleEdit, save, getUserInput} = this.props;
        return (
            <div>
                <Button onClick={() => toggleEdit(false)}>Cancel</Button>
                <Button onClick={() => save(getUserInput())}>{'Save'}</Button>
            </div>
        );
    };

    render() {
        const {editing, fields, fieldFor, loading, saving} = this.props;
        return (
            <div>
                {loading && <h4>loading</h4>}
                {saving && <h4>saving</h4>}
                {editing && this.renderEditingButtons()}
                {!editing && this.renderConsultingButton()}
                {fieldFor('uuid', {entityPath: 'user', onChange: () => {console.log(fields)}})}
                {fieldFor('firstName', {entityPath: 'user'})}
                {fieldFor('lastName', {entityPath: 'user'})}
                {fieldFor('date', {entityPath: 'user'})}
            </div>
        )
    }
};

UserForm.displayName = 'UserForm';

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user', 'address'],
    loadAction: loadUserAction,
    saveAction: saveUserAction,
    nonValidatedFields: ['user.firstName']
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserForm);

export default ConnectedUserForm;
