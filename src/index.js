import React , { Component , PropTypes } from 'react';

import SmartExampleComponent from './components/smart';

const fields = {
  firstName: {name: 'firstName', value:'Pierre'},
  lastName: {name: 'lastName', value: 'Besson'}
};


export default function App(){
  return (
    <div>
      <h1>Example</h1>
      <SmartExampleComponent fields={fields} />
    </div>
  )
}
