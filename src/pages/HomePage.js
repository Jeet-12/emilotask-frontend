import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Container,
  Typography,
  Box,
  Button
} from '@mui/material';

const HomePage = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Determine the dashboard path safely
  const getDashboardPath = () => {
    if (!user) return '/'; // Default path if user is null
    switch(user.role) {
      case 'user': return '/user';
      case 'account': return '/account';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4} textAlign="center">
        <Typography variant="h2" gutterBottom>
          Welcome to Claim Management System
        </Typography>
        
        <Typography variant="h5" gutterBottom>
          {isAuthenticated ? `Hello, ${user?.username || "Guest"}!` : 'Please login or register'}
        </Typography>
        
        <Box mt={4}>
          {isAuthenticated ? (
            <Button
              component={Link}
              to={getDashboardPath()}
              variant="contained"
              color="primary"
              size="large"
              sx={{ textTransform: 'none' }}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                size="large"
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                color="primary"
                size="large"
                sx={{ textTransform: 'none' }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;