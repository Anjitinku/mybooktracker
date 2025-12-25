// Import Navigate component for redirecting unauthenticated users
import { Navigate } from 'react-router-dom';
// Import custom authentication hook
import { useAuth } from '@/hooks/useAuth';
// Import loader icon for loading state
import { Loader2 } from 'lucide-react';

// Define props interface for ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode; // The protected content to render if authenticated
}

// ProtectedRoute component - guards routes that require authentication
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Get user and loading state from auth context
  const { user, loading } = useAuth();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      // Full screen container with centered spinner
      <div className="flex min-h-screen items-center justify-center bg-background">
        {/* Spinning loader icon with primary color */}
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If no user (not authenticated), redirect to login page
  // replace prop replaces current history entry instead of pushing
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected children
  return <>{children}</>;
};

// Export ProtectedRoute component as default export
export default ProtectedRoute;
