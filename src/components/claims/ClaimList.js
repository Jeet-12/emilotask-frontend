import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography,
  CircularProgress,
  List
} from '@mui/material'; 
import ClaimItem from './ClaimItem';

const ClaimList = ({ claims, loading, showActions = false, showDeductionInfo = false }) => {
  const { user } = useSelector(state => state.auth);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!claims || claims.length === 0) {
    return (
      <Box mt={4}>
        <Typography variant="body1" align="center">
          No claims found
        </Typography>
      </Box>
    );
  }

  const filteredClaims = claims.filter(claim => {
    if (user.role === 'user') return claim.user._id === user._id;
    if (user.role === 'account') return claim.status === 'pending' || claim.status === 'deducted';
    if (user.role === 'admin') return claim.status === 'confirmed';
    return true;
  });

  return (
    <List>
      {filteredClaims.map(claim => (
        <ClaimItem 
          key={claim._id} 
          claim={claim} 
          showActions={showActions}
          showDeductionInfo={showDeductionInfo}
        />
      ))}
    </List>
  );
};

export default ClaimList;