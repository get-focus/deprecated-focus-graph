import {INPUT_CHANGE, INPUT_BLUR, INPUT_BLUR_LIST} from '../actions/input';
import {inputError, inputErrorList} from '../actions/input';
import {__fake_focus_core_validation_function__, filterNonValidatedFields, validateField, validateFieldArray, formatValue,getRedirectEntityPath} from './validations'
import {CREATE_FORM, VALIDATE_FORM, SYNC_FORMS_ENTITY, SYNC_FORM_ENTITIES} from '../actions/form';
import {setFormToSaving} from '../actions/form';
import {PENDING} from '../actions/entity-actions-builder';
import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isEmpty from 'lodash/isEmpty';
import mapKeys from 'lodash/mapKeys';
import isArray from 'lodash/lang';

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
                fields: action.fields.map(field => {
                  const redirectEntityPath = getRedirectEntityPath(field.dataSetValue, field.entityPath, field.name, definitions, domains);
                  const _rentityPath = redirectEntityPath ? {redirectEntityPath} : {};
                  return {
                    ...field,
                    formattedInputValue: formatValue(field.dataSetValue, field.entityPath, field.name, definitions, domains),
                    ...redirectEntityPath
                }
              })
            });
            break;
        default:
            next(action);
            break;
    }
}

export default fieldMiddleware;
