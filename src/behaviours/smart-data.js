import React, {Component, PropTypes} from 'react';
const DEFAULT_PROPS =  {
  onSubmit(data){
    console.log('submit', data);
    this.props.saveEntity(data.uuid.value, data);
  },
  onChange({name, value, error}){
      const {fields} = this.state;
      if(!fields[name] || fields[name].value !== value){
        fields[name] = {name, value, error};
        this.setState({fields});
      }
  },
  transformFields(fields, propertyToExtract){
    return Object.keys(fields).reduce((res, fieldName)=>{
      res[fieldName] = {name: fieldName, value: fields[fieldName]};
      return res;
    }, {});
  }
}
export function connect(){

  //this is the only component which have state
  // It passes to other using props
  return function connectStateToStores(ComponentToConnect){
    //console.log('definition b');
    class LifeCycleConnector extends Component {
      constructor(props) {
        super(props);
        this.state = {
          fields: props.transformFields(props.fields)
        };
      }
      componentWillMount(){
        if(this.props.loadEntity){
          this.props.loadEntity(this.props.id);
        }
      }
      componentWillReceiveProps({fields}){
        if(!fields){
          return;
        }
        return this.setState({fields: this.props.transformFields(fields)});
      }
      render(){
        //console.log('smart data behaviour', this.props);
        const {onSubmit, onChange, fields: propsFields, ...otherProps} = this.props
        const {fields} = this.state;
        return <ComponentToConnect fields={fields} hasConnectedStateToStore={true} onChange={onChange.bind(this)} onSubmit={onSubmit.bind(this)} {...otherProps} />;
      }
    }
    LifeCycleConnector.displayName = `${ComponentToConnect.displayName}LifeCycleConnected`;
    LifeCycleConnector.defaultProps = DEFAULT_PROPS;
    return LifeCycleConnector;
  }

}
