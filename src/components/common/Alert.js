import React from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar'; // Updated import
import Paper from '@mui/material/Paper'; // Updated import
import Typography from '@mui/material/Typography'; // Updated import
import { styled } from '@mui/material/styles'; // Updated styling approach

// Using styled API instead of makeStyles
const CustomAlert = styled(Paper)(({ theme, severity }) => ({
  padding: theme.spacing(2),
  backgroundColor: severity === 'error' ? theme.palette.error.main :
                severity === 'success' ? theme.palette.success.main :
                severity === 'warning' ? theme.palette.warning.main :
                theme.palette.info.main,
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
}));

const Alert = () => {
  const alerts = useSelector(state => state.alert);
  
  return (
    <>
      {alerts.map((alert) => (
        <Snackbar 
          key={alert.id}
          open 
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <CustomAlert severity={alert.alertType}>
            <Typography variant="body1">{alert.msg}</Typography>
          </CustomAlert>
        </Snackbar>
      ))}
    </>
  );
};

export default Alert;