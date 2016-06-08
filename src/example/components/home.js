import React from 'react';
import Card from './card';

const routes = [
  {route: '/user/1234/adress', destination: 'Adress', description: 'Composant user avec une adresse', title: 'adress'},
  {route: '/user/1234/form', destination: 'Form', description: 'Composant user avec un superbe form', title: 'form'},
  {route: '/user/1234/custom', destination: 'Custom', description: 'Composant user avec un superbe form custom', title: 'custom'},
  {route: '/user/1234/display', destination: 'Custom', description: 'Composant user avec un superbe form display', title: 'display'}
];

const Home = props => <div style={{display: 'flex', flexWrap: 'wrap'}}>{routes.map(route => <Card key={route.route} {...route} />)}</div>;

export default Home;
