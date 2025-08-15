import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { applyDeduction } from '../../api/claims';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography
} from '@material-ui/core';

const DeductionForm = ({ open, claim, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: '',
    reason: ''
  });
  
  const { amount, reason } = formData;
  const { loading } = useSelector(state => state.claim);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await dispatch(applyDeduction(claim._id, { amount, reason }));
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Apply Deduction</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Claim: {claim._id.substring(0, 6)}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Expected Earnings: ${claim.expectedEarnings.toFixed(2)}
          </Typography>
          
          <TextField
            margin="dense"
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            value={amount}
            onChange={onChange}
            required
            inputProps={{ min: 0, max: claim.expectedEarnings, step: 0.01 }}
          />
          <TextField
            margin="dense"
            label="Reason"
            name="reason"
            fullWidth
            multiline
            rows={4}
            value={reason}
            onChange={onChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Applying...' : 'Apply Deduction'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DeductionForm;