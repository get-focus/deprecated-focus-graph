import {INPUT_CHANGE, INPUT_BLUR, INPUT_BLUR_LIST} from '../actions/input';
import {inputError, inputErrorList} from '../actions/input';
import {CREATE_FORM, VALIDATE_FORM, SYNC_FORMS_ENTITY, SYNC_FORM_ENTITIES} from '../actions/form';
import {setFormToSaving} from '../actions/form';
import {PENDING} from '../actions/entity-actions-builder';
import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isEmpty from 'lodash/isEmpty';
import identity from 'lodash/identity';
import mapKeys from 'lodash/mapKeys';
import isArray from 'lodash/lang';

// THIS IS A MOCK FUNCTION THAT MUST BE REPLACED BY THE FOCUS CORE VALIDATION
// TODO : replace this with the focus core function
const __fake_focus_core_validation_function__ = (isRequired = false, validators = [], name, rawValue) => {
    const rand = Math.random();
    const isValid = rand > 0.5;
    const error = isRequired && (isUndefined(rawValue) || isNull(rawValue) || isEmpty(rawValue)) ? `${name} is required` : isValid ? false : 'Random error set by a fake function';
    return {
        name,
        value: rawValue,
        isValid: !error,
        error
    }
}

/**
 * Filter fields that must not be validated.
 * This uses the option nonValidatedFields set by the user in the form configuration.
 * @param  {array} fields             all form fields
 * @param  {array} nonValidatedFields list of paths of fields that must not be validated
 * @return {array}                    array of fields that should be validated
 */
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
const validateField = (definitions, domains, formKey, entityPath, fieldName, value, dispatch, isList, index, test, test2) => {
    let {isRequired, domain: domainName, redirect} = definitions[entityPath][fieldName];
    let validationResult= {};
    // Redirect use to have the information of a list field
    if(redirect){
      domainName = definitions[redirect]
      const domain = domains[domainName];

      value.map((element, index)=>{
        mapKeys(element, (value, key) => {
          const fieldValid = validateField(definitions, domains, formKey, redirect, key, value, dispatch, true, index, entityPath, fieldName );
        })
      })
      validationResult = {isValid : true}
    }else {
      const domain = domains[domainName];
      validationResult = __fake_focus_core_validation_function__(isRequired, domain.validators, fieldName, value);
    }

    if (validationResult.isValid == false  && !isList) {
        dispatch(inputError(formKey, fieldName, entityPath, validationResult.error));
        return false;
    } else if (!validationResult.isValid && isList){
      dispatch(inputErrorList(formKey, test2, test, validationResult.error, fieldName, index));
      return false;
    } else {
        return true;
    }
}

const validateFieldArray = (definitions, domains, formKey, entityPath, fieldName, value,propertyNameLine, index, dispatch ) => {
  let {isRequired, domain: domainName, redirect} = definitions[entityPath][fieldName];
  let validationResult= {};

  if(redirect){
    domainName = definitions[redirect][propertyNameLine].domain;
    const domain = domains[domainName];
    //To do map
    validationResult = __fake_focus_core_validation_function__(isRequired, domain.validators, propertyNameLine, value);
  }

  if (!validationResult.isValid) {
      dispatch(inputErrorList(formKey, fieldName, entityPath, validationResult.error, propertyNameLine, index));
      return false;
  } else {
      return true;
  }
}

/**
 * Default field formatter. Defaults to the identity function
 * @type {function}
 */
const defaultFormatter = identity;

/**
 * Formats a value, based on its domain. Returns the formatted value
 * @param  {object} value         the value to format]
 * @param  {string} entityPath    the entityPath of the field related to this value
 * @param  {string} fieldName     the fieldName of the field related to this value
 * @param  {object} definitions   the defintions object
 * @param  {object} domains       the domains object
 * @return {object}               the formatted value
 */
const formatValue = (value, entityPath, fieldName, definitions, domains) => {
    //To Do ajouter la cas ou la entityDefinition est en required ! Tableau ?
    const entityDefinition = definitions[entityPath] || {};
    const {domain: domainName = {}} = entityDefinition[fieldName] || {};
    const {formatter = defaultFormatter} = domains[domainName] || {};
    return formatter(value);
};

const getRedirectEntityPath = (value, entityPath, fieldName, definitions, domains) => {
  if(definitions[entityPath][fieldName].redirect){
    return definitions[entityPath][fieldName].redirect;
  }else {
    return 'wait'
  }
}

const fieldMiddleware = store => next => action => {
    const {forms, definitions, domains} = store.getState();
    switch(action.type) {
        case INPUT_BLUR:
            // On input blur action, validate the provided field
            validateField(definitions, domains, action.formKey, action.entityPath, action.fieldName, action.rawValue,  store.dispatch);
            break;
        case INPUT_BLUR_LIST:
            validateFieldArray(definitions, domains, action.formKey, action.entityPath, action.fieldName, action.rawValue, action.propertyNameLine, action.index,store.dispatch);
            break;

        case VALIDATE_FORM:
            const {formKey, nonValidatedFields} = action;
            const {fields} = find(forms, {formKey});

            // Get the fields to validate
            const fieldsToValidate = filterNonValidatedFields(fields, nonValidatedFields);

            // Validate every field, and if one is invalid, then the form is invalid
            const formValid = fieldsToValidate.reduce((formValid, field) => {
                console.log(field)
                const fieldValid = validateField(definitions, domains, formKey, field.entityPath, field.name, field.rawInputValue, store.dispatch);
                if (!fieldValid) formValid = false;
                return fieldValid;
            }, true);

            // If the form is valid, then dispatch the save action
            if (formValid) {
                store.dispatch(setFormToSaving(formKey));
                store.dispatch(action.saveAction);
            }
            break;
        case INPUT_CHANGE:
            next({
                ...action,
                formattedValue: formatValue(action.rawValue, action.entityPath, action.fieldName, definitions, domains),
                redirectEntityPath : 'child'
            });
            break;
        case SYNC_FORM_ENTITIES:
        case SYNC_FORMS_ENTITY:
        case CREATE_FORM:
            next({
                ...action,
                fields: action.fields.map(field => ({
                    ...field,
                    formattedInputValue: formatValue(field.dataSetValue, field.entityPath, field.name, definitions, domains),
                    redirectEntityPath : getRedirectEntityPath(field.dataSetValue, field.entityPath, field.name, definitions, domains)
                }))
            });
            break;
        default:
            next(action);
            break;
    }
}

export default fieldMiddleware;
