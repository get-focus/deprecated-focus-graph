import moment from 'moment';
import React from 'react';

import {loadCivility} from './services/load-civility';
const format = ['DD/MM/YYYY', 'DD-MM-YYYY', 'D MMM YYYY'];
//import AutoCompleteSelect from 'focus-components/components/input/autocomplete-select/field';

const _querySearcher = query => {
    let data = [
        {
            key: 'JL',
            label: 'Joh Lickeur'
        },
        {
            key: 'GK',
            label: 'Guénolé Kikabou'
        },
        {
            key: 'YL',
            label: 'Yannick Lounivis'
        }
    ];
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data,
                totalCount: data.length
            });
        }, 500);
    });
};

const keyResolver = key => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve.bind(this, 'Resolved value'), 300);
    });
}

const querySearcher = query => {
  const data = [
      {
          key: 'NY',
          label: 'New York'
      },
      {
          key: 'PAR',
          label: 'Paris'
      },
      {
          key: 'TOY',
          label: 'Tokyo'
      },
      {
          key: 'BEI',
          label: 'Pékin'
      },
      {
          key: 'LON',
          label: 'Londres'
      },
      {
          key: 'BER',
          label: 'Berlin'
      }
  ].filter(({key, label}) => label.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data,
                totalCount: 40
            });
        }, 200);
    });
}


export const definitions = {
    user: {
  information: {
        uuid: { domain: 'DO_DON_DIEGO', isRequired: true},
        firstName: { domain: 'DO_RODRIGO', isRequired: false},
        lastName: { domain: 'DO_DON_DIEGO', isRequired: true},
        date: { domain: 'DO_DATE', isRequired: false},
        test: {domain: 'DO_DON_DIEGO', isRequired:true},
        civility: { domain: 'DO_CIVILITE', isRequired: true},
        // TODO: ['childs'] ?
        childs : {redirect: ['user.child']}
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
}

export const domains = {
    DO_RODRIGO: {
        type: 'text',
        validators: [{
            type: 'string',
            options: {
                maxLength: 2
            }
        }],
         formatter: value => value + ' - formaté rodrigo',
    },
    DO_DON_DIEGO: {
        type: 'text',
        validators: [{
            type: 'string',
            options: {
                maxLength: 200
            }
        }],

    },
    DO_AUTOCOMPLETE: {
        type: 'text',
        validators: [{
            type: 'string',
            options: {
                maxLength: 200
            }
        }],
        formatter: value => value + ' - formaté',
        //DisplayComponent: props => <div><AutoCompleteSelect isEdit={false} querySearcher={querySearcher} placeholder={'Your search...'} keyResolver={keyResolver} {...props} />{JSON.stringify(props)}</div>,
        InputComponent:  props => <div>
        value: {props.value}
        {/*<AutoCompleteSelect isEdit={true} querySearcher={querySearcher} placeholder={'Your search...'} keyResolver={keyResolver} {...props} />*/}
        {JSON.stringify(props)}
        </div>

    },
    DO_DATE : {

        formatter: date => date ? moment(date, format).format('DD/MM/YYYY') : ''
    },
    DO_CIVILITE: {
        type: 'text',
        validators: [{
            type: 'string',
            options: {
                maxLength: 200
            }
        }]

    }
};

export const masterDataConfig  = [{name: 'civility', service: loadCivility}];
