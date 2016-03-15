import React, {PropTypes} from 'react';

function Button({onClick, children, options}) {
    const optionsClassName = options.map(opt => `mdl-button--${opt}`).join(' ');
    return (
    <button className={`mdl-button mdl-js-button ${optionsClassName}`} onClick={onClick}>
      {children}
    </button>
  );
}


Button.displayName = 'Button';
Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.string)
};
Button.defaultProps = {
    options: []
}
export default Button;
