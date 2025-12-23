import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/books" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">
            BookTracker
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <Button asChild size="sm">
              <Link to="/books/new">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Book
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
