import React, {Component, PropTypes} from 'react';
import find from 'lodash/find';
import {connect as connectToDocumentation} from '../../behaviours/documentation';
import {connect as connectToForm } from '../../behaviours/form';
import {connect as connectToMetadata} from '../../behaviours/metadata';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {connect as connectToMasterData} from '../../behaviours/master-data';
import {loadUserAction, saveUserAction} from '../actions/user-actions';

import Panel from '../../components/panel';
import compose from 'lodash/flowRight';

class UserDisplayOnly extends Component {
    componentWillMount() {
        const {id, load, loadMasterData} = this.props;
        load({id});
        loadMasterData();
    }
    render() {
        const {editing, fields, fieldFor, selectFor} = this.props;
        const civilityField = find(fields, {name: 'civility', entityPath: 'user'});
        return (
            <Panel title='Display only user page' >
                {fieldFor('uuid', {entityPath: 'user'})}
                {fieldFor('date', {entityPath: 'user'})}
            </Panel>
        );
    }
};

UserDisplayOnly.displayName = 'UserDisplayOnly';

const formConfig = {
    formKey: 'userDisplay',
    entityPathArray: ['user', 'address'],
    loadAction: loadUserAction,
    saveAction: saveUserAction,
    nonValidatedFields: ['user.firstName']
};
export const tuto = `
  ## Comment faire une page de consultation pure

  \`const lol = 'lol';\`


`;
//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedDisplayUser = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers(),
    connectToDocumentation(tuto)
  )(UserDisplayOnly);

export default ConnectedDisplayUser;
