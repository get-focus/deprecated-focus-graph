import {createForm, destroyForm, SYNC_FORM_ENTITY, toggleFormEditing} from '../../actions/form';
import formReducer from '../form';
import isArray from 'lodash/isArray';

describe('The form reducer', () => {
    describe('when receiving a CREATE_FORM action', () => {
        // Create the action
        const action = createForm('formKey', ['user', 'movie']);
        // Simulate the middleware effect
        action.fields = [{name: 'myField', dataSetValue: 'fieldValue'}];
        const state = [];
        const newState = formReducer(state, action);
        it('should return an array', () => {
            expect(isArray(newState)).to.be.true;
        });
        it('should create the form object', () => {
            expect(newState.length).to.equal(1);
            const form = newState[0];
            expect(form.formKey).to.equal('formKey');
            expect(form.fields).to.deep.equal([{
                name: 'myField',
                dataSetValue: 'fieldValue',
                active: true,
                dirty: false,
                error: false,
                valid: true,
                loading: false,
                saving: false,
                rawInputValue: 'fieldValue'
            }]);
        })
    });
    describe('when receiving a DESTROY_FORM action', () => {
        const state = [{formKey: 'lol'}];
        const action = destroyForm('lol');
        const newState = formReducer(state, action);
        it('should return an array', () => {
            expect(isArray(newState)).to.be.true;
        });
        it('should destroy the target form', () => {
            expect(newState.length).to.equal(0);
        });
    });
    describe('when receiving a SYNC_FORM_ENTITY action', () => {
        const state = [{
            formKey: 'form1',
            entityPathArray: ['user'],
            fields: [
                {
                    name: 'firstName',
                    entityPath: 'user',
                    rawInputValue: 'David',
                    dataSetValue: 'David',
                    dirty: true
                },
                {
                    name: 'lastName',
                    entityPath: 'user',
                    rawInputValue: 'Lopez',
                    dataSetValue: 'Lopez',
                    dirty: false
                },
                {
                    name: 'weapon',
                    entityPath: 'user',
                    rawInputValue: 'shoe',
                    dataSetValue: 'shoe',
                    dirty: false
                }
            ]
        }];
        const action = {
            type: SYNC_FORM_ENTITY,
            entityPath: 'user',
            fields: [
                {
                    name: 'firstName',
                    entityPath: 'user',
                    dataSetValue: 'Joe'
                },
                {
                    name: 'lastName',
                    entityPath: 'user',
                    dataSetValue: 'Lopez'
                },
                {
                    name: 'wife',
                    entityPath: 'user',
                    dataSetValue: 'Kevina'
                }
            ]
        };
        const newState = formReducer(state, action);
        it('should return an array', () => {
            expect(isArray(newState)).to.be.true;
        });
        it('should have the correct count of fields', () => {
            expect(newState[0].fields.length).to.equal(4);
        });
        it('should update the common fields', () => {
            const updatedForm = newState[0];
            expect(updatedForm.fields[0].dataSetValue).to.equal('Joe');
            expect(updatedForm.fields[1].dataSetValue).to.equal('Lopez');
        });
        it('should leave untouched the non-updated fields', () => {
            const updatedForm = newState[0];
            expect(updatedForm.fields[2].dataSetValue).to.equal('shoe');
        });
        it('should reset the dirty state for all fields', () => {
            const updatedForm = newState[0];
            updatedForm.fields.map(field => {

                expect(field.dirty).to.be.false;
            });
        });
        it('should create the missing fields', () => {
            const updatedForm = newState[0];
            expect(updatedForm.fields[3].dataSetValue).to.equal('Kevina');
        });
    });
    describe('when receiving a TOGGLE_FORM_EDITING action', () => {
        const state = [{
            formKey: 'form1',
            entityPathArray: ['user'],
            editing: false,
            fields: [
                {
                    name: 'firstName',
                    entityPath: 'user',
                    rawInputValue: 'Davide',
                    dataSetValue: 'David',
                    dirty: true
                },
                {
                    name: 'lastName',
                    entityPath: 'user',
                    rawInputValue: 'Lopez',
                    dataSetValue: 'Lopez',
                    dirty: false
                },
                {
                    name: 'weapon',
                    entityPath: 'user',
                    rawInputValue: 'shoe',
                    dataSetValue: 'shoe',
                    dirty: false
                }
            ]
        }];
        it('should toggle the form editing attribute', () => {
            const action = toggleFormEditing('form1', true);
            const newState = formReducer(state, action);
            expect(newState[0].editing).to.be.true;
        });
        it('should leave untouched the fields when the form is toggled to editing', () => {
            const action = toggleFormEditing('form1', true);
            const newState = formReducer(state, action);
            expect(newState[0].fields).to.deep.equal(state[0].fields);
        });
        it('should set the fields\' rawInputValue to their dataSetValue when the form is toggled to consulting', () => {
            const modifiedInitialState = [...state];
            modifiedInitialState[0].editing = true;
            modifiedInitialState[0].fields[0].rawInputValue = 'LOL';
            const action = toggleFormEditing('form1', false);
            const newState = formReducer(modifiedInitialState, action);
            expect(newState[0].fields[0].rawInputValue).to.equal(newState[0].fields[0].dataSetValue);
        });
    });
});
