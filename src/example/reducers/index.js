import {combineReducers} from 'redux';
import userReducer from './user-reducer';

// export a root reducer
export default combineReducers({
    user: userReducer
});
