import React, {Component, PropTypes} from 'react';
import {connect as connectToStore} from './store';
import {createForm, destroyForm, inputChange} from '../actions/form';
import find from 'lodash/find';

const mapStateToPropsBuilder = key => ({forms}) => {
    const formCandidate = find(forms, {key});
    return {fields: formCandidate ? formCandidate.fields : []};
};

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

        _onInputChange(name, entityPath, value) {
            const {store: {dispatch}} = this.context;
            dispatch(inputChange(formKey, name, entityPath, value));
        }

        _toggleEdit(edit) {
            const {store: {dispatch}} = this.context;
            dispatch(toggleFormEdit(formKey, edit));
        }

        render() {
            return <ComponentToConnect {...this.props} onInputChange={::this._onInputChange} entityPathArray={entityPathArray}/>;
        }
    }
    FormComponent.contextTypes = {
        store: PropTypes.shape({
            subscribe: PropTypes.func.isRequired,
            dispatch: PropTypes.func.isRequired,
            getState: PropTypes.func.isRequired
        })
    };
    return connectToStore(entityPathArray, {mapStateToProps: mapStateToPropsBuilder(formKey), ...storeConnectorOptions})(FormComponent);
}
