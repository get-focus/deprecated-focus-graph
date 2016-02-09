import React , {Component, PropTypes} from 'react';
import DefaultFieldComponent from '../components/field';
const FIELD_CONTEXT_TYPE = {
  fieldHelpers: PropTypes.object
};

export function connectWithoutBinding(){
  //check it is a string or an array;
  return function connectComponentToFieldHelpers(ComponentToConnect){
    class FieldConnectedComponent extends Component {
      render(){
        return <ComponentToConnect {...this.props} {...this.context.fieldHelpers}/>;
      }
    }
    FieldConnectedComponent.displayName = `${ComponentToConnect.displayName}FieldConnected`;
    FieldConnectedComponent.contextTypes = FIELD_CONTEXT_TYPE;
    return FieldConnectedComponent;
  }

}


export function fieldFor(propertyName, {FieldComponent = DefaultFieldComponent}, {fields, definition}){
  //console.log('FIELD FOR', propertyName, fields, definition)
  //check if this is a component with fields in props
  //check if this has a definition in props
  return <FieldComponent name={propertyName} value={(fields && fields[propertyName]) ? fields[propertyName].value : undefined} metadata={definition[propertyName]}/>;
}

export function connect(ComponentToConnect){
 function FieldConnectedComponent(props, {fieldHelpers}){
     const fieldFor = (name, options = {FieldComponent: DefaultFieldComponent}) => fieldHelpers.fieldFor(name, options, props)
     return <ComponentToConnect {...props} hasFieldHelpers={true} fieldFor={fieldFor}/>;
 }
 FieldConnectedComponent.displayName = `${ComponentToConnect.displayName}FieldConnected`;
 FieldConnectedComponent.contextTypes = FIELD_CONTEXT_TYPE;
 return FieldConnectedComponent;
}


class FieldProvider extends Component {
  getChildContext(){
    const {FieldComponent} = this.props;
    return {
      fieldHelpers: {
        fieldFor
      }
    }
  }
  render(){
    return this.props.children;
  }
}
FieldProvider.defaultProps = {
  FieldComponent: DefaultFieldComponent
}
FieldProvider.childContextTypes = FIELD_CONTEXT_TYPE;

export const Provider = FieldProvider;
