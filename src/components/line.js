import React, {PropTypes} from 'react';
const Line =  ({onClick, children, fieldForLine, textForLine,options,index,selectForLine,  ...otherProps}) => {
    console.log(otherProps)
    return (
    <div>
        <div>  {fieldForLine('firstName', {entityPath: 'user.child'})} </div>
        {selectForLine('firstName', {entityPath: 'user.child', masterDatum: 'civility'})}
        {textForLine('firstName', {entityPath: 'user.child'})}
        <div>  {fieldForLine('lastName', {entityPath: 'user.child'})}  </div>
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
