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
    masterDatum,
    ...otherProps
}, {store: {getState}}) => {
  console.log(masterDatum)
    const {masterData = []} = getState();
    const masterDatumObject = find(masterData, {name: masterDatum}) || {value: []};
    const {value: values} = masterDatumObject;
    const wrappedOnChange = ({target:{value}}) => {
        onChange(value);
    }
    return (
        <div>
            <select name={name} onChange={wrappedOnChange} value={rawInputValue}>
                <option value={null}></option>
                {values.map(({code, label}) => <option key={code} value={code}>{label}</option>)}
            </select>
            {!valid && <b style={{color: 'red'}}>{error}</b>}
        </div>
    );
};

SelectComponent.contextTypes = {
    store: reactReduxStoreShape
};

export default SelectComponent;
