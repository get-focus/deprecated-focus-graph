import {CREATE_FORM, SYNC_FORM_ENTITIES, VALIDATE_FORM} from '../actions/form';
import {SUCCESS} from '../actions/entity-actions-builder';
import {__fake_focus_core_validation_function__, filterNonValidatedFields, validateField, validateFieldArray, formatValue} from './validations'
import {syncFormsEntity, toggleFormEditing, setFormToSaving, validateForm} from '../actions/form';
import get from 'lodash/get';
import map from 'lodash/map';
import find from 'lodash/find';
import xorWith from 'lodash/xorWith';
import reduce from 'lodash/reduce';

const FORM_MIDDLEWARE =  'FORM_MIDDLEWARE';
const formMiddleware = store => next => action => {

    if(!store || !store.getState){ throw new Error(`${FORM_MIDDLEWARE}: You middleware needs a redux store.`)}

    if(action.syncForm) {

        // The action requires the forms to sync themselves with the dataset, let's do it
        // Grab the new state, to have the updates on the dataset
        const newState = next(action);

        const {_meta: {status, saving, loading}} = action;

        // Get the updated dataset
        const {dataset, forms, definitions,domains} = store.getState();

        const entityPath = action.entityPath;
        const fieldsOnlyInDefinitions = reduce(get(definitions, `${entityPath}`), (acc, value, key) => {
          if(!get(dataset, `${entityPath}.data`, {})[key]) acc.push({
            name: key,
            entityPath: entityPath,
            dataSetValue: undefined,
            isRequired: value.isRequired,
            loading: false,
            saving : saving,
            valid:true,
            rawValid: true
          })
          return acc
        }, [])

        // Read the fields in the dataset at the entityPath location, and build a minimum field object that will be merged with the form fields
        const fields = map(get(dataset, `${entityPath}.data`), (fieldValue, fieldName) => {
            const field = {
                name: fieldName,
                entityPath,
                dataSetValue: fieldValue,
                loading: get(dataset, `${entityPath}.loading`) ,
                valid:true,
                rawValid: true,
                saving: get(dataset, `${entityPath}.saving`)
            };
            // If action was a success, then replace the rawInputValue
            if (status === SUCCESS) field.rawInputValue = fieldValue;
            return field;
        });
        // Dispatch the SYNC_FORMS_ENTITY action
        store.dispatch(syncFormsEntity(entityPath, [...fieldsOnlyInDefinitions,...fields ]));

        // Treat the _meta
        if (saving && status === SUCCESS) {
            // Get the target form key by looking for forms in a saving state and containing the concerned entity path
            const formKey = forms.reduce((acc, form) => (form.saving && form.entityPathArray.indexOf(action.entityPath) !== -1) ? form.formKey : acc, null);
            // Toggle the form back to consulting since the save was a success #YOLO
            store.dispatch(toggleFormEditing(formKey, false));
        }

        // Continue with the rest of the redux flow
        return newState;
    }else {
      if(store === null){
        throw new Error('Store not defined')
      }
      const {dataset, forms, definitions, domains} = store.getState();
      const {formKey, nonValidatedFields,entityPathArray } = action;
      switch(action.type) {
          // The creation's action is also in the middleware for the formated value
          case CREATE_FORM:
            const fields = entityPathArray.reduce((acc, entityPath) => ([
                ...acc,
                ...map(get(dataset, `${entityPath}.data`), (fieldValue, fieldName) => ({
                    name: fieldName,
                    entityPath,
                    dataSetValue: fieldValue,
                    rawInputValue: fieldValue,
                    loading: get(dataset, `${entityPath}.loading`) || false ,
                    saving: get(dataset, `${entityPath}.saving`) || false
                }))
            ]), []);
            return next({...action, fields});
              break;
          case VALIDATE_FORM:
              const {fields : fieldCreated} = find(forms, {formKey});
              // Get the fields to validate
              const fieldsToValidate = filterNonValidatedFields(fieldCreated, nonValidatedFields);
              // Validate every field, and if one is invalid, then the form is invalid
              const formValid = fieldsToValidate.reduce((formValid, field) => {
                  const fieldValid = validateField(definitions, domains, formKey, field.entityPath, field.name, field.rawInputValue, store.dispatch);
                  if (!fieldValid) formValid = false;
                  return formValid;
              }, true);
              // If the form is valid, then dispatch the save action
              if (formValid) {
                  store.dispatch(setFormToSaving(formKey));
                  store.dispatch(action.saveAction);
              }
              break;
          case SYNC_FORM_ENTITIES:
            const form = find(forms, {formKey: action.formKey});
            action.fields = form.fields.map(field => ({
                ...field,
                rawInputValue: field.dataSetValue
            }));
            next(action);
          default:
            next(action);
            break;
        }
    }
}

export default formMiddleware;
