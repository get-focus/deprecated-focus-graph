import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from '../../../behaviours/form';
import {connect as connectToMetadata} from '../../../behaviours/metadata';
import {connect as connectToFieldHelpers} from '../../../behaviours/field';
import {connect as connectToMasterData} from '../../behaviours/master-data';
import Panel from '../../components/panel';
import compose from 'lodash/flowRight';

const UserAndAdressInformations = props => {
        const {editing, fields, fieldFor, selectFor} = props;
        return (
            <Panel title='User and address' {...props}>
                {fieldFor('uuid', {onChange: () => {console.log(fields)}, entityPath: 'user'})}
                {fieldFor('firstName', {entityPath: 'user'})}
                {fieldFor('lastName', {entityPath: 'user'})}
                {selectFor('civility', {entityPath: 'user', masterDatum: 'civility'})}
                {fieldFor('date', {entityPath: 'user'})}
                {fieldFor('city', {entityPath: 'address'})}
            </Panel>
        );
  };

UserAndAdressInformations.displayName = 'UserAndAdressInformations';

const formConfig = {
    //todo: it should raise an error if i use the same formKey.
    formKey: 'userAndAddressInformations',
    entityPathArray: ['user', 'address'],
    //loadAction: loadMixedAction,
    //saveAction: saveMixedAction,
    nonValidatedFields: ['user.firstName']
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserAddressInformations = compose(
    connectToMetadata(['user', 'address']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserAndAdressInformations);

export default ConnectedUserAddressInformations;
