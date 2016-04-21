import React from 'react';
import TypingBehaviour from '../behaviours/typing';

const InputComponent = ({
    name,
    rawInputValue,
    formattedInputValue,
    onChange,
    onBlur,
    error,
    valid,
    typing,
    onTypingBeginning,
    onTypingEnd,
    ...otherProps
}) => {
    const wrappedOnFocus = () => {
        onTypingBeginning();
    }
    const wrappedOnBlur = () => {
        onBlur();
        onTypingEnd();
    }
    return (
        <div className='mdl-textfield mdl-js-textfield'>
            <input className='mdl-textfield__input' type='text' id={name} value={typing ? rawInputValue : formattedInputValue} onChange={({target:{value}}) => onChange(value)} onFocus={wrappedOnFocus} onBlur={wrappedOnBlur}/>
            <label className='mdl-textfield__label' htmlFor={name}>{name}</label>
            {!valid && <b style={{color: 'red'}}>{error}</b>}
        </div>
    );
};

export default TypingBehaviour(InputComponent);
