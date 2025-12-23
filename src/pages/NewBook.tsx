import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import BookForm from '@/components/BookForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const NewBook = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    author: string;
    status: 'want_to_read' | 'reading' | 'read';
    rating: number | null;
    review: string;
    is_favorite: boolean;
    reading_progress: number;
  }) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('books').insert({
        user_id: user.id,
        title: data.title.trim(),
        author: data.author.trim() || null,
        status: data.status,
        rating: data.rating,
        review: data.review.trim() || null,
        is_favorite: data.is_favorite,
        reading_progress: data.reading_progress,
      });

      if (error) throw error;

      toast({
        title: 'Book added!',
        description: `"${data.title}" has been added to your library.`,
      });
      navigate('/books');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add book. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-xl">
        <Card className="animate-slide-up shadow-soft">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Add New Book</CardTitle>
            <CardDescription>
              Add a book to your reading list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookForm
              onSubmit={handleSubmit}
              submitLabel="Add Book"
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewBook;
