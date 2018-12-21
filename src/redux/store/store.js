import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers/allReducers';

const store = createStore(rootReducer, composeWithDevTools());

export default store;