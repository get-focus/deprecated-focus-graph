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
        const {id, clear, load} = this.props;
        console.log(id)
        load({id});


    }
    render() {
        const {editing, fields, fieldFor,listFor,selectFor, loading, saving, list} = this.props;
        return (
            <Panel title='User' {...this.props}>
                {fieldFor('uuid', {entityPath: 'user.information', onChange: () => {console.log(fields)}})}
                {fieldFor('firstName', {entityPath: 'user.information'})}
                {fieldFor('lastName', {entityPath: 'user.information'})}
            </Panel>
        );
    }
};

const formConfigUser = {
  formKey: 'userFormUser',
  entityPathArray: ['user.information'],
  loadAction: loadUserAction,
  saveAction: saveUserAction,
  nonValidatedFields: ['user.information.firstName']
};

UserForm.displayName = 'UserForm';


const ConnectedUserForm = compose(
  connectToMetadata(['user']),
  connectToForm(formConfigUser),
  connectToFieldHelpers()
)(UserForm);


class UserFormConfig extends Component {
    componentWillMount() {
        const {id, load} = this.props;
        console.log(id)
        load({id});
    }


    render() {
        const {editing, fields, fieldFor,listFor, loading, saving, list} = this.props;
        return (
            <Panel title='User' {...this.props}>
                {fieldFor('uuid', {entityPath: 'user.information', onChange: () => {console.log(fields)}})}
                {fieldFor('firstName', {entityPath: 'user.information'})}
                {fieldFor('lastName', {entityPath: 'user.information'})}
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
    <ConnectedUserFormConfig {...props} id='1235'/>
    <ConnectedUserForm {...props}/>
  </div>

}

export default ComponentUser;
