import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from '../../behaviours/form';
import {connect as connectToMetadata} from '../../behaviours/metadata';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {connect as connectToMasterData} from '../../behaviours/master-data';
import {loadMixedAction, saveMixedAction} from '../actions/mixed-actions';

import Panel from '../../components/panel';
import compose from 'lodash/flowRight';

class UserAddressForm extends Component {
    componentWillMount() {
        const {id, load, loadMasterData} = this.props;
        load({id});
        loadMasterData();
    }

    render() {
        const {editing, fields, fieldFor, list, selectFor} = this.props;
        return (
            <Panel title='User and address' {...this.props}>
                {fieldFor('uuid', {onChange: () => {console.log(fields)}, entityPath: 'user'})}
                {list('childs', {entityPath : 'user', redirectEntityPath: 'child'})}
            </Panel>
        );
    }
};

UserAddressForm.displayName = 'UserAddressForm';

const formConfig = {
    //todo: it should raise an error if i use the same formKey.
    formKey: 'userAndAddressForm',
    entityPathArray: ['user', 'address', 'child'],
    loadAction: loadMixedAction,
    saveAction: saveMixedAction,
    nonValidatedFields: ['user.firstName']
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserAddressForm = compose(
    connectToMetadata(['user', 'address', 'child']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserAddressForm);

export default ConnectedUserAddressForm;
