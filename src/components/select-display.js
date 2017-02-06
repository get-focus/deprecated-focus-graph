import React from 'react';
import reactReduxStoreShape from 'react-redux/lib/utils/storeShape';
import find from 'lodash/find';
import get from 'lodash/get'
import i18n from 'i18next';
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
    const defaultValue = values ? values.find(element => element.isDefaultValue) : rawInputValue;

    const label = renderLabelOfCode(values, rawInputValue || get(defaultValue, 'code'));
    return (
        <div>
          {i18n.t(label)}
        </div>
    );
};

SelectComponent.contextTypes = {
    store: reactReduxStoreShape
};

export default SelectComponent;
