import React, {Component} from 'react';
import {connect} from '../form';
import {Provider as StoreProvider} from 'react-redux';
import builder from '../../store/create-store';
const {renderIntoDocument} = TestUtils;
import find from 'lodash/find';
import rootReducer from '../../reducers';
import DevTools from '../../example/containers/dev-tools';

const store = builder({dataset:rootReducer}, [], [DevTools.instrument()]);

describe('The form connect', () => {
    let capturedProps;
    const MyComponent = (props) => {
        capturedProps = props;
        return (<div>my component</div>);
    }

    describe('when used with no option', () => {
        const formOptions = {};
        it('should throw an error on the formKey option', () => {
            expect(() => connect(formOptions)(MyComponent)).to.throw('FormConnect: You must provide a "formKey" option as a string to the form connect.');
        });
    });

    describe('when used with only the name option', () => {
        const formOptions = {
            formKey: 'testForm'
        };
        it('should throw an error on the entityPathArray option', () => {
            expect(() => connect(formOptions)(MyComponent)).to.throw('FormConnect: You must provide a "entityPathArray" option as an array to the form connect.');
        });
    });

    describe('when used with a name and an entityPathArray', () => {
        const formOptions = {
            formKey: 'testForm',
            entityPathArray: ['user']
        };
        const ConnectedTestComponent = connect(formOptions)(MyComponent);
        const TestWrapperComponent = () => (
            <StoreProvider store={store}>
                <ConnectedTestComponent/>
            </StoreProvider>
        );

        let renderedTestComponent;
        before(() => {
            renderedTestComponent = renderIntoDocument(<TestWrapperComponent/>);
        });

        it('should not throw any error', () => {
            expect(() => connect(formOptions)(MyComponent)).to.not.throw();
        });
        it('should have the form state in the props', () => {
            expect(capturedProps.formKey).to.equal('testForm');
            expect(capturedProps.loading).to.be.false;
            expect(capturedProps.editing).to.be.false;
            expect(capturedProps.saving).to.be.false;
            expect(capturedProps.entityPathArray).to.deep.equal(['user']);
        });
    });
    describe('when onInputChange is called', () => {
        const dispatchSpy = sinon.spy(store, 'dispatch');
        const formOptions = {
            formKey: 'testForm',
            entityPathArray: ['user']
        };
        const ConnectedTestComponent = connect(formOptions)(MyComponent);
        const TestWrapperComponent = () => (
            <StoreProvider store={store}>
                <ConnectedTestComponent/>
            </StoreProvider>
        );
        let renderedTestComponent;
        before(() => {
            dispatchSpy.reset();
            renderedTestComponent = renderIntoDocument(<TestWrapperComponent/>);
            const {onInputChange} = capturedProps;
            onInputChange('uuid', 'user', 'new value');
        });
        it('should trigger an INPUT_CHANGE action', () => {
            expect(dispatchSpy).to.have.been.calledWith({
                type: 'INPUT_CHANGE',
                formKey: 'testForm',
                fieldName: 'uuid',
                entityPath: 'user',
                rawValue: 'new value'
            });
        });
        it('should update the state', () => {
            const uuidField = find(capturedProps.fields, field => field.name === 'uuid');
            expect(uuidField.rawInputValue).to.equal('new value');
        });
        it('should reflect the change in the getUserInput method', () => {
            expect(capturedProps.getUserInput().user.uuid).to.equal('new value');
        });
    })
})
