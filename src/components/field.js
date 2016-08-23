import React, {PropTypes} from 'react';
import DefaultInputComponent from './input';
import DefaultDisplayComponent from './display';
import DefaultSelectComponent from './select';
import DefaultListComponent from './list';
import DefaultTextComponent from './text';
import DefaultSelectDisplayComponent from './select-display';

const FieldLabelValueComponent = ({label, ValueComponent}) => (
    <div className='field'>
        <div><b>{label}</b></div>
        {ValueComponent}
    </div>
);
FieldLabelValueComponent.displayName = 'FieldLabelValueComponent';


function Field({multiple, list,fieldFor,fieldForLine,  ...otherProps}) {
    otherProps.value = otherProps.rawInputValue; https://github.com/get-focus/focus-redux/issues/39 compatibility with focus components
    const {DisplayComponent = DefaultDisplay, InputComponent = DefaultInputComponent, SelectComponent = DefaultSelectComponent, SelectComponentDisplay= DefaultSelectDisplayComponent, ListComponent = DefaultListComponent} = otherProps.metadata;
    const renderConsult = () => list ?  <ListComponent fieldForLine={fieldForLine} values={otherProps.formattedInputValue} {...otherProps}/> : (multiple ? <SelectComponentDisplay {...otherProps} /> : <DisplayComponent {...otherProps} />);
    const renderEdit = () => list ?  <ListComponent fieldForLine={fieldForLine} values={otherProps.formattedInputValue} {...otherProps}/> : (multiple ? <SelectComponent {...otherProps}/> : <InputComponent {...otherProps}/>);
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
