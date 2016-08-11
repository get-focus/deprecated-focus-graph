import React, {PropTypes} from 'react';
import DefaultInputComponent from './input';
import DefaultDisplayComponent from './display';
import DefaultSelectComponent from './select';
import DefaultListComponent from './list';
import DefaultTextComponent from './text';


function Field({textOnly, multiple, list, fieldFor, fieldForLine, ...otherProps}) {
    const {TextComponent = DefaultTextComponent, DisplayComponent = DefaultDisplayComponent, InputComponent = DefaultInputComponent, SelectComponent = DefaultSelectComponent, ListComponent = DefaultListComponent} = otherProps.metadata;
    if(textOnly) {
        return <TextComponent {...otherProps} />
    }
    otherProps.value = otherProps.rawInputValue; //https://github.com/get-focus/focus-redux/issues/39 compatibility with focus components
    const renderConsult = () => (list ? <ListComponent fieldForLine={fieldForLine} values={otherProps.formattedInputValue} {...otherProps}/> : <DisplayComponent {...otherProps} /> );
    const renderEdit = () => list ? <ListComponent fieldForLine={fieldForLine} values={otherProps.formattedInputValue} {...otherProps}/> : (multiple ? <SelectComponent {...otherProps}/> : <InputComponent {...otherProps}/>);
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
