import React, {PropTypes} from 'react';
import {connect, Provider} from '../master-data';

const MASTER_DATA_PROPTYPE = PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      service: PropTypes.func.isRequired,
      cacheDuration: PropTypes.number
})).isRequired;


describe('The master data behaviour', () => {
    describe('The master data provider', () => {
        let component;
        const TestComponent = (props, context) => <div id='testContent'>{JSON.stringify(context)}</div>;
        const _tryRenderProviderWithProps = props => {
          const shallowRenderer = TestUtils.createRenderer();
          shallowRenderer.render(<Provider {...props}><TestComponent /></Provider>);
          return shallowRenderer.getRenderOutput();
      };
        it('should be a class', () => {
           expect(Provider).to.be.a('function');
       });
        it('should be a react component with childContextTypes', () => {
           expect(Provider.childContextTypes.masterDataLoaders).to.be.a.function;//.to.deep.equal(MASTER_DATA_PROPTYPE)
       });
       it('should be a react component with propTypes', () => {
          expect(Provider.propTypes.configuration).be.a.function;//to.equal(MASTER_DATA_PROPTYPE)
      });

        it('should be a class with getChildContext method', () => {
           expect(Provider.prototype.getChildContext).to.be.a('function');
       });
      it('should render a React component', () => {
           component = _tryRenderProviderWithProps({configuration:[{name: 'chiffres', service: ()=> Promise.resolve([1,2,3])}]});
           expect(component).to.be.an('object');
           expect(component.type).to.be.equal(TestComponent);
       })

    });

    describe('The connector to the masterData', () => {
      describe('the connect function', () => {
        const CONNECTOR_VALIDATION_MESSAGE_NOT_AN_ARRAY = 'MASTER_DATA_CONNECT: the names property must be an array.';
        const CONNECTOR_VALIDATION_MESSAGE_EMPTY_ARRAY = 'MASTER_DATA_CONNECT: the names property must contain at least a name.';
        it('should be a function', () => {
            expect(connect).to.be.a('function');
        });
          it('should not accept a number parameter', () => {
            expect(() => connect(1)).to.throw(CONNECTOR_VALIDATION_MESSAGE_NOT_AN_ARRAY);
        });
          it('should not accept a function parameter', () => {
            expect(() => connect(() => {})).to.throw(CONNECTOR_VALIDATION_MESSAGE_NOT_AN_ARRAY);
        });
          it('should not accept an empty array parameter', () => {
            expect(() => connect([])).to.throw(CONNECTOR_VALIDATION_MESSAGE_EMPTY_ARRAY);
        });
          it('should not accept a string  parameter', () => {
            expect(() => connect('n1')).to.throw(CONNECTOR_VALIDATION_MESSAGE_NOT_AN_ARRAY);
        });
          it('should accept an array of string parameter and return a connector', () => {
            expect(connect(['n1', 'n2'])).to.be.a('function');
        });
      });

    });
});
