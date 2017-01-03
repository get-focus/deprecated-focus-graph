import React, {PropTypes} from 'react';
import reactReduxStoreShape from 'react-redux/lib/utils/storeShape';
import find from 'lodash/find';

const SelectComponent = ({
    values,
    value,
    onChange,
    name,
    valid,
    error,
    ...otherProps
}) => {
    const wrappedOnChange = ({target:{value}}) => {
        onChange(value);
    }
    return (
        <div>
            <select name={name} onChange={wrappedOnChange} value={value}>
                <option value={null}></option>
                {values.map(element => {
                    return <option key={element.code} value={element.code} selected={element.isDefaultValue}>{element.label}</option>
                })}
            </select>
            {!valid && <b style={{color: 'red'}}>{error}</b>}
        </div>
    );
};

SelectComponent.propTypes = {
    error: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    valid: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    values: PropTypes.array
};
SelectComponent.defaultProps = {
    values: []
};
SelectComponent.contextTypes = {
    store: reactReduxStoreShape
};
export default SelectComponent;
