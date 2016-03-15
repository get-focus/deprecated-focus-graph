import {CREATE_FORM} from '../actions/form';
import get from 'lodash/get';

const formMiddleware = store => next => action => {
    if (action.type === CREATE_FORM) {
        const {dataset} = store.getState();
        const {entityPathArray, key: formKey} = action;
        const fields = entityPathArray.reduce((acc, entityPath) => ({...acc, [entityPath]: get(dataset, entityPath)}), {});
        return next({...action, fields});
    } else if (action.impactForm) {
        const {forms} = store.getState();
        return next(action);
    } else {
        return next(action);
    }
}

export default formMiddleware;
