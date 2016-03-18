import formMiddleware from '../form';
import {CREATE_FORM, SYNC_FORM_ENTITY} from '../../actions/form';

describe('The form middleware', () => {
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
                        loading: true
                    }
                },
                forms: [{
                    key: 'formKey',
                    entityPathArray: ['user'],
                    fields: [{
                        name: 'firstName',
                        dataSetValue: 'Joe',
                        entityPath: 'user',
                        loading: false
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
    })
    describe('when a random action is passed', () => {
        const randomAction = {
            type: 'LOL'
        };
        it('should just pass the action to next', () => {
            formMiddleware(null)(nextSpy)(randomAction);
            expect(nextSpy).to.have.been.callCount(1);
            expect(nextSpy).to.have.been.calledWith(randomAction);
        })
    });
    describe('when a CREATE_FORM action is passed', () => {
        const creationAction = {
            type: CREATE_FORM,
            key: 'formKey',
            entityPathArray: ['user']
        }
        it('should call the store.getState once', () => {
            formMiddleware(store)(nextSpy)(creationAction);
            expect(getStateSpy).to.have.callCount(1);
        });
        it('should call the next once with the populated data', () => {
            formMiddleware(store)(nextSpy)(creationAction);
            expect(nextSpy).to.have.been.callCount(1);
            expect(nextSpy).to.have.been.calledWith({
                ...creationAction,
                fields: [
                    {
                        dataSetValue: 'Joe',
                        entityPath: 'user',
                        name: 'firstName',
                        loading: true
                    },
                    {
                        dataSetValue: 'Lopez',
                        entityPath: 'user',
                        name: 'lastName',
                        loading: true
                    }
                ]
            });
        });
    });
    describe('when an action that should sync the form is passed', () => {
        const alteredStore = {
            getState: () => {
                getStateSpy();
                return {
                    dataset: {
                        user: {
                            data: {
                                firstName: 'David',
                                lastName: 'Lopez'
                            },
                            loading: true
                        }
                    },
                    forms: [{
                        key: 'formKey',
                        entityPathArray: ['user'],
                        fields: [{
                            name: 'firstName',
                            dataSetValue: 'Joe',
                            entityPath: 'user',
                            loading: false
                        }]
                    }]
                }
            },
            dispatch: dispatchSpy
        };
        const myLoadAction = {
            type: 'A_TYPE_THAT_THE_FORM_SHOULD_LOOK_AFTER',
            syncForm: true,
            entityPath: 'user'
        }
        it('should pass the provided action to next', () => {
            formMiddleware(alteredStore)(nextSpy)(myLoadAction);
            expect(nextSpy).to.have.callCount(1);
        })
        it('should dispatch several SYNC_FORM_ENTITY actions', () => {
            formMiddleware(alteredStore)(nextSpy)(myLoadAction);
            expect(dispatchSpy).to.have.callCount(1);
            expect(dispatchSpy).to.have.been.calledWith({
                type: SYNC_FORM_ENTITY,
                entityPath: 'user',
                fields: [
                    {
                        dataSetValue: 'David',
                        entityPath: 'user',
                        name: 'firstName',
                        loading: true,
                        inputValue: 'David'
                    },
                    {
                        dataSetValue: 'Lopez',
                        entityPath: 'user',
                        name: 'lastName',
                        loading: true,
                        inputValue: 'Lopez'
                    }
                ]
            });
        })
    });
});
