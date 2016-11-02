import React, {PropTypes} from 'react';


function List({ fieldForLine, selectForLine, textForLine, LineComponent, children, options, error, values, ...otherProps}) {
    const renderLine = () => {
    return (values ? values.map((element, index) => {
            // fieldFor which wrapp the index.
            const lineFieldFor = (linePropertyName, lineOptions) => fieldForLine(linePropertyName, lineOptions, index)
            const selectFieldFor = (linePropertyName, lineOptions) => selectForLine(linePropertyName, lineOptions, index)
            const textFieldFor = (linePropertyName, lineOptions) => textForLine(linePropertyName, lineOptions, index)

            return <LineComponent key={otherProps.idField ? element[idField]: index} value={element} fieldForLine={lineFieldFor} textForLine={textFieldFor} selectForLine={selectFieldFor} index={index} {...otherProps}/>
         }): <div></div>) // todo: null ?
    }
    return (
      <div className='list'>{renderLine()}</div>
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
