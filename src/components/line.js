import React, {PropTypes} from 'react';
const Line =  ({onClick, children, fieldForLine, textForLine,options,index,selectForLine,  ...otherProps}) => {
    return (
    <div>
        <div>  {fieldForLine('firstName', {entityPath: 'user.child'})} </div>
    </div>
  );
}


Line.displayName = 'Line';
Line.propTypes = {
    onClick: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.string)
};
Line.defaultProps = {
    options: []
}
export default Line;
