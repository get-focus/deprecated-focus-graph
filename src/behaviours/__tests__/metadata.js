import {Provider as MetadataProvider, connect as connectMetadata} from '../metadata';
import {Provider as StoreProvider} from 'react-redux';
import {loadDefinitions, loadDomains} from '../../actions/metadata';
const {renderIntoDocument} = TestUtils;

describe('The MetadataProvider', () => {
    const shallowRenderer = TestUtils.createRenderer();
    const definitions = {entity: 'lol definitions object'};
    const domains = {domain: 'lol domains object'};
    const expectedDefinitionsLoadingAction = loadDefinitions(definitions);
    const expectedDomainsLoadingAction = loadDomains(domains);
    const dispatchSpy = sinon.spy();
    const context = {
        store: {
            dispatch: dispatchSpy
        }
    }
    shallowRenderer.render(<MetadataProvider definitions={definitions} domains={domains}/>, context);
    it('should dispatch two actions', () => {
        expect(dispatchSpy).to.have.callCount(2);
    });
    it('should dispatch the definitions load action', () => {
        expect(dispatchSpy).to.have.been.calledWith(expectedDefinitionsLoadingAction);
    });
    it('should dispatch the domains load action', () => {
        expect(dispatchSpy).to.have.been.calledWith(expectedDomainsLoadingAction);
    });
});

describe('The metadata connector', () => {
    const definitions = {entity: 'lol definitions object'};
    const domains = {domain: 'lol domains object'};
    const propsSpy = sinon.spy();
    const store = {
        dispatch: sinon.stub()
    };
    const ProbeComponent = props => {
        propsSpy(props);
        return (<span>probe</span>);
    };
    const ConnectedTestComponent = connectMetadata(['entity'])(ProbeComponent);
    const TestComponent = (
        <StoreProvider store={store}>
        <MetadataProvider domains={domains} definitions={definitions}>
        <ConnectedTestComponent/>
        </MetadataProvider>
        </StoreProvider>
    );

    it('should receive the metadata props', () => {
        renderIntoDocument(TestComponent);
        expect(propsSpy).to.have.callCount(1);
        expect(propsSpy).to.have.been.calledWith({_behaviours: {connectedToMetadata: true}, definitions, domains});
    });
});
