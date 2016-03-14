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
export function connect(definitionName) {
    if(!(isString(definitionName) || isArray(definitionName)) || ((isArray(definitionName) || isString(definitionName)) && definitionName.length === 0)) {
      throw new Error(`${BEHAVIOUR_DEFINITION_CONNECT}:  The definition name should be a string or an array of strings.`)
  }

    return function connectComponentToDefinitions(ComponentToConnect) {
      function DefinitionConnectedComponent(props, context) {
        if(!isObject(context)) {
            throw new Error(`${BEHAVIOUR_DEFINITION_CONNECT} The context must be an object check your **DefinitionsProvider**`)
        }
        const {definitions} = context;
        if(!isObject(definitions)) {
            throw new Error(`${BEHAVIOUR_DEFINITION_CONNECT} The definitions must be an object check your **DefinitionsProvider**`)
        }
        const definition = definitions[definitionName];
        if(!isObject(definition)) {
            throw new Error(`${BEHAVIOUR_DEFINITION_CONNECT} The definition you requested : ${definitionName} does not exists or is not an object, check your **DefinitionsProvider**`)
        }
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
    constructor(props) {
      super(props);
      this._validatePropsDefinitions(props);
  }
    _validatePropsDefinitions(props) {
      if(!isObject(props.definitions) || isFunction(props.definitions) || isEmpty(props.definitions)) {
        throw new Error(`${BEHAVIOUR_DEFINITION_PROVIDER} the provider needs a definition props which should be a non empty object`);
    }
  }
    getChildContext() {
      return {
        definitions: this.props.definitions
    }
  }
    render() {
      return this.props.children;
  }
}

DefinitionsProvider.childContextTypes = DEFINITION_CONTEXT_TYPE;

export const Provider = DefinitionsProvider;
