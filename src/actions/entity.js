import fetch from 'isomorphic-fetch';
console.log('actions');


export const REQUEST_ENTITY = 'REQUEST_ENTITY';
export const RECEIVE_ENTITY = 'RECEIVE_ENTITY';
export const ERROR_ENTITY = 'ERROR_ENTITY';

function requestEntity({id}){
  return {type: REQUEST_ENTITY, payload: {id}};
}

function receiveEntity(jsonEntity){
  return {type: RECEIVE_ENTITY, payload: jsonEntity};
}

function errorEntity(error){
  return {type: ERROR_ENTITY, payload: error};
}

export function fetchEntity({id}){
  return async dispatch => {
    try{
      dispatch(requestEntity({id}));
      const response = await fetch(`http://localhost:9999/x/entity/${id}`)
      const data = await response.json();
      dispatch(receiveEntity(data));
    }
    catch(err){
      dispatch(errorEntity(err));
    }
  }
}

export function saveEntity({id}){
  return async dispatch => {
    try{
      dispatch(requestEntity({id}));
      const response = await fetch(`http://localhost:9999/x/entity/${id}`)
      const data = await response.json();
      dispatch(receiveEntity(data));
    }
    catch(err){
      dispatch(errorEntity(err));
    }
  }
}
