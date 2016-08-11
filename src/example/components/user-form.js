import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from '../../behaviours/form';
import {connect as connectToMetadata} from '../../behaviours/metadata';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {connect as connectToMasterData} from '../../behaviours/master-data';
import {loadUserAction, saveUserAction} from '../actions/user-actions';

import Panel from '../../components/panel';
import compose from 'lodash/flowRight';

class UserForm extends Component {
    componentWillMount() {
        const {id, load} = this.props;
        load({id});
    }

    render() {
        const {editing, fields, fieldFor,  loading, saving, list} = this.props;
        return (
            <Panel title='User' {...this.props}>
                {fieldFor('uuid', {entityPath: 'user.information', onChange: () => {console.log(fields)}})}
                {fieldFor('firstName', {entityPath: 'user.information'})}
                {fieldFor('lastName', {entityPath: 'user.information'})}
                {fieldFor('date', {entityPath: 'user.information'})}

            </Panel>
        );
    }
};

UserForm.displayName = 'UserForm';

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user.information', 'user.address'],
    loadAction: loadUserAction,
    saveAction: saveUserAction,
    nonValidatedFields: ['user.information.firstName']
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserForm);

export default ConnectedUserForm;
