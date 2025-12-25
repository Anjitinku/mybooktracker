// Import Link component for client-side navigation
import { Link } from 'react-router-dom';
// Import Heart icon from lucide-react for favorite indicator
import { Heart } from 'lucide-react';
// Import Card components from shadcn/ui
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
}: BookCardProps) => {
  // Render the book card wrapped in a link
  return (
    // Link to book detail page
    <Link to={`/books/${id}`}>
      {/* Card container with hover effects and animation */}
      <Card
        className={cn(
          // Group class for child hover effects
          // Cursor pointer for clickability indication
          // Transition for smooth hover effects
          // Hover: elevate card and add shadow
          // Border and background styling
          // Slide-up entrance animation
          'group cursor-pointer transition-all duration-300 hover:shadow-soft hover:-translate-y-1 border-border/50 bg-card animate-slide-up',
        )}
        // Stagger animation based on card index (50ms per card)
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
        {/* Card content with status, rating, and progress */}
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
        </CardContent>
      </Card>
    </Link>
  );
};

// Export BookCard component as default export
export default BookCard;
