import {actionBuilder} from '../entity-actions-builder';
describe('The actionBuilder', () => {
    describe('when called with wrong parameters', () => {
        it('should throw a type error when called without all parameters', () => {
            expect(() => { actionBuilder()}).to.throw(TypeError,'Cannot read property \'name\' of undefined');
        });
        it('should throw an error when called without a string name parameter', () => {
            const NAME_MESSAGE = 'ACTION_BUILDER: the name parameter should be a string.';
            expect(() => { actionBuilder({name: undefined})}).to.throw(NAME_MESSAGE);
            expect(() => { actionBuilder({name: 1})}).to.throw(NAME_MESSAGE);
            expect(() => { actionBuilder({name: {}})}).to.throw(NAME_MESSAGE);
            expect(() => { actionBuilder({name: () => {}})}).to.throw(NAME_MESSAGE);
            expect(() => { actionBuilder({name: ''})}).to.throw(NAME_MESSAGE);
            expect(() => { actionBuilder({name: 'test'})}).to.not.throw(NAME_MESSAGE);
        });
        it('should throw an error when called without a string type parameter : load,save,delete', () => {
            const TYPE_MESSAGE = 'ACTION_BUILDER: the type parameter should be a string and the value one of these: load,save,delete.';
            expect(() => { actionBuilder({name: 'test'})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: undefined})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: 1})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: {}})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: () => {}})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: ''})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: 'nimp'})}).to.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: 'load'})}).to.not.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: 'save'})}).to.not.throw(TYPE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: 'delete'})}).to.not.throw(TYPE_MESSAGE);
        });
        it('should throw an error when called without a function returning a Promise service parameter', () => {
            const SERVICE_MESSAGE = 'ACTION_BUILDER: the service parameter should be a function.';
            expect(() => { actionBuilder({name: 'test', type: 'load'})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: 'load', service: undefined})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: 'load', service: 1})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: 'load', service: 'nimp'})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: 'load', service: {}})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: 'load', service: null})}).to.throw(SERVICE_MESSAGE);
            expect(() => { actionBuilder({name: 'test', type: 'load', service: () => Promise.resolve({test: 'test'})})}).to.not.throw(SERVICE_MESSAGE);
        });
    })
    describe('when called with right parameters', () => {
        const RESOLVE_VALUE = {testValue: 'tests'};
        const REJECT_VALUE = {error: 'error'};
        const TEST_VALID_ACTION_LOAD_BUILDER_PARAMS_RESOLVE = {name: 'test', type: 'load', service: () => Promise.resolve(RESOLVE_VALUE)};
        const TEST_VALID_ACTION_LOAD_BUILDER_PARAMS_REJECT = {name: 'test', type: 'load', service: () => Promise.reject(REJECT_VALUE)};
        const TEST_VALID_ACTION_SAVE_BUILDER_PARAMS_RESOLVE = {name: 'test', type: 'save', service: () => Promise.resolve(RESOLVE_VALUE)};
        const TEST_VALID_ACTION_SAVE_BUILDER_PARAMS_REJECT = {name: 'test', type: 'save', service: () => Promise.reject(REJECT_VALUE)};

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
        describe('The creators part of the result', () => {
            const {creators: actionBuildedCreators} = actionBuilder(TEST_VALID_ACTION_LOAD_BUILDER_PARAMS_RESOLVE);
            it('should return an object with three keys with request, response, error', () => {
                expect(actionBuildedCreators).to.be.an('object');
                expect(actionBuildedCreators).to.include.keys('requestLoadTest', 'responseLoadTest', 'errorLoadTest');
            });
            it('should return an object with three values with request, response, error', () => {
                const {requestLoadTest: requestActionCreator, responseLoadTest: responseActionCreator, errorLoadTest: errorActionCreator} = actionBuildedCreators;
                expect(requestActionCreator).to.be.a.function;
                expect(responseActionCreator).to.be.a.function;
                expect(errorActionCreator).to.be.a.function;
                const PAYLOAD = {test: 'test'};
                expect(requestActionCreator(PAYLOAD)).to.deep.equal({type: 'REQUEST_LOAD_TEST', payload: PAYLOAD, syncForm: true, entityPath: 'test', _meta: {status: 'pending', loading: true, saving: false}});
                expect(responseActionCreator(PAYLOAD)).to.deep.equal({type: 'RESPONSE_LOAD_TEST', payload: PAYLOAD, syncForm: true, entityPath: 'test', _meta: {status: 'success', loading: true, saving: false}});
                expect(errorActionCreator(PAYLOAD)).to.deep.equal({type: 'ERROR_LOAD_TEST', payload: PAYLOAD, syncForm: true, entityPath: 'test', _meta: {status: 'error', loading: true, saving: false}});
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
                expect(dispatchSpy).to.have.callCount(2);
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'REQUEST_LOAD_TEST', syncForm: true, entityPath: 'test', _meta: {status: 'pending', loading: true, saving: false}});
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'RESPONSE_LOAD_TEST', payload: RESOLVE_VALUE, syncForm: true, entityPath: 'test', _meta: {status: 'success', loading: true, saving: false}});
                done();
            });
            it('when called with an unsuccessfull load service should call the error action creator', async done => {
                const dispatchSpy = sinon.spy();
                await actionBuildedLoadRejectAsync()(dispatchSpy);
                expect(dispatchSpy).to.have.callCount(2);
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'REQUEST_LOAD_TEST', syncForm: true, entityPath: 'test', _meta: {status: 'pending', loading: true, saving: false}});
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'ERROR_LOAD_TEST', payload: REJECT_VALUE, syncForm: true, entityPath: 'test', _meta: {status: 'error', loading: true, saving: false}});
                done();
            });
            it('when called with a successfull save service should call the response and request action creators', async done => {
                const dispatchSpy = sinon.spy();
                await actionBuildedSaveResolveAsync()(dispatchSpy);
                expect(dispatchSpy).to.have.callCount(2);
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'REQUEST_SAVE_TEST', syncForm: true, entityPath: 'test', _meta: {status: 'pending', loading: false, saving: true}});
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'RESPONSE_SAVE_TEST', payload: RESOLVE_VALUE, syncForm: true, entityPath: 'test', _meta: {status: 'success', loading: false, saving: true}});
                done();
            });
            it('when called with an unsuccessfull save service should call the error action creator', async done => {
                const dispatchSpy = sinon.spy();
                dispatchSpy.reset();
                await actionBuildedSaveRejectAsync()(dispatchSpy);
                expect(dispatchSpy).to.have.callCount(2);
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'REQUEST_SAVE_TEST', syncForm: true, entityPath: 'test', _meta: {status: 'pending', loading: false, saving: true}});
                expect(dispatchSpy).to.have.been.called.calledWith({type: 'ERROR_SAVE_TEST', payload: REJECT_VALUE, syncForm: true, entityPath: 'test', _meta: {status: 'error', loading: false, saving: true}});
                done();
            });
        });
    });
});
