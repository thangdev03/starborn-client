import React, { useEffect } from 'react';
import AppRoutes from './routes';
import HeaderBar from './components/admin/HeaderBar';
import { Box, createTheme, ThemeProvider, Typography } from '@mui/material';
import { colors } from './services/const';
import { useLocation } from 'react-router-dom';
import useTitle from './hooks/useTitle';

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
        sx={{
          bgcolor: colors.adminBack,
          minHeight: '100vh',
          paddingLeft: {xs: '8px', md: '296px'},
          paddingRight: {xs: '8px', md: '0'},
          paddingTop: {xs: '88px', md: '88px'}
        }}
      >
        <HeaderBar />
        
        
        <AppRoutes />
      </Box>
    </ThemeProvider>
  );
}

export default App;
