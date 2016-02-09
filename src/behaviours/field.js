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


export function connect(ComponentToConnect){
 class FieldExtendedClass  extends Component {
   render(){
     //console.log('fieldClass', this.props, this.context);
     const fieldFor = (name, options) => this.context.fieldHelpers.fieldFor(name, options, this.props)
     return <ComponentToConnect {...this.props} hasFieldHelpers={true} fieldFor={fieldFor}/>;
   }
 }
 FieldExtendedClass.displayName = `${ComponentToConnect.displayName}FieldConnected`;
 FieldExtendedClass.contextTypes = FIELD_CONTEXT_TYPE;
 return FieldExtendedClass;
}


class FieldProvider extends Component {
  getChildContext(){
    const {FieldComponent} = this.props;
    return {
      fieldHelpers: {
        fieldFor(propertyName, options, {fields, definition}){
          //console.log('FIELD FOR', propertyName, fields, definition)
          //check if this is a component with fields in props
          //check if this has a definition in props
          return <FieldComponent name={propertyName} value={(fields && fields[propertyName]) ? fields[propertyName].value : undefined} metadata={definition[propertyName]}/>;
        }
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
