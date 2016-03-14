import {reducerBuilder} from './reducer-builder';
import {loadUserTypes} from '../actions/user-actions';

//types to use
// question here is should loadUserTypes be more like {request, receive} instead of {REQUEST_LOAD_USER, RECEIVE_LOAD_USER}
// I prefer the things as they are now but I would like your opinion @BernardStanislas and @Tommass
const {REQUEST_LOAD_USER, RECEIVE_LOAD_USER} = loadUserTypes;
const REQUEST_SAVE_USER= 'requestSaveUser', RECEIVE_SAVE_USER = 'receiveSaveUser';// temp


// default state
const DEFAULT_STATE = {
    data:{
        firstName:'UserYolo'
    }
};

// Reducer for the user entity with a state modification on load and save.
const userReducer = reducerBuilder({
    types: {
      load: {request: REQUEST_LOAD_USER, receive: RECEIVE_LOAD_USER},
      save: {request: REQUEST_SAVE_USER, receive: RECEIVE_SAVE_USER}
  },
    defaultState: DEFAULT_STATE
});

export default userReducer;
