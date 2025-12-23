import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import Header from '@/components/Header';
import BookForm from '@/components/BookForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Book {
  id: string;
  title: string;
  author: string | null;
  status: 'want_to_read' | 'reading' | 'read';
  rating: number | null;
  review: string | null;
  is_favorite: boolean;
  reading_progress: number | null;
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user && id) {
      fetchBook();
    }
  }, [user, id]);

  const fetchBook = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: 'Book not found',
          description: 'This book does not exist or you do not have access.',
          variant: 'destructive',
        });
        navigate('/books');
        return;
      }

      setBook(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load book. Please try again.',
        variant: 'destructive',
      });
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: {
    title: string;
    author: string;
    status: 'want_to_read' | 'reading' | 'read';
    rating: number | null;
    review: string;
    is_favorite: boolean;
    reading_progress: number;
  }) => {
    if (!id) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('books')
        .update({
          title: data.title.trim(),
          author: data.author.trim() || null,
          status: data.status,
          rating: data.rating,
          review: data.review.trim() || null,
          is_favorite: data.is_favorite,
          reading_progress: data.reading_progress,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Book updated!',
        description: 'Your changes have been saved.',
      });
      navigate('/books');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update book. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.from('books').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Book deleted',
        description: 'The book has been removed from your library.',
      });
      navigate('/books');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete book. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-xl">
        <Card className="animate-slide-up shadow-soft">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-serif text-2xl">Edit Book</CardTitle>
                <CardDescription>
                  Update book details or remove from library
                </CardDescription>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this book?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove "{book.title}" from your library.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
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
            <BookForm
              initialData={{
                title: book.title,
                author: book.author || '',
                status: book.status,
                rating: book.rating,
                review: book.review || '',
                is_favorite: book.is_favorite,
                reading_progress: book.reading_progress || 0,
              }}
              onSubmit={handleUpdate}
              submitLabel="Save Changes"
              isLoading={isUpdating}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BookDetail;
