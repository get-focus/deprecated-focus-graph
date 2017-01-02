import {actionBuilder} from '../entity-actions-builder';
import {PENDING, SUCCESS, ERROR} from '../entity-actions-builder';

describe('The actionBuilder', () => {
    describe('when called with wrong parameters', () => {
        it('should throw a type error when called without all parameters', () => {
            expect(() => { actionBuilder()}).to.throw(TypeError,'Cannot read property \'names\' of undefined');
        });
        it('should throw an error when called without a string name parameter', () => {
            const NAMES_MESSAGE = 'ACTION_BUILDER: the names parameter should be a non empty array.';
            expect(() => { actionBuilder({names: undefined})}).to.throw(NAMES_MESSAGE);
            expect(() => { actionBuilder({names: 1})}).to.throw(NAMES_MESSAGE);
            expect(() => { actionBuilder({names: {}})}).to.throw(NAMES_MESSAGE);
            expect(() => { actionBuilder({names: () => {}})}).to.throw(NAMES_MESSAGE);
            expect(() => { actionBuilder({names: ''})}).to.throw(NAMES_MESSAGE);
            expect(() => { actionBuilder({names: []})}).to.throw(NAMES_MESSAGE);
            expect(() => { actionBuilder({names: ['test']})}).to.not.throw(NAMES_MESSAGE);
        });

        it('should throw an error when called without a string name parameter', () => {
            const NAME_MESSAGE = 'ACTION_BUILDER: the names parameter should be made of strings';
            expect(() => { actionBuilder({names: [undefined]})}).to.throw(NAME_MESSAGE);
            expect(() => { actionBuilder({names: [1]})}).to.throw(NAME_MESSAGE);
            expect(() => { actionBuilder({names: [{}]})}).to.throw(NAME_MESSAGE);
            expect(() => { actionBuilder({names: [() => {}]})}).to.throw(NAME_MESSAGE);
            expect(() => { actionBuilder({names: ['']})}).to.throw(NAME_MESSAGE);
            expect(() => { actionBuilder({names: ['test']})}).to.not.throw(NAME_MESSAGE);
        });

        it('should throw an error when called without a string type parameter : load,save,delete,error', () => {
            const TYPE_MESSAGE = 'ACTION_BUILDER: the type parameter should be a string and the value one of these: load,save,delete,error.';
            expect(() => { actionBuilder({names: ['test']})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: undefined})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 1})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: {}})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: () => {}})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: ''})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 'nimp'})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 'load'})}).to.not.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 'save'})}).to.not.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 'error'})}).to.not.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 'delete'})}).to.not.throw(TYPE_MESSAGE);
        });
        it('should throw an error when called without a function returning a Promise service parameter', () => {
            const SERVICE_MESSAGE = 'ACTION_BUILDER: the service parameter should be a function.';
            expect(() => { actionBuilder({names: ['test'], type: 'load'})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 'load', service: undefined})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 'load', service: 1})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 'load', service: 'nimp'})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 'load', service: {}})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 'load', service: null})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({names: ['test'], type: 'load', service: () => Promise.resolve({test: 'test'})})}).to.not.throw(SERVICE_MESSAGE);
        });
    })
    describe('when called with right parameters', () => {
        const RESOLVE_VALUE = {testValue: 'tests'};
        const REJECT_VALUE = {error: 'error'};
        const TEST_VALID_ACTION_LOAD_BUILDER_PARAMS_RESOLVE = {names: ['test'], type: 'load', service: () => (Promise.resolve(RESOLVE_VALUE).then(data => ({response: data})))};
        const TEST_VALID_ACTION_LOAD_BUILDER_PARAMS_REJECT = {names: ['test'], type: 'load', service: () => (Promise.reject(REJECT_VALUE).then(data => ({response: data, status: 'ERROR'})))};
        const TEST_VALID_ACTION_SAVE_BUILDER_PARAMS_RESOLVE = {names: ['test'], type: 'save', service: () => (Promise.resolve(RESOLVE_VALUE).then(data => ({response: data})))};
        const TEST_VALID_ACTION_SAVE_BUILDER_PARAMS_REJECT = {names: ['test'], type: 'save', service: () => (Promise.reject(REJECT_VALUE).then(data => ({response: data, status: 'ERROR'})))};

        it('should return an object with types, creators, action', () => {
            const actionBuilded = actionBuilder(TEST_VALID_ACTION_LOAD_BUILDER_PARAMS_RESOLVE);
            expect(actionBuilded).to.be.an('object');
            expect(actionBuilded).to.include.keys('types', 'creators', 'action');
        });
        describe('The types part of the result', () => {
            it('should return an object with three types with REQUEST, RESPONSE and ERROR', () => {
                const {types: actionBuildedTypes} = actionBuilder(TEST_VALID_ACTION_LOAD_BUILDER_PARAMS_RESOLVE);
                expect(actionBuildedTypes).to.be.an('object');
                expect(actionBuildedTypes).to.include.keys('REQUEST_LOAD_TEST', 'RESPONSE_LOAD_TEST', 'ERROR_LOAD_TEST');
            });
        });
        describe('The action part of the result', () => {
            const {action: actionBuildedLoadResolveAsync} = actionBuilder(TEST_VALID_ACTION_LOAD_BUILDER_PARAMS_RESOLVE);
            const {action: actionBuildedLoadRejectAsync} = actionBuilder(TEST_VALID_ACTION_LOAD_BUILDER_PARAMS_REJECT);
            const {action: actionBuildedSaveResolveAsync} = actionBuilder(TEST_VALID_ACTION_SAVE_BUILDER_PARAMS_RESOLVE);
            const {action: actionBuildedSaveRejectAsync} = actionBuilder(TEST_VALID_ACTION_SAVE_BUILDER_PARAMS_REJECT);

            const CRITERIA = {id: 'test'};
            it('should return a function', () => {
                expect(actionBuildedLoadResolveAsync).to.be.a.function;
                expect(actionBuildedLoadRejectAsync).to.be.a.function;
                expect(actionBuildedSaveResolveAsync).to.be.a.function;
                expect(actionBuildedSaveRejectAsync).to.be.a.function;
            });
            it('when called with a successfull load service should call the response and request action creators', async done => {
                const dispatchSpy = sinon.spy();
                await actionBuildedLoadResolveAsync()(dispatchSpy);
                expect(dispatchSpy).to.have.callCount(3);
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'REQUEST_LOAD_TEST', syncTypeForm: 'request', formKey: undefined, entityPath: 'test', _meta: {status: PENDING, loading: true, saving: false,  error: false}});
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'RESPONSE_LOAD_TEST', payload: RESOLVE_VALUE, formKey: undefined, syncTypeForm: 'response', entityPath: 'test', _meta: {status: SUCCESS, loading: true, saving: false,  error: false}});

                done();
            });
            it('when called with an unsuccessfull load service should call the error action creator', async done => {
                const dispatchSpy = sinon.spy();
                await actionBuildedLoadRejectAsync()(dispatchSpy);
                expect(dispatchSpy).to.have.callCount(2);
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'REQUEST_LOAD_TEST', syncTypeForm: 'request', formKey: undefined, entityPath: 'test', _meta: {status: PENDING, loading: true, saving: false,  error: false}});
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'ERROR_LOAD_TEST', payload: REJECT_VALUE, syncTypeForm: 'error',formKey: undefined,  entityPath: 'test', _meta: {status: ERROR, loading: false, saving: false, error: true}});
                done();
            });
            it('when called with a successfull save service should call the response and request action creators', async done => {
                const dispatchSpy = sinon.spy();
                await actionBuildedSaveResolveAsync()(dispatchSpy);
                expect(dispatchSpy).to.have.callCount(4);
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'REQUEST_SAVE_TEST', syncTypeForm: 'request', formKey: undefined, entityPath: 'test', _meta: {status: PENDING, loading: false, saving: true,  error: false}});
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'RESPONSE_SAVE_TEST', payload: RESOLVE_VALUE,  formKey: undefined,syncTypeForm: 'response', entityPath: 'test', _meta: {status: SUCCESS, loading: false, saving: true, error: false}});
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'PUSH_MESSAGE', message:  {content: 'test.fields.saved', id:"msgId_1", type: 'success'}});
                done();
            });
            it('when called with an unsuccessfull save service should call the error action creator', async done => {
                const dispatchSpy = sinon.spy();
                dispatchSpy.reset();
                await actionBuildedSaveRejectAsync()(dispatchSpy);
                expect(dispatchSpy).to.have.callCount(2);
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'REQUEST_SAVE_TEST',  syncTypeForm: 'request', formKey: undefined, entityPath: 'test', _meta: {status: PENDING, loading: false, saving: true,  error: false}});
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'ERROR_SAVE_TEST', payload: REJECT_VALUE, syncTypeForm: 'error',formKey: undefined,  entityPath: 'test', _meta: {status: ERROR, loading: false, saving: false, error: true}});
                done();
            });
        });
    });
});
