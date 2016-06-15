import moment from 'moment';
import {loadCivility} from './services/load-civility';
const format = ['DD/MM/YYYY', 'DD-MM-YYYY', 'D MMM YYYY'];

export const definitions = {
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

export const domains = {
    DO_RODRIGO: {
        type: 'text',
        validator: [{
            type: 'string',
            options: {
                maxLength: 50
            }
        }],
         formatter: value => value + ' - formaté rodrigo'
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
};

export const masterDataConfig  = [{name: 'civility', service: loadCivility}];
