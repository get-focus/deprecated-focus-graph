import {CREATE_FORM, DESTROY_FORM} from '../actions/form';

const form = (state = {}, {type, key}) => {
    switch (type) {
        case CREATE_FORM:
            return {...state, [key]: {
                // TODO populate the form
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
