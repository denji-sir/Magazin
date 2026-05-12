import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import '@mantine/core/styles.css';
import './index.css';
import { theme } from './app/theme';
import { router } from './app/router';
import { AuthProvider } from './shared/api/AuthContext';
import { CartProvider } from './shared/api/CartContext';
import { FavoritesProvider } from './shared/api/FavoritesContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <RouterProvider router={router} />
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: '#FFFFFF',
                  color: '#151515',
                  borderRadius: '10px',
                  border: '1px solid #E7E0D6',
                  fontFamily: 'Inter, sans-serif',
                },
              }}
            />
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </MantineProvider>
  </StrictMode>
);
