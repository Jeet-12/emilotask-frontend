import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Grid 
} from '@mui/material'; 
import { ExpandMore, FilterList } from '@mui/icons-material';

const ReportFilters = ({ onFilter, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || ''
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
      startDate: '',
      endDate: ''
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

export default ReportFilters;