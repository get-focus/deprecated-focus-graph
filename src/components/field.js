import React, {PropTypes} from 'react';
import DefaultInputComponent from './input';
import DefaultSelectComponent from './select';

function Field({multiple, ...otherProps}) {
    const {InputComponent = DefaultInputComponent, SelectComponent = DefaultSelectComponent} = otherProps.metadata;
    const renderConsult = () => (
        <div>{otherProps.formattedInputValue}</div>
    );
    const renderEdit = () => multiple ? <SelectComponent {...otherProps}/> : <InputComponent {...otherProps}/>;
    return (
        <div className='field'>
            <div><b>{otherProps.name}</b></div>
            {otherProps.editing ? renderEdit() : renderConsult()}
        </div>
    );
}

Field.displayName = 'Field';
Field.propTypes = {
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    name: PropTypes.string.isRequired
};

export default Field;
