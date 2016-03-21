import {CREATE_FORM, DESTROY_FORM, SYNC_FORM_ENTITY, INPUT_CHANGE} from '../actions/form';
import find from 'lodash/find';
import xorWith from 'lodash/xorWith';
import isUndefined from 'lodash/isUndefined';

const initializeField = field => ({
    valid: true,
    error: false,
    active: true,
    dirty: false,
    inputValue: field.dataSetValue,
    ...field
});

const findField = (fields, entityPath, name) => find(fields, {entityPath, name});
const getFieldsOutterJoin = (firstSource, secondSource) => xorWith(firstSource, secondSource, (a, b) => a.name === b.name && a.entityPath === b.entityPath);
const isNotAFieldFromForm = ({dirty}) => isUndefined(dirty);

const forms = (state = [], action) => {
    switch (action.type) {
        case CREATE_FORM:
            // When creating a form, simply initialize all the fields and pass it to the new form object
            return [...state, {
                key: action.key,
                entityPathArray: action.entityPathArray,
                // TODO populate the form
                fields: action.fields.map(initializeField)
            }];
        case DESTROY_FORM:
            return state.filter(({key: candidateKey}) => candidateKey !== action.key);
        case SYNC_FORM_ENTITY:
            // Iterate over all forms, and synchronise fields with the dataset
            return state.map(form => (form.entityPathArray.indexOf(action.entityPath) !== -1 ? {
                ...form,
                fields: [
                    ...form.fields.map(formField => ({
                        ...formField,
                        // Look into the action's fields to update, if it concerns the current field then merge it
                        ...findField(action.fields, action.entityPath, formField.name)
                    })),
                    // Get the outter intersection of the action fields and the form fields, meaning the
                    // fields to update that are not in the form, or the form fields that should not be updated
                    ...getFieldsOutterJoin(form.fields, action.fields)
                    // then filter it to remove the existing form fields, and create the missing fields
                    .filter(isNotAFieldFromForm)
                    .map(initializeField)
                ]
            } : form));
        case INPUT_CHANGE:
            // TODO : do a clean cut of the form array, to avoid form duplication
            // Check if the field to change exists
            const changedFieldExistsInForm = !isUndefined(find(find(state, {key: action.formKey}).fields, {name: action.fieldName, entityPath: action.entityPath}));
            if (!changedFieldExistsInForm) {
                // It does not exist, so create it
                return state.map(form => ({
                    ...form,
                    ...(form.key === action.formKey ? {
                        fields: [
                            // Keep the other fields
                            ...form.fields,
                            // Create the new one
                            {
                                name: action.fieldName,
                                entityPath: action.entityPath,
                                valid: true,
                                error: false,
                                active: true,
                                dirty: true,
                                inputValue: action.value
                            }
                        ]
                    } : {})
                }));
            } else {
                // The field exists, so just update the inputValue
                return state.map(form => ({
                    ...form,
                    ...(form.key === action.formKey ? {
                        fields: form.fields.map(field => ({
                            ...field,
                            // Test if it's the correct field, identified by the tuple (name, entityPath)
                            ...(field.name === action.fieldName && field.entityPath === action.entityPath ? {
                                inputValue: action.value
                            } : {})
                        }))
                    } : {})
                }));
            }
        default:
            return state;
    }
}

export default forms;
