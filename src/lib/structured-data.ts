import { siteConfig, formattedAddress } from './config';
import { getRealSocialUrls } from './social';
import { absoluteUrl, shippingFor } from './utils';
import type { Product } from './types';

const base = siteConfig.url.replace(/\/$/, '');

/**
 * Organization + OnlineStore. Values here must match the footer, the contact
 * page and your Merchant Center business information exactly.
 */
export function organizationJsonLd() {
  const { contact, business } = siteConfig;
  const sameAs = getRealSocialUrls();

  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': `${base}/#organization`,
    name: siteConfig.name,
    legalName: business.legalName,
    url: base,
    logo: `${base}/logo.svg`,
    image: `${base}/logo.svg`,
    description: siteConfig.description,
    email: contact.email,
    telephone: contact.phone,
    currenciesAccepted: siteConfig.currency,
    paymentAccepted: 'Credit Card, Debit Card',
    areaServed: { '@type': 'Country', name: business.country },
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.street,
      addressLocality: contact.city,
      postalCode: contact.postcode,
      addressCountry: contact.countryCode,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: contact.email,
      telephone: contact.phone,
      areaServed: business.countryCode,
      availableLanguage: ['English'],
    },
    ...(sameAs.length ? { sameAs } : {}),
    ...(business.vatNumber ? { vatID: business.vatNumber } : {}),
    ...(business.companyNumber
      ? { identifier: business.companyNumber }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: base,
    name: siteConfig.name,
    publisher: { '@id': `${base}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${base}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Product schema. Every value below is also rendered on the page and sent in
 * the Merchant Center feed — Google cross-checks all three.
 */
export function productJsonLd(product: Product) {
  const url = absoluteUrl(`/products/${product.slug}`);
  const { shipping, returns, business } = siteConfig;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.title,
    description: product.shortDescription,
    image: product.images.map((img) => absoluteUrl(img.src)),
    sku: product.sku,
    mpn: product.sku,
    ...(product.gtin ? { gtin: product.gtin } : {}),
    brand: { '@type': 'Brand', name: product.brand },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url,
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.availability === 'in_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@id': `${base}/#organization` },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: shippingFor(product.price).toFixed(2),
          currency: siteConfig.currency,
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: business.countryCode,
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: shipping.handlingDaysMin,
            maxValue: shipping.handlingDaysMax,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: shipping.transitDaysMin,
            maxValue: shipping.transitDaysMax,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: business.countryCode,
        returnPolicyCategory:
          'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: returns.days,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees:
          returns.returnShippingPaidBy === 'merchant'
            ? 'https://schema.org/FreeReturn'
            : 'https://schema.org/ReturnShippingFees',
      },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Renders a JSON-LD script tag. */
export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, '\\u003c'),
  };
}
