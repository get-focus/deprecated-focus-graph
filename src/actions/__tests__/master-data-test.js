import {loadMasterDatum, REQUEST_MASTER_DATUM, RESPONSE_MASTER_DATUM, ERROR_MASTER_DATUM} from '../master-data';
const NAME_SHOULD_BE_A_STRING = 'LOAD_MASTER_DATUM_ACTION: the name parameter should be a string.';
const SERVICE_SHOULD_BE_A_FUNCTION = 'LOAD_MASTER_DATUM_ACTION: the service parameter should be a function.';
const CACHE_DURATION_SHOULD_BE_A_NUMBER = 'LOAD_MASTER_DATUM_ACTION: the cacheDuration parameter should be a number.';

const MOCKED_MASTER_DATUM = [{code: 1, value: 'Un'}, {code: 2, value: 'Deux'}];
const MOCKED_SVC = () => {
    return Promise.resolve(MOCKED_MASTER_DATUM)
};

describe('Master datum actions', () => {
    describe('loadMasterDatum', () => {
        describe('when called with wrong parameters', () => {
            it('should throw a LOAD_MASTER_DATUM_ACTION  on the name error when called without all parameters', () => {
                expect(() => { loadMasterDatum()}).to.throw(Error, NAME_SHOULD_BE_A_STRING);
            });
            describe('when called with a wrong name parameter', () => {

                it('should throw a name error when called with a number', () => {
                    expect(() => { loadMasterDatum(1)}).to.throw(Error, NAME_SHOULD_BE_A_STRING);
                });
                it('should throw a name error when called with a function', () => {
                    expect(() => { loadMasterDatum(() => 'test')}).to.throw(Error, NAME_SHOULD_BE_A_STRING);
                });
                it('should throw a name error when called with an array', () => {
                    expect(() => { loadMasterDatum([1,2,3])}).to.throw(Error, NAME_SHOULD_BE_A_STRING);
                });
                it('should throw a name error when called with an object', () => {
                    expect(() => { loadMasterDatum({a: 'a'})}).to.throw(Error, NAME_SHOULD_BE_A_STRING);
                });
                it('should throw a service error when called with only a good name', () => {
                    expect(() => { loadMasterDatum('chiffres')}).to.throw(Error, SERVICE_SHOULD_BE_A_FUNCTION);
                });

            });
            describe('when called with a wrong service parameter and a good name', () => {
                it('should throw a service error when called with a number', () => {
                    expect(() => { loadMasterDatum('chiffres', 1)}).to.throw(Error, SERVICE_SHOULD_BE_A_FUNCTION);
                });
                it('should throw a service error when called with a string', () => {
                    expect(() => { loadMasterDatum('chiffres','test')}).to.throw(Error, SERVICE_SHOULD_BE_A_FUNCTION);
                });
                it('should throw a service error when called with an array', () => {
                    expect(() => { loadMasterDatum('chiffres', [1,2,3])}).to.throw(Error, SERVICE_SHOULD_BE_A_FUNCTION);
                });
                it('should throw a service error when called with an object', () => {
                    expect(() => { loadMasterDatum('chiffres', {a: 'a'})}).to.throw(Error, SERVICE_SHOULD_BE_A_FUNCTION);
                });
                it('should not throw any service error when called with a good service (and a good name)', () => {
                    expect(() => { loadMasterDatum('chiffres', MOCKED_SVC)}).to.not.throw(Error);
                });
            });
            describe('when called with a wrong cacheDuration paramaeter an with a good service and name parameters', () => {
                it('should throw a service error when called with a number', () => {
                    expect(() => { loadMasterDatum('chiffres', MOCKED_SVC, () => 'lol')}).to.throw(Error, CACHE_DURATION_SHOULD_BE_A_NUMBER);
                });
                it('should throw a service error when called with a string', () => {
                    expect(() => { loadMasterDatum('chiffres',MOCKED_SVC, 'test')}).to.throw(Error, CACHE_DURATION_SHOULD_BE_A_NUMBER);
                });
                it('should throw a service error when called with an array', () => {
                    expect(() => { loadMasterDatum('chiffres',MOCKED_SVC,  [1,2,3])}).to.throw(Error, CACHE_DURATION_SHOULD_BE_A_NUMBER);
                });
                it('should throw a service error when called with an object', () => {
                    expect(() => { loadMasterDatum('chiffres',MOCKED_SVC, {a: 'a'})}).to.throw(Error, CACHE_DURATION_SHOULD_BE_A_NUMBER);
                });
                it('should not throw any service error when called with a good service (and a good name)', () => {
                    expect(() => { loadMasterDatum('chiffres', MOCKED_SVC, 123)}).to.not.throw(Error);
                });

            });
            describe('The built action part of the result', () => {
                const NAME = 'chiffres';
                const ERROR_MASTER_DATUM_MOCK = 'No way to load this list';
                const loadActionWithResolveServiceAsync =  loadMasterDatum(NAME, d => (Promise.resolve(MOCKED_MASTER_DATUM).then(data => ({response: data}))), 0);
                const loadActionWithResolveServiceAsyncWithCache =  loadMasterDatum(NAME, d => Promise.resolve(MOCKED_MASTER_DATUM).then(data => ({response: data})));
                const loadActionWithRejectServiceAsync =  loadMasterDatum(NAME, d => Promise.reject(ERROR_MASTER_DATUM_MOCK).then(data => ({response: data})), 0);

                it('should return a function', () => {
                    expect(loadActionWithResolveServiceAsync).to.be.a.function;
                    expect(loadActionWithResolveServiceAsync).to.be.a.function;
                });

                it('when called with a successfull service should call the response and request action creators', async done => {
                    const dispatchSpy = sinon.spy();
                    await loadActionWithResolveServiceAsync(dispatchSpy);
                    expect(dispatchSpy).to.have.been.called.twice;
                    expect(dispatchSpy).to.have.callCount(2);
                    expect(dispatchSpy).to.have.been.called.calledWith({type: REQUEST_MASTER_DATUM, name: NAME});
                    expect(dispatchSpy).to.have.been.called.calledWith({type: RESPONSE_MASTER_DATUM, name: NAME,  value: MOCKED_MASTER_DATUM});
                    done();
                });

                it('when called with an unsuccessfull service should call the error action creator', async done => {
                    const dispatchSpy = sinon.spy();
                    await loadActionWithRejectServiceAsync(dispatchSpy);
                    expect(dispatchSpy).to.have.been.called.twice;
                    expect(dispatchSpy).to.have.callCount(2);
                    expect(dispatchSpy).to.have.been.called.calledWith({type: REQUEST_MASTER_DATUM, name: NAME});
                    expect(dispatchSpy).to.have.been.called.calledWith({type: ERROR_MASTER_DATUM, name: NAME, error: ERROR_MASTER_DATUM_MOCK});
                    done();
                });
                it('when called with a successfull service should call the response and request action creators without the cache', async done => {
                    const dispatchSpy = sinon.spy();
                    await loadActionWithResolveServiceAsync(dispatchSpy);
                    await loadActionWithResolveServiceAsync(dispatchSpy);
                    expect(dispatchSpy).to.have.callCount(4);
                    expect(dispatchSpy).to.have.been.called.calledWith({type: REQUEST_MASTER_DATUM, name: NAME});
                    expect(dispatchSpy).to.have.been.called.calledWith({type: RESPONSE_MASTER_DATUM, name: NAME,  value: MOCKED_MASTER_DATUM});
                    done();
                });
                it('when called with a successfull service should call the response and request action creators without the cache', async done => {
                    const dispatchSpy = sinon.spy();
                    await loadActionWithResolveServiceAsyncWithCache(dispatchSpy);
                    await loadActionWithResolveServiceAsyncWithCache(dispatchSpy);
                    expect(dispatchSpy).to.have.callCount(2);
                    expect(dispatchSpy).to.have.been.called.calledWith({type: REQUEST_MASTER_DATUM, name: NAME});
                    expect(dispatchSpy).to.have.been.called.calledWith({type: RESPONSE_MASTER_DATUM, name: NAME,  value: MOCKED_MASTER_DATUM});
                    done();
                });

            });
        });
    })
});
