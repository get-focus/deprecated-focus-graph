
import {
  REQUEST_ENTITY,
  RECEIVE_ENTITY
} from '../actions';

export default function entityReducer(state = {}, {type, payload}){
 switch (type) {
  case REQUEST_ENTITY:
      return {...state, isLoading: true};
  case RECEIVE_ENTITY:
      return {...state, ...payload, isLoading: false};
  default:
      return state
  }
}
