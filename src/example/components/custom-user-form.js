import React, {Component, PropTypes} from 'react';
import find from 'lodash/find';

import {connect as connectToForm } from '../../behaviours/form';
import {connect as connectToMetadata} from '../../behaviours/metadata';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {connect as connectToMasterData} from '../../behaviours/master-data';
import {loadUserAction, saveUserAction} from '../actions/user-actions';

import LineComponent from '../../components/line'

import Panel from '../../components/panel';
import compose from 'lodash/flowRight';

class UserForm extends Component {
    componentWillMount() {
        const {id, load, loadMasterData} = this.props;
        //load({id});
        loadMasterData();
    }
    componentWillReceiveProps(newProps){
      console.log(newProps.saving);
      console.log(this.props.saving)
    }

    render() {
        const {editing, fields, fieldFor, selectFor, listFor} = this.props;
        const civilityField = find(fields, {name: 'civility', entityPath: 'user.information'});
        return (
            <Panel title='User with more details for Mrs' {...this.props}>
                {fieldFor('uuid', {entityPath: 'user.information', onChange: () => {console.log(fields)}})}
                {fieldFor('test', {entityPath: 'user.information'})}
                {selectFor('civility', {entityPath: 'user.information', masterDatum: 'civility'})}
                {civilityField && civilityField.rawInputValue === 'MRS' && fieldFor('firstName', {entityPath: 'user.information'})}
                {civilityField && civilityField.rawInputValue === 'MRS' && fieldFor('lastName', {entityPath: 'user.information'})}
                {fieldFor('date', {entityPath: 'user.information'})}
                {listFor('childs', {LineComponent, entityPath : 'user.information', redirectEntityPath: 'user.child'})}
            </Panel>
        );
    }
};

UserForm.displayName = 'UserForm';

const formConfig = {
    formKey: 'userCustomForm',
    entityPathArray: ['user.information'],
    saveAction: saveUserAction,
    nonValidatedFields: ['user.information.firstName', 'user.information.lastName']
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserForm);

export default ConnectedUserForm;
