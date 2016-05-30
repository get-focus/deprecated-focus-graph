import React, {PropTypes} from 'react';

function Line({onClick, children, fieldForLine, options,index, value,error,  ...otherProps}) {
    return (
    <div>
        <div>  {fieldForLine('firstName', {entityPath: 'child'}, index)}<span> {error ? (error.propertyNameLine === 'firstName' ? error.error : "") : ""}</span> </div>
        <div>  {fieldForLine('lastName', {entityPath: 'child'}, index)} <span> {error ? (error.propertyNameLine === 'lastName' ? error.error : "") : ""}</span> </div>
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
