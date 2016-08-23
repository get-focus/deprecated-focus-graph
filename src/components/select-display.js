import React from 'react';
import reactReduxStoreShape from 'react-redux/lib/utils/storeShape';
import find from 'lodash/find';


function renderLabelOfCode(values, code){
  const element = values ? values.find(element => element.code === code) : [];
  const label = element ? element.label : "";
  return label;
}


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
    const {masterData = []} = getState();
    const masterDatumObject = find(masterData, {name: masterDatum}) || {value: []};
    const {value: values} = masterDatumObject;
    const label = renderLabelOfCode(values, rawInputValue);
    return (
        <div>
          {label}
        </div>
    );
};

SelectComponent.contextTypes = {
    store: reactReduxStoreShape
};

export default SelectComponent;
