import React, {Component, PureComponent, PropTypes} from 'react';
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


class Field extends PureComponent {

  render(){
    const {textOnly, multiple, list, fieldForLine, ...otherProps} = this.props;
    otherProps.value = otherProps.rawInputValue; //https://github.com/get-focus/focus-redux/issues/39 compatibility with focus components
    console.log(otherProps.value)
    const {TextComponent = DefaultTextComponent, DisplayComponent = DefaultDisplayComponent, InputComponent = DefaultInputComponent, SelectComponent = DefaultSelectComponent,SelectComponentDisplay = DefaultSelectDisplayComponent, ListComponent = DefaultListComponent} = otherProps.metadata;
    const renderConsult = () => list ?  <ListComponent fieldForLine={fieldForLine} values={otherProps.formattedInputValue} {...otherProps}/> : (multiple ? <SelectComponentDisplay {...otherProps} /> : <DisplayComponent {...otherProps} />);
    const renderEdit = () => list ? <ListComponent fieldForLine={fieldForLine} values={otherProps.formattedInputValue} {...otherProps}/> : (multiple ? <SelectComponent {...otherProps}/> : <InputComponent {...otherProps}/>);
    const ValueComponent = otherProps.editing ? renderEdit() : renderConsult();
    return textOnly ? ValueComponent : <FieldLabelValueComponent label={otherProps.name} ValueComponent={ValueComponent} />;
  }
}





Field.displayName = 'Field';
Field.propTypes = {
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    name: PropTypes.string.isRequired,
    multiple: PropTypes.bool
};

export default Field;
