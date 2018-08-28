import {combineReducers} from 'redux';
import mans from './mans';
import filter from './filter';

export default combineReducers({
    mans,
    filter
});