import {reducerBuilder} from '../../reducers/reducer-builder';
import {loadMixedTypes, saveMixedTypes} from '../actions/mixed-actions';

// default data
const DEFAULT_DATA = {
    city: 'Libercourt'
};

// Reducer for the user entity with a state modification on load and save.
const userReducer = reducerBuilder({
    name: 'ADDRESS',
    loadTypes: loadMixedTypes,
    saveTypes: saveMixedTypes,
    defaultData: DEFAULT_DATA
});

export default userReducer;
