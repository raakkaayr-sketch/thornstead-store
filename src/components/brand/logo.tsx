import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config';

/**
 * Hainholt mark: a skillet, drawn in one weight so it stays clear at
 * favicon size. Copper square, cream pan.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('h-8 w-8', className)}
    >
      <rect width="32" height="32" rx="9" className="fill-brand" />
      <circle
        cx="13.5"
        cy="16"
        r="6.4"
        stroke="currentColor"
        strokeWidth="1.8"
        className="text-brand-foreground"
      />
      <circle
        cx="13.5"
        cy="16"
        r="2.1"
        fill="currentColor"
        className="text-brand-foreground"
        opacity="0.45"
      />
      <path
        d="M20 16h6.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="text-brand-foreground"
      />
    </svg>
  );
}

export function Logo({
  className,
  showTagline = false,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight">
          {siteConfig.name}
        </span>
        {showTagline && (
          <span className="mt-1 text-[11px] tracking-wide text-muted-foreground">
            {siteConfig.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
