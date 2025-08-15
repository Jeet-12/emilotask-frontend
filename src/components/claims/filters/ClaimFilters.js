import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid // Now imported from @mui/material
} from '@mui/material'; // Updated to MUI v5
import { ExpandMore, FilterList } from '@mui/icons-material'; // Updated icons import

const ClaimFilters = ({ onFilter, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    status: initialFilters.status || '',
    minAmount: initialFilters.minAmount || '',
    maxAmount: initialFilters.maxAmount || '',
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || '',
    hasDeductions: initialFilters.hasDeductions || ''
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedFilters = {};
    
    // Only include filters with values
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '') {
        cleanedFilters[key] = filters[key];
      }
    });
    
    onFilter(cleanedFilters);
  };

  const handleReset = () => {
    setFilters({
      status: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
      hasDeductions: ''
    });
    onFilter({});
  };

  return (
    <Box mb={2}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center">
            <FilterList />
            <Typography variant="subtitle1" style={{ marginLeft: '0.5rem' }}>
              Filters
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="deducted">Deducted</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Has Deductions</InputLabel>
                  <Select
                    name="hasDeductions"
                    value={filters.hasDeductions}
                    onChange={handleChange}
                    label="Has Deductions"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Min Amount"
                  name="minAmount"
                  type="number"
                  variant="outlined"
                  value={filters.minAmount}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Max Amount"
                  name="maxAmount"
                  type="number"
                  variant="outlined"
                  value={filters.maxAmount}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={filters.startDate}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={filters.endDate}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button 
                    type="button" 
                    variant="outlined" 
                    onClick={handleReset}
                    style={{ marginRight: '1rem' }}
                  >
                    Reset
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Apply Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ClaimFilters;