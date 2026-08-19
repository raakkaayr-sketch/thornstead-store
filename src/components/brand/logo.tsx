import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config';

/**
 * Hainholt mark: a sprig growing from a grounded base, drawn in a single
 * weight so it stays legible at favicon size.
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
      <path
        d="M16 25V13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="text-brand-foreground"
      />
      <path
        d="M16 17c0-3.3 2.4-6 5.4-6 0 3.3-2.4 6-5.4 6Z"
        fill="currentColor"
        className="text-brand-foreground"
      />
      <path
        d="M16 21c0-2.8-2-5-4.6-5 0 2.8 2 5 4.6 5Z"
        fill="currentColor"
        className="text-brand-foreground"
        opacity="0.72"
      />
      <path
        d="M10.5 25h11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="text-brand-foreground"
        opacity="0.5"
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
