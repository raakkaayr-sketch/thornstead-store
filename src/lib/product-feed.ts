import { siteConfig } from './config';
import { getAllProducts } from './products';
import { absoluteUrl, escapeCsv, escapeXml, feedPrice, shippingFor } from './utils';
import type { Product } from './types';

/**
 * Google Merchant Center feeds.
 *
 * Both feeds are generated from the same product data that renders the site,
 * so a price, title, image or availability can never drift between the feed
 * and the landing page — mismatches there are the most common cause of
 * "Mismatched value" disapprovals and Misrepresentation flags.
 *
 * Own-brand products have no GTIN, so we submit `brand` + `mpn` and set
 * `identifier_exists` to `no`, which is exactly what Google asks for when a
 * manufacturer has not assigned a barcode. We never invent a GTIN.
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
    ? 'Free UK delivery'
    : siteConfig.shipping.serviceName;
}

export function generateProductFeedXml(): string {
  const products = getAllProducts();
  const now = new Date().toUTCString();

  const items = products
    .map((product) => {
      const link = absoluteUrl(`/products/${product.slug}`);
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
        <g:country>${siteConfig.business.countryCode}</g:country>
        <g:service>${escapeXml(shippingLabel(product))}</g:service>
        <g:price>${feedPrice(shippingCost)}</g:price>
      </g:shipping>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Product Feed</title>
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

  const rows = products.map((product) => {
    const [mainImage, ...extraImages] = product.images;
    const shippingCost = shippingFor(product.price);

    const values: Record<(typeof CSV_COLUMNS)[number], string> = {
      id: product.sku,
      title: product.title,
      description: product.shortDescription,
      link: absoluteUrl(`/products/${product.slug}`),
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
      shipping: `${siteConfig.business.countryCode}:::${feedPrice(shippingCost)}`,
    };

    return CSV_COLUMNS.map((col) => escapeCsv(values[col])).join(',');
  });

  return [CSV_COLUMNS.join(','), ...rows].join('\n');
}
