import {createForm, destroyForm, SYNC_FORM_ENTITY} from '../../actions/form';
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
            expect(form.key).to.equal('formKey');
            expect(form.fields).to.deep.equal([{
                name: 'myField',
                dataSetValue: 'fieldValue',
                active: true,
                dirty: false,
                error: false,
                valid: true,
                loading: false,
                saving: false,
                inputValue: 'fieldValue'
            }]);
        })
    });
    describe('when receiving a DESTROY_FORM action', () => {
        const state = [{key: 'lol'}];
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
            key: 'form1',
            entityPathArray: ['user'],
            fields: [
                {
                    name: 'firstName',
                    entityPath: 'user',
                    inputValue: 'David',
                    dataSetValue: 'David',
                    dirty: true
                },
                {
                    name: 'lastName',
                    entityPath: 'user',
                    inputValue: 'Lopez',
                    dataSetValue: 'Lopez',
                    dirty: false
                },
                {
                    name: 'weapon',
                    entityPath: 'user',
                    inputValue: 'shoe',
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
    })
});
