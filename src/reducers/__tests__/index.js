import {createForm} from '../../actions/form';
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
                inputValue: 'fieldValue'
            }]);
        })
    });
});
