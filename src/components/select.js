import React from 'react';
import reactReduxStoreShape from 'react-redux/lib/utils/storeShape';
import find from 'lodash/find';

const SelectComponent = ({
    name,
    rawInputValue,
    formattedInputValue,
    onChange,
    error,
    valid,
    values,
    masterDatum,
    ...otherProps
}, {store: {getState}}) => {

    const {masterData = []} = getState();
    const masterDatumObject = find(masterData, {name: masterDatum}) || {value: []};
    const {value} = masterDatumObject;
    const selectValues = values || value
    const wrappedOnChange = ({target:{value}}) => {
        onChange(value);
    }
    return (
        <div>
            <select name={name} onChange={wrappedOnChange} value={rawInputValue}>
                <option value={null}></option>
                {selectValues.map(({code, label}) => <option key={code} value={code}>{label}</option>)}
            </select>
            {!valid && <b style={{color: 'red'}}>{error}</b>}
        </div>
    );
};

SelectComponent.contextTypes = {
    store: reactReduxStoreShape
};

export default SelectComponent;
