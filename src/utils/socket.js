import io from 'socket.io-client';
import store from '../store/store';
import { lockClaim, unlockClaim } from '../store/actions/claimActions';  // Changed imports
import { setAlert } from '../store/actions/alertActions';

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  query: { token: localStorage.getItem('token') }
});

socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('claimLocked', ({ claimId, lockedBy }) => {
  store.dispatch(lockClaim(claimId));  // Changed to use lockClaim
});

socket.on('claimUnlocked', (claimId) => {
  store.dispatch(unlockClaim(claimId));  // Changed to use unlockClaim
});

socket.on('lockError', ({ message }) => {
  store.dispatch(setAlert(message, 'error'));
});

socket.on('error', ({ message }) => {
  store.dispatch(setAlert(message, 'error'));
});

export const emitLockClaim = (claimId) => {  // Renamed to avoid naming conflict
  socket.emit('lockClaim', claimId);
};

export const emitUnlockClaim = (claimId) => {  // Renamed to avoid naming conflict
  socket.emit('unlockClaim', claimId);
};

export default socket;