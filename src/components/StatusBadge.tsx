// Import utility function for merging class names
import { cn } from '@/lib/utils';

// Define type for book reading status - matches database enum
type BookStatus = 'want_to_read' | 'reading' | 'read';

// Define props interface for StatusBadge component
interface StatusBadgeProps {
  status: BookStatus; // The reading status to display
  className?: string; // Optional additional CSS classes
}

// Configuration object mapping each status to its label and styling
const statusConfig: Record<BookStatus, { label: string; className: string }> = {
  want_to_read: {
    label: 'Want to Read', // Display text for want_to_read status
    className: 'bg-muted text-muted-foreground border-muted', // Neutral/muted styling
  },
  reading: {
    label: 'Reading', // Display text for reading status
    className: 'bg-status-reading/10 text-status-reading border-status-reading/30', // Blue/active styling
  },
  read: {
    label: 'Read', // Display text for read status
    className: 'bg-status-read/10 text-status-read border-status-read/30', // Green/completed styling
  },
};

// StatusBadge component - displays a colored badge for book reading status
const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  // Get the configuration for the current status
  const config = statusConfig[status];
  
  // Render the badge span element
  return (
    <span
      className={cn(
        // Base badge styles: flexbox, rounded, border, padding, text size
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        // Status-specific styling from config
        config.className,
        // Any additional classes passed as props
        className
      )}
    >
      {/* Display the human-readable status label */}
      {config.label}
    </span>
  );
};

// Export StatusBadge component as default export
export default StatusBadge;
