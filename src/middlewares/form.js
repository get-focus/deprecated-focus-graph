import {CREATE_FORM} from '../actions/form';
import {SUCCESS} from '../actions/entity-actions-builder';
import {syncFormsEntity, toggleFormEditing} from '../actions/form';
import get from 'lodash/get';
import map from 'lodash/map';

const formMiddleware = store => next => action => {
    if (action.type === CREATE_FORM) {
        const {dataset} = store.getState();
        const {entityPathArray, formKey} = action;
        const fields = entityPathArray.reduce((acc, entityPath) => ([
            ...acc,
            ...map(get(dataset, `${entityPath}.data`), (fieldValue, fieldName) => ({
                name: fieldName,
                entityPath,
                dataSetValue: fieldValue,
                rawInputValue: fieldValue,
                loading: get(dataset, `${entityPath}.loading`),
                saving: get(dataset, `${entityPath}.saving`)
            }))
        ]), []);
        return next({...action, fields});
    } else if (action.syncForm) {
        // The action requires the forms to sync themselves with the dataset, let's do it
        // Grab the new state, to have the updates on the dataset
        const newState = next(action);

        const {_meta: {status, saving}} = action;

        // Get the updated dataset
        const {dataset, forms} = store.getState();
        const entityPath = action.entityPath;
        // Read the fields in the dataset at the entityPath location, and build a minimum field object that will be merged with the form fields
        const fields = map(get(dataset, `${entityPath}.data`), (fieldValue, fieldName) => {
            const field = {
                name: fieldName,
                entityPath,
                dataSetValue: fieldValue,
                loading: get(dataset, `${entityPath}.loading`),
                saving: get(dataset, `${entityPath}.saving`)
            };
            // If action was a success, then replace the rawInputValue
            if (status === SUCCESS) field.rawInputValue = fieldValue;
            return field;
        });
        // Dispatch the SYNC_FORMS_ENTITY action
        store.dispatch(syncFormsEntity(entityPath, fields));

        // Treat the _meta
        if (saving && status === SUCCESS) {
            // Get the target form key by looking for forms in a saving state and containing the concerned entity path
            const formKey = forms.reduce((acc, form) => (form.saving && form.entityPathArray.indexOf(action.entityPath) !== -1) ? form.formKey : acc, null);
            // Toggle the form back to consulting since the save was a success #YOLO
            store.dispatch(toggleFormEditing(formKey, false));
        }

        // Continue with the rest of the redux flow
        return newState;
    } else {
        return next(action);
    }
}

export default formMiddleware;
