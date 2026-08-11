import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button-variants';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="font-display text-5xl font-semibold text-brand">404</p>
      <div>
        <h1 className="text-2xl font-semibold">We could not find that page</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          It may have been moved, or the link might be out of date. The shop is
          still where you left it.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href="/" className={buttonVariants({ variant: 'outline' })}>
          Back home
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: 'brand' })}>
          Browse the shop
        </Link>
      </div>
    </div>
  );
}
