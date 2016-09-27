import {actionBuilder} from '../../actions/entity-actions-builder';
import {loadUser, saveUser, loadError} from '../services/user-service';

const _loadUserAction = actionBuilder({names: ['user.information'], type: 'load', service: loadUser});
export const loadUserTypes = _loadUserAction.types;
export const loadUserAction = _loadUserAction.action;

const _loadUserErrorAction = actionBuilder({names: ['user.information'], type: 'load', service: loadError});
export const loadUserErrorTypes = _loadUserErrorAction.types;
export const loadUserErrorAction = _loadUserErrorAction.action;

const _saveUserAction = actionBuilder({names: ['user.information'], type: 'save', service: saveUser});
export const saveUserTypes = _saveUserAction.types;
export const saveUserAction = _saveUserAction.action;
