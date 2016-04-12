import React, {Component, PropTypes} from 'react';
import {loadMasterData} from '../actions/master-data';
import {pick} from 'lodash/object';
import {capitalize} from 'lodash/string';

const MASTER_DATA_PROPTYPE = PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      service: PropTypes.func.isRequired,
      cacheDuration: PropTypes.number
})).isRequired;

const MASTER_DATA_CONTEXT_TYPE = {
  masterDataLoaders: MASTER_DATA_PROPTYPE
}


// Connect the component to the load method of the master data.
// You have to pass an array of names in which you are interested.
// These names should correspond to the configuration you provide to the `MasterDataProvider`.
// It add as props to the connected component the loaders for each requested master data with the name `loadMasterDataName`
// Where name is what you give to the names property of the connector.
// Example Call
//```jsx
//const MyComponentWhichUsesAMasterDataLoader = (props) => <div><button = >LoadMyList</button>{props.name}</div>;
//const MyMasterDataConnectedComponent =  connectMasterData(['sandwichTypes'])(MyComponentWhichUsesAMasterDataLoader)
//```
const connectMasterData = (names = []) => {
  return function connectComponent(ComponentToConnect) {
      const MasterDataConnectedComponent = (props, {masterDataLoaders}) => {
          const wantedMasterDataLoaders = masterDataLoaders.reduce((res, current) => {
              if(names.indexOf(current.name) !== -1){
                res[`loadMasterData${capitalize(current.name)}`] = () => loadMasterData(current.name, current.service, current.cacheDuration);
              }
              return res;
          }, {});
          if(Object.keys(wantedMasterDataLoaders) === 0){
            console.warn(`connectMasterData: your keys ${Object.keys(names)} are not in the masterDataLoaders ${masterDataLoaders.reduce((res, current) => [...res, current.name], [])}`)
          }
          const {_behaviours, ...otherProps} = props;
          const behaviours = {isConnectedMasterData: true, ..._behaviours}
          return <ComponentToConnect {...otherProps} {...wantedMasterDataLoaders} _behaviours={behaviours} />;
      }
      MasterDataConnectedComponent.displayName = `${ComponentToConnect.displayName}MasterDataConnectedComponent`;
      MasterDataConnectedComponent.contextTypes = MASTER_DATA_CONTEXT_TYPE;
      return MasterDataConnectedComponent;
  }

};
export const connect = connectMasterData;

// MasterDataProvider.
// Add behaviour to set the master data config: `MasterDataProvider`,
// the provider put in the context the array which is named `masterDataLoaders`,
// you have to pass to the provider the following configuration:
//`configuration = [{name, service, cacheDuration}]`
// which will be passed in the `masterDataLoaders`
// Example Call
//```jsx
//<MasterDataProvider config={[{name: 'sandwichType', service: loadSandwichType}, {name: 'civility', service: loadChiffres}]}>
//  <MyMasterDataConnectedDumbComponent />
//</MasterDataProvider>
//```
class MasterDataProvider extends Component {
    getChildContext() {
        return {
          masterDataLoaders: this.props.configuration
      }
    }
    render() {
        return this.props.children;
    }
}

MasterDataProvider.childContextTypes = MASTER_DATA_CONTEXT_TYPE;
MasterDataProvider.defaultProps = {configuration: []}

MasterDataProvider.propTypes = {
  configuration: MASTER_DATA_PROPTYPE
};

export const Provider = MasterDataProvider;
