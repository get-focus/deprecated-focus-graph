import {capitalize, toUpper} from 'lodash/string';
import {isFunction, isString} from 'lodash/lang';
const ACTION_BUILDER = 'ACTION_BUILDER';
const ALLOW_ACTION_TYPES = ['load', 'save', 'delete'];
const STRING_EMPTY = '';
// A simple function to create action creators
// Return a function which returns a type and a payload
// example:  _actionCreatorBuilder('REQUEST_LOAD_USER') will return `payload => {type: 'REQUEST_LOAD_USER', payload}`
const _actionCreatorBuilder = (type, name) => payload => payload ? {type, payload, entityPath: name, syncForm: true}: {type, entityPath: name, syncForm: true};

// A simple function to create async middleware dispatcher for redux
// You have to provide a object with the following properties
// {
//   service: A `Promise base service` which take one argument (the service entry data) an optional second the options
//   creators : {
//     response:{name, value} where value is the function standing for an action creator
//     request:{name, value} where value is the function standing for an action creator
//     error:{name, value} where value is the function standing for an action creator
//   }
// }
const _asyncActionCreator = ({service: promiseSvc, creators:{response: {value: responseActionCreator}, request: {value: requestActionCreator}, error: {value: errorActionCreator}}}) => (data => {
    return async dispatch => {
      try{
        dispatch(requestActionCreator(data));
        const svcValue = await promiseSvc(data)
        dispatch(responseActionCreator(svcValue));
    }
    catch(err) {
        dispatch(errorActionCreator(err));
    }
  }
});

// Validate the action builder parameters
const _validateActionBuilderParams = ({name, type, service}) => {
    if(!isString(name) || STRING_EMPTY === name) {
      throw new Error(`${ACTION_BUILDER}: the name parameter should be a string.`);
  }
    if(!isString(type) || ALLOW_ACTION_TYPES.indexOf(type) === -1) {
      throw new Error(`${ACTION_BUILDER}: the type parameter should be a string and the value one of these: ${ALLOW_ACTION_TYPES.join(',')}.`);
  }
    if(!isFunction(service)) {
      throw new Error(`${ACTION_BUILDER}: the service parameter should be a function.`);
  }
}

// Action builder is a simple way to create action types, action creator, and an async action
// It takes one object parameter
// ### doc
// ```javascript
// {
//   name, // The name of your data in the store (example user)
//   type, // Which type of action it is: load, save, delete, ...
//   service // an async action to load data
// }
// ```
//
// ### example
// ```javascript
// const loadAction = actionBuilder({name:'user', type:'load', service:loadUserSvc});
//```
//
// will produce
//
//```javascript
// export const loadUserTypes = loadAction.types;
// // which are the action types {REQUEST_LOAD_USER, RESPONSE_LOAD_USER}
// export const loadUserAction = loadAction.action;
// //which is a function taking the criteria as param
// ```
export const actionBuilder = ({name, type, service}) => {
    _validateActionBuilderParams({name, type, service});
  //Case transformation
    const UPPER_TYPE = toUpper(type);
    const UPPER_NAME = toUpper(name);
    const CAPITALIZE_TYPE = capitalize(type);
    const CAPITALIZE_NAME = capitalize(name);

    const constants = {
      request: `REQUEST_${UPPER_TYPE}_${UPPER_NAME}`,
      response: `RESPONSE_${UPPER_TYPE}_${UPPER_NAME}`,
      error: `ERROR_${UPPER_TYPE}_${UPPER_NAME}`
  }
    const creators = {
      request: {name: `request${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: _actionCreatorBuilder(constants.request, name)},
      response: {name: `response${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: _actionCreatorBuilder(constants.response, name)},
      error: {name: `error${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: _actionCreatorBuilder(constants.error, name)}
  }


    const action = _asyncActionCreator({service, creators});
    return {
      types: {
        [constants.request]: constants.request,
        [constants.response]: constants.response,
        [constants.error]: constants.error
    },
      creators: {
        [creators.request.name]: creators.request.value,
        [creators.response.name]: creators.response.value,
        [creators.error.name]: creators.error.value
    },
      action
  }
}

/*
Beginning of an optim way to write it but maybe less readable
['request', 'response', 'error'].reduce((res, actionName)=>{
//creates the type
res[types[actionName]] = `${toUpper(actionName)}_${UPPER_TYPE}_${UPPER_NAME}`;
//creates the action creators
res[creators[actionName]] = {
name: `${actionName}${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`,
value: payload => _actionCreatorBuilder(res[types[actionName]], payload)
};
return res;
}, {types:{}, creators:{}})
*/
