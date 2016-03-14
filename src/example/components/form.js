import React, {PropTypes} from 'react';

function Form({onSubmit, children}) {
    return (
      <form action={onSubmit}>
          {children}
      </form>

  );
}

Form.displayName = 'Form';
Form.propTypes = {
    onSubmit: PropTypes.func.isRequired
};
export default Form;
