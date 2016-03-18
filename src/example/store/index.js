import builder from '../../store/builder';
import rootReducer from '../reducers';
import {INPUT_CHANGE} from '../../actions/form';

const lastNameMiddleware = store => next => action => {
    if (action.type === INPUT_CHANGE && action.fieldName == 'firstName') {
        const lastNameAction = {...action};
        lastNameAction.fieldName = 'lastName';
        lastNameAction.value = action.value.toUpperCase();
        next(action);
        store.dispatch(lastNameAction);
    } else {
        next(action);
    }
}

const store = builder(rootReducer, [lastNameMiddleware]);

export default store;
