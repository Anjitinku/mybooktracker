// Import Link and useNavigate for navigation
import { Link, useNavigate } from 'react-router-dom';
// Import icons from lucide-react
import { Heart, Pencil, Trash2 } from 'lucide-react';
// Import Card components from shadcn/ui
import { Card, CardContent, CardHeader } from '@/components/ui/card';
// Import Button component
import { Button } from '@/components/ui/button';
// Import AlertDialog for delete confirmation
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
// Import custom components for book information display
import StatusBadge from './StatusBadge';
import StarRating from './StarRating';
import ProgressBar from './ProgressBar';
// Import utility function for merging class names
import { cn } from '@/lib/utils';

// Define props interface for BookCard component
interface BookCardProps {
  id: string; // Unique book identifier for linking
  title: string; // Book title (required)
  author: string | null; // Author name (optional)
  status: 'want_to_read' | 'reading' | 'read'; // Reading status
  rating: number | null; // User rating 1-5 (optional)
  isFavorite: boolean; // Whether book is marked as favorite
  readingProgress?: number; // Reading progress percentage (optional)
  index?: number; // Index in list for staggered animation delay
  onDelete?: (id: string) => void; // Callback for delete action
}

// BookCard component - displays a book summary card in the library grid
const BookCard = ({
  id,
  title,
  author,
  status,
  rating,
  isFavorite,
  readingProgress = 0, // Default to 0 if not provided
  index = 0, // Default to 0 for animation delay calculation
  onDelete,
}: BookCardProps) => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Handle edit button click - navigate to book detail page
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Prevent event bubbling
    navigate(`/books/${id}`);
  };

  // Handle delete confirmation
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Prevent event bubbling
    onDelete?.(id);
  };

  // Render the book card wrapped in a link
  return (
    // Link to book detail page
    <Link to={`/books/${id}`}>
      {/* Card container with hover effects and animation */}
      <Card
        className={cn(
          'group cursor-pointer transition-all duration-300 hover:shadow-soft hover:-translate-y-1 border-border/50 bg-card animate-slide-up',
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Card header with title, author, and favorite icon */}
        <CardHeader className="pb-2">
          {/* Flex container for title/author and favorite icon */}
          <div className="flex items-start justify-between gap-2">
            {/* Title and author container with overflow handling */}
            <div className="flex-1 min-w-0">
              {/* Book title with truncation for long titles */}
              <h3 className="font-serif text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {title}
              </h3>
              {/* Author name (only shown if author exists) */}
              {author && (
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  by {author}
                </p>
              )}
            </div>
            {/* Favorite heart icon (only shown if book is favorited) */}
            {isFavorite && (
              <Heart className="h-4 w-4 fill-destructive text-destructive flex-shrink-0" />
            )}
          </div>
        </CardHeader>
        {/* Card content with status, rating, progress, and actions */}
        <CardContent className="pt-0 space-y-3">
          {/* Row with status badge and star rating */}
          <div className="flex items-center justify-between">
            {/* Status badge showing reading status */}
            <StatusBadge status={status} />
            {/* Star rating (only shown if rating exists) */}
            {rating && <StarRating rating={rating} readonly size="sm" />}
          </div>
          {/* Progress bar (only shown for books being read with progress > 0) */}
          {status === 'reading' && readingProgress > 0 && (
            <ProgressBar progress={readingProgress} />
          )}
          {/* Action buttons row */}
          <div className="flex items-center gap-2 pt-1">
            {/* Edit button */}
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleEdit}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
            {/* Delete button with confirmation dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => e.preventDefault()}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Book</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Export BookCard component as default export
export default BookCard;
