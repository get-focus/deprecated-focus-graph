import {capitalize, toUpper} from 'lodash/string';

// A simple function to create action creators
// Return a function which returns a type and a payload
// example:  _baseActionCreator('REQUEST_LOAD_USER') will return `payload => {type: 'REQUEST_LOAD_USER', payload}`
const _baseActionCreator = type => (payload => ({type, payload}));

// A simple function to create async middleware dispatcher for redux
// You have to provide a object with the following properties
// {
//   service: A `Promise base service` which take one argument (the service entry data) an optional second the options
//   creators : {
//     receive:{name, value} where value is the function standing for an action creator
//     request:{name, value} where value is the function standing for an action creator
//     error:{name, value} where value is the function standing for an action creator
//   }
// }
const _baseActionAsync = ({service: promiseSvc, creators:{receive: {value: receiveActionCreator}, request: {value: requestActionCreator}, error: {value: errorActionCreator}}}) => (data => {
  return async dispatch => {
    try{
      dispatch(requestActionCreator(data));
      const svcValue = await promiseSvc(data)
      dispatch(receiveActionCreator(svcValue));
    }
    catch(err){
      dispatch(errorActionCreator(err));
    }
  }
});

export const loadActionBuilder = ({name, type, service}) => {
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
    request: {name: `request${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: _baseActionCreator(constants.request)},
    receive: {name: `receive${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: _baseActionCreator(constants.receive)},
    error: {name: `error${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: _baseActionCreator(constants.error)}
  }


  const action = _baseActionAsync({service, creators});
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

/*
Beginning of an optim way to write it but maybe less readable
['request', 'receive', 'error'].reduce((res, actionName)=>{
//creates the type
res[types[actionName]] = `${toUpper(actionName)}_${UPPER_TYPE}_${UPPER_NAME}`;
//creates the action creators
res[creators[actionName]] = {
name: `${actionName}${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`,
value: payload => _baseActionCreator(res[types[actionName]], payload)
};
return res;
}, {types:{}, creators:{}})
*/
