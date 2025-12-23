import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Plus, Filter } from 'lucide-react';
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
import Header from '@/components/Header';
import BookCard from '@/components/BookCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type BookStatus = 'want_to_read' | 'reading' | 'read';

interface Book {
  id: string;
  title: string;
  author: string | null;
  status: BookStatus;
  rating: number | null;
  is_favorite: boolean;
  reading_progress: number | null;
}

const Books = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author, status, rating, is_favorite, reading_progress')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load books. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            My Library
          </h1>
          <p className="text-muted-foreground">
            {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-background">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="want_to_read">Want to Read</SelectItem>
              <SelectItem value="reading">Reading</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book, index) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                status={book.status}
                rating={book.rating}
                isFavorite={book.is_favorite}
                readingProgress={book.reading_progress ?? 0}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="p-4 rounded-full bg-muted mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              {searchQuery || statusFilter !== 'all'
                ? 'No books found'
                : 'Your library is empty'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Start building your reading list by adding your first book'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button asChild>
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

export default Books;
