import {capitalize, toUpper} from 'lodash/string'
function buildLoadAction({name}){
  const REQUEST_ENTITY = `REQUEST_ENTITY_${name}`;
  const loadAction = (criteria, options) => ({type: REQUEST_ENTITY, payload: criteria});
  return {name: REQUEST_ENTITY, action: loadAction};
}
function buildReceiveAction({name}){
  const RECEIVE_ENTITY = `RECEIVE_ENTITY_${name}`;
}

const _baseActionCreator = (type, payload) => ({type, payload});

export const loadActionBuilder = (name, type='load', service) => {
  //Case transformation
  const UPPER_TYPE = toUpper(type);
  const UPPER_NAME = toUpper(name);
  const CAPITALIZE_TYPE = capitalize(type);
  const CAPITALIZE_NAME = capitalize(name);

  const constants =  {
    request: `REQUEST_${UPPER_TYPE}_${UPPER_NAME}`,
    receive: `RECEIVE_${UPPER_TYPE}_${UPPER_NAME}`,
    error: `ERROR_${UPPER_TYPE}_${UPPER_NAME}`
  }
  const creators = {
    request: {name: `request${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: (criteria) => _baseActionCreator(constants.request, criteria)},
    receive: {name: `receive${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: (json) => _baseActionCreator(constants.receive, json)},
    error: {name: `error${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: (err) => _baseActionCreator(constants.error, err)}
  }
  const action = ({id})=> {
    return async dispatch => {
      try{
        dispatch(creators.request.value({id}));
        const response = await fetch(`http://localhost:9999/x/entity/${id}`)
        const data = await response.json();
        dispatch(creators.receive.value(data));
      }
      catch(err){
        dispatch(creators.error.value(err));
      }
    }
  };
  /*
    Beginning of an optim way to write it but maybe less readable
    ['request', 'receive', 'error'].reduce((res, actionName)=>{
    res[constants[actionName]] =
    return res;
  }, {types:{}, creators:{}})
  */
  return {
    types: {
      [constants.request]: constants.request,
      [constants.receive]: constants.receive,
      [constants.error]: constants.error
    },
    creators: {
      [creators.request.name]: creators.request.value,
      [creators.receive.name]: creators.receive.value,
      [creators.error.name]: creators.error.value
    },
    action
  }
}
