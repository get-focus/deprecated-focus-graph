import {CREATE_FORM, DESTROY_FORM} from '../actions/form';

const form = (state = {}, {type, key, fields}) => {
    switch (type) {
        case CREATE_FORM:
            return {...state, [key]: {
                // TODO populate the form
                fields
            }};
        case DESTROY_FORM:
            const otherForms = {...state};
            otherForms.delete(key);
            return otherForms;
        default:
            return state;
    }
}

export default form;
