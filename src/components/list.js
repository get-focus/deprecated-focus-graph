import React, {PropTypes} from 'react';
import DefaultLineComponent from './line'


function List({onClick, fieldForLine, lineComponent, children, options, error, values, ...otherProps}) {
    const renderEditLine = () => {
         return (
           <div>
             <div>Bonjour ! </div>
             <div>Bonjour ! </div>
           </div>

         )
    }
    const renderLine = () => {
    return (values ? values.map((element, index) => {
            return <DefaultLineComponent value={element} error={error[index]}  fieldForLine={fieldForLine} index={index}/>
         }): <div></div>)
    }
    return (
      <div className='list'> {renderLine()}</div>
  );
}


List.displayName = 'List';
List.propTypes = {
    lineComponent: PropTypes.element,
    onClick: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.string)
};
List.defaultProps = {
    options: []
}
export default List;
