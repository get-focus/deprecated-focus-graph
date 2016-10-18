import {INPUT_CHANGE, INPUT_BLUR, INPUT_BLUR_LIST} from '../actions/input';
import {inputError, inputErrorList} from '../actions/input';
import {__fake_focus_core_validation_function__, filterNonValidatedFields, validateField, validateFieldArray, formatValue,getRedirectEntityPath} from './validations'
import {CREATE_FORM, VALIDATE_FORM, SYNC_FORMS_ENTITY, SYNC_FORM_ENTITIES} from '../actions/form';
import {setFormToSaving} from '../actions/form';
import {PENDING} from '../actions/entity-actions-builder';
import find from 'lodash/find';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isEmpty from 'lodash/isEmpty';
import mapKeys from 'lodash/mapKeys';
import isArray from 'lodash/isArray';
const FIELD_MIDDLEWARE = 'FIELD_MIDDLEWARE';

// Check the definitions givent the data.
export const _checkFieldDefinition = (fieldName: string, entityPath: string, definitions: object)=> {
  if(!definitions){
    return console.warn(`${FIELD_MIDDLEWARE}: You need to provide definitions.`)
  }
  if(!entityPath || !fieldName){
    return console.warn(`${FIELD_MIDDLEWARE}: You need an entityPath and a fieldName.`)
  }
  if(!get(definitions, `${entityPath}`)){
    return console.warn(`${FIELD_MIDDLEWARE}: your entityPath ${entityPath} is not in your definitions`, definitions);
  }
  if(!get(definitions, `${entityPath}.${fieldName}`)){
    return console.warn(`${FIELD_MIDDLEWARE}: your field ${fieldName} is not in the definitions of ${entityPath}, please check the data in your store. Maybe your server response is not what you think it is.`, definitions[entityPath]);
  }
}

export const _checkValueForList = (value,propertyName) => {
  if(!isArray(value) && value !== undefined){
    throw new Error(`${FIELD_MIDDLEWARE}: You must provide an array when calling listFor('${propertyName}') in the DEFAULT_DATA (reducer) or in the service`);
  }
}



const fieldMiddlewareBuilder = (translate = element => element) => {
  return  store => next => (action) => {
    if(!store || !store.getState){ throw new Error(`${FIELD_MIDDLEWARE}: Your middleware needs a redux store.`)}
      const {forms, definitions, domains} = store.getState();
      switch(action.type) {
          // Middleware post state processing
          case INPUT_BLUR:
              // On input blur action, validate the provided field
              validateField(definitions, domains, action.formKey, action.entityPath, action.fieldName, action.rawValue,  store.dispatch);
              break;
          case INPUT_BLUR_LIST:
              validateFieldArray(definitions, domains, action.formKey, action.entityPath, action.fieldName, action.rawValue, action.propertyNameLine, action.index,store.dispatch);
              break;
          // Middleware pre state processing
          case INPUT_CHANGE:
              next({
                  ...action,
                  formattedValue: formatValue(action.rawValue, action.entityPath, action.fieldName, definitions, domains)
              });
              break;
          case CREATE_FORM:
          case SYNC_FORM_ENTITIES:
          case SYNC_FORMS_ENTITY:
              next({
                  ...action,
                  fields: action.fields.map(field => {
                    _checkFieldDefinition(field.name, field.entityPath, definitions);
                    const redirectEntityPath = getRedirectEntityPath(field.dataSetValue, field.entityPath, field.name, definitions, domains);
                    let _redirectEntityPath= {};
                    if(redirectEntityPath){
                      _checkValueForList(field.dataSetValue, field.name)
                      _redirectEntityPath = {redirectEntityPath}
                    }
                    return {
                      ...field,
                      formattedInputValue: formatValue(field.dataSetValue, field.entityPath, field.name, definitions, domains),
                      label: translate(field.entityPath + "." + field.name),
                      ..._redirectEntityPath
                  }
                })
              });
              break;
          default:
              next(action);
              break;
      }
  }
}


export default fieldMiddlewareBuilder;
