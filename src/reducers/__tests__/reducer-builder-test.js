import {createForm, destroyForm, SYNC_FORMS_ENTITY, toggleFormEditing} from '../../actions/form';
import {reducerBuilder} from '../reducer-builder';

describe('The reducer builder reducer', () => {
    describe('When no arguments are passed', () => {
      it('should throw an error', () => {
        const MSG = `Cannot read property 'defaultData' of undefined`;
        expect(() => reducerBuilder()).to.throw(MSG);
      })
    });
    describe('When the wrong or no name is passed', () => {
      it('should throw a error', () => {
        const MSG ='REDUCER_BUILDER: you need to provide a name.';
        expect(() => reducerBuilder({})).to.throw(MSG);
        expect(() => reducerBuilder({name: 1})).to.throw(MSG);
        expect(() => reducerBuilder({name: []})).to.throw(MSG);
        expect(() => reducerBuilder({name: null})).to.throw(MSG);
        expect(() => reducerBuilder({name: undefined})).to.throw(MSG);
        expect(() => reducerBuilder({name: 'lol'})).to.not.throw(MSG);
      })
    });
    describe('The load and save types', () => {
      const name = 'lol';
      const REQUEST_LOAD_LOL = 'REQUEST_LOAD_LOL';
      const RECEIVE_LOAD_LOL = 'RECEIVE_LOAD_LOL';
      const REQUEST_SAVE_LOL = 'REQUEST_SAVE_LOL';
      const RECEIVE_SAVE_LOL = 'RECEIVE_SAVE_LOL';
      describe.skip('When the wrong loadTypes are passed', () => {
        const MSG ='REDUCER_BUILDER: you need to provide loadTypes with REQUEST AND RECEIVE inside.';
          it('should throw an error', () => {
            expect(() => reducerBuilder({name, loadTypes: null })).to.throw(MSG);
            expect(() => reducerBuilder({name, loadTypes: {REQUEST_LOAD_LOL, RECEIVE_LOAD_LOL} })).to.not.throw(MSG);
          })
      })
      describe.skip('When the wrong saveTypes are passed', () => {
        const MSG ='REDUCER_BUILDER: you need to provide saveTypes with REQUEST AND RECEIVE inside.';
          it('should throw an error', () => {
            expect(() => reducerBuilder({
              name,
              loadTypes: {REQUEST_LOAD_LOL, RECEIVE_LOAD_LOL}
            })).to.throw(MSG);
          })
      })

    })
});
