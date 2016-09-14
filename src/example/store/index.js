import builder from '../../store/create-store';
import rootReducer from '../reducers';
import {INPUT_CHANGE} from '../../actions/input';
import DevTools from '../containers/dev-tools';

const lastNameMiddleware = store => next => action => {
    if (action.type === INPUT_CHANGE && action.fieldName == 'firstName') {
        const lastNameAction = {...action};
        lastNameAction.fieldName = 'lastName';
        lastNameAction.rawValue = action.rawValue.toUpperCase();
        next(action);
        store.dispatch(lastNameAction);
    } else {
        next(action);
    }
}

export const ownActiondMiddleware = store => next => action => {
     if (action.type === INPUT_CHANGE && action.fieldName == 'uuid') {
         const customAction = {};
         customAction.type = 'CLEAR_FORM';
         customAction.formKey = action.formKey;
         next(action);
         store.dispatch(customAction);
     } else {
         next(action);
     }
 }


const store = builder({dataset: rootReducer}, [], [DevTools.instrument()]);

export default store;
