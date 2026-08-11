'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { cn, formatPrice } from '@/lib/utils';
import type { Category, Product, SortOption } from '@/lib/types';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

export function ShopBrowser({
  products,
  categories,
  priceRange,
  initialQuery = '',
  initialCategory,
}: {
  products: Product[];
  categories: Category[];
  priceRange: { min: number; max: number };
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selected, setSelected] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [maxPrice, setMaxPrice] = useState(priceRange.max);
  const [sort, setSort] = useState<SortOption>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = products.filter((product) => {
      if (selected.length && !selected.includes(product.categorySlug)) return false;
      if (product.price > maxPrice) return false;
      if (!q) return true;
      return (
        product.title.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q) ||
        product.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });

    list = [...list];
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        list.sort(
          (a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price
        );
    }
    return list;
  }, [products, query, selected, maxPrice, sort]);

  const activeFilters =
    selected.length + (maxPrice < priceRange.max ? 1 : 0) + (query ? 1 : 0);

  const reset = () => {
    setQuery('');
    setSelected([]);
    setMaxPrice(priceRange.max);
    setSort('featured');
  };

  const toggleCategory = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const filters = (
    <div className="space-y-8">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider">Search</h2>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the range"
          className="mt-3"
          aria-label="Search products"
        />
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider">Category</h2>
        <ul className="mt-3 space-y-2">
          {categories.map((category) => {
            const count = products.filter(
              (p) => p.categorySlug === category.slug
            ).length;
            return (
              <li key={category.slug}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={selected.includes(category.slug)}
                    onChange={() => toggleCategory(category.slug)}
                    className="h-4 w-4 rounded border-border accent-[hsl(var(--brand))]"
                  />
                  <span className="flex-1">{category.name}</span>
                  <span className="text-xs tabular-nums">{count}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider">
          Maximum price
        </h2>
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="mt-4 w-full accent-[hsl(var(--brand))]"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Up to <span className="tabular-nums">{formatPrice(maxPrice)}</span>
        </p>
      </div>

      {activeFilters > 0 && (
        <Button variant="outline" size="sm" onClick={reset} className="w-full">
          Clear filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container-page grid gap-10 px-6 py-12 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24">{filters}</div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? 'product' : 'products'}
            {activeFilters > 0 && ' matching your filters'}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters > 0 && ` (${activeFilters})`}
            </Button>

            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sort products"
              className="h-9 w-auto py-0 text-[13px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="font-medium">No products match those filters</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Try widening the price range or clearing a category to see more of
              the range.
            </p>
            <Button variant="outline" size="sm" onClick={reset}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 3}
              />
            ))}
          </div>
        )}
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[85] lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-background p-6 pb-10'
            )}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-full p-2 text-muted-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filters}
            <Button
              variant="brand"
              className="mt-8 w-full"
              onClick={() => setFiltersOpen(false)}
            >
              Show {results.length} products
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
