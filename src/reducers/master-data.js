import {REQUEST_MASTER_DATA, RESPONSE_MASTER_DATA, ERROR_MASTER_DATA} from '../actions/master-data';

const _updateOrCreateMasterDataWithElement = (list = [], name, newValue) => {
    const masterDataIdx = list.findIndex(d => d.name === name);
    if(masterDataIdx !== -1) {
      return [...list.slice(0, masterDataIdx), newValue ,...list.slice(masterDataIdx+1)];
    } else {
        return [...list, newValue];
    }
}

const masterDataReducer = (state = [], action = {}) => {
    //return state;
    const {type} = action;
    switch (type) {
        case REQUEST_MASTER_DATA:
          const loadingMasterData = {name: action.name, value: action.value, isLoading: true};
          return _updateOrCreateMasterDataWithElement(state, action.name, loadingMasterData);
        case RESPONSE_MASTER_DATA:
          const responseMasterData = {name: action.name, value: action.value, isLoading: false};
          return _updateOrCreateMasterDataWithElement(state, action.name, responseMasterData);
        case ERROR_MASTER_DATA:
          const errorMasterData = {name: action.name, error: action.error, isLoading: false};
          return _updateOrCreateMasterDataWithElement(state, action.name, errorMasterData);
        default:
          return state;
    }
};
export default masterDataReducer;
