import React, {PropTypes} from 'react';

function Line({onClick, children, options}) {
    return (
    <div>
      Je suis une ligne et cest vraiment trop ouf!
    </div>
  );
}


Line.displayName = 'Line';
Line.propTypes = {
    onClick: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.string)
};
Line.defaultProps = {
    options: []
}
export default Line;
