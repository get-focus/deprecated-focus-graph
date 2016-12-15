import {capitalize, toUpper} from 'lodash/string';
import {isArray, isFunction,isString} from 'lodash/lang';
import i18n from 'i18next';

let msgId = 0;

function _getMessageId(){
  msgId++;
  return `msgId_${msgId}`;
}

const ACTION_BUILDER = 'ACTION_BUILDER';
const ALLOW_ACTION_TYPES = ['load', 'save', 'delete', 'error'];
const STRING_EMPTY = '';
const LOAD = ALLOW_ACTION_TYPES[0];
const SAVE = ALLOW_ACTION_TYPES[1];

export const PENDING = 'PENDING';
export const SUCCESS = 'SUCCESS';
export const ERROR = 'ERROR';

// A simple function to create action creators
// Return a function which returns a type and a payload
// example:  _actionCreatorBuilder('REQUEST_LOAD_USER') will return `payload => {type: 'REQUEST_LOAD_USER', payload}`
const _actionCreatorBuilder = (type, name, _meta, syncTypeForm) => (payload, formKey) => ({...{type, entityPath: name, syncTypeForm, _meta}, ...(payload ? {payload} : {}), formKey});
// A simple function to create async middleware dispatcher for redux
// You have to provide a object with the following properties
// {
//   service: A `Promise base service` which take one argument (the service entry data) an optional second the options
//   actionCreatorsArray : [{
//     name: the name of the concerned node.
//     request: the function standing for an action creator of request
//     response: the function standing for an action creator of response
//     error: the function standing for an action creator of error
//   }]
// }
const _asyncActionCreator = ({service: promiseSvc, actionCreatorsArray,type,  message}) => ((data, formKey) => {
    return async dispatch => {
        try {
            actionCreatorsArray.forEach(({name, request: requestActionCreator}) => dispatch(requestActionCreator(data, formKey)));
            const svcValue = await promiseSvc(data);
            actionCreatorsArray.forEach(({name, response: responseActionCreator, error:errorActionCreator}) => {
                // When there is only one node the complete payload is dispatched.
                if(actionCreatorsArray.length === 1 && svcValue['status'] !== 'ERROR'){
                  dispatch(responseActionCreator(svcValue,formKey));
                  if(type === 'save'){
                    dispatch({
                      type: 'PUSH_MESSAGE',
                      message : {
                        content: message ? message : name+'.fields.saved',
                        id: _getMessageId(),
                        type: 'success'
                      }})
                  }
                } else if (actionCreatorsArray.length !== 1 && svcValue['status'] !== 'ERROR') {
                  // Whene there is more node only a part of the payload is dispathed.
                  // TODO: a bit ugly but with the convention on name it should work.
                  const splitName = name.split('.');
                  const lastNamePart = splitName[splitName.length - 1];
                  const responsePartFromName = svcValue[lastNamePart];
                  if(responsePartFromName){

                    dispatch(responseActionCreator(responsePartFromName,formKey));

                    if(type === 'save'){
                      dispatch({
                        type: 'PUSH_MESSAGE',
                        message : {
                          content: message ? message : name+'.fields.saved',
                          id: _getMessageId(),
                          type: 'success'

                        }})
                    }
                  } else {
                    throw new Error(
                      `ACTION_BUILDER: Your response does not contain the property ${lastNamePart} extracted from the action name ${name} you provided to the builder`,
                      svcValue
                    );
                  }
                }else {
                  svcValue['globalErrors'].map(element => {
                    return dispatch({
                      type: 'PUSH_MESSAGE', message : {
                        content: i18n ? i18n.t(element) : element,
                        id: _getMessageId(),
                        type: 'error'
                      }
                    })
                  })
                    console.log(formKey)
                    dispatch(errorActionCreator(svcValue, formKey))
                }
              });

        } catch(err) {
            // maybe this shoud be formated the same way the payload is.
            actionCreatorsArray.forEach(({name, error:errorActionCreator}) => dispatch(errorActionCreator(err)));
        }
    }
});

// Validate the action builder parameters
const _validateActionBuilderParams = ({names, type, service}) => {
    if(!isArray(names) || names.length === 0) {
        throw new Error(`${ACTION_BUILDER}: the names parameter should be a non empty array.`);
    }

    names.forEach( (name) => {
      if(!isString(name) || STRING_EMPTY === name) {
        throw new Error(`${ACTION_BUILDER}: the names parameter should be made of strings.`);
      }
    });

    if(!isString(type) || ALLOW_ACTION_TYPES.indexOf(type) === -1) {
        throw new Error(`${ACTION_BUILDER}: the type parameter should be a string and the value one of these: ${ALLOW_ACTION_TYPES.join(',')}.`);
    }
    if(!isFunction(service)) {
        throw new Error(`${ACTION_BUILDER}: the service parameter should be a function.`);
    }
}

type ActionBuilderConfig = {
  name: string,
  type: string,
  service: Function
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
export const actionBuilder = ({names, type, service, message}) => {
    _validateActionBuilderParams({names, type, service});
    //Case transformation
    const UPPER_TYPE = toUpper(type);
    const CAPITALIZE_TYPE = capitalize(type);
    const loading = type === LOAD;
    const saving = type === SAVE;

    const _metas = {
        request: {status: PENDING, loading, saving},
        response: {status: SUCCESS, loading, saving},
        error: {status: ERROR, loading: false, saving: false}
    }
    // for each node action types and action creators are made.
    const _creatorsAndTypes = names.reduce((res, name) => {
      // commonTreatement
      const UPPER_NAME = toUpper(name);
      const CAPITALIZE_NAME = capitalize(name);

      const constants = {
          request: `REQUEST_${UPPER_TYPE}_${UPPER_NAME}`,
          response: `RESPONSE_${UPPER_TYPE}_${UPPER_NAME}`,
          error: `ERROR_${UPPER_TYPE}_${UPPER_NAME}`
      }
      // todo: find another name for name and value // not crystal clear
      const creators = {
          request: {name: `request${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: _actionCreatorBuilder(constants.request, name, _metas.request, 'request')},
          response: {name: `response${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: _actionCreatorBuilder(constants.response, name, _metas.response, 'response')},
          error: {name: `error${CAPITALIZE_TYPE}${CAPITALIZE_NAME}`, value: _actionCreatorBuilder(constants.error, name, _metas.error, 'error')}
      }

      return {
        types: {
          ...res.types,
          [constants.request]: constants.request,
          [constants.response]: constants.response,
          [constants.error]: constants.error
        },
        creators: {
          ...res.creators,
          [creators.request.name]: creators.request.value,
          [creators.response.name]: creators.response.value,
          [creators.error.name]: creators.error.value
        },
        actionCreatorsArray: [
          ...res.actionCreatorsArray, {
            name,
            request: creators.request.value,
            response: creators.response.value,
            error: creators.error.value
          }
        ]
      };
    }, {types: {}, creators: {}, actionCreatorsArray: []});
//    const action = _asyncActionCreator({service, actionCreatorsArray: _creatorsAndTypes.actionCreatorsArray, type, message});

    const action = _asyncActionCreator({service, actionCreatorsArray: _creatorsAndTypes.actionCreatorsArray, type, message});
    return {
        action,
        types: _creatorsAndTypes.types,
        creators: _creatorsAndTypes.creators
    };
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
