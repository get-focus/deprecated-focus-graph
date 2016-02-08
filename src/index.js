import React , { Component , PropTypes } from 'react';

import SmartExampleComponent from './components/smart';

const fields = {
  firstName: 'Pierre',
  lastName: 'Besson'
};


export default function App(){
  return (
    <div>
      <h1>Example</h1>
      <SmartExampleComponent fields={fields} />
    </div>
  )
}
