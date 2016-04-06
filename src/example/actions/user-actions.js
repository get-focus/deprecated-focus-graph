import {actionBuilder} from '../../actions/entity-actions-builder';
import {loadUserSvc, saveUserSvc} from '../services/user-service';

const loadAction = actionBuilder({name: 'user', type: 'load', service: loadUserSvc});
export const loadUserTypes = loadAction.types;
export const loadUserAction = loadAction.action;

const saveAction = actionBuilder({name: 'user', type: 'save', service: saveUserSvc});
export const saveUserTypes = saveAction.types;
export const saveUserAction = saveAction.action;
