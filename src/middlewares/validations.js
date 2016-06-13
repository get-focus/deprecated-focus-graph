import identity from 'lodash/identity';
import {INPUT_CHANGE, INPUT_BLUR, INPUT_BLUR_LIST} from '../actions/input';
import {inputError, inputErrorList} from '../actions/input';
import {CREATE_FORM, VALIDATE_FORM, SYNC_FORMS_ENTITY, SYNC_FORM_ENTITIES} from '../actions/form';
import {setFormToSaving} from '../actions/form';
import {PENDING} from '../actions/entity-actions-builder';
import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isEmpty from 'lodash/isEmpty';
import mapKeys from 'lodash/mapKeys';
import isArray from 'lodash/lang';
/**
 * Default field formatter. Defaults to the identity function
 * @type {function}
 */
const defaultFormatter = identity;


// THIS IS A MOCK FUNCTION THAT MUST BE REPLACED BY THE FOCUS CORE VALIDATION
// TODO : replace this with the focus core function
export const __fake_focus_core_validation_function__ = (isRequired = false, validators = [], name, rawValue) => {
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
export const filterNonValidatedFields = (fields, nonValidatedFields) => fields.filter(({name, entityPath}) => nonValidatedFields.indexOf(`${entityPath}.${name}`) === -1);

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
export const validateField = (definitions, domains, formKey, entityPath, fieldName, value, dispatch, isList, index, test, test2) => {
    let {isRequired, domain: domainName, redirect} = definitions[entityPath][fieldName];
    let validationResult= {};
    // Redirect use to have the information of a list field
    if(redirect){
      domainName = definitions[redirect]
      value.map((element, index)=>{
        mapKeys(element, (value, key) => {
          const fieldValid = validateFieldForList(definitions, domains[domainName[key].domain] , key, formKey, value, dispatch,index, entityPath, fieldName );
        })
      })
      validationResult = {isValid : true}
    }else {
      const domain = domains[domainName];
      validationResult = __fake_focus_core_validation_function__(isRequired, domain.validators, fieldName, value);
    }

    if (validationResult.isValid == false  ) {
        dispatch(inputError(formKey, fieldName, entityPath, validationResult.error));
        return false;
    } else {
        return true;
    }
}


export const validateFieldForList = (definitions, domain, key, formKey, value, dispatch,index, entityPath, fieldName ) => {
    let validationResult= {};
    let {isRequired} = definitions[entityPath][fieldName];
    validationResult = __fake_focus_core_validation_function__(isRequired, domain.validators, fieldName, value);
    if (!validationResult.isValid ){
      dispatch(inputErrorList(formKey, key, entityPath, validationResult.error, fieldName, index));
      return false;
    } else {
      return true;
    }
}



export const validateFieldArray = (definitions, domains, formKey, entityPath, fieldName, value,propertyNameLine, index, dispatch ) => {
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
 * Formats a value, based on its domain. Returns the formatted value
 * @param  {object} value         the value to format]
 * @param  {string} entityPath    the entityPath of the field related to this value
 * @param  {string} fieldName     the fieldName of the field related to this value
 * @param  {object} definitions   the defintions object
 * @param  {object} domains       the domains object
 * @return {object}               the formatted value
 */
export const formatValue = (value, entityPath, fieldName, definitions, domains) => {
    //To Do ajouter la cas ou la entityDefinition est en required ! Tableau ?
    const entityDefinition = definitions[entityPath] || {};
    const {domain: domainName = {}} = entityDefinition[fieldName] || {};
    const {formatter = defaultFormatter} = domains[domainName] || {};
    return formatter(value);
};

export const getRedirectEntityPath = (value, entityPath, fieldName, definitions, domains) => {
  if(definitions[entityPath][fieldName].redirect){
    return definitions[entityPath][fieldName].redirect;
  }else {
    return 'wait'
  }
}
