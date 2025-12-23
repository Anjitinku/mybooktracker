import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number | null;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const StarRating = ({ rating, onChange, readonly = false, size = 'md' }: StarRatingProps) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            'transition-transform',
            !readonly && 'hover:scale-110 cursor-pointer',
            readonly && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              'transition-colors',
              rating && star <= rating
                ? 'fill-star-filled text-star-filled'
                : 'fill-transparent text-star-empty'
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
