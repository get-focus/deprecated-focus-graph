import React, {Component, PropTypes} from 'react';
import {loadMasterData} from '../actions/master-data';

const MASTER_DATA_CONTEXT_TYPE = {
  masterDataloaders: PropTypes.object
}

class MasterDataProvider extends Component {
  constructor(props) {
    super(props);
    this._loaders = props.configuration.reduce((res, current) => {
        res[current.name] = () => _loadMasterData(name, current.service, current.cacheDuration);
        return res;
    });
  }
  getChildContext() {
      return {
        masterDataloaders: this._loaders
    }
  }
    render() {
      return this.props.children;
  }
}

MasterDataProvider.childContextTypes = MASTER_DATA_CONTEXT_TYPE;
MasterDataProvider.defaultProps = {configuration: []}

MasterDataProvider.propTypes = {
  configuration:  PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        service: PropTypes.func.isRequired,
        cacheDuration: PropTypes.number
    })
  ).isRequired;
};

export const Provider = DefinitionsProvider;
