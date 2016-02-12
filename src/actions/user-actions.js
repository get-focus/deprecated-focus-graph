import {loadActionBuilder} from './entity-actions-builder';

const loadAction = loadActionBuilder('user', 'load');

export const loadUserTypes = loadAction.types;
export const loadUserAction = loadAction.action;
