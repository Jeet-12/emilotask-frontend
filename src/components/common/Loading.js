import React from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Backdrop } from '@mui/material'; // Updated import

const Loading = () => {
  const loading = useSelector(state => state.loading);
  
  return (
    <Backdrop open={loading} style={{ zIndex: 9999 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;