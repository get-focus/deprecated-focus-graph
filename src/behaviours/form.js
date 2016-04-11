import React, {Component, PropTypes} from 'react';
import {connect as connectToStore} from './store';
import {createForm, destroyForm, inputChange} from '../actions/form';
import find from 'lodash/find';
import compose from 'lodash/flowRight';

const internalMapStateToProps = (state, key) => {
    const formCandidate = find(state.forms, {key});
    const resultingProps = {};
    if (formCandidate) {
        resultingProps.fields = formCandidate.fields;
        resultingProps.getUserInput = () => formCandidate.fields.reduce((entity, field) => ({...entity, [field.name]: field.inputValue}), {});
    } else {
        resultingProps.fields = [];
        resultingProps.getUserInput = () => ({});
    }
    return resultingProps;
};

const internalMapDispatchToProps = (dispatch, loadAction, saveAction) => {
    const resultingActions = {};
    if (loadAction) resultingActions.load = compose(dispatch, loadAction);
    if (saveAction) resultingActions.save = compose(dispatch, saveAction);
    return resultingActions;
};

const getExtendedComponent = (ComponentToConnect,formOptions) => {
    class FormComponent extends Component {
        componentWillMount() {
            const {store: {dispatch}} = this.context;
            dispatch(createForm(formOptions.name, formOptions.entityPathArray));
        }

        componentWillUnmount() {
            const {store: {dispatch}} = this.context;
            dispatch(destroyForm(formOptions.name));
        }

        _onInputChange(name, entityPath, value) {
            const {store: {dispatch}} = this.context;
            dispatch(inputChange(formOptions.name, name, entityPath, value));
        }

        _toggleEdit(edit) {
            const {store: {dispatch}} = this.context;
            dispatch(toggleFormEdit(formOptions.name, edit));
        }

        render() {
            return <ComponentToConnect {...this.props} onInputChange={::this._onInputChange} entityPathArray={formOptions.entityPathArray}/>;
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
        name: formKey,
        entityPathArray,
        mapStateToProps: userDefinedMapStateToProps = () => ({}),
        mapDispatchToProps: userDefinedMapDispatchToProps = () => ({}),
        loadAction,
        saveAction
    } = formOptions;

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
