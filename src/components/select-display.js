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
    defaultValue,
    valid,
    masterDatum,
    ...otherProps
}, {store: {getState}}) => {
    const {masterData = []} = getState();
    const masterDatumObject = find(masterData, {name: masterDatum}) || {value: []};

    const {value: values} = masterDatumObject;
    const defaultValueSelect = values ? defaultValue ? defaultValue : get(values.find(element => element.isDefaultValue), 'code') : rawInputValue;

    const label = renderLabelOfCode(values, rawInputValue || defaultValueSelect);
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
