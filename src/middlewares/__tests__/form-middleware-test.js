import formMiddleware from '../form';
import {CREATE_FORM, SYNC_FORMS_ENTITY, TOGGLE_FORM_EDITING} from '../../actions/form';
import {SUCCESS} from '../../actions/entity-actions-builder';

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
                        loading: true,
                        saving: false
                    }
                },
                forms: [{
                    formKey: 'formKey',
                    entityPathArray: ['user'],
                    fields: [{
                        name: 'firstName',
                        dataSetValue: 'Joe',
                        entityPath: 'user',
                        isRequired: true,
                        loading: false,
                        saving: false
                    }]
                }],
                definitions: {
                  user : {
                    firstName: {
                      domain: 'DO_DOMAINE',
                      isRequired: true
                    }
                  }
                }
            }
        },
        dispatch: dispatchSpy
    };
    beforeEach(() => {
        getStateSpy.reset();
        nextSpy.reset();
        dispatchSpy.reset();
    })
    describe('when no store is given tho the middleware ', ()=>{
      it('should throw an error', () =>{
        expect(() => formMiddleware()(nextSpy)({type: 'lol'}))
        .to.throw('FORM_MIDDLEWARE: You middleware needs a redux store.');
      })
    });
    describe('when a random action is passed', () => {
        const randomAction = {
            type: 'LOL'
        };
        it('should just pass the action to next', () => {
            formMiddleware(store)(nextSpy)(randomAction);
            expect(nextSpy).to.have.been.callCount(1);
            expect(nextSpy).to.have.been.calledWith(randomAction);
        });
    });
    describe('when a CREATE_FORM action is passed', () => {
        const creationAction = {
            type: CREATE_FORM,
            formKey: 'formKey',
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
                        loading: true,
                        saving: false,
                        rawValid: false,
                        rawInputValue: 'Joe'
                    },
                    {
                        dataSetValue: 'Lopez',
                        entityPath: 'user',
                        name: 'lastName',
                        loading: true,
                        rawValid: false,
                        saving: false,
                        rawInputValue: 'Lopez'
                    }
                ]
            });
        });
        it('should give an empty array of fields when there is nothing in the dataset', () => {
            const brokenAction = {
                type: CREATE_FORM,
                formKey: 'formKey',
                entityPathArray: ['nonExistingEntity']
            }
            formMiddleware(store)(nextSpy)(brokenAction);
            expect(nextSpy).to.have.been.callCount(1);
            expect(nextSpy).to.have.been.calledWith({
                ...brokenAction,
                fields: []
            });
        })
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
                            loading: true,
                            saving: true
                        }
                    },
                    forms: [{
                        formKey: 'formKey',
                        entityPathArray: ['user'],
                        saving: true,
                        fields: [{
                            name: 'firstName',
                            dataSetValue: 'Joe',
                            entityPath: 'user',
                            loading: false,
                            isRequired: true,
                            saving: false
                        }]
                    }],
                    domains: {
                      DO_DOMAINE : {
                        type: 'text'
                      }
                    },
                    definitions: {
                      user: {
                        firstName: {
                          domain: 'DO_DOMAINE',
                          isRequired: true
                        },
                        lastName: {
                          domain: 'DO_DOMAINE',
                          isRequired: true
                        }
                      }
                    }
                }
            },
            dispatch: dispatchSpy
        };
        const myLoadAction = {
            type: 'A_TYPE_THAT_THE_FORM_SHOULD_LOOK_AFTER',
            syncForm: true,
            formKey: 'formKey',
            entityPath: 'user',
            _meta: {
                status: SUCCESS,
                saving: false,
                loading: true
            }
        }
        it('should pass the provided action to next', () => {
            formMiddleware(alteredStore)(nextSpy)(myLoadAction);
            expect(nextSpy).to.have.callCount(1);
        })
        it('should dispatch several SYNC_FORMS_ENTITY actions', () => {
            formMiddleware(alteredStore)(nextSpy)(myLoadAction);
            expect(dispatchSpy).to.have.callCount(1);
            expect(dispatchSpy).to.have.been.calledWith({
                type: SYNC_FORMS_ENTITY,
                entityPath: 'user',
                fields: [
                    {
                        dataSetValue: 'David',
                        entityPath: 'user',
                        name: 'firstName',
                        loading: true,
                        saving: true,
                        rawInputValue: 'David',
                        valid: true,
                        rawValid: true
                    },
                    {
                        dataSetValue: 'Lopez',
                        entityPath: 'user',
                        name: 'lastName',
                        loading: true,
                        saving: true,
                        rawInputValue: 'Lopez',
                        rawValid: true,
                        valid: true
                    }
                ]
            });
        });
        it('should dispatch a TOGGLE_FORM_EDITING when a successful save is passed', () => {
            const mySuccessfulSaveAction = {
                type: 'A_TYPE_THAT_THE_FORM_SHOULD_LOOK_AFTER',
                syncForm: true,
                entityPath: 'user',
                _meta: {
                    status: SUCCESS,
                    saving: true,
                    loading: false
                }
            };
            formMiddleware(alteredStore)(nextSpy)(mySuccessfulSaveAction);
            expect(dispatchSpy).to.have.callCount(2);
            expect(dispatchSpy).to.have.been.calledWith({
                type: SYNC_FORMS_ENTITY,
                entityPath: 'user',
                fields: [
                    {
                        dataSetValue: 'David',
                        entityPath: 'user',
                        name: 'firstName',
                        loading: true,
                        saving: true,
                        rawInputValue: 'David',
                        rawValid: true,
                        valid: true
                    },
                    {
                        dataSetValue: 'Lopez',
                        entityPath: 'user',
                        name: 'lastName',
                        loading: true,
                        rawValid: true,
                        saving: true,
                        rawInputValue: 'Lopez',
                        valid: true
                    }
                ]
            });
            expect(dispatchSpy).to.have.been.calledWith({
                type: TOGGLE_FORM_EDITING,
                formKey: 'formKey',
                editing: false
            });
        })
    });
});
