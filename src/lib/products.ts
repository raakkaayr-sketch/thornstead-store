import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import type { Category, Product, SortOption } from './types';

const products = productsData as Product[];
const categories = categoriesData as Category[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function countProductsInCategory(slug: string): number {
  return getProductsByCategory(slug).length;
}

export function getFeaturedProducts(limit = 4): Product[] {
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  );
  const others = products.filter(
    (p) => p.categorySlug !== product.categorySlug && p.id !== product.id
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getPriceRange(): { min: number; max: number } {
  if (!products.length) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

export interface ProductFilters {
  query?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
}

export function filterProducts(filters: ProductFilters = {}): Product[] {
  const {
    query = '',
    categories: cats = [],
    minPrice,
    maxPrice,
    sort = 'featured',
  } = filters;

  let result = [...products];

  const q = query.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (cats.length) result = result.filter((p) => cats.includes(p.categorySlug));
  if (typeof minPrice === 'number') result = result.filter((p) => p.price >= minPrice);
  if (typeof maxPrice === 'number') result = result.filter((p) => p.price <= maxPrice);

  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      result.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      result.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price
      );
  }

  return result;
}

export function searchProducts(query: string, limit = 6): Product[] {
  if (!query.trim()) return [];
  return filterProducts({ query }).slice(0, limit);
}
