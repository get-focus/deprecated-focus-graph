import formsReducer from './form';
import masterDataReducer from './master-data';
import {definitions as def, domains as dom} from './metadata';

export const forms = formsReducer;
export const masterData = masterDataReducer;
export const definitions = def;
export const domains = dom;
