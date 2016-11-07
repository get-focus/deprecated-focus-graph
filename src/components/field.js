import React, {PureComponent, PropTypes} from 'react';
import Label from './label';
import DefaultInputComponent from './input';
import DefaultDisplayComponent from './display';
import DefaultSelectComponent from './select';
import SmartSelectComponent from './smart-select';
import DefaultListComponent from './list';
import DefaultTextComponent from './text';
import DefaultSelectDisplayComponent from './select-display';

const FieldLabelValueComponent = ({editing, isRequired, label, name, valid, ValueComponent, displayLabel, isRaw, index}) => (
    <div data-focus='field' className='mdl-grid' data-mode={editing ? 'edit' : 'consult'} data-required={isRequired} data-valid={valid}>
        <div data-focus='field-label-container' className={((isRaw && index === undefined) || index != undefined) ? '' : 'mdl-cell mdl-cell--top mdl-cell--4-col'}>
            {(displayLabel || (displayLabel === false && index != undefined) || displayLabel === undefined) && <Label name={name} text={label} />}
        </div>
        <div data-focus='field-value-container' className='mdl-cell mdl-cell--top mdl-cell--8-col' style={(index != undefined || isRaw) ? {marginTop: '0px'} : {}}>
            {ValueComponent}
            {editing && rawValid && <i className="material-icons">check</i>}
        </div>
    </div>
);
FieldLabelValueComponent.displayName = 'FieldLabelValueComponent';


class Field extends PureComponent {
    render() {
        const {textOnly, multiple, list, fieldForLine, index, ...otherProps} = this.props;
        const {
            TextComponent = DefaultTextComponent,
            DisplayComponent = DefaultDisplayComponent,
            InputComponent = DefaultInputComponent,
            SelectComponent = DefaultSelectComponent,
            SelectDisplayComponent = DefaultSelectDisplayComponent,
            ListComponent = DefaultListComponent
        } = otherProps.metadata;
        const renderConsult = () => list ?  <ListComponent fieldForLine={fieldForLine} values={otherProps.formattedInputValue} {...otherProps}/> : (multiple ? <SelectDisplayComponent {...otherProps} /> : <DisplayComponent  {...otherProps} />);
        const renderEdit = () => list ? <ListComponent fieldForLine={fieldForLine} values={otherProps.formattedInputValue} {...otherProps}/> : (multiple ? <SmartSelectComponent SelectComponent={SelectComponent} {...otherProps}/> : <InputComponent {...otherProps}/>);
        const ValueComponent = otherProps.editing ? renderEdit() : renderConsult();
        return textOnly ? ValueComponent : <FieldLabelValueComponent ValueComponent={ValueComponent} displayLabel={otherProps.displayLabel} isRaw={otherProps.isRaw} index={index} {...otherProps} />
}
}
Field.displayName = 'Field';
Field.propTypes = {
    error: PropTypes.string,
    name: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    displaLabel: PropTypes.bool,
    isRaw: PropTypes.bool
};
export default Field;
