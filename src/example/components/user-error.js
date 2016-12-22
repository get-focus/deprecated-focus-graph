import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from '../../behaviours/form';
import {connect as connectToMetadata} from '../../behaviours/metadata';
import {connect as connectToFieldHelpers} from '../../behaviours/field';
import {connect as connectToMasterData} from '../../behaviours/master-data';
import {saveErrorUserAction, saveUserAction} from '../actions/user-actions';
const Code = props => <pre><code>{JSON.stringify(props, null, 4)}</code></pre>
import Panel from '../../components/panel';
import compose from 'lodash/flowRight';
import LineComponent from '../../components/line'
class UserErrors extends Component {
    componentWillMount() {
        const {id, load, loadMasterData} = this.props;
        //load();

    }
    componentWillReceiveProps(nextProps){
      console.log(nextProps.error)
    }
    render() {
        const {editing, fields, fieldFor, listFor, selectFor} = this.props;
        return (
            <Panel title='User and address' {...this.props}>
                {fieldFor('uuid', {entityPath: 'user.information'})}
                {fieldFor('firstName', {entityPath: 'user.information'})}
            </Panel>
        );
    }
};

UserErrors.displayName = 'UserErrors';

const formConfig = {
    //todo: it should raise an error if i use the same formKey.
    formKey: 'userAndAddressForm',
    entityPathArray: ['user.information'/*, 'child'*/],
    //loadAction: loadUserErrorAction,
    saveAction: saveErrorUserAction,
    nonValidatedFields: ['user.information.uuid', {'user.childs': ['firstName']}    ]
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserErrors = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserErrors);

export default ConnectedUserErrors;
