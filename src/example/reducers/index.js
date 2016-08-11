import {combineReducers} from 'redux';
import information from './user-reducer';
import addressReducer from './address-reducers';


const userReducer = combineReducers({
    information,
    address: addressReducer
});

// export a root reducer
export default combineReducers({
  user: userReducer
});
