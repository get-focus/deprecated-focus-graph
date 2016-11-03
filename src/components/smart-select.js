import React from 'react';
import reactReduxStoreShape from 'react-redux/lib/utils/storeShape';
import find from 'lodash/find';

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
    return <SelectComponent onChange={onChange} error={error} formattedInputValue={formattedInputValue} name={name} values={selectValues} rawInputValue={rawInputValue} valid={valid}  {...otherProps}/>
};

SmartSelectComponent.contextTypes = {
    store: reactReduxStoreShape
};

export default SmartSelectComponent;
