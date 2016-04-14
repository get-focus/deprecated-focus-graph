import React , {Component, PropTypes} from 'react';
import {connect, Provider} from '../definitions';
const {renderIntoDocument} = TestUtils;

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
            definitions: PropTypes.object,
            domains: PropTypes.object
        })
    });
    it('should be a class with getChildContext method', () => {
        expect(Provider.prototype.getChildContext).to.be.a('function');
    });
    it('should render a React component', () => {
        component = _tryRenderProviderWithProps({
            definitions: {
                test: {
                    name: 'test'
                }
            },
            domains: {}
        });
        expect(component).to.be.an('object');
        expect(component.type).to.be.equal(TestComponent);
    });
    it('should have the correct propTypes', () => {
        expect(Provider.propTypes).to.have.property('definitions');
        expect(Provider.propTypes).to.have.property('domains');
    });
});

describe('The connect to definitions', () => {
    it('should be a function', () => {
        expect(connect).to.be.a('function');
    });
    it('should accept a string array parameter and return a connector', () => {
        expect(connect(['n1'])).to.be.a('function');
    });
    it('should only accept an array as definitionNames', () => {
        expect(() => connect('n1')).to.throw('BEHAVIOUR_DEFINITION_CONNECT You must provide a definitionNameArray as an array to the definition connector. Instead, you gave \'n1\'');
    });
    describe('when used with a valid definitionNameArray', () => {
        const NO_DEF_MSG = 'BEHAVIOUR_DEFINITION_CONNECT You must provide definitions and domains to the Provider, check your **DefinitionsProvider**'
        const TestComponent = props => <pre><code>{JSON.stringify(props)}</code></pre>;
        TestComponent.displayName = 'TestComponent';
        const _tryRender = Component => renderIntoDocument(<Component/>);
        it('should return a react component', () => {
            const ConnectedTestComponent = connect(['n1'])(TestComponent);
            expect(ConnectedTestComponent).to.be.a('function');
        });
        it('should throw an error when there are no definitions and domains', () => {
            const ConnectedComponentToTest = connect(['n1'])(() => (<div>coucou</div>));
            const ComponentToTest = () => (
                <Provider>
                    <ConnectedComponentToTest/>
                </Provider>
            );
            expect(() => _tryRender(ComponentToTest))
            .to.throw(NO_DEF_MSG);
        });
        it('should throw an error when there are no definitions', () => {
            const ConnectedComponentToTest = connect(['n1'])(() => (<div>coucou</div>));
            const ComponentToTest = () => (
                <Provider domains={{lol: 'lol'}}>
                    <ConnectedComponentToTest/>
                </Provider>
            );
            expect(() => _tryRender(ComponentToTest))
            .to.throw(NO_DEF_MSG);
        });
        it('should throw an error when there are no domains', () => {
            const ConnectedComponentToTest = connect(['n1'])(() => (<div>coucou</div>));
            const ComponentToTest = () => (
                <Provider definitions={{lol: 'lol'}}>
                    <ConnectedComponentToTest/>
                </Provider>
            );
            expect(() => _tryRender(ComponentToTest))
            .to.throw(NO_DEF_MSG);
        });
    });
    describe('when used with invalid domains and definitions', () => {
        const TestComponent = props => <pre><code>{JSON.stringify(props)}</code></pre>;
        TestComponent.displayName = 'TestComponent';
        const _tryRender = Component => renderIntoDocument(<Component/>);
        it('should throw an error when asking for a non existing definitionName', () => {
            const ConnectedComponentToTest = connect(['n1'])(() => (<div>coucou</div>));
            const ComponentToTest = () => (
                <Provider definitions={{lol: 'lol'}} domains={{DO_REMIFASOL: 'DO_ERREUR'}}>
                    <ConnectedComponentToTest/>
                </Provider>
            );
            expect(() => _tryRender(ComponentToTest))
            .to.throw('BEHAVIOUR_DEFINITION_CONNECT You asked for the definition \'n1\', but it is not present in the definitions you provided to the **DefinitionsProvider**');
        });
    })
    describe('when used normally', () => {
        const DEFINITIONS = {n1: {f1:{domain: 'DO_LOPEZ'}, f2:{domain: 'DO_JOE'}}, n2: {f1:{domain: 'DO_DAVID'}, f2:{domain: 'DO_DIEGO'}}}
        const DOMAINS = {DO_RITO: 'DO_RITO', DO_DO: 'DO_DO'};

        const TestComponent = () => <div>lol</div>;
        const ConnectedComponentToTest = connect(['n1'])(TestComponent);

        const context = {
            definitions: DEFINITIONS,
            domains: DOMAINS
        };
        const shallowRenderer = TestUtils.createRenderer();
        shallowRenderer.render(<ConnectedComponentToTest/>, context);
        const ComponentToTest = shallowRenderer.getRenderOutput();

        it('should render a component', () => {
            expect(ComponentToTest).to.be.a('object');
        });
        it('should render a component with props', () => {
            expect(ComponentToTest.props).to.be.a('object');
        });
        it('should have the _behaviours{isConnectedToDefinition} as props', () => {
            const {_behaviours} = ComponentToTest.props;
            expect(_behaviours).to.be.a('object');
            expect(_behaviours.isConnectedToDefinition).to.be.a('boolean');
            expect(_behaviours.isConnectedToDefinition).to.be.equal(true);
        })
        it('should have the definitions as props', () => {
            const {definitions} = ComponentToTest.props;
            expect(definitions).to.be.a('object');
            expect(definitions).to.be.deep.equal({n1: DEFINITIONS.n1});
        });
        it('should have the domains as props', () => {
            const {domains} = ComponentToTest.props;
            expect(domains).to.be.a('object');
            expect(domains).to.be.deep.equal(DOMAINS);
        });
    })
});
