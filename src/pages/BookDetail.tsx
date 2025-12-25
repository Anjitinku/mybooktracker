// Import React hooks for state management and side effects
import { useState, useEffect } from 'react';
// Import hooks for URL params and navigation from React Router
import { useParams, useNavigate } from 'react-router-dom';
// Import icons from lucide-react icon library
import { Loader2, Trash2 } from 'lucide-react';
// Import UI components from shadcn/ui component library
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Import AlertDialog components for delete confirmation modal
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
// Import custom components
import Header from '@/components/Header';
import BookForm from '@/components/BookForm';
// Import Supabase client for database operations
import { supabase } from '@/integrations/supabase/client';
// Import custom hooks
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Define interface for book data structure
interface Book {
  id: string; // Unique identifier
  title: string; // Book title (required)
  author: string | null; // Author name (optional)
  status: 'want_to_read' | 'reading' | 'read'; // Reading status enum
  rating: number | null; // User rating 1-5 (optional)
  review: string | null; // User's review text (optional)
  is_favorite: boolean; // Whether book is marked as favorite
  reading_progress: number | null; // Reading progress percentage (optional)
}

// BookDetail component - view and edit a single book
const BookDetail = () => {
  // Extract book ID from URL parameters
  const { id } = useParams<{ id: string }>();
  // Hook to navigate between routes
  const navigate = useNavigate();
  // Get current user from auth context
  const { user } = useAuth();
  // Hook for displaying toast notifications
  const { toast } = useToast();
  // State to store the book data
  const [book, setBook] = useState<Book | null>(null);
  // State to track initial loading
  const [loading, setLoading] = useState(true);
  // State to track if update is in progress
  const [isUpdating, setIsUpdating] = useState(false);
  // State to track if delete is in progress
  const [isDeleting, setIsDeleting] = useState(false);

  // Effect to fetch book data when user and id are available
  useEffect(() => {
    // Only fetch if both user is logged in and id exists
    if (user && id) {
      fetchBook();
    }
  }, [user, id]); // Re-run when user or id changes

  // Async function to fetch single book from Supabase
  const fetchBook = async () => {
    try {
      // Query the books table for specific book by ID
      const { data, error } = await supabase
        .from('books') // Target books table
        .select('*') // Select all columns
        .eq('id', id) // Filter by book ID
        .maybeSingle(); // Return single record or null (doesn't throw if not found)

      // Throw error if query failed
      if (error) throw error;
      
      // If no book found, show error and redirect
      if (!data) {
        toast({
          title: 'Book not found',
          description: 'This book does not exist or you do not have access.',
          variant: 'destructive',
        });
        navigate('/books'); // Redirect to books list
        return;
      }

      // Update state with fetched book data
      setBook(data);
    } catch (error) {
      // Show error toast if fetch failed
      toast({
        title: 'Error',
        description: 'Failed to load book. Please try again.',
        variant: 'destructive',
      });
      navigate('/books'); // Redirect to books list on error
    } finally {
      // Set loading to false regardless of outcome
      setLoading(false);
    }
  };

  // Handler function to update book in database
  const handleUpdate = async (data: {
    title: string;
    author: string;
    status: 'want_to_read' | 'reading' | 'read';
    rating: number | null;
    review: string;
    is_favorite: boolean;
    reading_progress: number;
  }) => {
    // Return early if no book ID
    if (!id) return;

    // Set updating state to show loading indicator
    setIsUpdating(true);
    try {
      // Update book record in Supabase
      const { error } = await supabase
        .from('books') // Target books table
        .update({
          title: data.title.trim(), // Trim whitespace from title
          author: data.author.trim() || null, // Set to null if empty string
          status: data.status,
          rating: data.rating,
          review: data.review.trim() || null, // Set to null if empty string
          is_favorite: data.is_favorite,
          reading_progress: data.reading_progress,
        })
        .eq('id', id); // Update only the book with matching ID

      // Throw error if update failed
      if (error) throw error;

      // Show success toast
      toast({
        title: 'Book updated!',
        description: 'Your changes have been saved.',
      });
      // Navigate back to books list
      navigate('/books');
    } catch (error) {
      // Show error toast if update failed
      toast({
        title: 'Error',
        description: 'Failed to update book. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Reset updating state
      setIsUpdating(false);
    }
  };

  // Handler function to delete book from database
  const handleDelete = async () => {
    // Return early if no book ID
    if (!id) return;

    // Set deleting state to show loading indicator
    setIsDeleting(true);
    try {
      // Delete book record from Supabase
      const { error } = await supabase.from('books').delete().eq('id', id);

      // Throw error if delete failed
      if (error) throw error;

      // Show success toast
      toast({
        title: 'Book deleted',
        description: 'The book has been removed from your library.',
      });
      // Navigate back to books list
      navigate('/books');
    } catch (error) {
      // Show error toast if delete failed
      toast({
        title: 'Error',
        description: 'Failed to delete book. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Reset deleting state
      setIsDeleting(false);
    }
  };

  // Show loading spinner while fetching book data
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation header */}
        <Header />
        {/* Centered loading spinner */}
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Return null if book not found (redirect happens in fetchBook)
  if (!book) {
    return null;
  }

  // Render the book detail/edit page
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation header */}
      <Header />
      
      {/* Main content with max width constraint */}
      <main className="container py-8 max-w-xl">
        {/* Card container for edit form with animation */}
        <Card className="animate-slide-up shadow-soft">
          <CardHeader>
            {/* Header with title and delete button */}
            <div className="flex items-start justify-between">
              <div>
                {/* Card title */}
                <CardTitle className="font-serif text-2xl">Edit Book</CardTitle>
                {/* Card description */}
                <CardDescription>
                  Update book details or remove from library
                </CardDescription>
              </div>
              {/* Delete button with confirmation dialog */}
              <AlertDialog>
                {/* Button that triggers the dialog */}
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                {/* Dialog content */}
                <AlertDialogContent>
                  <AlertDialogHeader>
                    {/* Dialog title */}
                    <AlertDialogTitle>Delete this book?</AlertDialogTitle>
                    {/* Dialog description with book title */}
                    <AlertDialogDescription>
                      This will permanently remove "{book.title}" from your library.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    {/* Cancel button */}
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {/* Confirm delete button */}
                    <AlertDialogAction
                      onClick={handleDelete} // Trigger delete on click
                      disabled={isDeleting} // Disable while deleting
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {/* Show spinner while deleting, otherwise show text */}
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Delete'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Book edit form with pre-filled data */}
            <BookForm
              initialData={{
                title: book.title,
                author: book.author || '', // Convert null to empty string
                status: book.status,
                rating: book.rating,
                review: book.review || '', // Convert null to empty string
                is_favorite: book.is_favorite,
                reading_progress: book.reading_progress || 0, // Default to 0 if null
              }}
              onSubmit={handleUpdate} // Handler for form submission
              submitLabel="Save Changes" // Button text
              isLoading={isUpdating} // Loading state for button
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Export BookDetail component as default export
export default BookDetail;
