import React, {PropTypes} from 'react';

function Field({name, value, error, dirty, onChange, ...otherProps}) {
    return (
        <div>
            <div>{name}</div>
            <div className='mdl-textfield mdl-js-textfield'>
                <input className='mdl-textfield__input' type='text' id={name} value={value} onChange={({target:{value}}) => onChange(value)} {...otherProps}/>
                <label className='mdl-textfield__label' htmlFor={name}>{name}</label>
            </div>
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
