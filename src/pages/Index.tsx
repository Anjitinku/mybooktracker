// Import useEffect hook for side effects
import { useEffect } from 'react';
// Import navigation hook from React Router
import { useNavigate } from 'react-router-dom';
// Import custom authentication hook
import { useAuth } from '@/hooks/useAuth';
// Import loader icon for loading state
import { Loader2 } from 'lucide-react';

// Index component - landing page that redirects based on auth status
const Index = () => {
  // Hook to navigate between routes programmatically
  const navigate = useNavigate();
  // Destructure user and loading state from auth context
  const { user, loading } = useAuth();

  // Effect to redirect user based on authentication status
  useEffect(() => {
    // Only redirect after auth check is complete
    if (!loading) {
      if (user) {
        // If user is logged in, redirect to books page
        navigate('/books');
      } else {
        // If user is not logged in, redirect to login page
        navigate('/login');
      }
    }
  }, [user, loading, navigate]); // Re-run when these dependencies change

  // Render loading spinner while determining auth state
  return (
    // Full screen container with centered content
    <div className="flex min-h-screen items-center justify-center bg-background">
      {/* Spinning loader icon with primary color */}
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

// Export Index component as default export
export default Index;
