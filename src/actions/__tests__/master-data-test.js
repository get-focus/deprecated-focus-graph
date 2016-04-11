import {loadMasterData} from '../master-data';
const NAME_SHOULD_BE_A_STRING = 'LOAD_MASTER_DATA_ACTION: the name parameter should be a string.';
const SERVICE_SHOULD_BE_A_FUNCTION = 'LOAD_MASTER_DATA_ACTION: the service parameter should be a function.';
const CACHE_DURATION_SHOULD_BE_A_NUMBER = 'LOAD_MASTER_DATA_ACTION: the cacheDuration parameter should be a number.';

const MOCKED_MASTER_DATA = [{code: 1, value: 'Un'}, {code: 2, value: 'Deux'}];
const MOCKED_SVC = () => Promise.resolve(MOCKED_MASTER_DATA);

describe('master data actions', () => {
  describe.only('loadMasterData', () => {
    describe('when called with wrong parameters', () => {
        it('should throw a LOAD_MASTER_DATA_ACTION  on the name error when called without all parameters', () => {
            expect(() => { loadMasterData()}).to.throw(Error, NAME_SHOULD_BE_A_STRING);
        });
        describe('when called with a wrong name parameter', () => {

          it('should throw a name error when called with a number', () => {
              expect(() => { loadMasterData(1)}).to.throw(Error, NAME_SHOULD_BE_A_STRING);
          });
          it('should throw a name error when called with a function', () => {
              expect(() => { loadMasterData(() => 'test')}).to.throw(Error, NAME_SHOULD_BE_A_STRING);
          });
          it('should throw a name error when called with an array', () => {
              expect(() => { loadMasterData([1,2,3])}).to.throw(Error, NAME_SHOULD_BE_A_STRING);
          });
          it('should throw a name error when called with an object', () => {
              expect(() => { loadMasterData({a: 'a'})}).to.throw(Error, NAME_SHOULD_BE_A_STRING);
          });
          it('should throw a service error when called with only a good name', () => {
            expect(() => { loadMasterData('chiffres')}).to.throw(Error, SERVICE_SHOULD_BE_A_FUNCTION);
          });

        });
        describe('when called with a wrong service parameter and a good name', () => {
          it('should throw a service error when called with a number', () => {
              expect(() => { loadMasterData('chiffres', 1)}).to.throw(Error, SERVICE_SHOULD_BE_A_FUNCTION);
          });
          it('should throw a service error when called with a string', () => {
              expect(() => { loadMasterData('chiffres','test')}).to.throw(Error, SERVICE_SHOULD_BE_A_FUNCTION);
          });
          it('should throw a service error when called with an array', () => {
              expect(() => { loadMasterData('chiffres', [1,2,3])}).to.throw(Error, SERVICE_SHOULD_BE_A_FUNCTION);
          });
          it('should throw a service error when called with an object', () => {
              expect(() => { loadMasterData('chiffres', {a: 'a'})}).to.throw(Error, SERVICE_SHOULD_BE_A_FUNCTION);
          });
          it('should not throw any service error when called with a good service (and a good name)', () => {
            expect(() => { loadMasterData('chiffres', MOCKED_SVC)}).to.not.throw(Error);
          });
        });
        describe('when called with a wrong cacheDuration paramaeter an with a good service and name parameters', () => {
          it('should throw a service error when called with a number', () => {
              expect(() => { loadMasterData('chiffres', MOCKED_SVC, () => 'lol')}).to.throw(Error, CACHE_DURATION_SHOULD_BE_A_NUMBER);
          });
          it('should throw a service error when called with a string', () => {
              expect(() => { loadMasterData('chiffres',MOCKED_SVC, 'test')}).to.throw(Error, CACHE_DURATION_SHOULD_BE_A_NUMBER);
          });
          it('should throw a service error when called with an array', () => {
              expect(() => { loadMasterData('chiffres',MOCKED_SVC,  [1,2,3])}).to.throw(Error, CACHE_DURATION_SHOULD_BE_A_NUMBER);
          });
          it('should throw a service error when called with an object', () => {
              expect(() => { loadMasterData('chiffres',MOCKED_SVC, {a: 'a'})}).to.throw(Error, CACHE_DURATION_SHOULD_BE_A_NUMBER);
          });
          it('should not throw any service error when called with a good service (and a good name)', () => {
            expect(() => { loadMasterData('chiffres', MOCKED_SVC, 123)}).to.not.throw(Error);
          });

        });

/*        it('should throw an error when called without a string name parameter', () => {
            const NAME_MESSAGE = 'ACTION_BUILDER: the name parameter should be a string.';
            expect(() => { loadMasterData({name: undefined})}).to.throw(NAME_MESSAGE);
            expect(() => { loadMasterData({name: 1})}).to.throw(NAME_MESSAGE);
            expect(() => { loadMasterData({name: {}})}).to.throw(NAME_MESSAGE);
            expect(() => { loadMasterData({name: () => {}})}).to.throw(NAME_MESSAGE);
            expect(() => { loadMasterData({name: ''})}).to.throw(NAME_MESSAGE);
            expect(() => { loadMasterData({name: 'test'})}).to.not.throw(NAME_MESSAGE);
        });
        it('should throw an error when called without a string type parameter : load,save,delete', () => {
            const TYPE_MESSAGE = 'ACTION_BUILDER: the type parameter should be a string and the value one of these: load,save,delete.';
            expect(() => { loadMasterData({name: 'test'})}).to.throw(TYPE_MESSAGE);
            expect(() => { loadMasterData({name: 'test', type: undefined})}).to.throw(TYPE_MESSAGE);
            expect(() => { loadMasterData({name: 'test', type: 1})}).to.throw(TYPE_MESSAGE);
            expect(() => { loadMasterData({name: 'test', type: {}})}).to.throw(TYPE_MESSAGE);
            expect(() => { loadMasterData({name: 'test', type: () => {}})}).to.throw(TYPE_MESSAGE);
            expect(() => { loadMasterData({name: 'test', type: ''})}).to.throw(TYPE_MESSAGE);
            expect(() => { loadMasterData({name: 'test', type: 'nimp'})}).to.throw(TYPE_MESSAGE);
            expect(() => { loadMasterData({name: 'test', type: 'load'})}).to.not.throw(TYPE_MESSAGE);
            expect(() => { loadMasterData({name: 'test', type: 'save'})}).to.not.throw(TYPE_MESSAGE);
            expect(() => { loadMasterData({name: 'test', type: 'delete'})}).to.not.throw(TYPE_MESSAGE);
        });
        */
    });
  })
});
