import { 
  GET_CLAIMS, 
  GET_CLAIM, 
  CREATE_CLAIM, 
  APPLY_DEDUCTION,
  RESPOND_TO_DEDUCTION,
  APPROVE_CLAIM,
  LOCK_CLAIM,
  UNLOCK_CLAIM,
  CLAIM_ERROR 
} from './types';
import { setAlert } from './alertActions';
import { 
  getClaims as apiGetClaims,
  getClaim as apiGetClaim,
  createClaim as apiCreateClaim,
  applyDeduction as apiApplyDeduction,
  respondToDeduction as apiRespondToDeduction,
  approveClaim as apiApproveClaim,
  lockClaim as apiLockClaim,
  unlockClaim as apiUnlockClaim
} from '../../api/claims';

// Get all claims
export const getClaims = (params = {}) => async (dispatch) => {
  try {
    const res = await apiGetClaims(params);
    
    dispatch({
      type: GET_CLAIMS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CLAIM_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Failed to fetch claims', 'danger'));
  }
};

// Get single claim
export const getClaim = (id) => async (dispatch) => {
  try {
    const res = await apiGetClaim(id);
    
    dispatch({
      type: GET_CLAIM,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CLAIM_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Failed to fetch claim', 'danger'));
  }
};

// Create claim
export const createClaim = (claimData) => async (dispatch) => {
  try {
    const res = await apiCreateClaim(claimData);
    
    dispatch({
      type: CREATE_CLAIM,
      payload: res.data
    });
    
    dispatch(setAlert('Claim submitted successfully', 'success'));
    return true;
  } catch (err) {
    const errors = err.response?.data?.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    
    dispatch({
      type: CLAIM_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server error', 
        status: err.response?.status || 500 
      }
    });
    return false;
  }
};

// Apply deduction
export const applyDeduction = (claimId, deductionData) => async (dispatch) => {
  try {
    const res = await apiApplyDeduction(claimId, deductionData);
    
    dispatch({
      type: APPLY_DEDUCTION,
      payload: res.data
    });
    
    dispatch(setAlert('Deduction applied successfully', 'success'));
    return true;
  } catch (err) {
    dispatch({
      type: CLAIM_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Failed to apply deduction', 'danger'));
    return false;
  }
};

// Respond to deduction
export const respondToDeduction = (claimId, accept) => async (dispatch) => {
  try {
    const res = await apiRespondToDeduction(claimId, accept);
    
    dispatch({
      type: RESPOND_TO_DEDUCTION,
      payload: res.data
    });
    
    const message = accept ? 'Deduction accepted' : 'Deduction rejected';
    dispatch(setAlert(message, 'success'));
    return true;
  } catch (err) {
    dispatch({
      type: CLAIM_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Failed to respond to deduction', 'danger'));
    return false;
  }
};

// Approve claim
export const approveClaim = (claimId) => async (dispatch) => {
  try {
    const res = await apiApproveClaim(claimId);
    
    dispatch({
      type: APPROVE_CLAIM,
      payload: res.data
    });
    
    dispatch(setAlert('Claim approved successfully', 'success'));
    return true;
  } catch (err) {
    dispatch({
      type: CLAIM_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Failed to approve claim', 'danger'));
    return false;
  }
};

// Lock claim
export const lockClaim = (claimId) => async (dispatch) => {
  try {
    await apiLockClaim(claimId);
    
    dispatch({
      type: LOCK_CLAIM,
      payload: claimId
    });
  } catch (err) {
    dispatch({
      type: CLAIM_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Failed to lock claim', 'danger'));
  }
};

// Unlock claim
export const unlockClaim = (claimId) => async (dispatch) => {
  try {
    await apiUnlockClaim(claimId);
    
    dispatch({
      type: UNLOCK_CLAIM,
      payload: claimId
    });
  } catch (err) {
    dispatch({
      type: CLAIM_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server error', 
        status: err.response?.status || 500 
      }
    });
    dispatch(setAlert('Failed to unlock claim', 'danger'));
  }
};