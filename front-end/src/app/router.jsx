import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './AppShell';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AdminPage } from '../pages/AdminPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { ProtectedRoute } from '../shared/ui/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'catalog/:id', element: <ProductPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'payment', element: <PaymentPage /> },
      
      // Auth Routes
      { path: 'auth/login', element: <LoginPage /> },
      { path: 'auth/register', element: <RegisterPage /> },
      
      // Protected User Routes
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ) 
      },
      
      // Protected Admin Routes
      { 
        path: 'admin', 
        element: (
          <ProtectedRoute requireAdmin>
            <AdminPage />
          </ProtectedRoute>
        ) 
      },

      // Fallback
      { path: '*', element: <Navigate to="/" replace /> }
    ],
  },
]);
