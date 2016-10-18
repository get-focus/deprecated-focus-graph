import {actionBuilder} from '../../actions/entity-actions-builder';
import {loadMixedEntities, saveMixedEntities} from '../services/mixed-service';

const _loadMixedAction = actionBuilder({names: ['user.information', 'user.address', 'user.child'], type: 'load', service: loadMixedEntities});
export const loadMixedTypes = _loadMixedAction.types;
export const loadMixedAction = _loadMixedAction.action;

const _saveMixedAction = actionBuilder({names: ['user', 'address'], type: 'save', service: saveMixedEntities, message: 'saved'});
export const saveMixedTypes = _saveMixedAction.types;
export const saveMixedAction = _saveMixedAction.action;
