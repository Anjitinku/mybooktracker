import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import StarRating from './StarRating';
import ProgressBar from './ProgressBar';
import { cn } from '@/lib/utils';

interface BookCardProps {
  id: string;
  title: string;
  author: string | null;
  status: 'want_to_read' | 'reading' | 'read';
  rating: number | null;
  isFavorite: boolean;
  readingProgress?: number;
  index?: number;
}

const BookCard = ({
  id,
  title,
  author,
  status,
  rating,
  isFavorite,
  readingProgress = 0,
  index = 0,
}: BookCardProps) => {
  return (
    <Link to={`/books/${id}`}>
      <Card
        className={cn(
          'group cursor-pointer transition-all duration-300 hover:shadow-soft hover:-translate-y-1 border-border/50 bg-card animate-slide-up',
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {title}
              </h3>
              {author && (
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  by {author}
                </p>
              )}
            </div>
            {isFavorite && (
              <Heart className="h-4 w-4 fill-destructive text-destructive flex-shrink-0" />
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center justify-between">
            <StatusBadge status={status} />
            {rating && <StarRating rating={rating} readonly size="sm" />}
          </div>
          {status === 'reading' && readingProgress > 0 && (
            <ProgressBar progress={readingProgress} />
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default BookCard;
