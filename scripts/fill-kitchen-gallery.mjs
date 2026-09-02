/**
 * Downloads extra manufacturer photos for kitchen products that have fewer
 * than 3 images. Never overwrites existing files.
 *
 * Run: node scripts/fill-kitchen-gallery.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'images', 'products');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const EXTRA = {
  'philips-series-5500-lattego-ep5541': [
    'https://images.philips.com/is/image/PhilipsConsumer/EP5541_50-GAL1-global?wid=1800&hei=1800&fmt=jpg',
    'https://images.philips.com/is/image/PhilipsConsumer/EP5541_50-GAL2-global?wid=1800&hei=1800&fmt=jpg',
    'https://images.philips.com/is/image/PhilipsConsumer/EP5541_50-GAL3-global?wid=1800&hei=1800&fmt=jpg',
    'https://images.philips.com/is/image/PhilipsConsumer/EP5541_50-GAL1-de_DE?wid=1800&hei=1800&fmt=jpg',
    'https://images.philips.com/is/image/PhilipsConsumer/EP5541_50-GAL2-de_DE?wid=1800&hei=1800&fmt=jpg',
    'https://images.philips.com/is/image/PhilipsConsumer/EP5541_50-IMS-de_DE?wid=1800&hei=1800&fmt=jpg',
  ],
  'siemens-eq500-integral': [
    'https://media3.bsh-group.com/Product_Shots/1600x1600/MCSA02944725_TQ507DX3_EQ500_integral_def.jpg',
    'https://media3.bsh-group.com/Product_Shots/1600x1600/MCSA02944726_TQ507DX3_EQ500_integral_def.jpg',
  ],
  'jura-e4': [
    'https://api.jura.com/media/global/images/home-products/e-line-2021/e4/e4-piano-black-ea-15435/e4_ea_pianoblack_side.jpg',
    'https://api.jura.com/media/global/images/home-products/e-line-2021/e4/e4-piano-black-ea-15435/e4_ea_pianoblack_detail.jpg',
    'https://www.jura.com/-/media/global/images/home-products/e-line-2021/e4/e4-piano-black-ea-15435/e4_ea_pianoblack_lifestyle.jpg',
  ],
  'melitta-caffeo-barista-ts-smart': [
    'https://www.melitta.de/-/media/melitta/products/kaffeevollautomaten/barista-ts-smart/f860-100/gallery-2.jpg',
  ],
  'delonghi-dedica-maestro-ec950': [
    'https://dam.delonghi.com/1200x1200/assets/252026',
    'https://dam.delonghi.com/1200x1200/assets/252027',
    'https://dam.delonghi.com/1200x1200/assets/252028',
    'https://dam.delonghi.com/1200x1200/assets/252029',
    'https://dam.delonghi.com/1200x1200/assets/252030',
  ],
  'kitchenaid-artisan-5ksm175ps': [
    'https://www.whirlpool.com/is/image/content/dam/emea/kitchenaid/image/product-shot/kit/5KSM175PSECA.jpg?wid=1600&hei=1600&fmt=jpg',
    'https://www.kitchenaid.de/on/demandware.static/-/Sites-kitchenaid-master-catalog/default/dw/images/hi-res/5KSM175PSBCA_1.jpg',
  ],
  'philips-airfryer-xxl-hd9650': [
    'https://images.philips.com/is/image/PhilipsConsumer/HD9650_90-GAL1-global?wid=1800&hei=1800&fmt=jpg',
    'https://images.philips.com/is/image/PhilipsConsumer/HD9650_90-GAL2-global?wid=1800&hei=1800&fmt=jpg',
    'https://images.philips.com/is/image/PhilipsConsumer/HD9650_90-GAL3-global?wid=1800&hei=1800&fmt=jpg',
    'https://images.philips.com/is/image/PhilipsConsumer/HD9650_90-GAL1-de_DE?wid=1800&hei=1800&fmt=jpg',
    'https://images.philips.com/is/image/PhilipsConsumer/HD9650_90-GAL2-de_DE?wid=1800&hei=1800&fmt=jpg',
  ],
};

const SHOPIFY = {
  'ninja-foodi-max-dual-zone-af400': [
    'https://www.ninjakitchen.co.uk/products/ninja-foodi-max-dual-zone-air-fryer-af400uk.json',
  ],
  'ninja-foodi-multikocher-ol750': [
    'https://www.ninjakitchen.co.uk/products/ninja-foodi-15-in-1-smartlid-multi-cooker-ol750uk.json',
  ],
  'instant-pot-pro-crisp': [
    'https://www.instantpot.com/products/instant-pot-pro-crisp-8-quart.json',
  ],
};

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/avif,image/webp,image/*,*/*' },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(String(res.status));
  const type = res.headers.get('content-type') || '';
  if (type.includes('text/html') || type.includes('application/json') || type.includes('text/plain')) {
    throw new Error(`not image (${type})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 20000) throw new Error(`too small ${buf.length}`);
  return buf;
}

async function toAvif(buffer, dest) {
  await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize(1600, 1600, {
      fit: 'contain',
      background: { r: 250, g: 248, b: 244, alpha: 1 },
    })
    .avif({ quality: 58, effort: 4 })
    .toFile(dest);
}

function nextSlot(slug) {
  for (let i = 1; i <= 3; i++) {
    if (!fs.existsSync(path.join(outDir, `${slug}-${i}.avif`))) return i;
  }
  return null;
}

async function shopifySrcs(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(String(res.status));
  const data = await res.json();
  return (data.product?.images || []).map((img) =>
    String(img.src || img).replace(
      /_(pico|icon|thumb|small|compact|medium|large|grande|1024x1024|2048x2048)(?=\.)/,
      ''
    )
  );
}

async function fill(slug, urls) {
  let saved = 0;
  for (const url of urls) {
    const slot = nextSlot(slug);
    if (!slot) break;
    const dest = path.join(outDir, `${slug}-${slot}.avif`);
    try {
      const buf = await fetchBuffer(url);
      await toAvif(buf, dest);
      if (fs.statSync(dest).size < 8000) {
        fs.unlinkSync(dest);
        throw new Error('avif too small');
      }
      console.log(`  saved ${path.basename(dest)} <- ${url.slice(0, 90)}`);
      saved += 1;
    } catch (err) {
      console.log(`  skip ${err.message} :: ${url.slice(0, 90)}`);
    }
  }
  return saved;
}

async function main() {
  for (const [slug, urls] of Object.entries(EXTRA)) {
    console.log(`\n== ${slug}`);
    await fill(slug, urls);
  }

  for (const [slug, endpoints] of Object.entries(SHOPIFY)) {
    console.log(`\n== shopify ${slug}`);
    for (const endpoint of endpoints) {
      try {
        const srcs = await shopifySrcs(endpoint);
        console.log(`  ${srcs.length} shopify images`);
        await fill(slug, srcs.slice(0, 8));
      } catch (err) {
        console.log(`  shopify fail ${err.message}`);
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
