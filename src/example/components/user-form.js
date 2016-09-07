import React, {Component, PropTypes} from 'react';
import {connect as connectToState} from 'react-redux';
import {connect as connectToForm } from '../../behaviours/form';
import {connect as connectToMetadata} from '../../behaviours/metadata';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {connect as connectToMasterData} from '../../behaviours/master-data';
import {loadUserAction, saveUserAction} from '../actions/user-actions';
import {selectFieldsByFormKey} from '../../store/create-store';

import LineComponent from '../../components/line'

import Panel from '../../components/panel';
import compose from 'lodash/flowRight';

class UserForm extends Component {
    componentWillMount() {
        const {id, load} = this.props;
    }

    render() {
        const {editing, fields, fieldFor,listFor,selectFor, loading, saving, list} = this.props;
        return (
            <Panel title='User' {...this.props}>
              {fieldFor('firstName', {entityPath: 'user.information'})}
            </Panel>
        );
    }
};

UserForm.displayName = 'UserForm';


const ConnectedUserForm = compose(
    connectToState(selectFieldsByFormKey('userForm')),
    connectToMetadata(['user']),
    connectToFieldHelpers()
)(UserForm);


class UserFormConfig extends Component {
    componentWillMount() {
        const {id, load} = this.props;
        load({id});
    }

    render() {
        const {editing, fields, fieldFor,listFor, loading, saving, list} = this.props;
        return (
            <Panel title='User' {...this.props}>
                {fieldFor('uuid', {entityPath: 'user.information', onChange: () => {console.log(fields)}})}
                {fieldFor('firstName', {entityPath: 'user.information'})}
                {fieldFor('lastName', {entityPath: 'user.information'})}
                {fieldFor('date', {entityPath: 'user.information'})}
                {fieldFor('test', {entityPath: 'user.information'})}
                {listFor('childs', {LineComponent, entityPath : 'user.information', redirectEntityPath: 'user.child'})}

            </Panel>
        );
    }
};

UserFormConfig.displayName = 'UserFormConfig';

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user.information'],
    loadAction: loadUserAction,
    saveAction: saveUserAction,
    nonValidatedFields: ['user.information.firstName']
};

const ConnectedUserFormConfig = compose(
    connectToMetadata(['user']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserFormConfig);


function ComponentUser(props)  {
  return <div>
    <ConnectedUserForm {...props}/>
    <ConnectedUserFormConfig {...props}/>
  </div>

}

export default ComponentUser;
