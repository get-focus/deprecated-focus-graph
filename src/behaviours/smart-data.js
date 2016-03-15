import React, {Component, PropTypes} from 'react';
const DEFAULT_PROPS = {
    onSubmit(data) {
        console.log('submit', data);
        const transfromedData =this.props.transformFieldsToData(data);
        this.props.saveEntity(transfromedData.uuid, transfromedData);
    },
    onChange({name, value, error}) {
        const {fields} = this.state;
        if(!fields[name] || fields[name].value !== value) {
            fields[name] = {name, value, error};
            this.setState({fields});
        }
    },
    transformFieldsToData(data, propertyToMap) {
        return Object.keys(data).reduce((res, fieldName) => {
            res[fieldName] = data[fieldName].value;
            return res;
        }, {})
    },
    transformDataToFields(fields, propertyToExtract) {
        return Object.keys(fields).reduce((res, fieldName) => {
            res[fieldName] = {name: fieldName, value: fields[fieldName]};
            return res;
        }, {});
    }
}
export function connect() {

    //this is the only component which have state
    // It passes to other using props
    return function connectStateToStores(ComponentToConnect) {
        //console.log('definition b');
        class LifeCycleConnector extends Component {
            constructor(props) {
                super(props);
                this.state = {
                    fields: props.transformDataToFields(props.fields)
                };
            }
            componentWillMount() {
                if(this.props.loadEntity) {
                    this.props.loadEntity(this.props.id);
                }
            }
            componentWillReceiveProps({fields}) {
                if(!fields) {
                    return;
                }
                return this.setState({fields: this.props.transformDataToFields(fields)});
            }
            render() {
                //console.log('smart data behaviour', this.props);
                const {onSubmit, onChange, fields: propsFields, ...otherProps} = this.props
                const {fields} = this.state;
                return <ComponentToConnect fields={fields} hasConnectedStateToStore onChange={onChange.bind(this)} onSubmit={onSubmit.bind(this)} {...otherProps} />;
            }
        }
        LifeCycleConnector.displayName = `${ComponentToConnect.displayName}LifeCycleConnected`;
        LifeCycleConnector.defaultProps = DEFAULT_PROPS;
        return LifeCycleConnector;
    }

}
