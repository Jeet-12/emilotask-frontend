import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import { FileCopy } from '@mui/icons-material';

const ReportDetail = ({ report, onExport }) => {
  if (!report) return null;

  return (
    <Card sx={{ marginBottom: '1rem' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Report #{report._id.substring(0, 6)}</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileCopy />}
            onClick={() => onExport(report._id)}
            sx={{ textTransform: 'none' }}
          >
            Export
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Finalized: {new Date(report.finalizedAt).toLocaleString()}
        </Typography>
        
        <Box mt={2} mb={2}>
          <Typography variant="subtitle1">User: {report.user.username}</Typography>
        </Box>
        
        <Box display="flex" justifyContent="space-between">
          <Typography variant="subtitle1">
            Approved Amount: ₹{report.approvedAmount?.toFixed(2) || '0.00'}
          </Typography>
          <Typography variant="subtitle1">
            Total Deductions: ₹{report.totalDeductions?.toFixed(2) || '0.00'}
          </Typography>
        </Box>
        
        <Divider sx={{ margin: '1rem 0' }} />
        
        <Typography variant="subtitle1">Approvers:</Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Account Approver"
              secondary={report.accountApprover?.username || 'N/A'}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Admin Approver"
              secondary={report.adminApprover?.username || 'N/A'}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default ReportDetail;