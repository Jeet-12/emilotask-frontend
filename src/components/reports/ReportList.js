import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Box,
  Typography,
  CircularProgress,
  List
} from '@mui/material';
import ReportDetail from './ReportDetail';

const ReportList = ({ reports, loading, onExport }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <Box mt={4}>
        <Typography variant="body1" align="center">
          No reports found
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {reports.map(report => (
        <ReportDetail 
          key={report._id} 
          report={report} 
          onExport={onExport}
        />
      ))}
    </List>
  );
};

export default ReportList;