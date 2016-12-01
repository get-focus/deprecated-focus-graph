import React, {PropTypes} from 'react';
import i18next from 'i18next';

function Label({name, text}) {
    const content = i18next.t(text || name);
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
