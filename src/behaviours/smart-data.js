const DEFAULT_PROPS =  {
  onSubmit(data){
    console.log('submit', data);
  },
  onChange({name, value}){
      const {fields} = this.state;
      if(fields[name] !== value){
        fields[name] = {name, value, error};
        this.setState({fields});
      }
  },
  transformFields(fields){
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
    class LifeCycleConnector extends Component {
      constructor(props) {
        super(props);
        this.state = {fields: props.fields};
      }
      componentWillMount(){
        //this.props.loadEntity(this.props.id);
      }
      componentWillReceiveProps({fields}){
        if(!fields){
          return;
        }
        const newFields = Object.keys(fields).reduce((res, fieldName)=>{
          res[fieldName] = {name: fieldName, value: fields[fieldName]};
          return res;
        }, {});
        return this.setState({fields: newFields});
      }
      render(){
        const {onSubmit, onChange, ...otherProps} = this.props
        return <ComponentToConnect {...otherProps} />;
      }
    }
    LifeCycleConnector.displayName = `${ComponentToConnect.displayName}LifeCycleConnected`;
    LifeCycleConnector.defaultProps = DEFAULT_PROPS;
    return LifeCycleConnector;
  }

}
