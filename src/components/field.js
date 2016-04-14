import React, {PropTypes} from 'react';

function Field({name, value, error, dirty, onChange, metadata, editing, ...otherProps}) {
    const {InputComponent} = metadata;
    const renderConsult = () => (
        <div>{value}</div>
    );
    const renderEdit = () => (
        <InputComponent name={name} value={value} onChange={onChange} {...otherProps}/>
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
    error: PropTypes.bool,
    name: PropTypes.string.isRequired,
    //  value: PropTypes.object
};

export default Field;
