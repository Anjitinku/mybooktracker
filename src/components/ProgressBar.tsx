// Import utility function for merging class names
import { cn } from '@/lib/utils';

// Define props interface for ProgressBar component
interface ProgressBarProps {
  progress: number; // Progress value from 0 to 100
  className?: string; // Optional additional CSS classes
}

// ProgressBar component - visual indicator of reading progress
const ProgressBar = ({ progress, className }: ProgressBarProps) => {
  // Render the progress bar container
  return (
    // Outer container with optional custom classes
    <div className={cn('w-full', className)}>
      {/* Header row with label and percentage */}
      <div className="flex items-center justify-between mb-1">
        {/* Progress label text */}
        <span className="text-xs text-muted-foreground">Progress</span>
        {/* Progress percentage display */}
        <span className="text-xs font-medium text-foreground">{progress}%</span>
      </div>
      {/* Progress track (background bar) */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        {/* Progress indicator (filled portion) */}
        <div
          // Styling for the progress fill
          className="h-full rounded-full bg-status-reading transition-all duration-500 ease-out"
          // Set width dynamically based on progress value
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Export ProgressBar component as default export
export default ProgressBar;
