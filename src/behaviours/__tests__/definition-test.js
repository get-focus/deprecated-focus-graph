import React, {PropTypes} from 'react';
import {connect, Provider} from '../definitions';

describe('Definition behaviour', () => {
    describe('The definitions provider', () => {
        let component;
        const TestComponent = (props, context) => <div id='testContent'>{JSON.stringify(context)}</div>;
        const PROVIDER_VALIDATION_MSG = 'BEHAVIOUR_DEFINITION_PROVIDER the provider needs a definition props which should be a non empty object';
        const _tryRenderProviderWithProps = props => {
          const shallowRenderer = TestUtils.createRenderer();
          shallowRenderer.render(<Provider {...props}><TestComponent /></Provider>);
          return shallowRenderer.getRenderOutput();
      };
        it('should be a class', () => {
           expect(Provider).to.be.a('function');
       });
        it('should be a react component with childContextTypes', () => {
           expect(Provider.childContextTypes).to.deep.equal({
             definitions: PropTypes.object
         })
       });
        it('should be a class with getChildContext method', () => {
           expect(Provider.prototype.getChildContext).to.be.a('function');
       });
        it('should render a React component', () => {
           component = _tryRenderProviderWithProps({definitions:{test: {name: 'test'}}});
           expect(component).to.be.an('object');
           expect(component.type).to.be.equal(TestComponent);
       });
        it('should throw an error when there are no props', () => {
           expect(() => _tryRenderProviderWithProps()).to.throw(PROVIDER_VALIDATION_MSG)
       })
        it('should throw an error when props is an empty object', () => {
           expect(() => _tryRenderProviderWithProps({})).to.throw(PROVIDER_VALIDATION_MSG)
       })
        it('should throw an error when  definitions is a number', () => {
           expect(() => _tryRenderProviderWithProps({definitions: 1})).to.throw(PROVIDER_VALIDATION_MSG)
       })
        it('should throw an error when  definitions is a string', () => {
           expect(() => _tryRenderProviderWithProps({definitions: 'a'})).to.throw(PROVIDER_VALIDATION_MSG)
       });
        it('should throw an error when definitions is an array', () => {
           expect(() => _tryRenderProviderWithProps({definitions: []})).to.throw(PROVIDER_VALIDATION_MSG)
       });
        it('should throw an error when definitions is a function', () => {
           expect(() => _tryRenderProviderWithProps({definitions: () => {}})).to.throw(PROVIDER_VALIDATION_MSG)
       })
        it('should throw an error when definitions is an empty object', () => {
           expect(() => _tryRenderProviderWithProps({definitions: {}})).to.throw(PROVIDER_VALIDATION_MSG)
       })
    });
    describe('The connect to definitions', () => {
      describe('the connect function', () => {
        const CONNECTOR_VALIDATION_MESSAGE = 'BEHAVIOUR_DEFINITION_CONNECT:  The definition name should be a string or an array of strings.';
        it('should be a function', () => {
          expect(connect).to.be.a('function');
      });
        it('should accept a string parameter and return a connector', () => {
          expect(connect('n1')).to.be.a('function');
      });
        it('should not accept a number parameter', () => {
          expect(() => connect(1)).to.throw(CONNECTOR_VALIDATION_MESSAGE);
      });
        it('should not accept a number parameter', () => {
          expect(() => connect(() => {})).to.throw(CONNECTOR_VALIDATION_MESSAGE);
      });
        it('should not accept an empty string parameter', () => {
          expect(() => connect('')).to.throw(CONNECTOR_VALIDATION_MESSAGE);
      });
        it('should not accept an empty array parameter', () => {
          expect(() => connect([])).to.throw(CONNECTOR_VALIDATION_MESSAGE);
      });
        it('should accept an array of string parameter and return a connector', () => {
          expect(connect(['n1', 'n2'])).to.be.a('function');
      });
    });
      describe('the connectComponentToDefinitions function', () => {
        const TestComponent = props => <pre><code>{JSON.stringify(props)}</code></pre>;
        TestComponent.displayName = 'TestComponent';
        const _tryRenderWithDefinitionContext = (toRender, context) => {
          const shallowRenderer = TestUtils.createRenderer();
          shallowRenderer.render(toRender(), context);
          return shallowRenderer.getRenderOutput();
      };
        const NO_DEF_MSG = 'BEHAVIOUR_DEFINITION_CONNECT The definitions must be an object check your **DefinitionsProvider**';
        it('should return a react component', () => {
          const ConnectedTestComponent = connect('n1')(TestComponent);
          expect(ConnectedTestComponent).to.be.a('function');
      });
        describe('when rendered with a wrong context', () => {
          it('should throw an error when there is no context', () => {
            const ConnectedTestComponent = connect('n1')(TestComponent);
            expect(
            () => _tryRenderWithDefinitionContext(
              () => <ConnectedTestComponent />,
              null
            )
          ).to.throw(NO_DEF_MSG)
        })
          it('should throw an error when there are no definitions', () => {
            expect(() => _tryRenderWithDefinitionContext(() => <ConnectedTestComponent />, {})).to.throw('ConnectedTestComponent is not defined')
        })
          it('should throw an error when the requested definition is not present', () => {
            const WRONG_DEF_MSG = 'BEHAVIOUR_DEFINITION_CONNECT The definition you requested : nimp does not exists or is not an object, check your **DefinitionsProvider**';
            const ConnectedTestComponent = connect('nimp')(TestComponent);
            expect(
            () => _tryRenderWithDefinitionContext(
              () => <ConnectedTestComponent />,
              {definitions: {n1: {domain: 'PAPA'}}}
            )
          ).to.throw(WRONG_DEF_MSG);
        })
      });
        describe('render with a correct definitionContext', () => {
          const DEFINITIONS = {n1: {f1:{domain: 'DO_LOPEZ'}, f2:{domain: 'DO_JOE'}}, n2: {f1:{domain: 'DO_DAVID'}, f2:{domain: 'DO_DIEGO'}}}
          const ConnectedTestComponent = connect('n1')(TestComponent);
          const component = _tryRenderWithDefinitionContext(() => <ConnectedTestComponent/>, {definitions: DEFINITIONS});
          it('should render a component', () => {
            expect(component).to.be.a('object');
        });
          it('should render a component with props', () => {
            expect(component.props).to.be.a('object');
        });
          it('should have the _behaviours{isConnectedToDefinition} as props', () => {
            const {_behaviours} = component.props;
            expect(_behaviours).to.be.a('object');
            expect(_behaviours.isConnectedToDefinition).to.be.a('boolean');
            expect(_behaviours.isConnectedToDefinition).to.be.equal(true);
        })
          it('should have the definition as props', () => {
            const {definition} = component.props;
            expect(definition).to.be.a('object');
            expect(definition).to.be.deep.equal(DEFINITIONS.n1);
        });
      });
    });
  });
});
