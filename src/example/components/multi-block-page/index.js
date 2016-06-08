import React, {Component} from 'react';
import {loadMixedAction, saveMixedAction} from '../actions/mixed-actions';

class MultiBlockPage extends Component {
  componentWillMount(){
    loadMixedAction()
  }
  render(){
    //
    const {} = this.props;

  }
}
