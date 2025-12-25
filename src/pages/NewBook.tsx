// Import useState hook for managing loading state
import { useState } from 'react';
// Import navigation hook from React Router
import { useNavigate } from 'react-router-dom';
// Import UI components from shadcn/ui component library
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Import custom components
import Header from '@/components/Header';
import BookForm from '@/components/BookForm';
// Import Supabase client for database operations
import { supabase } from '@/integrations/supabase/client';
// Import custom hooks
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// NewBook component - form to add a new book to the library
const NewBook = () => {
  // Hook to navigate between routes programmatically
  const navigate = useNavigate();
  // Get current user from auth context
  const { user } = useAuth();
  // Hook for displaying toast notifications
  const { toast } = useToast();
  // State to track if form is being submitted
  const [isLoading, setIsLoading] = useState(false);

  // Handler function to submit new book to database
  const handleSubmit = async (data: {
    title: string; // Book title (required)
    author: string; // Author name
    status: 'want_to_read' | 'reading' | 'read'; // Reading status
    rating: number | null; // User rating 1-5 (optional)
    review: string; // User's review text
    is_favorite: boolean; // Whether to mark as favorite
    reading_progress: number; // Reading progress percentage
  }) => {
    // Return early if user is not logged in
    if (!user) return;

    // Set loading state to show spinner on button
    setIsLoading(true);
    try {
      // Insert new book record into Supabase
      const { error } = await supabase.from('books').insert({
        user_id: user.id, // Associate book with current user
        title: data.title.trim(), // Trim whitespace from title
        author: data.author.trim() || null, // Set to null if empty string
        status: data.status,
        rating: data.rating,
        review: data.review.trim() || null, // Set to null if empty string
        is_favorite: data.is_favorite,
        reading_progress: data.reading_progress,
      });

      // Throw error if insert failed
      if (error) throw error;

      // Show success toast with book title
      toast({
        title: 'Book added!',
        description: `"${data.title}" has been added to your library.`,
      });
      // Navigate to books list page
      navigate('/books');
    } catch (error) {
      // Show error toast if insert failed
      toast({
        title: 'Error',
        description: 'Failed to add book. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Reset loading state regardless of outcome
      setIsLoading(false);
    }
  };

  // Render the new book page
  return (
    // Main container with full viewport height
    <div className="min-h-screen bg-background">
      {/* Navigation header component */}
      <Header />
      
      {/* Main content with max width constraint for form */}
      <main className="container py-8 max-w-xl">
        {/* Card container for form with slide-up animation */}
        <Card className="animate-slide-up shadow-soft">
          {/* Card header with title and description */}
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Add New Book</CardTitle>
            <CardDescription>
              Add a book to your reading list
            </CardDescription>
          </CardHeader>
          {/* Card content containing the form */}
          <CardContent>
            {/* Reusable BookForm component */}
            <BookForm
              onSubmit={handleSubmit} // Handler for form submission
              submitLabel="Add Book" // Text for submit button
              isLoading={isLoading} // Loading state for button spinner
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Export NewBook component as default export
export default NewBook;
