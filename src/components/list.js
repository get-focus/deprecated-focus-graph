import React, {PropTypes} from 'react';

function List({onClick, lineComponent, children, options}) {
    const renderLine = () => {
         return (
           <div>
             <div>Bonjour ! </div>
             <div>Bonjour ! </div>
           </div>

         )
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
