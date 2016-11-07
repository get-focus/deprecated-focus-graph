import React, {PureComponent, PropTypes} from 'react';
import DefaultFieldComponent from '../components/field';
import find from 'lodash/find';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
const FIELD_CONTEXT_TYPE = {
    fieldHelpers: PropTypes.object,
    components: PropTypes.shape ({
       InputComponent: PropTypes.func,
       DisplayComponent: PropTypes.func
    })
};

// TODO: local override with entity definitions

const getFieldMetadata = (propertyName, entityPath, definitions, domains) => {
    const propertyDefinition = get(definitions, `${entityPath}.${propertyName}`);
    if (!propertyDefinition) throw new Error(`Property ${propertyName} does not exist in definition ${entityPath}`);
    return {
        isRequired: propertyDefinition.isRequired,
        ...domains[propertyDefinition.domain]
    }
}

const getListFieldMetadata = (propertyName, entityPath = {}, definitions, domains) => {
  const propertyDefinition = get(definitions,entityPath)
  return {
    isRequired: propertyDefinition.isRequired,
    ...domains[propertyDefinition.domain]
  };
}

const fieldForBuilder = (props, textOnly = false, multiple = false, list = false, fieldForListBuilder) => (propertyName, {FieldComponent = DefaultFieldComponent, redirectEntityPath, entityPath, onBlur: userDefinedOnBlur,onChange: userDefinedOnChange, ...options} = {}) => {
    const {fields, definitions, domains, onInputChange, onInputBlur, entityPathArray, editing, components} = props;
    // Check if the form has multiple entityPath. If it's the case, then check if an entityPath for the field is provided
    // todo: souldn't it check if the property exists in both entity path from the array and throw an error if it is so.
    // Maybe the cost is too high.
    if (entityPathArray && entityPathArray.length > 1 && !entityPath) throw new Error(`You must provide an entityPath when calling fieldFor('${propertyName}') since the form has multiple entityPath ${entityPathArray}`);
    entityPath = entityPath ? entityPath : entityPathArray[0];
    const metadata = list ? getListFieldMetadata(propertyName, redirectEntityPath, definitions, domains) :  getFieldMetadata(propertyName, entityPath, definitions, domains);

    const field = find(fields, {entityPath, name: propertyName});
    const {rawInputValue} = field || {};
    const onChange = rawValue => {
        onInputChange(propertyName, entityPath, rawValue);
        if (userDefinedOnChange) userDefinedOnChange(rawValue);
    };

    // Construct the onBlur, with the validation if validateOnBlur has not been set to false in the domain
    const onBlur = () => {
        if (get(definitions, `${entityPath}.${propertyName}`).validateOnBlur !== false) onInputBlur(propertyName, entityPath, rawInputValue);
        if (userDefinedOnBlur) userDefinedOnBlur();
    };
    const fieldForLine = list ? fieldForListBuilder(entityPath, propertyName, false, false, options.listOnly)(props): {};
    const selectForLine = list ? fieldForListBuilder(entityPath, propertyName, true)(props): {};
    const textForLine = list ? fieldForListBuilder(entityPath, propertyName, false, true)(props): {};

    const finalEditing = options.editing !== undefined ? options.editing : editing;
    return <FieldComponent  {...field}
              fieldForLine={fieldForLine}
              textForLine={textForLine}
              selectForLine={selectForLine}
              multiple={multiple}
              list={list}
              textOnly={textOnly}
              editing={finalEditing}
              name={propertyName}
              onBlur={onBlur}
              onChange={onChange}
              metadata={{ ...components, ...metadata}}
              {...options}/>;
}


const fieldForListBuilder = (entityPathList, propertyNameList, multiple=false, textOnly=false, displayLabel, isRaw) => {
  const fieldForLineBuilder = (connectedComponentProps) => (propertyName, {FieldComponent = DefaultFieldComponent, entityPath, onBlur: userDefinedOnBlur,onChange: userDefinedOnChange,  ...options} = {}, index) => {
      const {fields, definitions, domains, onInputChange, onInputBlur, entityPathArray, editing, onInputBlurList} = connectedComponentProps;
      const {onChange: optionsOnChange, ...otherOptions} = options;
      const fieldTab = find(fields, {name: propertyNameList});
      if(!isArray(fieldTab.rawInputValue) || !isArray(fieldTab.formattedInputValue) ){
        throw new Error(`You must provide an array when calling listFor('${propertyName}') in the DEFAULT_DATA (reducer) or in the service`);
      }

      const metadata = getFieldMetadata(propertyName, entityPath, definitions, domains);
      const field = {
        rawInputValue : fieldTab.rawInputValue[index][propertyName],
        formattedInputValue: fieldTab.formattedInputValue[index][propertyName]
      }
      const onChange = rawValue => {
       fieldTab.rawInputValue[index][propertyName] = rawValue;
        onInputChange(propertyNameList, entityPathList, fieldTab.rawInputValue);
        if (userDefinedOnChange) userDefinedOnChange(rawValue);
      }
      const onBlur = () => {
        if (get(definitions, `${entityPathList}.${propertyNameList}`).validateOnBlur !== false) onInputBlurList(propertyNameList, entityPathList, fieldTab.rawInputValue[index][propertyName], propertyName, index);
        if (userDefinedOnBlur) userDefinedOnBlur();
      }
      const fieldError = fieldTab.error && fieldTab.error[index] ? fieldTab.error[index][propertyName] : undefined;
      return <FieldComponent {...field}
                error={fieldError}
                textOnly={textOnly}
                editing={editing}
                multiple={multiple}
                name={propertyName}
                metadata={metadata}
                listOnly={listOnly}
                onChange={onChange}
                 onBlur={onBlur}
                 fields={fields}
                 {...connectedComponentProps}
                 {...options} />;
  }
  return fieldForLineBuilder;

}

export function connect() {
    return function connectComponent(ComponentToConnect) {
        function FieldConnectedComponent({_behaviours, ...otherProps}, {fieldHelpers, components}) {
            const props = {...otherProps, components}
            const {InputComponent, DisplayComponent} = components;
            const fieldFor = fieldHelpers.fieldForBuilder(props);
            const textFor = fieldHelpers.fieldForBuilder(props, true);
            const selectFor = fieldHelpers.fieldForBuilder(props, false, true);
            const listFor = fieldHelpers.fieldForBuilder(props, false, false, true, fieldHelpers.fieldForListBuilder);
            const behaviours = {connectedToFieldHelpers: true, ..._behaviours};
            return <ComponentToConnect {...otherProps} _behaviours={behaviours} components={components}  fieldFor={fieldFor} selectFor={selectFor} textFor={textFor} listFor={listFor}/>;
        }
        FieldConnectedComponent.displayName = `${ComponentToConnect.displayName}FieldConnected`;
        FieldConnectedComponent.contextTypes = FIELD_CONTEXT_TYPE;
        return FieldConnectedComponent;
    }
}


class FieldProvider extends PureComponent {
    getChildContext() {
        return {
            fieldHelpers: {
                fieldForBuilder,
                fieldForListBuilder
            },
            components: {
              InputComponent : this.props.InputComponent,
              DisplayComponent: this.props.DisplayComponent
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
