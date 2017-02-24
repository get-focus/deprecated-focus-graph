import React, {Component} from 'react';
import reactReduxStoreShape from 'react-redux/lib/utils/storeShape';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import compose from 'lodash/flowRight';
import {connect as connectToState} from 'react-redux';

import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import {selectReferenceList} from '../store/create-store';
class SmartSelectComponent extends Component {
    componentWillReceiveProps(newProps){
        const selectValues = newProps.referenceList[0] ?  newProps.referenceList[0].value || [] : [];
        const defaultValueSelect = this.props.defaultValue ?  this.props.defaultValue  : get(selectValues.find(element => element.isDefaultValue), 'code');
        if(!isEqual(this.props.referenceList, newProps.referenceList) && isUndefined(this.props.rawInputValue) && defaultValueSelect){
            this.props.onChange(defaultValueSelect)
        }
    }
    render(){
        const {
            name,
            rawInputValue,
            formattedInputValue,
            onChange,
            error,
            defaultValue,
            valid,
            referenceList =[{}],
            masterDatum,
            values,
            SelectComponent,
            ...otherProps
        } = this.props;

        const selectValues = referenceList[0]?  referenceList[0].value || [] : [];
        const defaultValueSelect = defaultValue ?  defaultValue : get(selectValues.find(element => element.isDefaultValue), 'code');

        const currentValue = isUndefined(rawInputValue) ? defaultValueSelect: rawInputValue;
        const finalValues = selectValues ? selectValues : values;
        return (
            <SelectComponent onChange={onChange} error={error} formattedInputValue={formattedInputValue} name={name} values={finalValues} rawInputValue={currentValue} currentValue={currentValue}  valid={valid} { ...otherProps}/>
        )
    }


}
export default  compose(
    connectToState(selectReferenceList())
)(SmartSelectComponent)
