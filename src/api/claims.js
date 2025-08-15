import axios from 'axios';
import { setAlert } from '../store/actions/alertActions';

const API_URL = process.env.REACT_APP_API_URL;

// Get all claims
export const getClaims = (params = {}) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/claims`, { params });
    
    dispatch({
      type: 'GET_CLAIMS',
      payload: res.data
    });
  } catch (err) {
    dispatch(setAlert('Failed to fetch claims', 'danger'));
  }
};

// Get single claim
export const getClaim = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/claims/${id}`);
    
    dispatch({
      type: 'GET_CLAIM',
      payload: res.data
    });
  } catch (err) {
    dispatch(setAlert('Failed to fetch claim', 'danger'));
  }
};

// Create claim
export const createClaim = async (formData, token) => {
  try {
    const response = await axios.post(`${API_URL}/claims`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error creating claim:', err);
    throw err;
  }
};

// Apply deduction
export const applyDeduction = (claimId, deductionData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/claims/${claimId}/deductions`, deductionData);
    
    dispatch({
      type: 'APPLY_DEDUCTION',
      payload: res.data
    });
    
    dispatch(setAlert('Deduction applied successfully', 'success'));
    return true;
  } catch (err) {
    dispatch(setAlert('Failed to apply deduction', 'danger'));
    return false;
  }
};

// Respond to deduction
export const respondToDeduction = (claimId, accept) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/claims/${claimId}/respond`, { accept });
    
    dispatch({
      type: 'RESPOND_TO_DEDUCTION',
      payload: res.data
    });
    
    const message = accept ? 'Deduction accepted' : 'Deduction rejected';
    dispatch(setAlert(message, 'success'));
    return true;
  } catch (err) {
    dispatch(setAlert('Failed to respond to deduction', 'danger'));
    return false;
  }
};

// Approve claim
export const approveClaim = (claimId, role) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/claims/${claimId}/approve`);
    
    dispatch({
      type: 'APPROVE_CLAIM',
      payload: res.data
    });
    
    dispatch(setAlert('Claim approved successfully', 'success'));
    return true;
  } catch (err) {
    dispatch(setAlert('Failed to approve claim', 'danger'));
    return false;
  }
};

// Lock claim
export const lockClaim = (claimId) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/claims/${claimId}/lock`);
    
    dispatch({
      type: 'LOCK_CLAIM',
      payload: claimId
    });
  } catch (err) {
    dispatch(setAlert('Failed to lock claim', 'danger'));
  }
};

// Unlock claim
export const unlockClaim = (claimId) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/claims/${claimId}/unlock`);
    
    dispatch({
      type: 'UNLOCK_CLAIM',
      payload: claimId
    });
  } catch (err) {
    dispatch(setAlert('Failed to unlock claim', 'danger'));
  }
};