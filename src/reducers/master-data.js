import {REQUEST_MASTER_DATUM, RESPONSE_MASTER_DATUM, ERROR_MASTER_DATUM} from '../actions/master-data';

const _updateOrCreateMasterDatumWithElement = (list = [], name, newValue) => {
    const masterDatumIdx = list.findIndex(d => d.name === name);
    if(masterDatumIdx !== -1) {
      return [...list.slice(0, masterDatumIdx), newValue ,...list.slice(masterDatumIdx+1)];
    } else {
        return [...list, newValue];
    }
}

const masterDataReducer = (state = [], action = {}) => {
    //return state;
    const {type} = action;
    switch (type) {
        case REQUEST_MASTER_DATUM:
          const loadingMasterDatum = {name: action.name, value: action.value, loading: true};
          return _updateOrCreateMasterDatumWithElement(state, action.name, loadingMasterDatum);
        case RESPONSE_MASTER_DATUM:
          const responseMasterDatum = {name: action.name, value: action.value, loading: false};
          return _updateOrCreateMasterDatumWithElement(state, action.name, responseMasterDatum);
        case ERROR_MASTER_DATUM:
          const errorMasterDatum = {name: action.name, error: action.error, loading: false};
          return _updateOrCreateMasterDatumWithElement(state, action.name, errorMasterDatum);
        default:
          return state;
    }
};
export default masterDataReducer;
