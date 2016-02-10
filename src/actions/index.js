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
  return function middleWareFetchCall(dispatch){
    dispatch(requestEntity({id}));
    return fetch(`http://localhost:9999/x/entity/${id}`)
            .then(response => response.json())
            .then(json => dispatch(receiveEntity(json)))
            .catch(err => dispatch(errorEntity(err)));
  }
}
