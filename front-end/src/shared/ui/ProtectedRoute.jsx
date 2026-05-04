import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/api/AuthContext';
import { Center, Loader } from '@mantine/core';

/**
 * ProtectedRoute — ensures user is authenticated and optionally has specific role.
 */
export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Center h="100vh">
        <Loader color="gold" size="xl" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login (assuming /auth/login exists as per F10)
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // If admin is required but user is not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}
