import fieldMiddleware from '../field';
import {
  INPUT_CHANGE,
  INPUT_BLUR,
  INPUT_ERROR,
  INPUT_BLUR_LIST,
  INPUT_ERROR_LIST
} from '../../actions/input'
import {definitions, domains} from '../../example/config';
describe('The field middleware', () => {
  const getStateSpy = sinon.spy();
  const nextSpy = sinon.spy();
  const dispatchSpy = sinon.spy();
  const store = {
      getState: () => {
          getStateSpy();
          return {
              dataset: {
                  user: {
                      data: {
                          firstName: 'Joe',
                          lastName: 'Lopez'
                      },
                      loading: true,
                      saving: false
                  }
              },
              definitions,
              domains,
              forms: [{
                  formKey: 'formKey',
                  entityPathArray: ['user'],
                  fields: [{
                      name: 'firstName',
                      dataSetValue: 'Joe',
                      entityPath: 'user',
                      loading: false,
                      saving: false
                  }]
              }]
          }
      },
      dispatch: dispatchSpy
  };
  beforeEach(() => {
      getStateSpy.reset();
      nextSpy.reset();
      dispatchSpy.reset();
  });
  describe('when no store is given tho the middleware ', ()=>{
    it('should throw an error', () =>{
      expect(() => fieldMiddleware()(nextSpy)({type: 'lol'}))
      .to.throw('FIELD_MIDDLEWARE: Your middleware needs a redux store.');
    });
    it('when an INPUT_BLUR action is passed', () => {
      fieldMiddleware(store)(nextSpy)({type: INPUT_BLUR, entityPath: 'user', fieldName: 'firstName'})
    });
    it('when an INPUT_BLUR_LIST action is passed', () => {});
    it('when an INPUT_CHANGE action is passed', () => {});
    it('when an SYNC_FORM_ENTITIES action is passed', () => {});
  });
});
