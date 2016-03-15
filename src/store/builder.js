import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import * as focusReducers from '../reducers';

const loggerMiddleware = createLogger();

const builder = appReducers => createStore(
    combineReducers({
        dataset: appReducers,
        ...focusReducers
    }),
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware // neat middleware that logs actions
    )
);

export default builder;
