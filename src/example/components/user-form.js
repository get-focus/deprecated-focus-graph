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


export const deleteFields = (victoire) => {
  type: MY_ACTION,
  victoire
}


class UserForm extends Component {
    componentWillMount() {
        const {id, load, clear} = this.props;
    }
    render() {
        const {editing, fields, fieldFor,listFor,selectFor, loading, saving, list} = this.props;
        console.log(this.props)

        return (
          <div>
          <Panel title='User' {...this.props}>
              {fieldFor('firstName', {entityPath: 'user.information'})}
              {fieldFor('lastName', {entityPath: 'user.information'})}
          </Panel>
          </div>

        );
    }
};

//mapDispatchToProps: (dispatch) => {const test = {}; test.deleteFields = (arg) => dispatch(deleteFields(arg)); return test},

const formConfigUser = {
  formKey: 'userFormUser',
  mapDispatchToProps: {deleteFields},
  entityPathArray: ['user.information'],
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
        load({id});
    }


    render() {
        const {editing, fields, fieldFor,listFor, loading, saving, list} = this.props;
        console.log(this.props)
        return (
            <Panel title='User' {...this.props}>
                {fieldFor('uuid', {entityPath: 'user.information', onChange: () => {console.log(fields)}})}
                {fieldFor('firstName', {entityPath: 'user.information'})}
                {fieldFor('lastName', {entityPath: 'user.information'})}
                {fieldFor('date', {entityPath: 'user.information'})}
                {fieldFor('test', {entityPath: 'user.information'})}
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
  mapDispatchToProps: () => {deleteFields},
  nonValidatedFields: ['user.information.firstName']
};

const ConnectedUserFormConfig = compose(
    connectToMetadata(['user']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserFormConfig);


function ComponentUser(props)  {
  return <div>
  hjghjgjhghj
    <ConnectedUserForm {...props}/>
  </div>

}

export default ComponentUser;
