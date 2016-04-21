import {actionBuilder} from '../../actions/entity-actions-builder';
import {loadUserSvc, saveUserSvc, loadMixedEntities} from '../services/user-service';

const loadAction = actionBuilder({names: ['user'], type: 'load', service: loadUserSvc});
export const loadUserTypes = loadAction.types;
export const loadUserAction = loadAction.action;

const _loadMixedAction = actionBuilder({names: ['user', 'address'], type: 'load', service: loadMixedEntities});
export const loadMixedTypes = _loadMixedAction.types;
export const loadMixedAction = _loadMixedAction.action;


const saveAction = actionBuilder({names: ['user'], type: 'save', service: saveUserSvc});
export const saveUserTypes = saveAction.types;
export const saveUserAction = saveAction.action;
