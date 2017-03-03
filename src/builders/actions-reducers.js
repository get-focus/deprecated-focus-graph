import {actionBuilder} from '../actions/entity-actions-builder';
import {reducerBuilder} from '../reducers/reducer-builder';

import isArray from 'lodash/isArray';
import capitalize from 'lodash/capitalize'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

function _reducerBuilderFunction (nodes,types, defaultData, actionTypes, isArrayTypes = false ) {
    let reducerBuilderReduce;
    if(isArrayTypes) {
        reducerBuilderReduce = (element) => {
            return reducerBuilder(types.reduce((acc, type) => {
                if(defaultData) return {...acc, name: element, [type+'Types'] : actionTypes[type].action, defaultData: defaultData[type]}
                return {...acc, name: element, [type+'Types'] : actionTypes[type].action}
            }, {}))
        }
    }else {
        reducerBuilderReduce = (element) => {
            return reducerBuilder({name: element, [types+ 'Types']: actionTypes, defaultData })
        }
    }
    if(isArray(nodes)){
        return nodes.reduce((acc, elm) => ({...acc,
            [elm]: reducerBuilderReduce(elm)
        }), {})
    } else {
        return reducerBuilderReduce(nodes)
    }
}



export const actionsReducersBuilder = ({name, nodes, types, service, defaultData}) => {
    if(isArray(types)) {
        const _actionBuilderMultiTypes = types.reduce((acc, elem) => {
            return {...acc, [elem]: actionBuilder({names: nodes, type: elem, service: service[elem]})}
        }, {})
        const _reducerBuilder = _reducerBuilderFunction (nodes, types,  defaultData, _actionBuilderMultiTypes, true)
        return {
            [name + 'Actions'] : _actionBuilderMultiTypes,
            [name + 'Reducers'] : _reducerBuilder
        }
    }else {
        const _actionBuilder = actionBuilder({names: nodes, type: types, service})
        const _reducerBuilder = _reducerBuilderFunction (nodes,types, defaultData,  _actionBuilder.action, false )
        return {
            [name + 'Actions'] : _actionBuilder,
            [name + 'Reducers'] : _reducerBuilder

        }
    }
}

function verifProps ({name, nodes, types, service, defaultData}) {
    if(!isString(name)){
        throw new Error(`Name should be a string : ${name}`)
    }
    if((!isString(types) && !isArray(types)) || (isArray(types) && types.length === 1)){
        throw new Error(`Types should be a array with two elements or a string : ${types}`)
    }
    if((!isString(nodes) && !isArray(nodes))||( isArray(nodes) && nodes.length === 1)){
        throw new Error(`Node should be a array with two elements or a string : ${nodes}`)
    }
    if(!isFunction(service) && (isArray(types) && !isObject(service)) || (isArray(types) && (Object.keys(service).indexOf('load') === -1 || Object.keys(service).indexOf('save') === -1))){
        throw new Error(`Service should be a function or an object with the key 'load' and 'save' : ${service}`)
    }
    if(defaultData){
        if(!isObject(defaultData) || (isArray(types) && (Object.keys(defaultData).indexOf('load') === -1 || Object.keys(defaultData).indexOf('save') === -1))){
            throw new Error(`DefaultData should be an object or an object with the key 'load' and 'save' if there is 2 types: ${defaultData}`)
        }
    }

}

export default (conf) => {
    if(isArray(conf)){
        return conf.reduce((acc, elm)=> {
            verifProps(elm);
            return {
                ...acc,
                [elm.name] : actionsReducersBuilder({...elm})
            }
        } ,{})
    } else {
        verifProps(conf)
        return actionsReducersBuilder(conf)
    }
};
