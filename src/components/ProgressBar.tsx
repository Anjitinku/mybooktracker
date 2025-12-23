import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar = ({ progress, className }: ProgressBarProps) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">Progress</span>
        <span className="text-xs font-medium text-foreground">{progress}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-status-reading transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
