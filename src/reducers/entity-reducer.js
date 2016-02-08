
import {
  REQUEST_ENTITY,
  RECEIVE_ENTITY
} from '../actions';

export default function entityReducer(state = {entity:{}}, {type, payload}){
  const {entity: entityState, ...otherStateProp} = state;
 switch (type) {
  case REQUEST_ENTITY:
      return {
        ...otherStateProp,
        entity: {data: entityState.data, isLoading: true}
      };
  case RECEIVE_ENTITY:
      return {
        ...otherStateProp,
        entity: {data: payload, isLoading: false}
      };
  default:
      return state
  }
}
