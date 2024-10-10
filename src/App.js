import React from 'react';
import AppRoutes from './routes';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import { colors } from './services/const';
import { useLocation } from 'react-router-dom';
import useTitle from './hooks/useTitle';
import AdminHeaderBar from './components/admin/AdminHeaderBar';
import Header from './components/client/Header';
import Footer from './components/client/Footer';
import AuthModal from './components/client/AuthModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: 'Inter',
      allVariants: {
        color: colors.primaryColor
      }
    }
  });
  const { pathname } = useLocation();
  const title = pathname.startsWith('/admin') ? 'Management System' : '';

  useTitle(title)

  return (
    <ThemeProvider theme={theme}>
      <Box 
        // ---ADMIN---
        // sx={{
        //   bgcolor: colors.adminBack,
        //   minHeight: '100vh',
        //   paddingLeft: {xs: '8px', md: '296px'},
        //   paddingRight: {xs: '8px', md: '0'},
        //   paddingTop: {xs: '88px', md: '88px'}
        // }}
        sx={{
          
        }}
      >
        {/* <AdminHeaderBar /> */}
        <Header />
        <ToastContainer />
        <AuthModal />
        
        <AppRoutes />
        
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
