import { siteConfig } from './config';
import { getRealSocialUrls } from './social';
import { absoluteUrl, shippingFor } from './utils';
import type { Product } from './types';

const base = siteConfig.url.replace(/\/$/, '');

/**
 * Organization + OnlineStore. Diese Werte müssen exakt mit dem Footer, dem
 * Impressum und den Unternehmensangaben im Merchant Center übereinstimmen.
 * Google vergleicht sie; Abweichungen führen zur Sperrung.
 */
export function organizationJsonLd() {
  const { contact, business, payment } = siteConfig;
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
    currenciesAccepted: siteConfig.currency,
    paymentAccepted: payment.methods.join(', '),
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
      areaServed: business.countryCode,
      availableLanguage: ['German', 'de'],
    },
    ...(sameAs.length ? { sameAs } : {}),
    ...(business.vatNumber ? { vatID: business.vatNumber } : {}),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: base,
    name: siteConfig.name,
    inLanguage: 'de-DE',
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
 * Product schema. Jeder Wert unten wird auch auf der Seite dargestellt und im
 * Merchant-Center-Feed übermittelt — Google prüft alle drei gegeneinander.
 *
 * Die Preise sind Bruttopreise, daher `valueAddedTaxIncluded: true`. Ein
 * Nettopreis im Markup bei Bruttopreis auf der Seite wäre eine Abweichung, die
 * Google als Preisfehler beanstandet.
 */
export function productJsonLd(product: Product) {
  const url = absoluteUrl(`/produkte/${product.slug}`);
  const { shipping, returns, business, gpsr } = siteConfig;

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
    manufacturer: { '@type': 'Organization', name: gpsr.manufacturerName },
    category: product.category,
    inLanguage: 'de-DE',
    offers: {
      '@type': 'Offer',
      url,
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: product.price.toFixed(2),
        priceCurrency: product.currency,
        valueAddedTaxIncluded: !business.smallBusinessScheme,
      },
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
        shippingDestination: siteConfig.shipping.shipToCountries.map(
          (countryCode) => ({
            '@type': 'DefinedRegion',
            addressCountry: countryCode,
          })
        ),
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
