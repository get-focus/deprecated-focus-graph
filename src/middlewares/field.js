import {INPUT_CHANGE, INPUT_BLUR} from '../actions/input';
import {inputError} from '../actions/input';
import {VALIDATE_FORM} from '../actions/form';
import {PENDING} from '../actions/entity-actions-builder';
import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isEmpty from 'lodash/isEmpty';

// THIS IS A MOCK FUNCTION THAT MUST BE REPLACED BY THE FOCUS CORE VALIDATION
// TODO : replace this with the focus core function
const __fake_focus_core_validation_function__ = (isRequired = false, validators = [], name, rawValue) => {
    const rand = Math.random();
    const isValid = rand > 5;
    const error = isRequired && (isUndefined(rawValue) || isNull(rawValue) || isEmpty(rawValue)) ? `${name} is required` : isValid ? false : 'Random error set by a fake function';
    return {
        name,
        value: rawValue,
        isValid,
        error
    }
}

const filterNonValidatedFields = (fields, nonValidatedFields) => fields.filter(({name, entityPath}) => nonValidatedFields.indexOf(`${entityPath}.${name}`) === -1);

/**
 * Validate a single field.
 * Returns true or false whether the field is valid or not.
 * Dispatches an INPUT_ERROR action if the field is invalid
 * @param  {object} definitions the application's definitions
 * @param  {object} domains     the application's domains
 * @param  {string} formKey     the form key
 * @param  {string} entityPath  the field entityPath
 * @param  {string} fieldName   the field name
 * @param  {object} value       the field value
 * @param  {function} dispatch  redux dispatch function
 * @return {boolean}            the field validation status
 */
const validateField = (definitions, domains, formKey, entityPath, fieldName, value, dispatch) => {
    const {isRequired, domain: domainName} = definitions[entityPath][fieldName];
    const domain = domains[domainName];
    const validationResult = __fake_focus_core_validation_function__(isRequired, domain.validators, fieldName, value);
    if (!validationResult.isValid) {
        dispatch(inputError(formKey, fieldName, entityPath, validationResult.error));
        return false;
    } else {
        return true;
    }
}

const fieldMiddleware = store => next => action => {
    const {forms, definitions, domains} = store.getState();
    if (action.type === INPUT_BLUR) {
        // On input blur action, validate the provided field
        validateField(definitions, domains, action.formKey, action.entityPath, action.fieldName, action.rawValue, store.dispatch);
    } else if (action.type === VALIDATE_FORM) {
        const {formKey, nonValidatedFields} = action;
        const {fields} = find(forms, {formKey});

        // Get the fields to validate
        const fieldsToValidate = filterNonValidatedFields(fields, nonValidatedFields);

        // Validate every field, and if one is invalid, then the form is invalid
        const formValid = fieldsToValidate.reduce((formValid, field) => {
            const fieldValid = validateField(definitions, domains, formKey, field.entityPath, field.name, field.rawInputValue, store.dispatch);
            if (!fieldValid) formValid = false;
        }, true);

        // If the form is valid, then dispatch the save action
        if (formValid) store.dispatch(action.saveAction);
    } else {
        next(action);
    }
}

export default fieldMiddleware;
