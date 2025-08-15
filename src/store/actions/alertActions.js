// src/store/actions/alertActions.js
import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

// Set alert
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  // Remove alert after timeout
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};

// Remove alert
export const removeAlert = (id) => ({
  type: REMOVE_ALERT,
  payload: id
});