import {INPUT_BLUR} from '../actions/input';
import {inputError} from '../actions/input';

// THIS IS A MOCK FUNCTION THAT MUST BE REPLACED BY THE FOCUS CORE VALIDATION
// TODO : replace this with the focus core function
const __fake_focus_core_validation_function__ = (validators = [], name, value) => {
    const rand = Math.random();
    const isValid = rand > 5;
    const error = isValid ? false : 'Random error set by a fake function';
    return {
        name,
        value,
        isValid,
        error
    }
}

const validateField = (validators, name, value) => {
    const validationResult = __fake_focus_core_validation_function__(validators, name, value);
    return validationResult;
}

const fieldMiddleware = store => next => action => {
    if (action.type === INPUT_BLUR) {
        const {definitions, domains} = store.getState();
        const {isRequired, domain: domainName} = definitions[action.entityPath][action.fieldName];
        const domain = domains[domainName];
        const validationResult = validateField(domain.validators, action.fieldName, action.value);
        if (!validationResult.isValid) {
            store.dispatch(inputError(action.formKey, action.fieldName, action.entityPath, validationResult.error));
        }
    } else {
        next(action);
    }
}

export default fieldMiddleware;
