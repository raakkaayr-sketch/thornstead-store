import { cn } from '@/lib/utils';

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'brand' | 'outline';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        variant === 'default' && 'bg-secondary text-secondary-foreground',
        variant === 'brand' && 'bg-brand/10 text-brand',
        variant === 'outline' && 'border border-border text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}
