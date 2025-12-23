import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import StarRating from './StarRating';
import { useToast } from '@/hooks/use-toast';

type BookStatus = 'want_to_read' | 'reading' | 'read';

interface BookFormData {
  title: string;
  author: string;
  status: BookStatus;
  rating: number | null;
  review: string;
  is_favorite: boolean;
  reading_progress: number;
}

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void>;
  submitLabel: string;
  isLoading?: boolean;
}

const BookForm = ({ initialData, onSubmit, submitLabel, isLoading }: BookFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<BookFormData>({
    title: initialData?.title || '',
    author: initialData?.author || '',
    status: initialData?.status || 'want_to_read',
    rating: initialData?.rating || null,
    review: initialData?.review || '',
    is_favorite: initialData?.is_favorite || false,
    reading_progress: initialData?.reading_progress || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a book title.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter book title"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Enter author name"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: BookStatus) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="want_to_read">Want to Read</SelectItem>
              <SelectItem value="reading">Reading</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.status === 'reading' && (
          <div className="space-y-3">
            <Label>Reading Progress: {formData.reading_progress}%</Label>
            <Slider
              value={[formData.reading_progress]}
              onValueChange={(value) =>
                setFormData({ ...formData, reading_progress: value[0] })
              }
              max={100}
              step={5}
              className="py-2"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Rating</Label>
          <StarRating
            rating={formData.rating}
            onChange={(rating) => setFormData({ ...formData, rating })}
            size="lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="review">Review</Label>
          <Textarea
            id="review"
            value={formData.review}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
            placeholder="Write your thoughts about this book..."
            rows={4}
            className="bg-background resize-none"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="favorite">Mark as Favorite</Label>
            <p className="text-sm text-muted-foreground">
              Add this book to your favorites
            </p>
          </div>
          <Switch
            id="favorite"
            checked={formData.is_favorite}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, is_favorite: checked })
            }
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/books')}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
