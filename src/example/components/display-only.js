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
        const civilityField = find(fields, {name: 'civility', entityPath: 'user.information'});
        return (
            <Panel title='Display only user page' {...this.props}>
                {fieldFor('uuid', {entityPath: 'user.information'})}
                {fieldFor('date', {entityPath: 'user.information'})}
            </Panel>
        );
    }
};

UserDisplayOnly.displayName = 'UserDisplayOnly';

const formConfig = {
    formKey: 'userDisplay',
    entityPathArray: ['user.information'],
    loadAction: loadUserAction,
};

export const tuto = `
  ## How can you build a pure consultation page
  - You have a component which can be pure or not, but it needs to be connected to the providers to have .
  - First you need to provide the meta data informations that is the role of the \`connectToMetadata\` informations. You can pass the informations to it .
  - Then if you need master data you need to be connected to them. Here we need the \`civility\`
  - Then you need to be connected to the form provider with the connect to form data, a form need a \`formKey\`, then

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
