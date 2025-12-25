// Import React hooks for state management and side effects
import { useState, useEffect } from 'react';
// Import Link component for client-side navigation
import { Link } from 'react-router-dom';
// Import icons from lucide-react icon library
import { Search, BookOpen, Plus, Filter } from 'lucide-react';
// Import UI components from shadcn/ui component library
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
// Import custom components
import Header from '@/components/Header';
import BookCard from '@/components/BookCard';
// Import Supabase client for database operations
import { supabase } from '@/integrations/supabase/client';
// Import custom hooks
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Define type for book reading status - matches database enum
type BookStatus = 'want_to_read' | 'reading' | 'read';

// Define interface for book data structure
interface Book {
  id: string; // Unique identifier
  title: string; // Book title (required)
  author: string | null; // Author name (optional)
  status: BookStatus; // Reading status
  rating: number | null; // User rating 1-5 (optional)
  is_favorite: boolean; // Whether book is marked as favorite
  reading_progress: number | null; // Reading progress percentage (optional)
}

// Books component - displays user's book collection with search and filter
const Books = () => {
  // Get current user from auth context
  const { user } = useAuth();
  // Hook for displaying toast notifications
  const { toast } = useToast();
  // State to store list of books from database
  const [books, setBooks] = useState<Book[]>([]);
  // State to track loading status during data fetch
  const [loading, setLoading] = useState(true);
  // State for search input value
  const [searchQuery, setSearchQuery] = useState('');
  // State for status filter dropdown value
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Effect to fetch books when user is available
  useEffect(() => {
    // Only fetch if user is logged in
    if (user) {
      fetchBooks();
    }
  }, [user]); // Re-run when user changes

  // Async function to fetch books from Supabase database
  const fetchBooks = async () => {
    try {
      // Query the books table, selecting specific columns
      const { data, error } = await supabase
        .from('books') // Target books table
        .select('id, title, author, status, rating, is_favorite, reading_progress') // Select fields
        .order('created_at', { ascending: false }); // Sort by newest first

      // Throw error if query failed
      if (error) throw error;
      // Update state with fetched books or empty array
      setBooks(data || []);
    } catch (error) {
      // Show error toast if fetch failed
      toast({
        title: 'Error',
        description: 'Failed to load books. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Set loading to false regardless of outcome
      setLoading(false);
    }
  };

  // Filter books based on search query and status filter
  const filteredBooks = books.filter((book) => {
    // Check if book title or author matches search query (case-insensitive)
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    // Check if book status matches selected filter (or filter is 'all')
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    // Return true only if both conditions are met
    return matchesSearch && matchesStatus;
  });

  // Render the books page
  return (
    // Main container with full viewport height
    <div className="min-h-screen bg-background">
      {/* Navigation header component */}
      <Header />
      
      {/* Main content area with container padding */}
      <main className="container py-8">
        {/* Page title section with fade-in animation */}
        <div className="mb-8 animate-fade-in">
          {/* Page heading */}
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            My Library
          </h1>
          {/* Book count subtitle - uses singular/plural based on count */}
          <p className="text-muted-foreground">
            {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
          </p>
        </div>

        {/* Search and Filter controls - stacks on mobile, side by side on larger screens */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          {/* Search input with icon */}
          <div className="relative flex-1">
            {/* Search icon positioned inside input */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {/* Search input field with left padding for icon */}
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search state on change
              className="pl-10 bg-background"
            />
          </div>
          {/* Status filter dropdown */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            {/* Dropdown trigger button */}
            <SelectTrigger className="w-full sm:w-48 bg-background">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            {/* Dropdown options */}
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="want_to_read">Want to Read</SelectItem>
              <SelectItem value="reading">Reading</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Books grid - conditionally renders based on loading/data state */}
        {loading ? (
          // Show skeleton loading placeholders while fetching
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Create 6 skeleton placeholders */}
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          // Show books grid if there are filtered results
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Map through filtered books and render BookCard for each */}
            {filteredBooks.map((book, index) => (
              <BookCard
                key={book.id} // Unique key for React list rendering
                id={book.id}
                title={book.title}
                author={book.author}
                status={book.status}
                rating={book.rating}
                isFavorite={book.is_favorite}
                readingProgress={book.reading_progress ?? 0} // Default to 0 if null
                index={index} // For staggered animation delay
              />
            ))}
          </div>
        ) : (
          // Show empty state when no books match filters or library is empty
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            {/* Empty state icon */}
            <div className="p-4 rounded-full bg-muted mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            {/* Empty state heading - different message based on filter state */}
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              {searchQuery || statusFilter !== 'all'
                ? 'No books found' // When filters are active
                : 'Your library is empty'} {/* When no filters */}
            </h3>
            {/* Empty state description */}
            <p className="text-muted-foreground mb-6 max-w-sm">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Start building your reading list by adding your first book'}
            </p>
            {/* Show add book button only when library is truly empty (no filters active) */}
            {!searchQuery && statusFilter === 'all' && (
              <Button asChild>
                {/* Link to new book page */}
                <Link to="/books/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Book
                </Link>
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// Export Books component as default export
export default Books;
