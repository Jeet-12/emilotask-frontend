import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getClaims, approveClaim } from '../../api/claims';
import { getReports, exportReport } from '../../api/reports';

// MUI v5 imports
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab
} from '@mui/material';
import {
  CheckCircle,
  Refresh,
  Search,
  FilterList,
  FileCopy as FileCopyIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';

import ReportList from '../reports/ReportList';
import ReportFilters from '../claims/filters/ReportFilters';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [claimsFilters, setClaimsFilters] = useState({
    status: 'all',
    search: ''
  });
  const [reportsFilters, setReportsFilters] = useState({});

  // Claims data
  const { claims = [], loading: claimsLoading } = useSelector(state => state.claim || {});
  
  // Reports data
  const { reports, loading: reportsLoading } = useSelector(state => state.report);

  useEffect(() => {
    dispatch(getClaims());
    dispatch(getReports(reportsFilters));
  }, [dispatch, reportsFilters]);

  const handleApprove = (claimId) => {
    dispatch(approveClaim(claimId, 'admin')).then(() => {
      dispatch(getClaims());
    });
  };

  const handleClaimsFilterChange = (e) => {
    setClaimsFilters({
      ...claimsFilters,
      [e.target.name]: e.target.value
    });
  };

  const handleRefreshClaims = () => {
    dispatch(getClaims());
  };

  const handleExportReport = (reportId) => {
    dispatch(exportReport(reportId));
  };

  const filteredClaims = claims.filter(claim => {
    const statusMatch = claimsFilters.status === 'all' || claim.status === claimsFilters.status;
    const searchMatch =
      claim._id?.toLowerCase().includes(claimsFilters.search.toLowerCase()) ||
      (claim.user?.name && claim.user.name.toLowerCase().includes(claimsFilters.search.toLowerCase()));
    return statusMatch && searchMatch;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Claims Management" />
          <Tab label="Settlement Reports" />
        </Tabs>

        {tabValue === 0 && (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  All Claims
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Refresh />}
                  onClick={handleRefreshClaims}
                >
                  Refresh
                </Button>
              </Box>

              {/* Filter Controls */}
              <Box display="flex" gap={2} mb={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="search"
                  value={claimsFilters.search}
                  onChange={handleClaimsFilterChange}
                  placeholder="Search claims..."
                  InputProps={{
                    startAdornment: <Search fontSize="small" color="action" />
                  }}
                />

                <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={claimsFilters.status}
                    onChange={handleClaimsFilterChange}
                    label="Status"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setClaimsFilters({ status: 'all', search: '' })}
                >
                  Clear Filters
                </Button>
              </Box>

              {/* Claims List */}
              {claimsLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : filteredClaims.length === 0 ? (
                <Typography>No claims found</Typography>
              ) : (
                <List>
                  {filteredClaims.map(claim => (
                    <ListItem key={claim._id} divider>
                      <ListItemText
                        primary={`Claim #${claim._id?.substring(0, 6)} - ${claim.user?.name || 'Unknown User'}`}
                        secondary={
                          <>
                            <Box component="span" display="block">
                              Amount: ₹{claim.expectedEarnings?.toFixed(2) || '0.00'}
                            </Box>
                            <Box component="span" display="flex" alignItems="center" mt={0.5}>
                              Status: 
                              <Chip
                                label={claim.status?.toUpperCase()}
                                size="small"
                                sx={{ ml: 1 }}
                                color={
                                  claim.status === 'approved' ? 'success' :
                                  claim.status === 'rejected' ? 'error' :
                                  claim.status === 'confirmed' ? 'info' : 'warning'
                                }
                              />
                            </Box>
                          </>
                        }
                      />
                      {claim.status === 'confirmed' && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApprove(claim._id)}
                        >
                          Approve
                        </Button>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 1 && (
          <Grid container spacing={3}>
            {/* Reports Section */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Settlement Reports
                  </Typography>

                  <ReportFilters onFilter={setReportsFilters} />

                  <ReportList
                    reports={reports}
                    loading={reportsLoading}
                    onExport={handleExportReport}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<BarChartIcon />}
                      onClick={() =>
                        dispatch(getReports({ sort: '-finalizedAt', limit: 10 }))
                      }
                    >
                      View Recent Reports
                    </Button>

                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<FileCopyIcon />}
                      onClick={() => {
                        if (reports.length > 0) {
                          handleExportReport(reports[0]._id);
                        }
                      }}
                    >
                      Export Latest Report
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default AdminDashboard;