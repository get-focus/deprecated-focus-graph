import React , {Component, PropTypes} from 'react';
import DefaultFieldComponent from '../components/field';

const FIELD_CONTEXT_TYPE = {
    fieldHelpers: PropTypes.object
};


function fieldFor(propertyName, {FieldComponent = DefaultFieldComponent, ...options}, {fields, definition, onChange}) {
    //console.log('FIELD FOR', propertyName, fields, definition)
    //check if this is a component with fields in props
    //check if this has a definition in props
    const value = (fields && fields[propertyName]) ? fields[propertyName].value : undefined;
    return <FieldComponent name={propertyName} onChange={onChange} value={value} metadata={definition[propertyName]} {...options}/>;
}

export function connect() {
    return function connectComponent(ComponentToConnect) {
        function FieldConnectedComponent(props, {fieldHelpers}) {
            const fieldFor = (name, options = {FieldComponent: DefaultFieldComponent}) => fieldHelpers.fieldFor(name, options, props)
            //console.log('field helpers behaviour', props);
            return <ComponentToConnect {...props} hasFieldHelpers fieldFor={fieldFor}/>;
        }
        FieldConnectedComponent.displayName = `${ComponentToConnect.displayName}FieldConnected`;
        FieldConnectedComponent.contextTypes = FIELD_CONTEXT_TYPE;
        return FieldConnectedComponent;
    }
}


class FieldProvider extends Component {
    getChildContext() {
        const {FieldComponent} = this.props;
        return {
            fieldHelpers: {
                fieldFor
            }
        }
    }
    render() {
        return this.props.children;
    }
}
FieldProvider.defaultProps = {
    FieldComponent: DefaultFieldComponent
}
FieldProvider.childContextTypes = FIELD_CONTEXT_TYPE;

export const Provider = FieldProvider;
