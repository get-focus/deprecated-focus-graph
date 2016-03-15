import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import * as focusReducers from '../reducers';
import formMiddleware from '../middlewares/form';

const loggerMiddleware = createLogger();

const builder = appReducers => createStore(
    combineReducers({
        dataset: appReducers,
        ...focusReducers
    }),
    applyMiddleware(
        formMiddleware,
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware // neat middleware that logs actions
    )
);

export default builder;
