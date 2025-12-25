// Import Link for navigation and useNavigate hook for programmatic navigation
import { Link, useNavigate } from 'react-router-dom';
// Import icons from lucide-react icon library
import { BookOpen, LogOut, Plus } from 'lucide-react';
// Import Button component from shadcn/ui
import { Button } from '@/components/ui/button';
// Import custom authentication hook
import { useAuth } from '@/hooks/useAuth';

// Header component - navigation bar with logo and user actions
const Header = () => {
  // Get current user and signOut function from auth context
  const { user, signOut } = useAuth();
  // Hook for programmatic navigation after sign out
  const navigate = useNavigate();

  // Handler function to sign out user
  const handleSignOut = async () => {
    // Call sign out method from auth context
    await signOut();
    // Redirect to login page after signing out
    navigate('/login');
  };

  // Render the header
  return (
    // Sticky header that stays at top of viewport
    // z-50 ensures it stays above other content
    // Glassmorphism effect with backdrop blur
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Container for header content with flexbox layout */}
      <div className="container flex h-16 items-center justify-between">
        {/* Logo/brand link that navigates to books page */}
        <Link to="/books" className="flex items-center gap-2 group">
          {/* Book icon in rounded container with hover effect */}
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          {/* App name with serif font */}
          <span className="font-serif text-xl font-semibold text-foreground">
            BookTracker
          </span>
        </Link>

        {/* User actions - only shown when user is logged in */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Add book button - links to new book form */}
            <Button asChild size="sm">
              <Link to="/books/new">
                {/* Plus icon with margin */}
                <Plus className="h-4 w-4 mr-1.5" />
                Add Book
              </Link>
            </Button>
            {/* Sign out button */}
            <Button
              variant="ghost" // Ghost variant for subtle appearance
              size="sm"
              onClick={handleSignOut} // Trigger sign out on click
              className="text-muted-foreground hover:text-foreground"
            >
              {/* Logout icon */}
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

// Export Header component as default export
export default Header;
