import builder from '../../store/builder';
import rootReducer from '../reducers';

const store = builder(rootReducer);

export default store;
