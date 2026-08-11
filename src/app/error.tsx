'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-5 px-6 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-[15px] text-muted-foreground">
        Sorry — that page failed to load. Trying again usually fixes it. If it
        keeps happening, please let us know.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="brand" onClick={reset}>
          Try again
        </Button>
        <Link href="/contact" className={buttonVariants({ variant: 'outline' })}>
          Contact us
        </Link>
      </div>
    </div>
  );
}
