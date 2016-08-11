import {reducerBuilder} from '../../reducers/reducer-builder';
import {loadUserTypes} from '../actions/user-actions';
import {saveUserTypes} from '../actions/user-actions';

//types to use
// question here is should loadUserTypes be more like {request, receive} instead of {REQUEST_LOAD_USER, RESPONSE_LOAD_USER}
// I prefer the things as they are now but I would like your opinion @BernardStanislas and @Tommass

// default data
const DEFAULT_DATA = {
    firstName:'UserYolo'
};

// Reducer for the user entity with a state modification on load and save.
const userReducer = reducerBuilder({
    name: 'USER.INFORMATION',
    loadTypes: loadUserTypes,
    saveTypes: saveUserTypes,
    defaultData: DEFAULT_DATA
});

export default userReducer;
