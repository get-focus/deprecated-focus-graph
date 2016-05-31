//Style
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'material-design-lite/material.css';
import 'material-design-lite/material.min';
import './style.scss';

//Browser polyfill
import 'babel-polyfill';

// libs
import React , { Component , PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router,IndexRoute, Route, Link, hashHistory } from 'react-router'
import moment from 'moment';

//Provider to set config
import {Provider as StoreProvider} from 'react-redux';
import {Provider as MetadataProvider} from '../behaviours/metadata';
import {Provider as FieldHelpersProvider} from '../behaviours/field';
import {Provider as MasterDataProvider} from '../behaviours/master-data';

import DevTools from './containers/dev-tools';

//Components
import UserAddressForm from './components/user-and-address-form';
import UserForm from './components/user-form';
import CustomUserForm from './components/custom-user-form';
import paramExtractor from './components/param-extractor';
import NoMatch from './components/no-match';
import Home from './components/home';
//configuration
import store from './store';
import {definitions, domains, masterDataConfig} from './config';
moment.locale('fr');

const App = ({children}) => {
    return (
        <StoreProvider store={store}>
            <MetadataProvider definitions={definitions} domains={domains}>
                <MasterDataProvider configuration={masterDataConfig}>
                    <div>
                        <DevTools />
                        <FieldHelpersProvider>
                          {children}
                        </FieldHelpersProvider>
                    </div>
                </MasterDataProvider>
            </MetadataProvider>
        </StoreProvider>
    )
}

const Layout = (props) => {
  const PAGE_TITLE = 'Great example page';
  return (
    <div className='mdl-layout'>
        <header className='mdl-layout__header'>
            <div className='mdl-layout__header-row'>
                <span className='mdl-layout-title'>{PAGE_TITLE}</span>
                <div className='mdl-layout-spacer'></div>
                <nav className='mdl-navigation mdl-layout--large-screen-only'>
                  <Link className='mdl-navigation__link' to='/user/1234/adress'>Adress</Link>
                  <Link className='mdl-navigation__link'  to='/user/1234/form'>form</Link>
                  <Link className='mdl-navigation__link'  to='/user/1234/custom'>custom</Link>
                </nav>
            </div>
        </header>
        {/*
          <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">Title</span>
          <nav className="mdl-navigation">
            <Link className='mdl-navigation__link' to='/user/1234/adress'>Adress</Link>
            <Link className='mdl-navigation__link'  to='/user/1234/form'>form</Link>
            <Link className='mdl-navigation__link'  to='/user/1234/custom'>custom</Link>
          </nav>
        </div>
        */}
        <main className='mdl-layout__content' style={{zIndex: 3}}>
            <App {...props}/>
        </main>
      <footer className='mdl-mini-footer'>
        <div className="mdl-mini-footer__left-section">
          <div className="mdl-logo">In order to display the devtools press `ctrl-h`</div>
        </div>

      </footer>
    </div>
  );
}

// Create the react component when the DOM is loaded.
document.addEventListener('DOMContentLoaded', event => {
    const pe = paramExtractor;
    const rootElement = document.querySelector(`.${__ANCHOR_CLASS__}`);
    // The child must be wrapped in a function
    // to work around an issue in React 0.13.
    ReactDOM.render(
      <Router history={hashHistory}>
        <Route path="/" component={Layout}>
          <IndexRoute component={Home} />
          <Route path="user/:id/adress" component={pe(UserAddressForm)} />
          <Route path="user/:id/form" component={pe(UserForm)} />
          <Route path="user/:id/custom" component={pe(CustomUserForm)} />

          <Route path="*" component={NoMatch}/>
        </Route>
      </Router>,
        rootElement);
    });
