import {combineReducers} from 'redux';
import userReducer from './user-reducer';
import addressReducer from './address-reducers';

// export a root reducer
export default combineReducers({
    user: userReducer,
    address: addressReducer
});
