import {actionBuilder} from './entity-actions-builder';
import {loadUserSvc} from '../services/user-service';

const loadAction = actionBuilder({name:'user', type:'load', service:loadUserSvc});
export const loadUserTypes = loadAction.types;
export const loadUserAction = loadAction.action;
