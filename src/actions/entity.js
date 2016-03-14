import fetch from 'isomorphic-fetch';
console.log('actions');

//
// LOAD
//
export const REQUEST_LOAD_ENTITY = 'REQUEST_LOAD_ENTITY';
export const RECEIVE_LOAD_ENTITY = 'RECEIVE_LOAD_ENTITY';
export const ERROR_LOAD_ENTITY = 'ERROR_LOAD_ENTITY';

function requestLoadEntity({id}) {
    return {type: REQUEST_LOAD_ENTITY, payload: {id}};
}

function receiveLoadEntity(jsonEntity) {
    return {type: RECEIVE_LOAD_ENTITY, payload: jsonEntity};
}

function errorLoadEntity(error) {
    return {type: ERROR_LOAD_ENTITY, payload: error};
}

export function loadEntity({id}) {
    return async dispatch => {
      try{
        dispatch(requestLoadEntity({id}));
        const response = await fetch(`http://localhost:9999/x/entity/${id}`)
        const data = await response.json();
        dispatch(receiveLoadEntity(data));
    }
    catch(err) {
        dispatch(errorLoadEntity(err));
    }
  }
}


//
// SAVE
//

export const REQUEST_SAVE_ENTITY = 'REQUEST_SAVE_ENTITY';
export const RECEIVE_SAVE_ENTITY = 'RECEIVE_SAVE_ENTITY';
export const ERROR_SAVE_ENTITY = 'ERROR_SAVE_ENTITY';

function requestSaveEntity({id}) {
    return {type: REQUEST_SAVE_ENTITY, payload: {id}};
}

function receiveSaveEntity(jsonEntity) {
    return {type: RECEIVE_SAVE_ENTITY, payload: jsonEntity};
}

function errorSaveEntity(error) {
    return {type: ERROR_SAVE_ENTITY, payload: error};
}

export function saveEntity(id, entityJSON) {
    console.log('save', entityJSON);
    return async dispatch => {
      try{
        dispatch(requestSaveEntity({id}));
        const response = await fetch(
        `http://localhost:9999/x/entity/${id}`, {
            method: 'PUT',
            body: JSON.stringify(entityJSON),
            headers: new Headers({
		                        'Content-Type': 'application/json'
          })
        }
      );
        const data = await response.json();
        dispatch(receiveSaveEntity(data));
    }
    catch(err) {
        dispatch(errorSaveEntity(err));
    }
  }
}
