import React from 'react';
const NoMatch = props => {
  return <div>
    <h3>No route matches the url you just type, please check the router of your app...</h3>
    <pre><code>{JSON.stringify(props, null, 2)}</code></pre>
  </div>
}
export default NoMatch;
