import {
  LOAD_DEFINITIONS,
  LOAD_DOMAINS
} from '../actions/metadata';

export const definitions = (state = {}, action) => {
    switch(action.type) {
        case LOAD_DEFINITIONS:
            return action.definitions;
        default:
            return state;
    }
}

export const domains = (state = {}, action) => {
    switch(action.type) {
        case LOAD_DOMAINS:
            return action.domains;
        default:
            return state;
    }
}
