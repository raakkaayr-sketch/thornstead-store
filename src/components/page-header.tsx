import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      {items.map((item, index) => (
        <span key={item.path} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-3 w-3" />}
          {index === items.length - 1 ? (
            <span aria-current="page" className="text-foreground">
              {item.name}
            </span>
          ) : (
            <Link href={item.path} className="transition-colors hover:text-foreground">
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({
  title,
  description,
  crumbs,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <header className="border-b border-border bg-muted/30">
      <div className="container-page px-6 py-12">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
