import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert
} from '@mui/material';
import { 
  Lock as LockIcon, 
  LockOpen as LockOpenIcon, 
  Check as CheckIcon,
  Close as CloseIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { 
  lockClaim, 
  unlockClaim, 
  approveClaim,
  applyDeduction,
  respondToDeduction
} from '../../api/claims';

const ClaimItem = ({ claim, showActions = false, showDeductionInfo = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { lockedClaims, loading } = useSelector(state => state.claim);
  const [deductionDialogOpen, setDeductionDialogOpen] = useState(false);
  const [deductionData, setDeductionData] = useState({
    amount: '',
    reason: ''
  });

  const isLocked = lockedClaims[claim._id];
  const isLockedByMe = isLocked && isLocked.lockedBy === user._id;

  const handleLock = () => dispatch(lockClaim(claim._id));
  const handleUnlock = () => dispatch(unlockClaim(claim._id));
  const handleApprove = () => dispatch(approveClaim(claim._id, user.role));
  const handleAcceptDeduction = () => dispatch(respondToDeduction(claim._id, true));
  const handleRejectDeduction = () => dispatch(respondToDeduction(claim._id, false));

  const handleOpenDeductionDialog = () => {
    setDeductionDialogOpen(true);
    if (claim.deductions?.length > 0) {
      const lastDeduction = claim.deductions[claim.deductions.length - 1];
      setDeductionData({
        amount: lastDeduction.amount,
        reason: lastDeduction.reason
      });
    }
  };

  const handleCloseDeductionDialog = () => {
    setDeductionDialogOpen(false);
    setDeductionData({ amount: '', reason: '' });
  };

  const handleDeductionChange = e => {
    setDeductionData({ ...deductionData, [e.target.name]: e.target.value });
  };

  const handleApplyDeduction = async (e) => {
    e.preventDefault();
    const amount = parseFloat(deductionData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid deduction amount');
      return;
    }
    if (!deductionData.reason.trim()) {
      alert('Please enter a reason for deduction');
      return;
    }
    await dispatch(applyDeduction(claim._id, {
      amount,
      reason: deductionData.reason
    }));
    handleCloseDeductionDialog();
  };

  const totalDeductions = claim.deductions?.reduce((sum, d) => sum + d.amount, 0) || 0;
  const finalAmount = claim.expectedEarnings - totalDeductions;

  const showUserActions = user.role === 'user' && claim.status === 'deducted';
  const showAccountActions = user.role === 'account';
  const showAdminActions = user.role === 'admin' && claim.status === 'confirmed';

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
       
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Claim #{claim._id.substring(0, 6)}</Typography>
            <Chip label={claim.status.toUpperCase()} color={
              claim.status === 'pending' ? 'warning' :
              claim.status === 'deducted' ? 'error' :
              claim.status === 'approved' ? 'success' : 'default'
            } />
          </Box>


          <Typography variant="body2" color="text.secondary">
            Submitted: {new Date(claim.createdAt).toLocaleString()}
          </Typography>

  
          <Box mt={2} mb={2}>
            <Typography variant="subtitle1">Posts:</Typography>
            <List dense>
              {claim.posts.map((post, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={post.post?.content?.substring(0, 50) || 'Post content'}
                    secondary={`Views: ${post.views} | Likes: ${post.likes}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

     
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1">
              Expected Earnings: ₹{claim.expectedEarnings}
            </Typography>
            {claim.approvedEarnings && (
              <Typography variant="subtitle1">
                Approved: ₹{claim.approvedEarnings}
              </Typography>
            )}
          </Box>

          {showDeductionInfo && (
            <Box mt={2}>
              <Typography variant="subtitle1">Deductions:</Typography>
              {claim.deductions?.length > 0 ? (
                <>
                  <List dense>
                    {claim.deductions.map((d, i) => (
                      <ListItem key={i}>
                        <ListItemText
                          primary={`₹${d.amount.toFixed(2)} - ${d.reason}`}
                          secondary={`Status: ${d.status}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="subtitle1">
                    Final Amount: ₹{finalAmount.toFixed(2)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2">No deductions applied</Typography>
              )}
            </Box>
          )}


        
            <>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2} justifyContent="flex-end">

              
                  <>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CloseIcon />}
                      onClick={handleRejectDeduction}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckIcon />}
                      onClick={handleAcceptDeduction}
                    >
                      Accept
                    </Button>
                  </>

                {showAccountActions && (
                  <>
                    <Button
                          variant="contained"
                          color="warning"
                          startIcon={<AttachMoneyIcon />}
                          onClick={handleOpenDeductionDialog}
                        >
                          {claim.deductions?.length ? 'Adjust Deduction' : 'Apply Deduction'}
                        </Button>
                    {isLockedByMe ? (
                      <>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<LockOpenIcon />}
                          onClick={handleUnlock}
                        >
                          Unlock
                        </Button>
                      
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<LockIcon />}
                        onClick={handleLock}
                      >
                        Lock
                      </Button>
                    )}

                    {isLockedByMe && claim.status === 'pending' && (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={handleApprove}
                      >
                        Approve
                      </Button>
                    )}
                  </>
                )}

                {showAdminActions && (
                  <>
                    {isLockedByMe ? (
                      <>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<LockOpenIcon />}
                          onClick={handleUnlock}
                        >
                          Unlock
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckIcon />}
                          onClick={handleApprove}
                        >
                          Final Approve
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<LockIcon />}
                        onClick={handleLock}
                      >
                        Lock
                      </Button>
                    )}
                  </>
                )}
              </Stack>
            </>
          
        </CardContent>
      </Card>
      <Dialog open={deductionDialogOpen} onClose={handleCloseDeductionDialog} fullWidth>
        <DialogTitle>
          {claim.deductions?.length ? 'Adjust Deduction' : 'Apply Deduction'}
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography>Expected Earnings: ₹{claim.expectedEarnings.toFixed(2)}</Typography>
            {totalDeductions > 0 && (
              <Typography>Current Deductions: ₹{totalDeductions.toFixed(2)}</Typography>
            )}
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label="Deduction Amount"
            name="amount"
            type="number"
            value={deductionData.amount}
            onChange={handleDeductionChange}
            inputProps={{ min: 0, max: claim.expectedEarnings, step: 0.01 }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Reason"
            name="reason"
            multiline
            rows={4}
            value={deductionData.reason}
            onChange={handleDeductionChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeductionDialog}>Cancel</Button>
          <Button 
            onClick={handleApplyDeduction}
            color="primary"
            variant="contained"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClaimItem;