import React , {Component, PropTypes} from 'react';
import DefaultFieldComponent from '../components/field';
import find from 'lodash/find';

const FIELD_CONTEXT_TYPE = {
    fieldHelpers: PropTypes.object
};

const fieldForBuilder = props => (propertyName, {FieldComponent = DefaultFieldComponent, entityPath, ...options} = {}) => {
    const {fields, definition, onInputChange, entityPathArray} = props;

    // Check if the form has multiple entityPath. If it's the case, then check if an entityPath for the field is provided
    if (entityPathArray.length > 1 && !entityPath) throw new Error(`You must provide an entityPath when calling fieldFor('${propertyName}') since the form has multiple entityPath ${entityPathArray}`);
    entityPath = entityPath ? entityPath : entityPathArray[0];

    const field = find(fields, {entityPath, name: propertyName});
    const value = field ? field.inputValue : undefined;
    const onChange = value => {
        onInputChange(propertyName, entityPath, value);
        if (options.onChange) options.onChange(value);
    }

    return <FieldComponent {...options} {...field} name={propertyName} onChange={onChange} value={value} metadata={definition[propertyName]} />;
}

export function connect() {
    return function connectComponent(ComponentToConnect) {
        function FieldConnectedComponent(props, {fieldHelpers}) {
            const fieldFor = fieldHelpers.fieldForBuilder(props);
            return <ComponentToConnect {...props} hasFieldHelpers fieldFor={fieldFor}/>;
        }
        FieldConnectedComponent.displayName = `${ComponentToConnect.displayName}FieldConnected`;
        FieldConnectedComponent.contextTypes = FIELD_CONTEXT_TYPE;
        return FieldConnectedComponent;
    }
}


class FieldProvider extends Component {
    getChildContext() {
        return {
            fieldHelpers: {
                fieldForBuilder
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
