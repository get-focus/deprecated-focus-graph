import {isObject, isString, isNumber, isFunction} from 'lodash/lang';
export const REQUEST_MASTER_DATA = 'REQUEST_MASTER_DATA';
export const RESPONSE_MASTER_DATA = 'RESPONSE_MASTER_DATA';
export const ERROR_MASTER_DATA = 'ERROR_MASTER_DATA';
const LOAD_MASTER_DATA_ACTION = 'LOAD_MASTER_DATA_ACTION';
export const requestMasterData = name => {
  return {type: REQUEST_MASTER_DATA, name};
}

export const responseMasterData = (name, data)  => {
  return {type: RESPONSE_MASTER_DATA, name, value: data};
}

export const errorMasterData = (name, error) => {
  return {type: ERROR_MASTER_DATA, name, error};
}
const DEFAULT_CACHE_DURATION = 1000 * 60; //1 min
const _cache = {};

const _getTimeStamp = () => new Date().getTime();
const _isDataInCache = name => {
  const cachedData = _cache[name];
  return isObject(cachedData) && _getTimeStamp() - cachedData.timeStamp < cachedData.cacheDuration;
};

const _setDataInCache = (name, cacheDuration = DEFAULT_CACHE_DURATION) => {
  _cache[name] = {name, cacheDuration, timeStamp: _getTimeStamp()};
};

const _validateLoadMasterData = (name, service, cacheDuration) => {
  if(!isString(name) || '' === name) {
      throw new Error(`${LOAD_MASTER_DATA_ACTION}: the name parameter should be a string.`);
  }
  if(!isFunction(service)) {
      throw new Error(`${LOAD_MASTER_DATA_ACTION}: the service parameter should be a function.`);
  }
  if(!isNumber(cacheDuration)) {
    throw new Error(`${LOAD_MASTER_DATA_ACTION}: the cacheDuration parameter should be a number.`);
  }
};


// Load a
export const loadMasterData = (name, service, cacheDuration = DEFAULT_CACHE_DURATION) => {
    _validateLoadMasterData(name, service, cacheDuration);
    return async dispatch => {
      dispatch(requestMasterData(name));
      try {
        if(_isDataInCache(name)){
          //Question is the cache usefull as this data will be in the app state.
          // Maybe we should only keep the timestamp and the name
          // This is usefull only for debug prupose.
          return;
          //const cached = await _getDataFromCache(name);
          //servedFromCacheMasterData(name, cached);
        }
        else {
          const res = await service().then(d => {
            _setDataInCache(name, cacheDuration)
            return d;
          });
          dispatch(responseMasterData(name, res));
        }
      } catch(err){
        dispatch(errorMasterData(name, err));
      }
    }
};

//Create a builder of master data action
// This builder should take into account the config of the provider which will call a set action.
