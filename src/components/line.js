import React, {PropTypes} from 'react';

function Line({onClick, children, fieldForLine, options,index, value, ...otherProps}) {
    return (
    <div>
        <div>  {fieldForLine('firstName', {entityPath: 'child'}, index)}</div>
        <div>  {fieldForLine('lastName', {entityPath: 'child'}, index)} </div>
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
