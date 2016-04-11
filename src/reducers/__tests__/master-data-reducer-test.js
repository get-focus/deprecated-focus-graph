import {REQUEST_MASTER_DATA, RESPONSE_MASTER_DATA, ERROR_MASTER_DATA} from '../../actions/master-data';
import masterDataReducer from '../master-data';
import {isArray} from 'lodash/lang'
const EMPY_INITIAL_STATE  = [];
const MOCK_VALUE_MASTER_DATA = [{code: 1, label: 'Un'}, {code: 2, label: 'Deux'}];
describe('The master data reducer', () => {

    describe('when receiving an unknown action with no initial state', () => {
      const newState = masterDataReducer();
      it('should return an array', () => {
          expect(isArray(newState)).to.be.true;
      });
    });

    describe('when receiving an unknown action with an initial state', () => {
        const INITIAL_STATE = [{name: 'A', value: 'a'}];
        const newState = masterDataReducer(INITIAL_STATE);
        it('should return the initial state', () => {
            expect(newState).to.equal(INITIAL_STATE);
        });
    });

    describe('when receiving an action with an unknown type', () => {
        const newState = masterDataReducer(EMPY_INITIAL_STATE, {type: 'UNKNOWN'});
        it('should return the initial state', () => {
            expect(newState).to.equal(EMPY_INITIAL_STATE);
        });
    });
    describe('when receiving an action with REQUEST_MASTER_DATA', () => {
        const ACTION_REQUEST_MASTER_DATA = {
          type: REQUEST_MASTER_DATA,
          value: MOCK_VALUE_MASTER_DATA,
          name: 'chiffres'
        };
        const updateItem = {
          name: ACTION_REQUEST_MASTER_DATA.name,
          value: ACTION_REQUEST_MASTER_DATA.value,
          loading: true
        };
        describe('when the state does not contain the master data', () => {
          const INITIAL_STATE = [{name: 'A', value: 'a'}]
          const newState = masterDataReducer(INITIAL_STATE, ACTION_REQUEST_MASTER_DATA);
          it('shoud return a new array with the new master data in the **loading** state', () => {
            expect(newState).to.be.an.array;
            expect(newState.length).to.equal(INITIAL_STATE.length + 1);
            expect(newState.find(m => m.name === ACTION_REQUEST_MASTER_DATA.name))
            .to.deep.equal(updateItem);
          });
        });
        describe('when the state contains the master data', () => {
          const INITIAL_STATE = [{name: 'A', value: 'a'}, {name: 'chiffres', value: [{code: 'lol', value: 'lol'}]}];
          const newState = masterDataReducer(INITIAL_STATE, ACTION_REQUEST_MASTER_DATA);
          it('should return a new array of the same length with an updated master data in the **loading** state', () => {
            expect(newState).to.be.an.array;
            expect(newState.length).to.equal(INITIAL_STATE.length);
            expect(newState.find(m => m.name === ACTION_REQUEST_MASTER_DATA.name))
            .to.deep.equal(updateItem);
          });
        });
    });


    describe('when receiving an action with RESPONSE_MASTER_DATA', () => {
        const ACTION_RESPONSE_MASTER_DATA = {
          type: RESPONSE_MASTER_DATA,
          value: MOCK_VALUE_MASTER_DATA,
          name: 'chiffres'
        };
        const updateItem = {
          name: ACTION_RESPONSE_MASTER_DATA.name,
          value: ACTION_RESPONSE_MASTER_DATA.value,
          loading: false
        };
        describe('when the state does not contain the master data', () => {
          const INITIAL_STATE = [{name: 'A', value: 'a'}]
          const newState = masterDataReducer(INITIAL_STATE, ACTION_RESPONSE_MASTER_DATA);
          it('shoud return a new array with the new master data in the **loading** state', () => {
            expect(newState).to.be.an.array;
            expect(newState.length).to.equal(INITIAL_STATE.length + 1);
            expect(newState.find(m => m.name === ACTION_RESPONSE_MASTER_DATA.name))
            .to.deep.equal(updateItem);
          });
        });
        describe('when the state contains the master data', () => {
          const INITIAL_STATE = [{name: 'A', value: 'a'}, {name: 'chiffres', value: [{code: 'lol', value: 'lol'}]}];
          const newState = masterDataReducer(INITIAL_STATE, ACTION_RESPONSE_MASTER_DATA);
          it('should return a new array of the same length with an updated master data in the **loading** state', () => {
            expect(newState).to.be.an.array;
            expect(newState.length).to.equal(INITIAL_STATE.length);
            expect(newState.find(m => m.name === ACTION_RESPONSE_MASTER_DATA.name))
            .to.deep.equal(updateItem);
          });
        });
    });

    describe('when receiving an action with ERROR_MASTER_DATA', () => {
        const ACTION_ERROR_MASTER_DATA = {
          type: ERROR_MASTER_DATA,
          error: 'Problem during the list loading',
          name: 'chiffres'
        };
        const updateItem = {
          name: ACTION_ERROR_MASTER_DATA.name,
          error: ACTION_ERROR_MASTER_DATA.error,
          loading: false
        };
        describe('when the state does not contain the master data', () => {
          const INITIAL_STATE = [{name: 'A', value: 'a'}]
          const newState = masterDataReducer(INITIAL_STATE, ACTION_ERROR_MASTER_DATA);
          it('shoud return a new array with the new master data in the **loading** state', () => {
            expect(newState).to.be.an.array;
            expect(newState.length).to.equal(INITIAL_STATE.length + 1);
            expect(newState.find(m => m.name === ACTION_ERROR_MASTER_DATA.name))
            .to.deep.equal(updateItem);
          });
        });
        describe('when the state contains the master data', () => {
          const INITIAL_STATE = [{name: 'A', value: 'a'}, {name: 'chiffres', value: [{code: 'lol', value: 'lol'}]}];
          const newState = masterDataReducer(INITIAL_STATE, ACTION_ERROR_MASTER_DATA);
          it('should return a new array of the same length with an updated master data in the **loading** state', () => {
            expect(newState).to.be.an.array;
            expect(newState.length).to.equal(INITIAL_STATE.length);
            expect(newState.find(m => m.name === ACTION_ERROR_MASTER_DATA.name))
                .to.deep.equal(updateItem);
          });
        });
    });


});
