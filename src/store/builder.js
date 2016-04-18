import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import * as focusReducers from '../reducers';
import formMiddleware from '../middlewares/form';
import fieldMiddleware from '../middlewares/field';

const loggerMiddleware = createLogger();

const builder = (appReducers, customMiddlewares = [], enhancers = []) => createStore(
    combineReducers({
        dataset: appReducers,
        ...focusReducers
    }),
    compose(
        applyMiddleware(
            ...customMiddlewares,
            formMiddleware,
            fieldMiddleware,
            thunkMiddleware, // lets us dispatch() functions
            // loggerMiddleware // neat middleware that logs actions
        ),
        ...enhancers
    )
);

export default builder;
