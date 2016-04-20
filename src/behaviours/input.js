import React, {Component} from 'react';

const InputBehaviour = InputComponent => class WrappedInputComponent extends Component {
    state = {typing: false};

    onTypingBeginning = () => {
        this.setState({typing: true});
    };

    onTypingEnd = () => {
        this.setState({typing: false});
    };

    render() {
        const {onTypingBeginning, onTypingEnd} = this;
        const {typing} = this.state;
        return (<InputComponent {...this.props} onTypingBeginning={onTypingBeginning} onTypingEnd={onTypingEnd} typing={typing}/>)
    }
};

export default InputBehaviour;
