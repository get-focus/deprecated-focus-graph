import React, {PropTypes, PureComponent} from 'react';
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
        class MetadataConnectedComponent extends PureComponent {
            constructor(props, context) {
                super(props, context);
                const {definitions, domains} = context;

                if (isEmpty(definitions) || isEmpty(domains)) {
                    throw new Error(`${BEHAVIOUR_METADATA_CONNECT} You must provide definitions and domains to the Provider, check your **MetadataProvider**`)
                }
                // todo: verif child presence (list)
                this.builtDefinitions = definitionNameArray.reduce((builtDefinitions, definitionName) => {
                    const candidateDefinition = definitions[definitionName];
                    if (!candidateDefinition) throw new Error(`${BEHAVIOUR_METADATA_CONNECT} You asked for the definition '${definitionName}', but it is not present in the definitions you provided to the **MetadataProvider**`);
                    return {...builtDefinitions, [definitionName]: candidateDefinition};
                }, {});
                this.behaviours = {connectedToMetadata: true, ...props._behaviours};
            }

            render() {
                return <ComponentToConnect {...this.props} _behaviours={this.behaviours} definitions={this.builtDefinitions} domains={this.context.domains} />;
            }
        }
        MetadataConnectedComponent.displayName = `${ComponentToConnect.displayName}MetadataConnected`;
        MetadataConnectedComponent.contextTypes = METADATA_CONTEXT_TYPE;
        return MetadataConnectedComponent;
    }
}

class MetadataProvider extends PureComponent {
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

//TODO: Add custom proptyes on this instead of flow types
/*
// Options you can provide to the field
// <Field {...options}/>
// fieldFor(propertyName, options)>
type FieldOptions = {
  name: string,
  isRequired: boolean,
  validateOnBlur: boolean,
  InputComponent: ReactClass | function,
  SelectComponent: ReactClass | function,
  DisplayComponent: ReactClass | function,
  multiple: boolean,
  options: Object,
  onChange: function,
  onBlur: function,
  rawInputValue: any,
  formattedInputValue: any
};

// List specific options
type ListFieldOptions = {
  metadata: Object,
  list: boolean
} & FieldOptions;

// A domain is just a name and any other information you need to add to all the fields with the same domain.
type DomainType = {name: string} & FieldOptions;
// An entity  is the same information as a field options or a domain but on the field level.
type EntityType = {name: string} & FieldOptions;
// The entity type for a list (or maybe in the future another type) is child
type EntityListType = {redirect: string};
*/
export const Provider = MetadataProvider;
