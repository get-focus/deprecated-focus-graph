import React , { Component , PropTypes } from 'react';
import { Provider } from 'react-redux';
import ConnectedSmartComponentExample from './components/smart';
import store from './store';
const fields = {
  firstName: {name: 'firstName', value:'Pierre'},
  lastName: {name: 'lastName', value: 'Besson'}
};


export default function App(){
  return (
    <Provider store={store}>
      <div>
        <h1>Example</h1>
        <ConnectedSmartComponentExample id={1234} fields={fields} />
      </div>
    </Provider>
  )
}
