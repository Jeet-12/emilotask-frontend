import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getClaims } from '../../api/claims';
import { 
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material'; // Updated to MUI v5
import ClaimList from '../claims/ClaimList';
import ClaimFilters from '../claims/filters/ClaimFilters';

const AccountDashboard = () => {
  const dispatch = useDispatch();
  const { claims, loading } = useSelector(state => state.claim);
  const [value, setValue] = useState(0);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    dispatch(getClaims(filters));
  }, [dispatch, filters]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    
    // Update filters based on tab
    if (newValue === 0) {
      setFilters({ ...filters, status: 'pending' });
    } else if (newValue === 1) {
      setFilters({ ...filters, status: 'deducted' });
    }
  };

  const pendingClaims = claims.filter(claim => claim.status === 'pending');
  const deductedClaims = claims.filter(claim => claim.status === 'deducted');

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Account Dashboard
        </Typography>
        
        <Card>
          <CardContent>
            <Tabs value={value} onChange={handleChangeTab}>
              <Tab label={`Pending Claims (${pendingClaims.length})`} />
              <Tab label={`Deducted Claims (${deductedClaims.length})`} />
            </Tabs>
            
            <Box mt={2}>
              <ClaimFilters 
                onFilter={(newFilters) => setFilters({ ...filters, ...newFilters })}
                initialFilters={filters}
              />
            </Box>
            
            {value === 0 && (
              <ClaimList 
                claims={pendingClaims} 
                loading={loading}
                showActions
              />
            )}
            
            {value === 1 && (
              <ClaimList 
                claims={deductedClaims} 
                loading={loading}
                showDeductionInfo
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AccountDashboard;