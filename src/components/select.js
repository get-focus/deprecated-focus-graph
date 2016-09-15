import React from 'react';
import reactReduxStoreShape from 'react-redux/lib/utils/storeShape';
import find from 'lodash/find';

const SelectComponent = ({
    values,
    value,
    onChange,
    name,
    valid,
    error
}) => {

    return (
        <div>
            <select name={name} onChange={onChange} value={value}>
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
