// Import useState hook for form state management
import { useState } from 'react';
// Import navigation hook from React Router
import { useNavigate } from 'react-router-dom';
// Import loader icon for submit button loading state
import { Loader2 } from 'lucide-react';
// Import UI components from shadcn/ui
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
// Import custom StarRating component
import StarRating from './StarRating';
// Import toast hook for notifications
import { useToast } from '@/hooks/use-toast';

// Define type for book reading status
type BookStatus = 'want_to_read' | 'reading' | 'read';

// Define interface for form data structure
interface BookFormData {
  title: string; // Book title (required)
  author: string; // Author name
  status: BookStatus; // Reading status
  rating: number | null; // User rating 1-5
  review: string; // User's review text
  is_favorite: boolean; // Whether marked as favorite
  reading_progress: number; // Progress percentage 0-100
}

// Define props interface for BookForm component
interface BookFormProps {
  initialData?: Partial<BookFormData>; // Optional initial values for edit mode
  onSubmit: (data: BookFormData) => Promise<void>; // Async submit handler
  submitLabel: string; // Text for submit button
  isLoading?: boolean; // Whether form is being submitted
}

// BookForm component - reusable form for adding/editing books
const BookForm = ({ initialData, onSubmit, submitLabel, isLoading }: BookFormProps) => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Hook for displaying toast notifications
  const { toast } = useToast();
  // Form state initialized with initial data or defaults
  const [formData, setFormData] = useState<BookFormData>({
    title: initialData?.title || '', // Title from initial data or empty
    author: initialData?.author || '', // Author from initial data or empty
    status: initialData?.status || 'want_to_read', // Status from initial data or default
    rating: initialData?.rating || null, // Rating from initial data or null
    review: initialData?.review || '', // Review from initial data or empty
    is_favorite: initialData?.is_favorite || false, // Favorite from initial data or false
    reading_progress: initialData?.reading_progress || 0, // Progress from initial data or 0
  });

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission (page reload)
    e.preventDefault();
    
    // Validate that title is not empty
    if (!formData.title.trim()) {
      // Show error toast if title is missing
      toast({
        title: 'Title required',
        description: 'Please enter a book title.',
        variant: 'destructive',
      });
      return; // Stop submission
    }

    try {
      // Call the onSubmit handler passed as prop
      await onSubmit(formData);
    } catch (error) {
      // Show error toast if submission fails
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Render the form
  return (
    // Form element with submit handler
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields container */}
      <div className="space-y-4">
        {/* Title field - required */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            // Update title in form state on change
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter book title"
            className="bg-background"
          />
        </div>

        {/* Author field - optional */}
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            // Update author in form state on change
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Enter author name"
            className="bg-background"
          />
        </div>

        {/* Status dropdown field */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          {/* Select component for status options */}
          <Select
            value={formData.status}
            // Update status in form state on change
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

        {/* Reading progress slider - only shown when status is 'reading' */}
        {formData.status === 'reading' && (
          <div className="space-y-3">
            {/* Label showing current progress percentage */}
            <Label>Reading Progress: {formData.reading_progress}%</Label>
            {/* Slider for progress 0-100 with 5% steps */}
            <Slider
              value={[formData.reading_progress]} // Value as array (required by Slider)
              // Update progress in form state (extract first value from array)
              onValueChange={(value) =>
                setFormData({ ...formData, reading_progress: value[0] })
              }
              max={100}
              step={5}
              className="py-2"
            />
          </div>
        )}

        {/* Rating field using StarRating component */}
        <div className="space-y-2">
          <Label>Rating</Label>
          <StarRating
            rating={formData.rating}
            // Update rating in form state when star is clicked
            onChange={(rating) => setFormData({ ...formData, rating })}
            size="lg"
          />
        </div>

        {/* Review textarea field */}
        <div className="space-y-2">
          <Label htmlFor="review">Review</Label>
          <Textarea
            id="review"
            value={formData.review}
            // Update review in form state on change
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
            placeholder="Write your thoughts about this book..."
            rows={4}
            className="bg-background resize-none"
          />
        </div>

        {/* Favorite toggle with description */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          {/* Label and description for favorite toggle */}
          <div className="space-y-0.5">
            <Label htmlFor="favorite">Mark as Favorite</Label>
            <p className="text-sm text-muted-foreground">
              Add this book to your favorites
            </p>
          </div>
          {/* Switch component for boolean toggle */}
          <Switch
            id="favorite"
            checked={formData.is_favorite}
            // Update favorite status in form state
            onCheckedChange={(checked) =>
              setFormData({ ...formData, is_favorite: checked })
            }
          />
        </div>
      </div>

      {/* Form action buttons */}
      <div className="flex gap-3">
        {/* Cancel button - navigates back to books list */}
        <Button
          type="button" // Prevent form submission
          variant="outline"
          onClick={() => navigate('/books')}
          className="flex-1"
        >
          Cancel
        </Button>
        {/* Submit button with loading state */}
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {/* Show spinner when loading */}
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

// Export BookForm component as default export
export default BookForm;
