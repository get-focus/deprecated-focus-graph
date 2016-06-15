import React, {PropTypes} from 'react';
import DefaultInputComponent from './input';
import DefaultDisplay from './display';
import DefaultSelectComponent from './select';

//Field component
// It is a wrapper around the component which will be rendered givent the options and the domain informations provided to it.
function Field({multiple, ...otherProps}) {
    const {DisplayComponent = DefaultDisplay, InputComponent = DefaultInputComponent, SelectComponent = DefaultSelectComponent} = otherProps.metadata;
    const renderConsult = () => <DisplayComponent value={otherProps.formattedInputValue} />
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
    name: PropTypes.string.isRequired,
    multiple: PropTypes.bool
};

export default Field;
