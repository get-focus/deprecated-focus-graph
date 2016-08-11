import {actionBuilder} from '../../actions/entity-actions-builder';
import {loadUser, saveUser} from '../services/user-service';

const _loadUserAction = actionBuilder({names: ['user.information'], type: 'load', service: loadUser});
export const loadUserTypes = _loadUserAction.types;
export const loadUserAction = _loadUserAction.action;

const _saveUserAction = actionBuilder({names: ['user'], type: 'save', service: saveUser});
export const saveUserTypes = _saveUserAction.types;
export const saveUserAction = _saveUserAction.action;
