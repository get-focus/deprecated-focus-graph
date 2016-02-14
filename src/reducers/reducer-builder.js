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
// const userReducer = buildReducer(
//  {
//    load: {request: REQUEST_LOAD_USER, receive: RECEIVE_LOAD_USER},
//    save: {request: REQUEST_SAVE_USER, receive: RECEIVE_SAVE_USER}
//  }
// )
// ```
export const buildReducer({types, defaultState})=>((state, {type, payload})=>{
  const {load, save} = types;
  const {data} = state;
  switch(tyoe){
    case load.request:
    case save.request:
     return {data, isLoading: true};
   case load.receive:
   case save.receive:
      return {payload, isLoading: false};
   default:
     return state;
  }
});
