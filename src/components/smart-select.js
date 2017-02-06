import React from 'react';
import reactReduxStoreShape from 'react-redux/lib/utils/storeShape';
import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';


const SmartSelectComponent = ({
    name,
    rawInputValue,
    formattedInputValue,
    onChange,
    error,
    valid,
    values,
    masterDatum,
    SelectComponent,
    ...otherProps
}, {store: {getState}}) => {
    const {masterData = []} = getState();
    const masterDatumObject = find(masterData, {name: masterDatum}) || {value: []};
    const {value} = masterDatumObject;
    const selectValues = values || value
    const defaultValue = selectValues.find(element => element.isDefaultValue);
    const currentValue = isUndefined(rawInputValue) ? defaultValue : rawInputValue;
    return <SelectComponent onChange={onChange} error={error} formattedInputValue={formattedInputValue} name={name} values={selectValues} rawInputValue={rawInputValue} valid={valid} defaultValue={defaultValue} {...otherProps}/>
};

SmartSelectComponent.contextTypes = {
    store: reactReduxStoreShape
};

export default SmartSelectComponent;
