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
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import omit from 'lodash/omit';

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
export const filterNonValidatedFields = (fields, nonValidatedFields) => {
  return fields.filter(({name, entityPath}) =>
    nonValidatedFields.indexOf(`${entityPath}.${name}`) === -1
  );
}


// export const filterNonValidatedInListField = (fields, nonValidatedFields) => {
//   console.log('yoyoyooyoyoyooyoyoyoyooyoy')
//   const yo =  fields.map( (obj) => {
//     obj.rawInputValue.map((jenpeuxplus) => {
//         nonValidatedFields
//     })
//       console.log(obj);
//       return obj;
//   })
//   console.log(yo);
//   return yo;
// }

export const filterNonValidatedInListField = (fields, nonValidatedFields) => {
  return fields.map( (obj) => {
       nonValidatedFields.map(element => {
        if(isString(element)) return;
        else {
          if(Object.keys(element)[0].includes(`${obj.entityPath}.${obj.name}`)){
            const test = element;
            obj.rawInputValue = obj.rawInputValue.map((value) => {

                return omit(value, test[`${obj.entityPath}.${obj.name}`]);

            })

          }
        }

      }, [])
      return obj;
  })
}

export const filterF = (fields, nonValidatedFields) => {
  return fields.reduce((finalFieldsToValidate, currentField) => {

    let potentialCurrentFieldToValidate;
    // todo: use a superb reduce
    nonValidatedFields.map(nonValidateField => {
      const FIELD_FULL_PATH = `${currentField.entityPath}.${currentField.name}`;
      // nonValidateField is a string we validate the field if the name doesn not match
      if(isString(nonValidateField)){
        if(!finalFieldsToValidate.includes(FIELD_FULL_PATH)){
          potentialCurrentFieldToValidate = currentField;
          return currentField;
        }
      //  console.log('yoooooooooooooooooooooooooooooooooooooooooooooooooooooo')
        return;
      }
      // nonValidateFields is an array we have to iterate through all its sub fields
      const fieldlistToFilterName = Object.keys(nonValidateField)[0];
      if(fieldlistToFilterName.includes(FIELD_FULL_PATH)){
          const rawInputValueToValidate = currentField.rawInputValue.map((value) => {
              return omit(value, nonValidateField[FIELD_FULL_PATH]);
          });
           rawInputValueToValidate.length > 0  && currentField ? (potentialCurrentFieldToValidate = {...currentField, rawInputValue: rawInputValueToValidate}) : undefined;
           return;
      }
    });
    /*  console.log('--------------------------------------');
    console.log(finalFieldsToValidate);
          console.log('--------------------------------------');*/
    return potentialCurrentFieldToValidate ? [...finalFieldsToValidate, potentialCurrentFieldToValidate] : finalFieldsToValidate;

  }, []);
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
export const validateField = (definitions, domains, formKey, entityPath, fieldName, value, dispatch) => {
    let {isRequired, domain: domainName, redirect} = definitions[entityPath][fieldName];
    let validationResult= {};
    // Redirect use to have the information of a list field
    if(isArray(value)){
      if(redirect){
        domainName = definitions[redirect]
        value.map((element, index)=>{
          mapKeys(element, (value, propertyNameLine) => {
            const domain = domains[domainName[propertyNameLine].domain];
            const fieldValid = validateFieldForList(definitions, domain , propertyNameLine, formKey, value, dispatch,index, entityPath, fieldName );
          })
        })
      }else {
        throw new Error(`${MIDDLEWARES_FIELD_VALIDATION} : You must provide a "redirect" defintions to your list field : ${fieldName}`)
      }

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
    let validationResult= {};
    let {isRequired} = definitions[entityPath][fieldNameList];
    validationResult = __fake_focus_core_validation_function__(isRequired, domain.validators, fieldNameList, value);
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
  let {isRequired, domain: domainName, redirect} = definitions[entityPath][fieldNameList];
  let validationResult= {};

  if(redirect){
    domainName = definitions[redirect][propertyNameLine].domain;
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
    const entityDefinition = definitions[entityPath] || {};
    const {domain: domainName = {}} = entityDefinition[fieldName] || {};
    const {formatter = defaultFormatter} = domains[domainName] || {};
    return formatter(value);
};




export const getRedirectEntityPath = (value, entityPath, fieldName, definitions, domains) => {
  if(definitions[entityPath][fieldName].redirect){
    return definitions[entityPath][fieldName].redirect;
  }else return;

}
