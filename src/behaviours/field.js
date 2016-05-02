import React , {Component, PropTypes} from 'react';
import DefaultFieldComponent from '../components/field';
import find from 'lodash/find';

const FIELD_CONTEXT_TYPE = {
    fieldHelpers: PropTypes.object
};

const getFieldMetadata = (propertyName, entityPath, definitions, domains) => {
    const propertyDefinition = definitions[entityPath][propertyName];
    if (!propertyDefinition) throw new Error(`Property ${propertyName} does not exist in definition ${entityPath}`);
    return {
        isRequired: propertyDefinition.isRequired,
        ...domains[propertyDefinition.domain]
    }
}

const fieldForBuilder = (props, multiple = false) => (propertyName, {FieldComponent = DefaultFieldComponent, entityPath, onBlur: userDefinedOnBlur, ...options} = {}) => {
    const {fields, definitions, domains, onInputChange, onInputBlur, entityPathArray, editing} = props;

    // Check if the form has multiple entityPath. If it's the case, then check if an entityPath for the field is provided
    // todo: souldn't it check if the property exists in both entity path from the array and throw an error if it is so.
    // Maybe the cost is too high.
    if (entityPathArray.length > 1 && !entityPath) throw new Error(`You must provide an entityPath when calling fieldFor('${propertyName}') since the form has multiple entityPath ${entityPathArray}`);
    entityPath = entityPath ? entityPath : entityPathArray[0];

    const metadata = getFieldMetadata(propertyName, entityPath, definitions, domains);

    const field = find(fields, {entityPath, name: propertyName});
    const {rawInputValue} = field || {};
    const onChange = rawValue => {
        onInputChange(propertyName, entityPath, rawValue);
        if (options.onChange) options.onChange(rawValue);
    };

    // Construct the onBlur, with the validation if validateOnBlur has not been set to false in the domain
    const onBlur = () => {
        if (definitions[entityPath][propertyName].validateOnBlur !== false) onInputBlur(propertyName, entityPath, rawInputValue);
        if (userDefinedOnBlur) userDefinedOnBlur();
    };

    return <FieldComponent {...options} {...field} multiple={multiple} editing={editing} name={propertyName} onBlur={onBlur} onChange={onChange} metadata={metadata} />;
}

export function connect() {
    return function connectComponent(ComponentToConnect) {
        function FieldConnectedComponent({_behaviours, ...otherProps}, {fieldHelpers}) {
            const fieldFor = fieldHelpers.fieldForBuilder(otherProps);
            const selectFor = fieldHelpers.fieldForBuilder(otherProps, true);
            const behaviours = {connectedToFieldHelpers: true, ..._behaviours};
            return <ComponentToConnect {...otherProps} _behaviours={behaviours} fieldFor={fieldFor} selectFor={selectFor}/>;
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
