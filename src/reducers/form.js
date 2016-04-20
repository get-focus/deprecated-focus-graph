import {CREATE_FORM, DESTROY_FORM, SYNC_FORM_ENTITY, TOGGLE_FORM_EDITING} from '../actions/form';
import {INPUT_CHANGE, INPUT_ERROR} from '../actions/input';
import find from 'lodash/find';
import xorWith from 'lodash/xorWith';
import isUndefined from 'lodash/isUndefined';

const initializeField = field => ({
    valid: true,
    error: false,
    active: true,
    dirty: false,
    loading: false,
    saving: false,
    rawInputValue: field.dataSetValue,
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
                formKey: action.formKey,
                entityPathArray: action.entityPathArray,
                editing: false,
                loading: false,
                saving: false,
                fields: action.fields.map(initializeField)
            }];
        case DESTROY_FORM:
            return state.filter(({formKey: candidateKey}) => candidateKey !== action.formKey);
        case SYNC_FORM_ENTITY:
            // Iterate over all forms, and synchronise fields with the dataset
            return state.map(form => {
                if (form.entityPathArray.indexOf(action.entityPath) === -1) return form;
                const newForm = {
                    ...form,
                    fields: [
                        ...form.fields.map(formField => {
                            const candidateField = findField(action.fields, action.entityPath, formField.name);
                            if (!candidateField) return formField;
                            return {
                                ...formField,
                                ...candidateField,
                                dirty: false
                            };
                        }),
                        // Get the outter intersection of the action fields and the form fields, meaning the
                        // fields to update that are not in the form, or the form fields that should not be updated
                        ...getFieldsOutterJoin(form.fields, action.fields)
                        // then filter it to remove the existing form fields, and create the missing fields
                        .filter(isNotAFieldFromForm)
                        .map(initializeField)
                    ]
                };
                // Iterate over fiels to check if form is loading or saving
                newForm.loading = newForm.fields.reduce((acc, {loading}) => acc || loading, false);
                newForm.saving = newForm.fields.reduce((acc, {saving}) => acc || saving, false);
                return newForm;
            });
        case INPUT_CHANGE:
            // Check if the field to change exists
            const changedFieldExistsInForm = !isUndefined(find(find(state, {formKey: action.formKey}).fields, {name: action.fieldName, entityPath: action.entityPath}));
            if (!changedFieldExistsInForm) {
                // It does not exist, so create it
                return state.map(form => ({
                    ...form,
                    ...(form.formKey === action.formKey ? {
                        fields: [
                            // Keep the other fields
                            ...form.fields,
                            // Create the new one
                            {
                                name: action.fieldName,
                                entityPath: action.entityPath,
                                valid: true,
                                error: false,
                                loading: false,
                                saving: false,
                                active: true,
                                dirty: true,
                                rawInputValue: action.rawValue
                            }
                        ]
                    } : {})
                }));
            } else {
                // The field exists, so just update the rawInputValue
                return state.map(form => ({
                    ...form,
                    ...(form.formKey === action.formKey ? {
                        fields: form.fields.map(field => {
                            const isFieldConcerned = field.name === action.fieldName && field.entityPath === action.entityPath;
                            if (!isFieldConcerned) return field;
                            return {
                                ...field,
                                rawInputValue: action.rawValue,
                                dirty: true,
                                valid: true
                            };
                        })
                    } : {})
                }));
            }
        case INPUT_ERROR:
            return state.map(form => ({
                ...form,
                ...(form.formKey === action.formKey ? {
                    fields: form.fields.map(field => {
                        const isFieldConcerned = field.name === action.fieldName && field.entityPath === action.entityPath;
                        if (!isFieldConcerned) return field;
                        return {
                            ...field,
                            error: action.error,
                            valid: false
                        };
                    })
                } : {})
            }));
        case TOGGLE_FORM_EDITING:
            return state.map(form => {
                // Check if form is the action's target form
                if (form.formKey === action.formKey) {
                    return {
                        ...form,
                        editing: action.editing,
                        fields: action.editing ? form.fields : form.fields.map(({dataSetValue, ...otherAttributes}) => ({
                            ...otherAttributes,
                            rawInputValue: dataSetValue,
                            dataSetValue
                        }))
                    };
                } else {
                    return form;
                }
            });
        default:
            return state;
    }
}

export default forms;
