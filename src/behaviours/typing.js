import React, {Component} from 'react';
import isEqual from 'lodash/isEqual';

const TypingBehaviour = InputComponent => class WrappedInputComponent extends Component {
    state = {typing: false};

    onTypingBeginning = () => {
        this.setState({typing: true});
    };

    onTypingEnd = () => {
        this.setState({typing: false});
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (!isEqual(this.props, nextProps) || (!isEqual(this.state, nextState)));
    }

    render() {
        const {onTypingBeginning, onTypingEnd} = this;
        const {typing} = this.state;
        return (<InputComponent {...this.props} onTypingBeginning={onTypingBeginning} onTypingEnd={onTypingEnd} typing={typing}/>)
    }
};

export default TypingBehaviour;
