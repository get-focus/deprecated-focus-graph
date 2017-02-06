import React, {Component} from 'react';
import reactReduxStoreShape from 'react-redux/lib/utils/storeShape';
import find from 'lodash/find';
import compose from 'lodash/flowRight';
import {connect as connectToState} from 'react-redux';

import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import {selectReferenceList} from '../store/create-store';
class SmartSelectComponent extends Component {
    componentWillReceiveProps(newProps){
        const selectValues = newProps.referenceList[0].value || [];
        const defaultValue = selectValues.find(element => element.isDefaultValue);
        if(isUndefined(this.props.rawInputValue) && defaultValue){
            this.props.onChange(defaultValue.code)
        }
    }
    render(){
        const {
            name,
            rawInputValue,
            formattedInputValue,
            onChange,
            error,
            valid,
            values = [],
            referenceList =[],
            masterDatum,
            SelectComponent,
            ...otherProps
        } = this.props;

        const selectValues = referenceList[0].value || [];
        const defaultValue = selectValues.find(element => element.isDefaultValue);

        const currentValue = isUndefined(rawInputValue) ? get(defaultValue, 'code') : rawInputValue;
        return (
            <SelectComponent onChange={onChange} error={error} formattedInputValue={formattedInputValue} name={name} values={selectValues} rawInputValue={currentValue} currentValue={currentValue}  valid={valid} {...otherProps}/>
        )
    }


}
export default  compose(
    connectToState(selectReferenceList())
)(SmartSelectComponent)
