/**
 * Thornstead — single source of truth for brand, business and policy data.
 *
 * Every customer-facing surface (footer, contact page, policies, checkout,
 * JSON-LD, Merchant Center feed) reads from this file. Google compares the
 * business details on your site against the ones in Merchant Center and your
 * payment processor — if they disagree, that is a Misrepresentation flag.
 * Change values here only, never in individual pages.
 *
 * BEFORE GOING LIVE: replace every value marked "REPLACE" with your real,
 * registered details.
 */

export const siteConfig = {
  name: 'Thornstead',
  tagline: 'Rooted in good design.',
  description:
    'Thornstead designs and sells its own range of home and garden essentials in the United Kingdom — planters, outdoor storage, garden tools and wildlife care, delivered UK-wide.',
  /** REPLACE with your live domain. Also set NEXT_PUBLIC_SITE_URL in Vercel. */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://thornstead.store',
  locale: 'en-GB',
  currency: 'GBP',
  currencySymbol: '£',

  /** Legal entity behind the shop. Must match Stripe and Merchant Center. */
  business: {
    /** Sole-trader / brand trading name (not a limited company). */
    legalName: 'Thornstead',
    tradingName: 'Thornstead',
    /** Leave empty — not a Companies House registered company. */
    companyNumber: '',
    /** Leave empty if not VAT registered. */
    vatNumber: '',
    countryCode: 'GB',
    country: 'United Kingdom',
  },

  /** REPLACE all of these with details you can actually be reached on. */
  contact: {
    email: 'contact@thornstead.store',
    phone: '+44 7462 294018',
    /** Digits only, for tel: links. */
    phoneHref: '+447462294018',
    street: '44 Glebe Way',
    city: 'Hornchurch',
    postcode: 'RM11 3RR',
    country: 'United Kingdom',
    countryCode: 'GB',
    hours: 'Monday to Friday, 9:00–17:00 (UK time)',
  },

  /**
   * Real social profiles only. Leave a value as '' and the icon is not
   * rendered anywhere — linking to a bare platform homepage is a trust flag.
   */
  social: {
    instagram: '',
    facebook: '',
    pinterest: '',
  },

  /**
   * Shipping. These exact numbers are used on product pages, in the shipping
   * policy, at checkout and in the Merchant Center feed. Whatever you set in
   * Merchant Center → Shipping must match this.
   */
  shipping: {
    /** Standard UK delivery charge in GBP. */
    standardCost: 3.95,
    /** Orders at or above this subtotal ship free. Set to null to always charge. */
    freeThreshold: 40,
    handlingDaysMin: 1,
    handlingDaysMax: 2,
    transitDaysMin: 2,
    transitDaysMax: 4,
    /** UK only. Adding countries here means updating Merchant Center too. */
    shipToCountries: ['GB'] as const,
    serviceName: 'Standard UK Delivery',
  },

  /** Returns. UK law gives 14 days to cancel; we voluntarily offer longer. */
  returns: {
    days: 30,
    statutoryCancellationDays: 14,
    returnShippingPaidBy: 'customer' as 'customer' | 'merchant',
    restockingFee: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Full postal address on one line, used in footers and JSON-LD. */
export function formattedAddress() {
  const { street, city, postcode, country } = siteConfig.contact;
  return `${street}, ${city}, ${postcode}, ${country}`;
}

/** Total estimated delivery window (handling + transit) in business days. */
export function deliveryWindow() {
  const { handlingDaysMin, handlingDaysMax, transitDaysMin, transitDaysMax } =
    siteConfig.shipping;
  return {
    min: handlingDaysMin + transitDaysMin,
    max: handlingDaysMax + transitDaysMax,
  };
}
