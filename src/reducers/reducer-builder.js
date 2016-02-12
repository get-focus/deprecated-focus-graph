import {loadUserTypes} from '../actions/user-actions';

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
