import React, {PropTypes, PureComponent} from 'react';
import {isEqual} from 'lodash';

class List extends PureComponent {

    shouldComponentUpdate(nextProps){

      //if(!isEqual(nextProps.values, this.props.values)) {console.log('Je ne me rends pas je suis un malade'); return true;}
      return true;
    }
    _renderLine () {
    const { fieldForLine, selectForLine, textForLine, LineComponent, children, options, values, ...otherProps} = this.props
    return (values ? values.map((element, index) => {
            // fieldFor which wrapp the index.
            const lineFieldFor = (linePropertyName, lineOptions) => fieldForLine(linePropertyName, lineOptions, index)
            const selectFieldFor = (linePropertyName, lineOptions) => selectForLine(linePropertyName, lineOptions, index)
            const textFieldFor = (linePropertyName, lineOptions) => textForLine(linePropertyName, lineOptions, index)

            return <LineComponent key={otherProps.idField ? element[idField]: index} value={element} fieldForLine={lineFieldFor} textForLine={textFieldFor} selectForLine={selectFieldFor} index={index} {...otherProps}/>
         }): <div></div>) // todo: null ?
    }
    render() {
      return (
        <div className='list'>{this._renderLine()}</div>
      );
    }
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
