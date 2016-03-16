import {CREATE_FORM, DESTROY_FORM, SYNC_FORM_ENTITY} from '../actions/form';
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

const form = (state = [], action) => {
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
            return state.map(form => ({
                ...form,
                ...(form.entityPathArray.indexOf(action.entityPath) !== -1 ? {
                    fields: [
                        ...form.fields.map(formField => ({
                            ...formField,
                            ...find(action.fields, {entityPath: action.entityPath, name: formField.name})
                        })),
                        ...xorWith(form.fields, action.fields, (a, b) => a.name === b.name && a.entityPath === b.entityPath)
                        .filter(({dirty}) => isUndefined(dirty))
                        .map(initializeField)
                    ]
                } : {})
            }));
        default:
            return state;
    }
}

export default form;
