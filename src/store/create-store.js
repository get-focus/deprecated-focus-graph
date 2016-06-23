import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import * as focusReducers from '../reducers';
import formMiddleware from '../middlewares/form';
import fieldMiddleware from '../middlewares/field';

const loggerMiddleware = createLogger();


// It just creates a store with focus presets
// It calls this method from redux http://redux.js.org/docs/api/createStore.html
// It takes sevral arguments
// appReducers : an object build with combineReducers which is here to save dataset
// customMiddlewares: An array of middlewares you want to add to your project (custom treatement on global state after an action) Do not abuse of them.
// enhancers: Redux middleware or other third party enhancers.
const createStoreWithFocus = (
    reducers = {},
    customMiddlewares = [],
    enhancers = []
  ) => {
    const {dataset, customData, ...otherReducers} = reducers;
    const customReducer =  customData ? {customData} : {};
    return createStore(
    combineReducers({
        dataset,
        ...customReducer,
        ...otherReducers,
        ...focusReducers
    }),
    compose(
        applyMiddleware(
            ...customMiddlewares,
            formMiddleware, // This middleware syncs the form state with the app lifecycle.
            fieldMiddleware, // This middleware
            thunkMiddleware, // lets us dispatch() functions
            // loggerMiddleware // neat middleware that logs actions
        ),
        ...enhancers
    )
)};
 export default createStoreWithFocus;

/*** SELECTORS ***/

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
