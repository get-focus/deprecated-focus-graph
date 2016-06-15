import React, {PropTypes} from 'react';
import DefaultLineComponent from './line'


function List({onClick, fieldForLine, LineComponent = DefaultLineComponent, children, options, error, values, ...otherProps}) {
    const renderLine = () => {
    return (values ? values.map((element, index) => {
            return <LineComponent value={element}   fieldForLine={fieldForLine} index={index}/>
         }): <div></div>) // todo: null ?
    }
    return (
      <div className='list'> {renderLine()}</div>
  );
}


List.displayName = 'List';
List.propTypes = {
    LineComponent: PropTypes.element.isRequired,
    fieldForLine: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.string)
};
List.defaultProps = {
    options: []
}
export default List;
