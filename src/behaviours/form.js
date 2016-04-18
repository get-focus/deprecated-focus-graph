import React, {Component, PropTypes} from 'react';
import {connect as connectToStore} from './store';
import {createForm, destroyForm, toggleFormEditing, validateForm} from '../actions/form';
import {inputChange, inputBlur} from '../actions/input';
import find from 'lodash/find';
import compose from 'lodash/flowRight';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';

const validateFormOptions = ({formKey, entityPathArray}) => {
    if (!isString(formKey)) throw new Error('FormConnect: You must provide a "formKey" option as a string to the form connect.');
    if (!isArray(entityPathArray)) throw new Error('FormConnect: You must provide a "entityPathArray" option as an array to the form connect.');
}

const internalMapStateToProps = (state, formKey) => {
    const formCandidate = find(state.forms, {formKey});
    const resultingProps = {...formCandidate};
    if (resultingProps) resultingProps.getUserInput = () => formCandidate.fields.reduce((entity, field) => ({...entity, [field.name]: field.inputValue}), {})
    return resultingProps;
};

const internalMapDispatchToProps = (dispatch, loadAction, saveAction, formKey, nonValidatedFields) => {
    const resultingActions = {};
    if (loadAction) resultingActions.load = compose(dispatch, loadAction);
    if (saveAction) resultingActions.save = (...saveArgs) => {
        dispatch(validateForm(formKey, nonValidatedFields, saveAction.call(null, saveArgs)));
    }
    return resultingActions;
};

/**
 * Extends the provided component
 * Creates and destroys the form, binds the inputChange methods to the current form key
 * @param  {ReactComponent} ComponentToConnect  the component that will be extended
 * @param  {object} formOptions                 the form options
 * @return {ReactComponent}                     the extended component
 */
const getExtendedComponent = (ComponentToConnect, formOptions) => {
    class FormComponent extends Component {
        componentWillMount() {
            const {store: {dispatch}} = this.context;
            // On component mounting, create the form in the Redux state
            dispatch(createForm(formOptions.formKey, formOptions.entityPathArray));
        }

        componentWillUnmount() {
            const {store: {dispatch}} = this.context;
            // On component mounting, remove the form from the Redux state
            dispatch(destroyForm(formOptions.formKey));
        }

        _onInputChange(name, entityPath, value) {
            const {store: {dispatch}} = this.context;
            dispatch(inputChange(formOptions.formKey, name, entityPath, value));
        }

        _onInputBlur(name, entityPath, value) {
            const {store: {dispatch}} = this.context;
            dispatch(inputBlur(formOptions.formKey, name, entityPath, value));
        }

        _toggleEdit(edit) {
            const {store: {dispatch}} = this.context;
            dispatch(toggleFormEditing(formOptions.formKey, edit));
        }

        render() {
            const {_behaviours, ...otherProps} = this.props;
            const behaviours = {connectedToForm: true, ..._behaviours};
            return <ComponentToConnect {...otherProps} _behaviours={behaviours} onInputChange={::this._onInputChange} onInputBlur={::this._onInputBlur} toggleEdit={::this._toggleEdit} entityPathArray={formOptions.entityPathArray} />;
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

/**
 * Form connector
 * Wraps the provided component into a component that will create the form on mounting and destroy it on unmounting.
 * Exposes an onInputChange prop already filled with the form key
 * formOptions has the shape {
 * 		formKey: the form key
 * 	 	entityPathArray: an array of all the entity paths the form should listen to. An entity path is the path in the dataset to reach the entity
 *    	mapStateToProps: a function taking the redux state as an argument and returning the props that should be given to the form component
 *     	mapDispatchToProps:  a function taking the redux dispatch function as an argument and returning the props that should be given to the form component
 *     	loadAction: the entity load action. If provided, a 'load' function will be provided as a prop, automatically dispatching the loadAction output
 *     	saveAction: same as loadAction but with the save
 * }
 * Usage: const FormComponent = connect({formKey: 'movieForm', entityPathArray: ['movie']})(MyComponent);
 */
export const connect = formOptions => ComponentToConnect => {
    const {
        formKey,
        entityPathArray,
        mapStateToProps: userDefinedMapStateToProps = () => ({}),
        mapDispatchToProps: userDefinedMapDispatchToProps = () => ({}),
        loadAction,
        saveAction,
        nonValidatedFields
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
        ...internalMapDispatchToProps(dispatch, loadAction, saveAction, formKey, nonValidatedFields),
        ...userDefinedMapDispatchToProps(dispatch)
    });

    return connectToStore(entityPathArray, {
        mapStateToProps,
        mapDispatchToProps}
    )(extendedComponent);
}
