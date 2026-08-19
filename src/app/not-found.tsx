import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button-variants';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="font-display text-5xl font-semibold text-brand">404</p>
      <div>
        <h1 className="text-2xl font-semibold">Diese Seite gibt es nicht</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Sie wurde möglicherweise verschoben oder der Link ist veraltet. Der
          Shop ist noch da, wo Sie ihn verlassen haben.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href="/" className={buttonVariants({ variant: 'outline' })}>
          Zur Startseite
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: 'brand' })}>
          Zum Shop
        </Link>
      </div>
    </div>
  );
}
