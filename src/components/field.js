import React, {PropTypes} from 'react';
import DefaultInputComponent from './input';

const defaultFormatter = value => value;

function Field({name, rawInputValue, formattedInputValue, error, dirty, onChange, onBlur, metadata, editing, ...otherProps}) {
    const {InputComponent = DefaultInputComponent} = metadata;
    const renderConsult = () => (
        <div>{formattedInputValue}</div>
    );
    const renderEdit = () => (
        <InputComponent name={name} error={error} value={rawInputValue} onChange={onChange} onBlur={onBlur} {...otherProps}/>
    );
    return (
        <div style={{display: 'flex', padding: 10}}>
            <div><b>{name}</b></div>
            {editing ? renderEdit() : renderConsult()}
        </div>
    );
}

Field.displayName = 'Field';
Field.propTypes = {
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    name: PropTypes.string.isRequired
};

export default Field;
