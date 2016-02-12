
import {loadUserTypes} from '../actions/user-actions';
const {REQUEST_LOAD_USER, RECEIVE_LOAD_USER} = loadUserTypes;
const DEFAULT_STATE = {
    data:{
      firstName:'UserYolo'
    }
};
export default function userReducer(state = DEFAULT_STATE, {type, payload}){
 const {data} = state;
 switch (type) {
  case REQUEST_LOAD_USER:
      return {data, isLoading: true};
  case RECEIVE_LOAD_USER:
      return {data: payload, isLoading: false};
  default:
      return state
  }
}
