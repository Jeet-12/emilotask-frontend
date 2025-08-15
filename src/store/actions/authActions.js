import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types';
import { setAlert } from './alertActions';
import api from '../../api/auth';

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.loadUser();
    
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = (userData) => async (dispatch) => {
  try {
    const res = await api.register(userData);
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    
    dispatch(loadUser());
    return true;
  } catch (err) {
    const errors = err.response.data.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    
    dispatch({
      type: REGISTER_FAIL
    });
    return false;
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  try {
    const res = await api.login(email, password);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    
    dispatch(loadUser());
    return true;
  } catch (err) {
    dispatch(setAlert('Invalid credentials', 'danger'));
    
    dispatch({
      type: LOGIN_FAIL
    });
    return false;
  }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};