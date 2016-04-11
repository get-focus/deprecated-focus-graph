import React, {Component, PropTypes} from 'react';
import {connect as connectToStore} from './store';
import {createForm, destroyForm, inputChange} from '../actions/form';
import find from 'lodash/find';
import compose from 'lodash/flowRight';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';

const validateFormOptions = ({formKey, entityPathArray}) => {
    if (!isString(formKey)) throw new Error('You must provide a "formKey" option as a string to the form connect.');
    if (!isArray(entityPathArray)) throw new Error('You must provide a "entityPathArray" option as an array to the form connect.');
}

const internalMapStateToProps = (state, formKey) => {
    const formCandidate = find(state.forms, {formKey});
    const resultingProps = {...formCandidate};
    if (resultingProps) resultingProps.getUserInput = () => formCandidate.fields.reduce((entity, field) => ({...entity, [field.name]: field.inputValue}), {})
    return resultingProps;
};

const internalMapDispatchToProps = (dispatch, loadAction, saveAction) => {
    const resultingActions = {};
    if (loadAction) resultingActions.load = compose(dispatch, loadAction);
    if (saveAction) resultingActions.save = compose(dispatch, saveAction);
    return resultingActions;
};

const getExtendedComponent = (ComponentToConnect, formOptions) => {
    class FormComponent extends Component {
        componentWillMount() {
            const {store: {dispatch}} = this.context;
            dispatch(createForm(formOptions.formKey, formOptions.entityPathArray));
        }

        componentWillUnmount() {
            const {store: {dispatch}} = this.context;
            dispatch(destroyForm(formOptions.formKey));
        }

        _onInputChange(name, entityPath, value) {
            const {store: {dispatch}} = this.context;
            dispatch(inputChange(formOptions.formKey, name, entityPath, value));
        }

        _toggleEdit(edit) {
            const {store: {dispatch}} = this.context;
            dispatch(toggleFormEdit(formOptions.formKey, edit));
        }

        render() {
            return <ComponentToConnect {...this.props} onInputChange={::this._onInputChange} entityPathArray={formOptions.entityPathArray} />;
        }
    }
    FormComponent.contextTypes = {
        store: PropTypes.shape({
            subscribe: PropTypes.func.isRequired,
            dispatch: PropTypes.func.isRequired,
            getState: PropTypes.func.isRequired
        })
    };
    return FormComponent;
};

export const connect = (formOptions) => ComponentToConnect => {
    const {
        formKey,
        entityPathArray,
        mapStateToProps: userDefinedMapStateToProps = () => ({}),
        mapDispatchToProps: userDefinedMapDispatchToProps = () => ({}),
        loadAction,
        saveAction
    } = formOptions;

    // Validate the provided options

    validateFormOptions(formOptions);

    // Extend the component
    const extendedComponent = getExtendedComponent(ComponentToConnect, formOptions);

    const mapStateToProps = state => ({
        ...internalMapStateToProps(state, formKey),
        ...userDefinedMapStateToProps(state)
    });
    const mapDispatchToProps = dispatch => ({
        ...internalMapDispatchToProps(dispatch, loadAction, saveAction),
        ...userDefinedMapDispatchToProps(dispatch)
    });

    return connectToStore(entityPathArray, {
        mapStateToProps,
        mapDispatchToProps}
    )(extendedComponent);
}
