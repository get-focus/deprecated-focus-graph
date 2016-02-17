import React , {Component, PropTypes} from 'react';
import {isEmpty, isObject, isFunction} from 'lodash/lang';


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
  //console.log('definition ');
  //check it is a string or an array;
  return function connectComponentToDefinitions(ComponentToConnect){
    function DefinitionConnectedComponent(props, {definitions}){
        const definition = definitions[definitionName];
        //console.log('def', definition, "props", props);
        return <ComponentToConnect hasConnectedToDefinition={true} definition={definition} {...props} />;
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
