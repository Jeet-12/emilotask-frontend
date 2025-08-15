import axios from 'axios';
import { setAlert } from '../store/actions/alertActions';

const API_URL = process.env.REACT_APP_API_URL;

// Register user
export const register = (userData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    
    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: res.data
    });
    
    dispatch(setAlert('Registration successful', 'success'));
    return true;
  } catch (err) {
    const errors = err.response.data.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    
    dispatch({
      type: 'REGISTER_FAIL'
    });
    return false;
  }
};

// Login user
export const login = (email, password) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: res.data
    });
    
    dispatch(setAlert('Login successful', 'success'));
    return true;
  } catch (err) {
    dispatch(setAlert('Invalid credentials', 'danger'));
    
    dispatch({
      type: 'LOGIN_FAIL'
    });
    return false;
  }
};

// Load user
export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/auth/me`);
    
    dispatch({
      type: 'USER_LOADED',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'AUTH_ERROR'
    });
  }
};

// Logout user
export const logout = () => (dispatch) => {
  dispatch({ type: 'LOGOUT' });
  dispatch(setAlert('You have been logged out', 'success'));
};