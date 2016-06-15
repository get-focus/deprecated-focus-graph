import React, {PropTypes, Component} from 'react';
import {loadDefinitions, loadDomains} from '../actions/metadata';
import {isArray, isEmpty} from 'lodash';

const BEHAVIOUR_METADATA_PROVIDER = 'BEHAVIOUR_METADATA_PROVIDER';
const BEHAVIOUR_METADATA_CONNECT = 'BEHAVIOUR_METADATA_CONNECT';

const METADATA_CONTEXT_TYPE = {
    definitions: PropTypes.object,
    domains: PropTypes.object
};

export function connect(definitionNameArray : Array<string> = []) {
    if (!isArray(definitionNameArray)) throw new Error(`${BEHAVIOUR_METADATA_CONNECT} You must provide a definitionNameArray as an array to the metadata connector. Instead, you gave '${definitionNameArray}'`);
    return function getMetadataConnectedComponent(ComponentToConnect) {
        function MetadataConnectedComponent(props, context) {
            const {definitions, domains} = context;

            if(isEmpty(definitions) || isEmpty(domains)) {
                throw new Error(`${BEHAVIOUR_METADATA_CONNECT} You must provide definitions and domains to the Provider, check your **MetadataProvider**`)
            }

            const builtDefinitions = definitionNameArray.reduce((builtDefinitions, definitionName) => {
                const candidateDefinition = definitions[definitionName];
                if (!candidateDefinition) throw new Error(`${BEHAVIOUR_METADATA_CONNECT} You asked for the definition '${definitionName}', but it is not present in the definitions you provided to the **MetadataProvider**`);
                return {...builtDefinitions, [definitionName]: candidateDefinition};
            }, {});

            const {_behaviours, ...otherProps} = props;
            const behaviours = {connectedToMetadata: true, ..._behaviours};
            return <ComponentToConnect _behaviours={behaviours} definitions={builtDefinitions} domains={domains} {...otherProps} />;
        }
        MetadataConnectedComponent.displayName = `${ComponentToConnect.displayName}MetadataConnected`;
        MetadataConnectedComponent.contextTypes = METADATA_CONTEXT_TYPE;
        return MetadataConnectedComponent;
    }
}

class MetadataProvider extends Component {
    getChildContext() {
        // Definitions and domains are also sent to the childre via the context.
        return {
            definitions: this.props.definitions,
            domains: this.props.domains
        };
    }
    componentWillMount() {
        const {store: {dispatch}} = this.context;
        const {definitions, domains} = this.props;

        // Maybe this should be in a separate function.

        // Definitions are sent to redux state.
        dispatch(loadDefinitions(definitions));
        // Domains are sent into the redux state.
        dispatch(loadDomains(domains));
    }
    render() {
        return this.props.children;
    }
}

MetadataProvider.childContextTypes = METADATA_CONTEXT_TYPE;
MetadataProvider.contextTypes = {
    store: PropTypes.shape({
        subscribe: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
        getState: PropTypes.func.isRequired
    })
};
MetadataProvider.propTypes = {
    definitions: PropTypes.object.isRequired,
    domains: PropTypes.object.isRequired
};

export const Provider = MetadataProvider;
