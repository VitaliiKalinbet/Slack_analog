import { combineReducers } from 'redux';
import user from './setUserReducer';

const rootReducer = combineReducers({
    user,
})

export default rootReducer;