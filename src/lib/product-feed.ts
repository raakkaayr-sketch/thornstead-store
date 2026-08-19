import { siteConfig } from './config';
import { getAllProducts } from './products';
import { absoluteUrl, escapeCsv, escapeXml, feedPrice, shippingFor } from './utils';
import type { Product } from './types';

/**
 * Feeds für Google Merchant Center (Deutschland).
 *
 * Beide Feeds entstehen aus denselben Produktdaten wie die Website. Preis,
 * Titel, Bild und Verfügbarkeit können daher nicht zwischen Feed und Zielseite
 * auseinanderlaufen — solche Abweichungen sind die häufigste Ursache für
 * Ablehnungen wegen "Wert stimmt nicht überein" und für Sperrungen wegen
 * Falschdarstellung.
 *
 * Eigenmarkenprodukte haben keine GTIN. Wir übermitteln daher Marke + MPN und
 * setzen `identifier_exists` auf `no`, genau so wie Google es verlangt, wenn
 * der Hersteller keine EAN vergeben hat. Eine GTIN wird niemals erfunden.
 *
 * Preise sind Bruttopreise inklusive 19 % MwSt. Google erwartet für
 * Deutschland den Steueranteil im Preis, nicht als gesondertes Feld. Die
 * Versandkosten im Feed müssen mit denen an der Kasse und auf der
 * Versandseite übereinstimmen.
 */

function availabilityValue(product: Product) {
  switch (product.availability) {
    case 'out_of_stock':
      return 'out_of_stock';
    case 'preorder':
      return 'preorder';
    default:
      return 'in_stock';
  }
}

function shippingLabel(product: Product) {
  return shippingFor(product.price) === 0
    ? 'Versandkostenfreie Lieferung'
    : siteConfig.shipping.serviceName;
}

function productLink(product: Product) {
  return absoluteUrl(`/produkte/${product.slug}`);
}

export function generateProductFeedXml(): string {
  const products = getAllProducts();
  const now = new Date().toUTCString();
  const { countryCode } = siteConfig.business;

  const items = products
    .map((product) => {
      const link = productLink(product);
      const [mainImage, ...extraImages] = product.images;
      const shippingCost = shippingFor(product.price);

      const additionalImages = extraImages
        .slice(0, 10)
        .map(
          (img) =>
            `      <g:additional_image_link>${escapeXml(
              absoluteUrl(img.src)
            )}</g:additional_image_link>`
        )
        .join('\n');

      return `    <item>
      <g:id>${escapeXml(product.sku)}</g:id>
      <g:title>${escapeXml(product.title)}</g:title>
      <g:description>${escapeXml(product.shortDescription)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(absoluteUrl(mainImage.src))}</g:image_link>
${additionalImages}
      <g:availability>${availabilityValue(product)}</g:availability>
      <g:price>${feedPrice(product.price, product.currency)}</g:price>
      <g:condition>${product.condition}</g:condition>
      <g:brand>${escapeXml(product.brand)}</g:brand>
      <g:mpn>${escapeXml(product.sku)}</g:mpn>
      ${
        product.gtin
          ? `<g:gtin>${escapeXml(product.gtin)}</g:gtin>`
          : `<g:identifier_exists>no</g:identifier_exists>`
      }
      <g:google_product_category>${escapeXml(
        product.googleProductCategory
      )}</g:google_product_category>
      <g:product_type>${escapeXml(product.category)}</g:product_type>
      <g:shipping>
        <g:country>${countryCode}</g:country>
        <g:service>${escapeXml(shippingLabel(product))}</g:service>
        <g:price>${feedPrice(shippingCost)}</g:price>
      </g:shipping>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Produktfeed</title>
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

const CSV_COLUMNS = [
  'id',
  'title',
  'description',
  'link',
  'image_link',
  'additional_image_link',
  'availability',
  'price',
  'condition',
  'brand',
  'mpn',
  'gtin',
  'identifier_exists',
  'google_product_category',
  'product_type',
  'shipping',
] as const;

export function generateProductFeedCsv(): string {
  const products = getAllProducts();
  const { countryCode } = siteConfig.business;

  const rows = products.map((product) => {
    const [mainImage, ...extraImages] = product.images;
    const shippingCost = shippingFor(product.price);

    const values: Record<(typeof CSV_COLUMNS)[number], string> = {
      id: product.sku,
      title: product.title,
      description: product.shortDescription,
      link: productLink(product),
      image_link: absoluteUrl(mainImage.src),
      additional_image_link: extraImages
        .map((img) => absoluteUrl(img.src))
        .join(','),
      availability: availabilityValue(product),
      price: feedPrice(product.price, product.currency),
      condition: product.condition,
      brand: product.brand,
      mpn: product.sku,
      gtin: product.gtin,
      identifier_exists: product.gtin ? 'yes' : 'no',
      google_product_category: product.googleProductCategory,
      product_type: product.category,
      shipping: `${countryCode}:::${feedPrice(shippingCost)}`,
    };

    return CSV_COLUMNS.map((col) => escapeCsv(values[col])).join(',');
  });

  return [CSV_COLUMNS.join(','), ...rows].join('\n');
}
