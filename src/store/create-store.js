import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import * as focusReducersDefault from '../reducers';
import formMiddleware from '../middlewares/form';
import fieldMiddlewareBuilder from '../middlewares/field';

const loggerMiddleware = createLogger();
type ProjectReducersType = {
  dataset: Function,
  customData: Object
}
// Creates a root reducer with all the focus reducers included
// It follows a convention
// Inside your project reducers you should have an object with the following nodes:ProjectReducersType
// - dataSet => All the reducers relative to data fetching inside your project
// - customData => Your custom reducer relative to the data
// - ...otherReducers => All the other property inside the object will be spread as a root reducer node.
export const combineReducerWithFocus = (projectReducers, focusReducers = focusReducersDefault) => {
  const {dataset, customData, ...otherReducers} = projectReducers;
  const customReducers =  customData ? {customData} : {};
  return combineReducers({
    dataset,
    ...customReducers,
    ...otherReducers,
    ...focusReducers
  });
}

// It just creates a store with focus presets
// It calls this method from redux http://redux.js.org/docs/api/createStore.html
// It takes sevral arguments
// appReducers : an object build with combineReducers which is here to save dataset
// customMiddlewares: An array of middlewares you want to add to your project (custom treatement on global state after an action) Do not abuse of them.
// enhancers: Redux middleware or other third party enhancers.
const createStoreWithFocus = (
    reducers = {},
    customMiddlewares = [],
    enhancers = [],
    translate = element=> element
  ) => {
    return createStore(
      combineReducerWithFocus(reducers),
      compose(
          applyMiddleware(
              ...customMiddlewares,
              formMiddleware, // This middleware syncs the form state with the app lifecycle.
              fieldMiddlewareBuilder(translate), // This middleware
              thunkMiddleware, // lets us dispatch() functions
              // loggerMiddleware // neat middleware that logs actionsMe
          ),
          ...enhancers
      )
)};
 export default createStoreWithFocus;

/*** SELECTORS ***/

export const selectFieldsByFormKey = formKey => (state= {}) => {
  const form = state.forms.find(element => element.formKey === formKey )
  const fields = form ? form.fields : [];
  return {fields: fields}
}


 // It  extracts data from the dataset part of the state
 export const selectData = name => (state ={}) => {
   if( !state.dataset[name]) throw new Error(`SELECTOR_DATASET : there is no ${name} in the dataset of the state`);
   return state.dataset[name]
 }


 // It extracts customData from the state
 // selectDate
 export const selectCustomData = name => (state ={}) => {
   if( !state.customData|| !state.customData[name]) throw new Error(`SELECTOR_CUTSOM_DATA : there is no ${name} in the dataset of the state`);
   return state.customData[name]
 }
