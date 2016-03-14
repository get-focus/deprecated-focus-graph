console.log('reducers');
import { combineReducers } from 'redux';
import entityReducer from './entity-reducer';
import userReducer from './user-reducer';

// export a root reducer
export default combineReducers({
    entity: entityReducer,
    user: userReducer
});
