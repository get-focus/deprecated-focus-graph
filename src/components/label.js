import React, {PropTypes} from 'react';

function Label({name, text}) {
    const content = text || name;
    return (
        <label data-focus='label' htmlFor={name}>
            {content}
        </label>
    );
}

Label.propTypes = {
    name: PropTypes.string.isRequired,
    text: PropTypes.string
};
export default Label;
