// Build a reducer in order to ease the creation on these in 80% of the cases
// ## doc
// To build a reducer you need to provide an object which is
// ```javascript
// {
//  types : {
//    load: { request, receive, error} which are the types for the load action
//    save: { request, receive, error} which are the types for the save action
//  },
//  defaultState: the default state of your reducer
// }
// ```
//
// ## example
// ```javascript
// const DEFAULT_USER_STATE = {firstName: 'Test'};
// const userReducer = buildReducer({types: {
//    load: {request: REQUEST_LOAD_USER, receive: RECEIVE_LOAD_USER},
//    save: {request: REQUEST_SAVE_USER, receive: RECEIVE_SAVE_USER}
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
//       return {data, isLoading: true};
//   case RECEIVE_LOAD_USER:
//       return {data: payload, isLoading: false};
//   default:
//       return state
//  }
// }
// ```
export const reducerBuilder = ({types, defaultState})=>((state = defaultState, {type, payload})=>{
  //todo: add some validation and check here
  const {load, save} = types;
  const {data} = state;
  switch(type){
    case load.request:
    case save.request:
     return {data, isLoading: true};
   case load.receive:
   case save.receive:
      return {data: payload, isLoading: false};
  // todo: error case
   default:
     return state;
  }
});
