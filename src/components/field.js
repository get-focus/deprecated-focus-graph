import React, {PropTypes} from 'react';
import DefaultInputComponent from './input';
import DefaultSelectComponent from './select';
import DefaultListComponent from './list';



function Field({multiple, list, ...otherProps}) {
    const {InputComponent = DefaultInputComponent, SelectComponent = DefaultSelectComponent, ListComponent = DefaultListComponent} = otherProps.metadata;
    const renderConsult = () => ( list ? _.map(otherProps.formattedInputValue,
      element => {
        console.log(element);
        return ( <div>{element[0].firstName}</div> );
     })
 : <div>{otherProps.formattedInputValue}</div> );
    const renderEdit = () => list ?  <ListComponent {...otherProps}/> : (multiple ? <SelectComponent {...otherProps}/> : <InputComponent {...otherProps}/>);
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
