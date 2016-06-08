import React , {PropTypes} from 'react';
import Remarkable from 'remarkable';

// Component de Documentation
const Documentation = ({content}) => <div dangerouslySetInnerHTML={{__html: new Remarkable({html: true}).render(content)}}/>
Documentation.propTypes = {
  content: PropTypes.string.isRequired
};

// Connector to a component
// There You just provide the text.
// connect(`
//  # Great doc
// `)(ComponentToConnect);
export function connect(documentationText) {
    return function connectComponentToDocumentation(ComponentToConnect) {
        function DocumentationConnectedComponent({_behaviours, ...otherProps}, {fieldHelpers}) {
            const behaviours = {connectedToFieldDocumentation: true, ..._behaviours};
            return (
              <div>
                <ComponentToConnect {...otherProps} _behaviours={behaviours}/>;
                <Documentation content={documentationText} />
              </div>
            )

        }
        DocumentationConnectedComponent.displayName = `${ComponentToConnect.displayName}DocumentationConnected`;
        return DocumentationConnectedComponent;
    }
}
