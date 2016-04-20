import React, {PropTypes} from 'react';
import DefaultInputComponent from './input';

function Field(props) {
    const {InputComponent = DefaultInputComponent} = props.metadata;
    const renderConsult = () => (
        <div>{props.formattedInputValue}</div>
    );
    const renderEdit = () => (
        <InputComponent {...props} />
    );
    return (
        <div style={{display: 'flex', padding: 10}}>
            <div><b>{props.name}</b></div>
            {props.editing ? renderEdit() : renderConsult()}
        </div>
    );
}

Field.displayName = 'Field';
Field.propTypes = {
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    name: PropTypes.string.isRequired
};

export default Field;
