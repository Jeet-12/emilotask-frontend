import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';
import Alert from './components/common/Alert';
import Loading from './components/common/Loading';
import { loadUser } from './api/auth';
import setAuthToken from './utils/setAuthToken';
import store from './store/store';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserPage from './pages/UserPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';

// Initialize socket connection
import './utils/socket';
import PostCreatePage from './pages/PostCreatePage';
import PostEditPage from './pages/PostEditPage';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Alert />
      <Loading />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/user"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <UserPage />
            </PrivateRoute>
          }
        />
        <Route path="/posts/new" element={<PrivateRoute allowedRoles={['user']}><PostCreatePage /></PrivateRoute>} />
<Route path="/posts/edit/:id" element={<PrivateRoute allowedRoles={['user']}><PostEditPage /></PrivateRoute>} />
        <Route
          path="/account"
          element={
            <PrivateRoute allowedRoles={['account']}>
              <AccountPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;