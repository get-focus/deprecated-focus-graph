import identity from 'lodash/identity';
import {INPUT_CHANGE, INPUT_BLUR, INPUT_BLUR_LIST,inputError, inputErrorList, inputChangeError} from '../actions/input';
import {CREATE_FORM, VALIDATE_FORM, SYNC_FORMS_ENTITY, SYNC_FORM_ENTITIES, setFormToSaving} from '../actions/form';
import {PENDING} from '../actions/entity-actions-builder';
import find from 'lodash/find';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isEmpty from 'lodash/isEmpty';
import mapKeys from 'lodash/mapKeys';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import omit from 'lodash/omit';
import map from 'lodash/map';
import validate from './validate';
/**
 * Default field formatter. Defaults to the identity function
 * @type {function}
 */
const defaultFormatter = identity;

const MIDDLEWARES_FIELD_VALIDATION = 'MIDDLEWARES_FIELD_VALIDATION';
const MIDDLEWARES_FORM_VALIDATION = 'MIDDLEWARES_FORM_VALIDATION';


// THIS IS A MOCK FUNCTION THAT MUST BE REPLACED BY THE FOCUS CORE VALIDATION
// TODO : replace this with the focus core function
export const __fake_focus_core_validation_function__ = (isRequired = false, validators = [], name, rawValue) => {

    const validationResult =  validate({name, value: rawValue}, validators);
    const isValid = validationResult.isValid;

    //const rand = Math.random();
    //const isValid = rand > 0.5;
    const error = isRequired && (isUndefined(rawValue) || isNull(rawValue) || (isString(rawValue) && isEmpty(rawValue) )) ? `${name} is required` : isValid ? false : validationResult.errors.join(' ');
    return {
        name,
        value: rawValue,
        isValid: !error,
        error
    }
}

// export const filterNonValidatedFields = (fields, nonValidatedFields = []) => {
//   if(!isArray(nonValidatedFields)){
//      throw new Error(`${MIDDLEWARES_FIELD_VALIDATION}: nonValidatedFields should be an array`, nonValidatedFields);
//   }
//   if(nonValidatedFields.length === 0) return fields;
//   return fields.reduce((finalFieldsToValidate, currentField) => {
//     const potentialCurrentFieldToValidate = nonValidatedFields.reduce( (field,nonValidateField, idx, tab) => {
//       const FIELD_FULL_PATH = `${currentField.entityPath}.${currentField.name}`;
//       // nonValidateField is a string we validate the field if the name doesn not match
//       if(isString(nonValidateField)){
//         if(!(FIELD_FULL_PATH === nonValidateField) && !tab.includes(FIELD_FULL_PATH)){
//           field = currentField;
//           return field
//         }
//       }
//       // nonValidateFields is an array we have to iterate through all its sub fields
//       const fieldlistToFilterName = Object.keys(nonValidateField)[0];
//       if(fieldlistToFilterName.includes(FIELD_FULL_PATH)){
//           if(!isArray(nonValidateField[FIELD_FULL_PATH])){
//             throw new Error(`${MIDDLEWARES_FIELD_VALIDATION} : You must provide an array when you want to have a non validate field for an element of the list : ${currentField.name}`)
//           }
//           const rawInputValueToValidate = currentField.rawInputValue.map((value) => {
//               return omit(value, nonValidateField[FIELD_FULL_PATH]);
//           });
//           if(rawInputValueToValidate.length > 0) field = {...currentField, rawInputValue: rawInputValueToValidate};
//           return field;
//       }
//     }, {});
//     return potentialCurrentFieldToValidate ? [...finalFieldsToValidate, potentialCurrentFieldToValidate] : finalFieldsToValidate;
//   }, []);
// }

export const filterNonValidatedFields = (fields, nonValidatedFields = []) => {
  if(!isArray(nonValidatedFields)){
     throw new Error(`${MIDDLEWARES_FIELD_VALIDATION}: nonValidatedFields should be an array`, nonValidatedFields);
  }
  if(nonValidatedFields.length === 0) return fields;
  return fields.reduce((finalFieldsToValidate, currentField) => {
    const potentialCurrentFieldToValidate = nonValidatedFields.reduce( (field,nonValidateField, idx, tab) => {
      const FIELD_FULL_PATH = `${currentField.entityPath}.${currentField.name}`;
      // nonValidateField is a string we validate the field if the name doesn not match
      if(isString(nonValidateField)){

        if(!tab.includes(FIELD_FULL_PATH)){
          field = currentField;
        }
      }
      // nonValidateFields is an array we have to iterate through all its sub fields
      const fieldlistToFilterName = Object.keys(nonValidateField)[0];
      if(fieldlistToFilterName.includes(FIELD_FULL_PATH)){
          if(!isArray(nonValidateField[FIELD_FULL_PATH])){
            throw new Error(`${MIDDLEWARES_FIELD_VALIDATION} : You must provide an array when you want to have a non validate field for an element of the list : ${currentField.name}`)
          }
          const rawInputValueToValidate = currentField.rawInputValue.map((value) => {
              return omit(value, nonValidateField[FIELD_FULL_PATH]);
          });
          if(rawInputValueToValidate.length > 0) {
            field = {...currentField, rawInputValue: rawInputValueToValidate}
            return field;
          }
      }
      return field
    }, undefined);
    return potentialCurrentFieldToValidate ? [...finalFieldsToValidate, potentialCurrentFieldToValidate] : finalFieldsToValidate;;
  }, []);
}


const _getRedirectDefinition = (redirect: Array, definitions: Object) => {
  if(!isArray(redirect)){
    throw new Error(`${MIDDLEWARES_FIELD_VALIDATION}: The redirect property must be an array`);
  }
  if(redirect.length > 1){
    console.warn(`${MIDDLEWARES_FIELD_VALIDATION}: This feature is not yet supported. It will be done soon.`)
  }
  const FAKE_REDIRECT_INDEX = 0;
  return get(definitions, `${redirect.length === 1 ? redirect[0]: redirect[FAKE_REDIRECT_INDEX]}`);
}


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
export const validateField = (definitions, domains , formKey, entityPath, fieldName, value, dispatch) => {
    // Redirect use to have the information of a list field
    const validationResult = validateGlobal(definitions, domains , formKey, entityPath, fieldName, value, dispatch);
    if (validationResult.isValid == false  ) {
        dispatch(inputError(formKey, fieldName, entityPath, validationResult.error || 'Required field'));
        return false;
    } else {
        return true;
    }
}


export const validateOnChangeField = (definitions, domains , formKey, entityPath, fieldName, value, dispatch)  => {
  const validationResult = validateGlobal(definitions, domains , formKey, entityPath, fieldName, value, dispatch);
  if (validationResult.isValid == false  ) {
      dispatch(inputChangeError(formKey, fieldName, entityPath));
      return false;
  } else {
      return true;
  }
}



export const validateGlobal = (definitions, domains , formKey, entityPath, fieldName, value, dispatch)=> {
  let {isRequired, domain: domainName, redirect} = get(definitions, `${entityPath}.${fieldName}`);
  let validationResult= {};
  if(isArray(value)){
    // If it is a list field it should redirect to a line entity definition.
    if(redirect){
      if(!isArray(redirect)){
        throw new Error(`${MIDDLEWARES_FIELD_VALIDATION}: your redirect property should be an array in the definition of ${entityPath}.${fieldName}.`)
      }
      //TODO: feature redirect array
      const redirectDefinition = _getRedirectDefinition(redirect, definitions);
      // The value is an array and we iterate over it.
      validationResult = {isValid : true};
      value.map((element, index) => {
        mapKeys(element, (value, propertyNameLine) => {
          const domain = domains[redirectDefinition[propertyNameLine].domain];
          const fieldValid = validateFieldForList(definitions, domain , propertyNameLine, formKey, value, dispatch,index, entityPath, fieldName );
          if(fieldValid === false){
            validationResult.isValid = false;
          }
        })
      })
    }else {
      throw new Error(`${MIDDLEWARES_FIELD_VALIDATION} : You must provide a "redirect" defintions to your list field : ${entityPath}.${fieldName}`)
    }

} else if(!isUndefined(value) && !isNull(value)){
    //TODO: Maybe it should be entityName + fieldName.
    const domain = domains[domainName];
    if(!domain){
      throw new Error(`${MIDDLEWARES_FIELD_VALIDATION}: Your field ${fieldName} in the entity ${entityPath} don't have a domain, you may have an array field which have a **redirect** property in it.`)
    }
    validationResult = __fake_focus_core_validation_function__(isRequired, domain.validators, fieldName, value);
  }else {
    validationResult = isRequired ? {isValid: false} : {isValid: true};
  }
  return validationResult
}



/**
 * Validate a one field in a list object
 * @param  {object} definitions the application's definitions
 * @param  {object} domain      the domain of the list field
 * @param  {string} propertyNameLine         the name in the line field
 * @param  {string} formKey     the form key
 * @param  {object} value       the field value
 * @param  {function} dispatch    redux dispatch function
 * @param  {number} index       the index of the list field in the list
 * @param  {string} entityPath  entityPath where is the list
 * @param  {string} fieldNameList   the name of the field List
 * @return {boolean}             the field validation status
 */
export const validateFieldForList = (definitions, domain, propertyNameLine, formKey, value, dispatch,index, entityPath, fieldNameList ) => {
//  if(value === 1) throw new Error(JSON.stringify({ domain, propertyNameLine, formKey, value, index, entityPath, fieldNameList}))
    let validationResult= {};
    const {isRequired} = get(definitions, `${entityPath}.${fieldNameList}`);
    validationResult = __fake_focus_core_validation_function__(isRequired, domain.validators, fieldNameList, value);
    //if(value === 1) throw new Error(JSON.stringify(validationResult));
    if (!validationResult.isValid ){
      dispatch(inputErrorList(formKey, fieldNameList , entityPath, validationResult.error, propertyNameLine , index));
      return false;
    } else {
      return true;
    }
}


/**
 * [description]
 * @param  {object} definitions      the application's definitions
 * @param  {[type]} domains          the application's domains
 * @param  {string} formKey          the form key
 * @param  {string} entityPath       entityPath where is the list
 * @param  {string} fieldNameList         the name of the field List
 * @param  {object} value            the field value
 * @param  {string} propertyNameLine the name in the line field
 * @param  {number} index            the index of the list field in the list
 * @param  {function} dispatch          redux dispatch function
 * @return {boolean}                  the field validation status
 */
export const validateFieldArray = (definitions, domains, formKey, entityPath, fieldNameList, value,propertyNameLine, index, dispatch ) => {
  let {isRequired, domain: domainName, redirect} = get(definitions, `${entityPath}.${fieldNameList}`);
  let validationResult= {};

  if(redirect){
    domainName = get(definitions, `${redirect}.${propertyNameLine}`).domain;
    const domain = domains[domainName];
    validationResult = __fake_focus_core_validation_function__(isRequired, domain.validators, propertyNameLine, value);
  }else {
    throw new Error(`${MIDDLEWARES_FIELD_VALIDATION} : You must provide a "redirect" defintions to your list field : ${fieldNameList}`)
  }

  if (!validationResult.isValid) {
      dispatch(inputErrorList(formKey, fieldNameList, entityPath, validationResult.error, propertyNameLine, index));
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
    const entityDefinition = get(definitions, `${entityPath}`) || {};
    const {domain: domainName = {} , redirect} = entityDefinition[fieldName] || {};
    if(redirect && isArray(value)){
      const redirectDefinition = _getRedirectDefinition(redirect, definitions);
      value = value.map((element, index)=>{
        const newElement ={};
        Object.keys(element).map((propertyNameLine)=> {
          const domain = domains[redirectDefinition[propertyNameLine].domain];
          const {formatter = defaultFormatter} = domain || {};
          newElement[propertyNameLine] = formatter(element[propertyNameLine]);
        })
        return newElement;
      })
      return value;
    }
    const {formatter = defaultFormatter} = domains[domainName] || {};
    return formatter(value);
};




export const getRedirectEntityPath = (value, entityPath, fieldName, definitions, domains) => {
  if(definitions && get(definitions, entityPath) && get(definitions, `${entityPath}.${fieldName}`) && get(definitions, `${entityPath}.${fieldName}`).redirect){
    return get(definitions, `${entityPath}.${fieldName}`).redirect;
  } return;
}
