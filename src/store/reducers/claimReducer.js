import { 
  GET_CLAIMS, 
  GET_CLAIM, 
  CREATE_CLAIM, 
  APPLY_DEDUCTION,
  RESPOND_TO_DEDUCTION,
  APPROVE_CLAIM,
  LOCK_CLAIM,
  UNLOCK_CLAIM,
  CLAIM_ERROR,
  SET_CLAIM_LOCK,
  SET_CLAIM_UNLOCK
} from '../actions/types';

const initialState = {
  claims: [],
  claim: null,
  loading: true,
  error: {},
  lockedClaims: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  
  switch (type) {
    case GET_CLAIMS:
      return {
        ...state,
        claims: payload.data,
        loading: false
      };
    case GET_CLAIM:
      return {
        ...state,
        claim: payload.data,
        loading: false
      };
    case CREATE_CLAIM:
      return {
        ...state,
        claims: [payload.data, ...state.claims],
        loading: false
      };
    case APPLY_DEDUCTION:
    case RESPOND_TO_DEDUCTION:
    case APPROVE_CLAIM:
      return {
        ...state,
        claims: state.claims.map(claim => 
          claim._id === payload.data._id ? payload.data : claim
        ),
        loading: false
      };
    case LOCK_CLAIM:
    case UNLOCK_CLAIM:
      return {
        ...state,
        loading: false
      };
    case SET_CLAIM_LOCK:
      return {
        ...state,
        lockedClaims: {
          ...state.lockedClaims,
          [payload.claimId]: {
            lockedBy: payload.lockedBy
          }
        }
      };
    case SET_CLAIM_UNLOCK:
      const newLockedClaims = { ...state.lockedClaims };
      delete newLockedClaims[payload];
      return {
        ...state,
        lockedClaims: newLockedClaims
      };
    case CLAIM_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}