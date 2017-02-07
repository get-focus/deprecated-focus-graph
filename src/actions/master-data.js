import {isObject, isString, isNumber, isFunction} from 'lodash/lang';
export const REQUEST_MASTER_DATUM = 'REQUEST_MASTER_DATUM';
export const RESPONSE_MASTER_DATUM = 'RESPONSE_MASTER_DATUM';
export const ERROR_MASTER_DATUM = 'ERROR_MASTER_DATUM';
const LOAD_MASTER_DATUM_ACTION = 'LOAD_MASTER_DATUM_ACTION';
export const requestMasterDatum = name => {
  return {type: REQUEST_MASTER_DATUM, name};
}

export const responseMasterDatum = (name, data)  => {
  return {type: RESPONSE_MASTER_DATUM, name, value: data};
}

export const errorMasterDatum = (name, error) => {
  return {type: ERROR_MASTER_DATUM, name, error};
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

const _validateLoadMasterDatum = (name, service, cacheDuration) => {
  if(!isString(name) || '' === name) {
      throw new Error(`${LOAD_MASTER_DATUM_ACTION}: the name parameter should be a string.`);
  }
  if(!isFunction(service)) {
      throw new Error(`${LOAD_MASTER_DATUM_ACTION}: the service parameter should be a function.`);
  }
  if(!isNumber(cacheDuration)) {
    throw new Error(`${LOAD_MASTER_DATUM_ACTION}: the cacheDuration parameter should be a number.`);
  }
};


// Load a
export const loadMasterDatum = (name, service, cacheDuration = DEFAULT_CACHE_DURATION) => {
    _validateLoadMasterDatum(name, service, cacheDuration);
    return async dispatch => {
      try {
        if(_isDataInCache(name)){
          //Question is the cache usefull as this data will be in the app state.
          // Maybe we should only keep the timestamp and the name
          // This is usefull only for debug prupose.
          return;
          //const cached = await _getDataFromCache(name);
          //servedFromCacheMasterDatum(name, cached);
        }
        else {
          dispatch(requestMasterDatum(name));
          const res = await service()
          _setDataInCache(name, cacheDuration);
          dispatch(responseMasterDatum(name, res));
        }
      } catch(err){
        dispatch(errorMasterDatum(name, err));
      }
    }
};

//Create a builder of master data action
// This builder should take into account the config of the provider which will call a set action.
