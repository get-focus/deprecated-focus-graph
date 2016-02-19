import React , {Component, PropTypes} from 'react';
import {isEmpty, isObject, isFunction, isString, isArray} from 'lodash/lang';


const BEHAVIOUR_DEFINITION_PROVIDER = 'BEHAVIOUR_DEFINITION_PROVIDER';
const BEHAVIOUR_DEFINITION_CONNECT = 'BEHAVIOUR_DEFINITION_CONNECT';
//Mutualization of the context type
const DEFINITION_CONTEXT_TYPE = {
  definitions: PropTypes.object
};

// The function uses a Higher Order Component pattern to provide
//
//
//
export function connect(definitionName){
  if(!((isString(definitionName) || isArray(definitionName)) && definitionName.length) > 0){
    throw new Error(`${BEHAVIOUR_DEFINITION_CONNECT}:  The definition name should be s string or an array of strings.`)
  }

  return function connectComponentToDefinitions(ComponentToConnect){
    function DefinitionConnectedComponent(props, {definitions}){
        const definition = definitions[definitionName];
        const {_behaviours, ...otherProps} = props;
        const behaviours = {isConnectedToDefinition: true,..._behaviours}
        //console.log('def', definition, "props", props);
        return <ComponentToConnect _behaviours={behaviours} definition={definition} {...otherProps} />;
    }
    DefinitionConnectedComponent.displayName = `${ComponentToConnect.displayName}DefinitionConnected`;
    DefinitionConnectedComponent.contextTypes = DEFINITION_CONTEXT_TYPE;
    return DefinitionConnectedComponent;
  }

}


class DefinitionsProvider extends Component {
  constructor(props){
    super(props);
    this._validatePropsDefinitions(props);
    //console.log(props);
  }
  _validatePropsDefinitions(props){
    if(!isObject(props.definitions) || isFunction(props.definitions) || isEmpty(props.definitions)){
      throw new Error(`${BEHAVIOUR_DEFINITION_PROVIDER} the provider needs a definitions props which should be a non empty object`);
    }
  }
  getChildContext(){
    return {
      definitions: this.props.definitions
    }
  }
  render(){
    return this.props.children;
  }
}

DefinitionsProvider.childContextTypes = DEFINITION_CONTEXT_TYPE;

export const Provider = DefinitionsProvider;
