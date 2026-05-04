import { Box } from '@mantine/core';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer/Footer';
import { useEffect } from 'react';

export function RootLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Check if we are in admin section to potentially use a different layout
  const isAdmin = pathname.startsWith('/admin');

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdmin && <Header />}
      
      <Box component="main" style={{ flex: 1 }}>
        <Outlet />
      </Box>

      {!isAdmin && <Footer />}
    </Box>
  );
}
