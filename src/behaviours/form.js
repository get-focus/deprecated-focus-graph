// @flow
import React, {PureComponent, PropTypes} from 'react';
import {connect as connectToStore} from './store';
import {createForm, destroyForm, toggleFormEditing, validateForm, syncFormEntities, clearForm} from '../actions/form';
import {inputChange, inputBlur, inputBlurList, inputError} from '../actions/input';
import find from 'lodash/find';
import compose from 'lodash/flowRight';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import {bindActionCreators} from 'redux';

const validateFormOptions = ({formKey, entityPathArray}) => {
    if (!isString(formKey)) throw new Error('FormConnect: You must provide a "formKey" option as a string to the form connect.');
    if (!isArray(entityPathArray)) throw new Error('FormConnect: You must provide a "entityPathArray" option as an array to the form connect.');
}

function buildMapDispatchToProps (dispatch , formOptions) {
    const {formKey,entityPathArray,mapDispatchToProps: userDefinedMapDispatchToProps = () => ({}),loadAction,saveAction,nonValidatedFields} = formOptions;
    let mapDispatch;
    if(isObject(userDefinedMapDispatchToProps)){
        const userFunctionToDispatch = dispatch => bindActionCreators(userDefinedMapDispatchToProps, dispatch);
        mapDispatch = userFunctionToDispatch(dispatch)
    } else {
        mapDispatch = userDefinedMapDispatchToProps(dispatch)
    }
    return {
        ...internalMapDispatchToProps(dispatch, loadAction, saveAction, formKey, nonValidatedFields, entityPathArray),
        ...mapDispatch
    }
}

const internalMapStateToProps = (state, formKey) => {
    const formCandidate = find(state.forms, {formKey});
    const resultingProps = {...formCandidate};
    return resultingProps;
};

const internalMapDispatchToProps = (dispatch, loadAction, saveAction, formKey, nonValidatedFields,entityPathArray ) => {
    const resultingActions = {};
    if (loadAction) resultingActions.load = (...loadArgs) => dispatch(loadAction(...loadArgs, formKey));
    resultingActions.clear = (element) => dispatch(clearForm(formKey, element));
    if (saveAction) resultingActions.save = (...saveArgs) => dispatch(validateForm(formKey, nonValidatedFields, saveAction(...saveArgs, formKey)));
    return resultingActions;
};

/**
* Extends the provided component
* Creates and destroys the form, binds the inputChange methods to the current form key
* @param  {ReactComponent} ComponentToConnect  the component that will be extended
* @param  {object} formOptions                 the form options
* @return {ReactComponent}                     the extended component
*/
const getExtendedComponent = (ComponentToConnect: ReactClass<{}>, formOptions: FormOptions) => {
    class FormComponent extends PureComponent {
        constructor(props){
            super(props)
            this._onInputChange = this._onInputChange.bind(this);
            this._onInputBlurError = this._onInputBlurError.bind(this);
            this._onInputBlur = this._onInputBlur.bind(this);
            this._onInputBlurList = this._onInputBlurList.bind(this);
            this._toggleEdit = this._toggleEdit.bind(this);
        }

        componentWillReceiveProps({fields}) {
            if (!this.getUserInput && fields) {
                this.getUserInput = () => this.props.fields.reduce((entities, field) => ({...entities, [field.entityPath]: {...entities[field.entityPath], [field.name]: field.rawInputValue}}), {})
            }
        }

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

        _onInputChange(name, entityPath, value, propertyNameLine, index) {
            const {store: {dispatch}} = this.context;
            dispatch(inputChange(formOptions.formKey, name, entityPath, value, propertyNameLine, index));
        }
        _onInputBlurError(name, entityPath, error) {
            const {store: {dispatch}} = this.context;
            dispatch(inputError(formOptions.formKey, name, entityPath, error));
        }
        _onInputBlurList(name, entityPath, value, propertyNameLine, index){
            const {store: {dispatch}} = this.context;
            dispatch(inputBlurList(formOptions.formKey, name, entityPath, value, propertyNameLine, index));
        }

        _onInputBlur(name, entityPath, value) {
            const {store: {dispatch}} = this.context;
            dispatch(inputBlur(formOptions.formKey, name, entityPath, value));
        }

        _toggleEdit(edit) {
            const {store: {dispatch}} = this.context;
            if (!edit) {
                // Edit is set to false, this means the user cancelled the edition, so dispatch a syncFormEntities action
                dispatch(syncFormEntities(formOptions.formKey));
            }
            dispatch(toggleFormEditing(formOptions.formKey, edit));
        }

        render() {
            const {_behaviours, ...otherProps} = this.props;
            const {store: {dispatch}} = this.context;
            const behaviours = {connectedToForm: true, ..._behaviours};
            return <ComponentToConnect {...otherProps} _behaviours={behaviours}
                getUserInput={this.getUserInput}
                onInputChange={this._onInputChange}
                onInputBlurError={this._onInputBlurError}
                onInputBlur={this._onInputBlur}
                onInputBlurList={this._onInputBlurList}
                toggleEdit={this._toggleEdit}
                entityPathArray={formOptions.entityPathArray} />;
        }
    }
    // Extract the redux methods without a connector
    FormComponent.contextTypes = {
        store: PropTypes.shape({
            subscribe: PropTypes.func.isRequired,
            dispatch: PropTypes.func.isRequired,
            getState: PropTypes.func.isRequired
        })
    };
    return FormComponent;
};


// FormOptions will be used by the form connector
type FormOptions = {
    // the form key will be used to name the associated state node in the form.
    formKey: string,
    // an array of all the entity paths the form should listen to. An entity path is the path in the dataset to reach the entity
    entityPathArray:  Array<string>,
    // a function taking the redux state as an argument and returning the props that should be given to the form component
    mapStateToProps: Function,
    // a function taking the redux dispatch function as an argument and returning the props that should be given to the form component
    mapDispatchToProps: Function,
    // the entity load action. If provided, a 'load' function will be provided as a prop, automatically dispatching the loadAction output
    loadAction: Function,
    // same as loadAction but with the save
    saveAction: Function,
    // The array of fields you don't want to validate.
    nonValidatedFields: Array<string>
}

/**
* Form connector
* Wraps the provided component into a component that will create the form on mounting and destroy it on unmounting.
* Exposes an onInputChange prop already filled with the form key
* FormOptions is describe in the associated type
* Usage: const FormComponent = connect({formKey: 'movieForm', entityPathArray: ['movie']})(MyComponent);
*/




export const connect = (formOptions: FormOptions) => (ComponentToConnect: ReactClass<{}>) => {
    const {
        formKey,
        mapStateToProps: userDefinedMapStateToProps = () => ({}),
        mapDispatchToProps: userDefinedMapDispatchToProps = () => ({}),
        entityPathArray
    } = formOptions;

    // Validate the provided options

    validateFormOptions(formOptions);

    // Extend the component
    const extendedComponent = getExtendedComponent(ComponentToConnect, formOptions);

    const mapStateToProps : Function = state => ({
        ...internalMapStateToProps(state, formKey),
        ...userDefinedMapStateToProps(state)
    });

    const mapDispatchToProps : Function = (dispatch: Function) => (buildMapDispatchToProps(dispatch, formOptions));

    // Call the redux connector
    return connectToStore(entityPathArray, {
        mapStateToProps,
        mapDispatchToProps}
    )(extendedComponent);
}
