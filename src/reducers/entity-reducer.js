
import {
  REQUEST_LOAD_ENTITY,
  RECEIVE_LOAD_ENTITY,
  ERROR_LOAD_ENTITY
} from '../actions/entity';
const DEFAULT_STATE = {
  entity:{
    data:{
      firstName:'Yolo'
    }
  }
};
export default function entityReducer(state = DEFAULT_STATE, {type, payload}){
const {entity: entityState, ...otherStateProp} = state;
 switch (type) {
  case REQUEST_LOAD_ENTITY:
      return {
        ...otherStateProp,
        entity: {data: entityState.data, isLoading: true}
      };
  case RECEIVE_LOAD_ENTITY:
      return {
        ...otherStateProp,
        entity: {data: payload, isLoading: false}
      };
  default:
      return state
  }
}
