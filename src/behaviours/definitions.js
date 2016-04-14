import React , {Component, PropTypes} from 'react';
import {isEmpty, isObject, isFunction, isString, isArray} from 'lodash/lang';

const BEHAVIOUR_DEFINITION_PROVIDER = 'BEHAVIOUR_DEFINITION_PROVIDER';
const BEHAVIOUR_DEFINITION_CONNECT = 'BEHAVIOUR_DEFINITION_CONNECT';

//Mutualization of the context type
const DEFINITION_CONTEXT_TYPE = {
    definitions: PropTypes.object,
    domains: PropTypes.object
};

// The function uses a Higher Order Component pattern to provide


export function connect(definitionNameArray = []) {
    if (!isArray(definitionNameArray)) throw new Error(`${BEHAVIOUR_DEFINITION_CONNECT} You must provide a definitionNameArray as an array to the definition connector. Instead, you gave '${definitionNameArray}'`);
    return function getDefinitionsConnectedComponent(ComponentToConnect) {
        function DefinitionsConnectedComponent(props, context) {
            const {definitions, domains} = context;
            if(isEmpty(definitions) || isEmpty(domains)) {
                throw new Error(`${BEHAVIOUR_DEFINITION_CONNECT} You must provide definitions and domains to the Provider, check your **DefinitionsProvider**`)
            }
            const builtDefinitions = definitionNameArray.reduce((builtDefinitions, definitionName) => {
                const candidateDefinition = definitions[definitionName];
                if (!candidateDefinition) throw new Error(`${BEHAVIOUR_DEFINITION_CONNECT} You asked for the definition '${definitionName}', but it is not present in the definitions you provided to the **DefinitionsProvider**`);
                return {...builtDefinitions, [definitionName]: candidateDefinition};
            }, {});
            const {_behaviours, ...otherProps} = props;
            const behaviours = {isConnectedToDefinition: true, ..._behaviours};
            return <ComponentToConnect _behaviours={behaviours} definitions={builtDefinitions} domains={domains} {...otherProps} />;
        }
        DefinitionsConnectedComponent.displayName = `${ComponentToConnect.displayName}DefinitionConnected`;
        DefinitionsConnectedComponent.contextTypes = DEFINITION_CONTEXT_TYPE;
        return DefinitionsConnectedComponent;
    }
}

class DefinitionsProvider extends Component {
    getChildContext() {
        return {
            definitions: this.props.definitions,
            domains: this.props.domains
        }
    }
    render() {
        return this.props.children;
    }
}

DefinitionsProvider.childContextTypes = DEFINITION_CONTEXT_TYPE;
DefinitionsProvider.propTypes = {
    definitions: PropTypes.object.isRequired,
    domains: PropTypes.object.isRequired
}
export const Provider = DefinitionsProvider;
