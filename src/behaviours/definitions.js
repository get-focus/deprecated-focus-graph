import React , {Component, PropTypes} from 'react';
const DEFINITION_CONTEXT_TYPE = {
  definitions: PropTypes.object
};

export function connect(definitionName){
  //check it is a string or an array;
  return function connectComponentToDefinitions(ComponentToConnect){
    class DefinitionConnectedComponent extends Component {
      render(){
        const definition = this.context.definitions[definitionName];
        return <ComponentToConnect definition={definition} {...this.props} />;
      }
    }
    DefinitionConnectedComponent.displayName = `${ComponentToConnect.displayName}DefinitionConnected`;
    DefinitionConnectedComponent.contextTypes = DEFINITION_CONTEXT_TYPE;
    return DefinitionConnectedComponent;
  }

}

class DefinitionsProvider extends Component {
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
