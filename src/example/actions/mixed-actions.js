import {actionBuilder} from '../../actions/entity-actions-builder';
import {loadMixedEntities, saveMixedEntities} from '../services/mixed-service';

const _loadMixedAction = actionBuilder({names: ['user', 'address', 'child'], type: 'load', service: loadMixedEntities});
export const loadMixedTypes = _loadMixedAction.types;
export const loadMixedAction = _loadMixedAction.action;

const _saveMixedAction = actionBuilder({names: ['user', 'address', 'child'], type: 'save', service: saveMixedEntities});
export const saveMixedTypes = _saveMixedAction.types;
export const saveMixedAction = _saveMixedAction.action;
