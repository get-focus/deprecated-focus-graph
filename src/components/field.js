import React, {PropTypes} from 'react';

function Field({name, value, error, onChange}) {
    return (
      <div className='mdl-textfield mdl-js-textfield'>
        <input className='mdl-textfield__input' type='text' id={name} value={value} onChange={({target:{value}}) => onChange(value)}/>
        <label className='mdl-textfield__label' htmlFor={name}>{name}</label>
      </div>
  );
}

Field.displayName = 'Field';
Field.propTypes = {
    error: PropTypes.object,
    name: PropTypes.string.isRequired,
//  value: PropTypes.object
};

export default Field;
