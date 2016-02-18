import React, {PropTypes} from 'react';
import {connect, Provider} from '../definitions';

describe('Definition behaviour', () => {
    describe('The provider', () => {
      let component;
      const TestComponent = (props, context) => <div id='testContent'>{JSON.stringify(context)}</div>;
      const PROVIDER_VALIDATION_MSG = 'BEHAVIOUR_DEFINITION_PROVIDER the provider needs a definitions props which should be a non empty object';
      const _tryRenderProviderWithProps = props => {
        const shallowRenderer = TestUtils.createRenderer();
        shallowRenderer.render(
          <Provider {...props}>
          <TestComponent />
          </Provider>
        );
          return shallowRenderer.getRenderOutput();
      };
       it('should be a class', () => {
          expect(Provider).to.be.a.function;
       });
       it('should be a react component with childContextTypes', () => {
         expect(Provider.childContextTypes).to.deep.equal({
           definitions: PropTypes.object
         })
       });
       it('should be a class with getChildContext method', () => {
         expect(Provider.getChildContext).to.be.a.function;
       });
       it('should render a React component', () => {
         component = _tryRenderProviderWithProps({definitions:{test: {name: 'test'}}});
         expect(component).to.be.an('object');
         expect(component.type).to.be.equal(TestComponent);
       });
       it('should throw an error when there are no props', ()=>{
         expect(() => _tryRenderProviderWithProps()).to.throw(PROVIDER_VALIDATION_MSG)
       })
       it('should throw an error when props is an empty object', ()=>{
         expect(() => _tryRenderProviderWithProps({})).to.throw(PROVIDER_VALIDATION_MSG)
       })
       it('should throw an error when  definitions is a number', ()=>{
         expect(() => _tryRenderProviderWithProps({definitions: 1})).to.throw(PROVIDER_VALIDATION_MSG)
       })
       it('should throw an error when  definitions is a string', ()=>{
         expect(() => _tryRenderProviderWithProps({definitions: 'a'})).to.throw(PROVIDER_VALIDATION_MSG)
       });
       it('should throw an error when definitions is an array', ()=>{
         expect(() => _tryRenderProviderWithProps({definitions: []})).to.throw(PROVIDER_VALIDATION_MSG)
       });
       it('should throw an error when definitions is a function', ()=>{
         expect(() => _tryRenderProviderWithProps({definitions: ()=>{}})).to.throw(PROVIDER_VALIDATION_MSG)
       })
       it('should throw an error when definitions is an empty object', ()=>{
         expect(() => _tryRenderProviderWithProps({definitions: {}})).to.throw(PROVIDER_VALIDATION_MSG)
       })
  })
});
