import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'material-design-lite/material.css';
import 'material-design-lite/material.min';
import 'babel-polyfill';
import './style.scss';

import React , { Component , PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Provider as StoreProvider} from 'react-redux';
import moment from 'moment';

import {Provider as MetadataProvider} from '../behaviours/metadata';
import {Provider as FieldHelpersProvider} from '../behaviours/field';
import {Provider as MasterDataProvider} from '../behaviours/master-data';

import UserAddressForm from './components/user-and-address-form';
import UserForm from './components/user-form';
import CustomUserForm from './components/custom-user-form';

import DevTools from './containers/dev-tools';
import {loadCivility} from './services/load-civility';
import store from './store';

moment.locale('fr');
const format = ['DD/MM/YYYY', 'DD-MM-YYYY', 'D MMM YYYY'];

const definitions = {
    user: {
        uuid: { domain: 'DO_RODRIGO', isRequired: false},
        firstName: { domain: 'DO_RODRIGO', isRequired: false},
        lastName: { domain: 'DO_DON_DIEGO', isRequired: true},
        date: { domain: 'DO_DATE', isRequired: false},
        civility: { domain: 'DO_CIVILITE', isRequired: true},
        childs : {redirect: 'child'}
    },
    child : {
      firstName : { domain: 'DO_RODRIGO', isRequired: false},
      lastName : { domain: 'DO_RODRIGO', isRequired: false}

    },
    address: {
        uuid: { domain: 'DO_RODRIGO', isRequired: false},
        city: { domain: 'DO_DON_DIEGO', isRequired: true}
    }
}

const domains = {
    DO_RODRIGO: {
        type: 'text',
        validator: [{
            type: 'string',
            options: {
                maxLength: 50
            }
        }]
    },
    DO_DON_DIEGO: {
        type: 'text',
        validator: [{
            type: 'string',
            options: {
                maxLength: 200
            }
        }],
        formatter: value => value + ' - formaté'
    },
    DO_DATE : {
        formatter: date => date ? moment(date, format).format('DD/MM/YYYY') : ''
    },
    DO_CIVILITE: {
        type: 'text',
        validator: [{
            type: 'string',
            options: {
                maxLength: 200
            }
        }]
    }
}

const App = () => {
    return (
        <StoreProvider store={store}>
            <MetadataProvider definitions={definitions} domains={domains}>
                <MasterDataProvider configuration={[{name: 'civility', service: loadCivility}]}>
                    <div>
                        <DevTools />
                        <FieldHelpersProvider>
                            <div>
                                <UserAddressForm id={1234}/>

                            </div>
                        </FieldHelpersProvider>
                    </div>
                </MasterDataProvider>
            </MetadataProvider>
        </StoreProvider>
    )
}

// Create the react component when the DOM is loaded.
document.addEventListener('DOMContentLoaded', (event) => {

    const rootElement = document.querySelector(`.${__ANCHOR_CLASS__}`);
    const PAGE_TITLE = 'Great example page';
    // The child must be wrapped in a function
    // to work around an issue in React 0.13.
    ReactDOM.render(
        <div className='mdl-layout  mdl-layout--fixed-header'>
            <header className='mdl-layout__header'>
                <div className='mdl-layout__header-row'>
                    <span className='mdl-layout-title'>{PAGE_TITLE}</span>
                    <div className='mdl-layout-spacer'></div>
                    <nav className='mdl-navigation mdl-layout--large-screen-only'>
                        <a className='mdl-navigation__link' href=''>Link</a>
                        <a className='mdl-navigation__link' href=''>Link</a>
                        <a className='mdl-navigation__link' href=''>Link</a>
                    </nav>
                </div>
            </header>
            <main className='mdl-layout__content' style={{zIndex: 3}}>
                <App />
            </main>
        </div>,
        rootElement);
    });
