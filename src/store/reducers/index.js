import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import postReducer from './postReducer';
import claimReducer from './claimReducer';
import reportReducer from './reportReducer';

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  post: postReducer,
  claim: claimReducer,
  report: reportReducer
});