import { cn } from '@/lib/utils';

type BookStatus = 'want_to_read' | 'reading' | 'read';

interface StatusBadgeProps {
  status: BookStatus;
  className?: string;
}

const statusConfig: Record<BookStatus, { label: string; className: string }> = {
  want_to_read: {
    label: 'Want to Read',
    className: 'bg-muted text-muted-foreground border-muted',
  },
  reading: {
    label: 'Reading',
    className: 'bg-status-reading/10 text-status-reading border-status-reading/30',
  },
  read: {
    label: 'Read',
    className: 'bg-status-read/10 text-status-read border-status-read/30',
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
