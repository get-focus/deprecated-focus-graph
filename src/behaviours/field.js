import React , {Component, PropTypes} from 'react';
import DefaultFieldComponent from '../components/field';
const FIELD_CONTEXT_TYPE = {
  fieldHelpers: PropTypes.object
};

export function connect(){
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

class FieldProvider extends Component {
  getChildContext(){
    const {FieldComponent} = this.props;
    return {
      fieldHelpers: {
        fieldFor(propertyName){
          //check if this is a component with fields in props
          //check if this has a definition in props
          return <FieldComponent name={propertyName} value={(this.state.fields && this.state.fields[propertyName]) ? this.state.fields[propertyName].value : undefined} metadata={this.props.definition[propertyName]}/>;
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
