import React, {PropTypes} from 'react';
const Line =  ({onClick, children, fieldForLine, textForLine,options,index,selectForLine,  ...otherProps}) => {
    return (
    <div>
        <div>  {fieldForLine('firstName', {entityPath: 'user.child',  editing: false})} </div>
        {selectForLine('firstName', {entityPath: 'user.child', masterDatum: 'civility'})}
        {textForLine('firstName', {entityPath: 'user.child', editing: false})}
        <div>  {fieldForLine('lastName', {entityPath: 'user.child', metadata:{InputComponent: props=> <div>Victoire</div>}})}  </div>
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
