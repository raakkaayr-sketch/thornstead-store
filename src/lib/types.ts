export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  /** Stable internal identifier, also used as the feed `mpn`. */
  sku: string;
  title: string;
  /** Hersteller oder Markenname des Produkts (z. B. Canon, Nikon). */
  brand: string;
  category: string;
  categorySlug: string;
  price: number;
  /** ISO 4217, für diesen Shop immer EUR. Bruttopreis inklusive MwSt. */
  currency: string;
  /** Google product condition. */
  condition: 'new' | 'refurbished' | 'used';
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  /**
   * Real barcode if the product has one. Left empty for own-brand goods that
   * have not been assigned a GTIN — the feed then sets identifier_exists=no.
   * Never invent a value here.
   */
  gtin: string;
  /** Google product category ID (taxonomy), improves feed quality. */
  googleProductCategory: string;
  images: ProductImage[];
  shortDescription: string;
  description: string;
  features: string[];
  specifications: ProductSpec[];
  /** Genuine review data only. A new shop has none. */
  reviewCount: number;
  ratingValue: number;
  featured: boolean;
  tags: string[];
  /**
   * Produktspezifische Warn- und Sicherheitshinweise nach Art. 19 Abs. 1 Buchst. d
   * GPSR. Fehlt das Feld, greift der allgemeine Hinweis in ProductCompliance.
   */
  safetyNotes?: string[];
}

export interface Category {
  name: string;
  slug: string;
  description: string;
}

export interface CartItem {
  id: string;
  slug: string;
  title: string;
  sku: string;
  price: number;
  image: string;
  quantity: number;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc';
