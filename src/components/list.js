import React, {PropTypes} from 'react';


function List({onClick, fieldForLine, LineComponent, children, options, error, values, ...otherProps}) {
    const renderLine = () => {
    return (values ? values.map((element, index) => {
            return <LineComponent key={otherProps.idField ? element[idField]: index} value={element}   fieldForLine={fieldForLine} index={index} {...otherProps}/>
         }): <div></div>) // todo: null ?
    }
    return (
      <div className='list'> {renderLine()}</div>
  );
}


List.displayName = 'List';
List.propTypes = {
    LineComponent: PropTypes.func.isRequired,
    fieldForLine: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.string)
};
List.defaultProps = {
    options: []
}
export default List;