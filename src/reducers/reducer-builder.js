// Build a reducer in order to ease the creation on these in 80% of the cases
// ## doc
// To build a reducer you need to provide an object which is
// ```javascript
// {
//  types : {
//    load: { request, response, error} which are the types for the load action
//    save: { request, response, error} which are the types for the save action
//  },
//  defaultState: the default state of your reducer
// }
// ```
//
// ## example
// ```javascript
// const DEFAULT_USER_STATE = {firstName: 'Test'};
// const userReducer = buildReducer({types: {
//    load: {request: REQUEST_LOAD_USER, response: RESPONSE_LOAD_USER},
//    save: {request: REQUEST_SAVE_USER, response: RESPONSE_SAVE_USER}
//  },
//  defaultState: DEFAULT_USER_STATE
// })
// ```
// will produce
// ```javascript
// function userReducer(state = DEFAULT_STATE, {type, payload}){
// const {data} = state;
//  switch (type) {
//   case REQUEST_LOAD_USER:
//       return {data, loading: true, saving: false};
//   case RESPONSE_LOAD_USER:
//       return {data: payload, loading: false, saving: false};
//   default:
//       return state
//  }
// }
// ```

const getDefaultState = defaultData => ({
    data: defaultData,
    loading: false,
    saving: false
});

export const reducerBuilder = ({types, defaultData}) => ((state = getDefaultState(defaultData), {type, payload}) => {
    //todo: add some validation and check here
    const {load, save} = types;
    switch(type) {
        case load.request:
            return {...state, loading: true};
        case save.request:
            return {...state, saving: true};
        case load.response:
            return {...state, data: payload, loading: false};
        case save.response:
            return {...state, data: payload, saving: false};
        case load.error:
            return {...state, loading: false};
        case save.error:
            return {...state, saving: false};
        default:
            return state;
    }
});
