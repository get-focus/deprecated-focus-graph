import React, {Component, PropTypes} from 'react';
import {loadMasterData} from '../actions/master-data';
import {pick} from 'lodash/object';

const MASTER_DATA_PROPTYPE = PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      service: PropTypes.func.isRequired,
      cacheDuration: PropTypes.number
})).isRequired;

const MASTER_DATA_CONTEXT_TYPE = {
  masterDataloaders: MASTER_DATA_PROPTYPE
}


// Connect the component to the load method of the master data.
const connectMasterData = (names) => {
  return function connectComponent(ComponentToConnect) {
      function MasterDataConnectedComponent(props, {masterDataloaders}) {
        console.log(masterDataloaders);
        const wantedMasterDataLoaders = masterDataloaders.reduce((res, current) => {
              if(names.indexOf(current.name) !== -1){
                res[`loadMasterData${current.name}`] = () => loadMasterData(current.name, current.service, current.cacheDuration);
              }
              return res;
          }, {});
          const {_behaviours, ...otherProps} = props;
          const behaviours = {isConnectedMasterData: true, ..._behaviours}
          console.log('wantedMasterDataLoaders', masterDataloaders, wantedMasterDataLoaders);
          return <ComponentToConnect {...otherProps} {...wantedMasterDataLoaders} _behaviours={behaviours} />;
      }
      MasterDataConnectedComponent.displayName = `${ComponentToConnect.displayName}MasterDataConnectedComponent`;
      MasterDataConnectedComponent.contextTypes = MASTER_DATA_CONTEXT_TYPE;
      return MasterDataConnectedComponent;
  }

};
export const connect = connectMasterData;


class MasterDataProvider extends Component {
  getChildContext() {
      return {
        masterDataloaders: this.props.configuration
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
