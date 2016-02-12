import React , { Component , PropTypes } from 'react';
import { Provider as StoreProvider} from 'react-redux';
import {Provider as DefinitionsProvider} from './behaviours/definitions';
import {Provider as FieldHelpersProvider} from './behaviours/field';
import ConnectedSmartComponentExample from './components/smart';
import ConnectedDumbComponentExample from './components/dumb';
import UserDumbComponent from './components/user-dumb';


import store from './store';

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
        <FieldHelpersProvider>
          <div>
            <h1>Example Dumb</h1>
            <ConnectedDumbComponentExample id={1234} />
            <h1>User Dumb</h1>
            <UserDumbComponent id={1234} />
          </div>
        </FieldHelpersProvider>
      </StoreProvider>
    </DefinitionsProvider>
  )
}
