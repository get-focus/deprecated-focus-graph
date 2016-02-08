import React , { Component , PropTypes } from 'react';
import { Provider as StoreProvider} from 'react-redux';
import {Provider as DefinitionsProvider} from './behaviours/definitions';
import ConnectedSmartComponentExample from './components/smart';
import store from './store';
const fields = {
  firstName: {name: 'firstName', value:'Pierre'},
  lastName: {name: 'lastName', value: 'Besson'}
};

const definitions = {
  user:{
    firstName: { domain: 'DO_RODRIGO', isRequired: false},
    lastName: { domain: 'DO_DON_DIEGO', isRequired: true},
  }
}

export default function App(){
  return (
    <DefinitionsProvider definitions={definitions}>
      <StoreProvider store={store}>
        <div>
          <h1>Example</h1>
          <ConnectedSmartComponentExample id={1234} fields={fields} />
        </div>
      </StoreProvider>
    </DefinitionsProvider>
  )
}
