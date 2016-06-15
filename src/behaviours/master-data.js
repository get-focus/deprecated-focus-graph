import React, {Component, PropTypes} from 'react';
import {loadMasterDatum} from '../actions/master-data';
import {pick} from 'lodash/object';
import {isArray} from 'lodash/lang';
import {capitalize} from 'lodash/string';
const MASTER_DATA_CONNECT = 'MASTER_DATA_CONNECT';
const MASTER_DATA_PROPTYPE = PropTypes.arrayOf(
    PropTypes.shape({
        name: PropTypes.string.isRequired,
        service: PropTypes.func.isRequired,
        cacheDuration: PropTypes.number
    })
).isRequired;

const MASTER_DATA_CONTEXT_TYPE = {
    masterDatumLoaders: MASTER_DATA_PROPTYPE
};


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
const connectMasterData = (names : Array<string> = [] ) => {
    if(!isArray(names)){
        throw new Error(`${MASTER_DATA_CONNECT}: the names property must be an array.`);
    }
    if(names.length === 0){
        throw new Error(`${MASTER_DATA_CONNECT}: the names property must contain at least a name.`);
    }
    return function connectComponent(ComponentToConnect) {
        const MasterDataConnectedComponent = (props, {masterDatumLoaders, store: {dispatch}}) => {
            const _loadAddMasterDatumContainer = masterDatumLoaders.reduce((res, current) => {
                if(names.indexOf(current.name) !== -1){
                    const dispatchLoader = () => dispatch(loadMasterDatum(current.name, current.service, current.cacheDuration));
                    return [...res, dispatchLoader];
                }
                return res;
            }, []);
            if(_loadAddMasterDatumContainer === 0){
                console.warn(`connectMasterData: your keys ${Object.keys(names)} are not in the masterDatumLoaders ${masterDatumLoaders.reduce((res, current) => [...res, current.name], [])}`)
            }
            const loadMasterData = () => _loadAddMasterDatumContainer.forEach(loader => loader());
            const {_behaviours, ...otherProps} = props;
            const behaviours = {connectedToMasterData: true, ..._behaviours}
            return <ComponentToConnect {...otherProps}  loadMasterData={loadMasterData} _behaviours={behaviours} />;
        }
        MasterDataConnectedComponent.displayName = `${ComponentToConnect.displayName}MasterDataConnectedComponent`;
        //Connect to the redux store
        MasterDataConnectedComponent.contextTypes = {
            store: PropTypes.shape({
                subscribe: PropTypes.func.isRequired,
                dispatch: PropTypes.func.isRequired,
                getState: PropTypes.func.isRequired
            }),
            ...MASTER_DATA_CONTEXT_TYPE
        };
        return MasterDataConnectedComponent;
    }

};
export const connect = connectMasterData;

// MasterDataProvider.
// Add behaviour to set the master data config: `MasterDataProvider`,
// the provider put in the context the array which is named `masterDatumLoaders`,
// you have to pass to the provider the following configuration:
//`configuration = [{name, service, cacheDuration}]`
// which will be passed in the `masterDatumLoaders`
// Example Call
//```jsx
//<MasterDataProvider config={[{name: 'sandwichType', service: loadSandwichType}, {name: 'civility', service: loadChiffres}]}>
//  <MyMasterDataConnectedDumbComponent />
//</MasterDataProvider>
//```
class MasterDataProvider extends Component {
    getChildContext() {
        return {
            masterDatumLoaders: this.props.configuration
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
