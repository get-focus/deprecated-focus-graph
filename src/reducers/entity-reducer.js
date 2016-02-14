
import {
  REQUEST_LOAD_ENTITY,
  RECEIVE_LOAD_ENTITY,
  ERROR_LOAD_ENTITY,
  REQUEST_SAVE_ENTITY,
  RECEIVE_SAVE_ENTITY,
  ERROR_SAVE_ENTITY
} from '../actions/entity';
const DEFAULT_STATE = {
    data:{
      firstName:'Yolo'
    }
};
export default function entityReducer(state = DEFAULT_STATE, {type, payload}){
 const {data} = state;
 switch (type) {
  case REQUEST_LOAD_ENTITY:
  case REQUEST_SAVE_ENTITY:
      return {data, isLoading: true};
  case RECEIVE_LOAD_ENTITY:
  case RECEIVE_SAVE_ENTITY:
      return {data: payload, isLoading: false};
  default:
      return state
  }
}
