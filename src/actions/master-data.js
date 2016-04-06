import {isObject} from 'lodash/lang';
export const REQUEST_MASTER_DATA = 'REQUEST_MASTER_DATA';
export const RESPONSE_MASTER_DATA = 'RESPONSE_MASTER_DATA';
export const ERROR_MASTER_DATA = 'ERROR_MASTER_DATA';
export const SERVE_FROM_CACHE_MASTER_DATA = 'SERVE_FROM_CACHE_MASTER_DATA';


export const requestMasterData = name => {
  return {type: REQUEST_MASTER_DATA, payload: {name}};
}
export const responseMasterData = (name, data)  => {
  return {type: RESPONSE_MASTER_DATA, payload: {name, data}};
}

export const servedFromCacheMasterData = (name, data)  => {
  return {type: RESPONSE_MASTER_DATA, payload: {name, data}};
}

export const errorMasterData = (name, error) => {
  return {type: ERROR_MASTER_DATA, payload: {name, error}};
}
const DEFAULT_CACHE_DURATION = 1000 * 60; //1 min
const _cache = {};

const _getTimeStamp = () => new Date().getTime();
const _isDataInCache = name => {
  const cachedData = _cache[name];
  return isObject(cachedData) && _getTimeStamp() - cachedData.timeStamp < cachedData.cacheDuration;
};

async const _getDataFromCache =  name => {
  return Promise.resolve(_cache[name].value);
}
const _setDataInCache = (name, value, cacheDuration = DEFAULT_CACHE_DURATION) => {
  _cache[name] = {name, value, cacheDuration, timeStamp: _getTimeStamp()};
  return value;
}

export async const loadMasterData(name, service, cacheDuration = DEFAULT_CACHE_DURATION) => {
    requestMasterData(name);
    try {
      if(_isDataInCache(name)){
          //Question is the cache usefull as this data will be in the app state.
          // Maybe we should only keep the timestamp and the name
          // This is usefull only for debug prupose.
          const cached = await _getDataFromCache(name);
          servedFromCacheMasterData(name, cached);
      }
      else {
        const res = await service().then(d => _setDataInCache(name, d, cacheDuration));
        responseMasterData(name, res);
      }
    } catch(err){
      errorMasterData(name, err)
    }
};

//Create a builder of master data action
// This builder should take into account the config of the provider which will call a set action.
