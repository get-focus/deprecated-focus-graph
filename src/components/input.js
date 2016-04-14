import React from 'react';

const InputComponent = ({name, value, onChange, ...otherProps}) => (
    <div className='mdl-textfield mdl-js-textfield'>
        <input className='mdl-textfield__input' type='text' id={name} value={value} onChange={({target:{value}}) => onChange(value)} {...otherProps}/>
        <label className='mdl-textfield__label' htmlFor={name}>{name}</label>
    </div>
);

export default InputComponent;
