import React from 'react';

const InputComponent = ({name, value, onChange, onBlur, error, valid, ...otherProps}) => (
    <div className='mdl-textfield mdl-js-textfield'>
        <input className='mdl-textfield__input' type='text' id={name} value={value} onChange={({target:{value}}) => onChange(value)} onBlur={onBlur} {...otherProps}/>
        <label className='mdl-textfield__label' htmlFor={name}>{name}</label>
        {!valid && <b style={{color: 'red'}}>{error}</b>}
    </div>
);

export default InputComponent;