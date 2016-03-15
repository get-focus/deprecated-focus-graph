import React, {Component, PropTypes} from 'react';
import {connect as connectToStore} from './store';
import {createForm, destroyForm} from '../actions/form';

export const connect = (formKey, entityPathArray, storeConnectorOptions) => ComponentToConnect => {
    class FormComponent extends Component {
        componentWillMount() {
            const {store: {dispatch}} = this.context;
            dispatch(createForm(formKey, entityPathArray));
        }

        componentWillUnmount() {
            const {store: {dispatch}} = this.context;
            dispatch(destroyForm(formKey));
        }

        render() {
            return <ComponentToConnect {...this.props}/>;
        }
    }
    FormComponent.contextTypes = {
        store: PropTypes.shape({
            subscribe: PropTypes.func.isRequired,
            dispatch: PropTypes.func.isRequired,
            getState: PropTypes.func.isRequired
        })
    };
    return connectToStore(entityPathArray, storeConnectorOptions)(FormComponent);
}
