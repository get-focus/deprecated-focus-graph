import {CREATE_FORM} from '../actions/form';
import {syncFormEntity} from '../actions/form';
import get from 'lodash/get';
import map from 'lodash/map';

const formMiddleware = store => next => action => {
    if (action.type === CREATE_FORM) {
        const {dataset} = store.getState();
        const {entityPathArray, key: formKey} = action;
        const fields = entityPathArray.reduce((acc, entityPath) => ([
            ...acc,
            ...map(get(dataset, `${entityPath}.data`), (fieldValue, fieldName) => ({
                name: fieldName,
                entityPath,
                dataSetValue: fieldValue,
                loading: get(dataset, `${entityPath}.loading`)
            }))
        ]), []);
        return next({...action, fields});
    } else if (action.syncForm) {
        // The action requires the forms to sync themselves with the dataset, let's do it
        // Grab the new state, to have the updates on the dataset
        const newState = next(action);
        const {dataset} = store.getState();
        const entityPath = action.entityPath;
        const fields = map(get(dataset, `${entityPath}.data`), (fieldValue, fieldName) => ({
            name: fieldName,
            entityPath,
            dataSetValue: fieldValue,
            loading: get(dataset, `${entityPath}.loading`)
        }));
        store.dispatch(syncFormEntity(entityPath, fields));
        return newState;
    } else {
        return next(action);
    }
}

export default formMiddleware;
