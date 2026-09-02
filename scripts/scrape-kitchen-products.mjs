/**
 * Downloads official manufacturer / Wikimedia product photos for the 30-item
 * kitchen catalog, converts them to square AVIF, and writes a manifest.
 *
 * Run: node scripts/scrape-kitchen-products.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'images', 'products');
const manifestPath = path.join(root, 'scripts', 'kitchen-image-manifest.json');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const BLOCK =
  /ytimg|youtu\.be|logo|favicon|sprite|icon-|apple-touch|badge|pixel|1x1|placeholder|banner|menu-|nav-|flag|payment|visa|mastercard|facebook|instagram|pinterest|twitter|cup.?warmer|geschirr|accessories\/|tassenwae|packaging-shot/i;

const PRODUCTS = [
  {
    sku: 'HH-KAF-002',
    slug: 'philips-series-5500-lattego-ep5541',
    query: 'Philips 5500 LatteGo EP5541 coffee machine',
    pages: [
      'https://www.philips.de/c-p/EP5541_50/5500-serie-vollautomatische-espressomaschinen',
    ],
    images: [
      'https://images.philips.com/is/image/philipsconsumer/vrs_9ef9a297_0354_4aed_b62899e847c213f6?wid=1800&hei=1800&fmt=jpg',
    ],
  },
  {
    sku: 'HH-KAF-003',
    slug: 'sage-barista-express-ses875',
    query: 'Sage Barista Express SES875 espresso machine',
    pages: ['https://www.sageappliances.com/en-gb/product/bes875'],
    images: [],
    allowHost: /breville|sageappliances|aem-assets/i,
  },
  {
    sku: 'HH-KAF-004',
    slug: 'siemens-eq500-integral',
    query: 'Siemens EQ.500 integral coffee machine',
    pages: [
      'https://www.siemens-home.bsh-group.com/de/product/TQ507DX3',
      'https://www.siemens-home.bsh-group.com/de/product/TQ507D03',
    ],
    images: [],
  },
  {
    sku: 'HH-KAF-005',
    slug: 'jura-e4',
    query: 'JURA E4 Piano Black coffee machine',
    pages: [
      'https://ca.jura.com/en/homeproducts/machines/e4-piano-black-naa-15466',
    ],
    images: [],
    allowHost: /jura\.com/i,
    deny: /accessories|cup.?warmer|geschirr/i,
  },
  {
    sku: 'HH-KAF-006',
    slug: 'melitta-caffeo-barista-ts-smart',
    query: 'Melitta Barista TS Smart F860 coffee machine',
    pages: [
      'https://www.melitta-international.com/bean-to-cup-machines/our-categories/all-bean-to-cup-machines/Melitta-Barista-TS-Smart',
    ],
    images: [],
  },
  {
    sku: 'HH-KAF-007',
    slug: 'delonghi-dedica-maestro-ec950',
    query: "DeLonghi Dedica Maestro EC950 espresso machine",
    pages: [
      'https://www.delonghi.com/de-de/p/espresso-kaffeemaschine-dedica-maestro-plus-ec950.m/EC950.M.html',
    ],
    images: [
      'https://dam.delonghi.com/1200x1200/assets/252025',
    ],
  },
  {
    sku: 'HH-MAS-001',
    slug: 'kitchenaid-artisan-5ksm175ps',
    query: 'KitchenAid Artisan 5KSM175 stand mixer',
    pages: [
      'https://www.kitchenaid.de/kuechenmaschine/mittel/859701501000/kuechenmaschine-mit-kippbarem-motorkopf-48-l-artisan-mit-zusaetzlichem-zubehoer-5ksm175ps',
    ],
    images: [
      'https://www.whirlpool.com/is/image/content/dam/emea/kitchenaid/image/product-shot/kit/5KSM175PSB-almond-cream.jpg?wid=1600&hei=1600&fmt=jpg',
    ],
    allowHost: /whirlpool|kitchenaid/i,
    wikimedia: ['Red KitchenAid Artisan.jpg'],
  },
  {
    sku: 'HH-MAS-002',
    slug: 'kenwood-chef-titanium',
    query: 'Kenwood Chef Titanium stand mixer',
    pages: [
      'https://www.kenwoodworld.com/en-gb/p/chef-baker-titanium-chef-baker-black-kvc85.004bk/KVC85.004BK.html',
    ],
    images: [],
  },
  {
    sku: 'HH-MAS-003',
    slug: 'bosch-mum5-styline',
    query: 'Bosch MUM5 Styline kitchen machine',
    pages: ['https://www.bosch-home.com/de/product/MUMS2EW20'],
    images: [],
  },
  {
    sku: 'HH-MAS-004',
    slug: 'vitamix-ascent-a2500i',
    query: 'Vitamix Ascent A2500i blender',
    pages: [
      'https://www.vitamix.com/us/en_us/shop/a2500-ascent-series-smart-blender',
    ],
    images: [],
  },
  {
    sku: 'HH-MAS-005',
    slug: 'braun-multiquick-9',
    query: 'Braun MultiQuick 9 hand blender',
    pages: ['https://www.braunhousehold.com/de-de/stabmixer'],
    images: [],
  },
  {
    sku: 'HH-HLF-001',
    slug: 'ninja-foodi-max-dual-zone-af400',
    query: 'Ninja Foodi MAX Dual Zone AF400 air fryer',
    pages: [
      'https://www.ninjakitchen.de/ninja-max-6-in-1-dual-zone-heissluftfritteuse-95-l/DZ400EU.html',
    ],
    shopify: [
      'https://www.ninjakitchen.co.uk/products/ninja-foodi-max-dual-zone-air-fryer-af400uk.json',
    ],
    images: [],
  },
  {
    sku: 'HH-HLF-002',
    slug: 'philips-airfryer-xxl-hd9650',
    query: 'Philips Airfryer XXL HD9650',
    pages: ['https://www.philips.ae/c-p/HD9650_90/premium-airfryer-xxl'],
    images: [
      'https://images.philips.com/is/image/PhilipsConsumer/HD9650_90-IMS-de_DE?wid=1800&hei=1800&fmt=jpg',
    ],
  },
  {
    sku: 'HH-HLF-003',
    slug: 'ninja-foodi-multikocher-ol750',
    query: 'Ninja Foodi OL750 multi cooker',
    pages: [
      'https://www.ninjakitchen.de/ninja-foodi-max-15-in-1-smartlid-multikocher-7-5-l/OL750EU.html',
    ],
    shopify: [
      'https://www.ninjakitchen.co.uk/products/ninja-foodi-15-in-1-smartlid-multi-cooker-ol750uk.json',
    ],
    images: [],
  },
  {
    sku: 'HH-HLF-004',
    slug: 'instant-pot-pro-crisp',
    query: 'Instant Pot Pro Crisp pressure cooker',
    shopify: [
      'https://www.instantpot.com/products/instant-pot-pro-crisp-8-quart.json',
    ],
    pages: [],
    images: [],
  },
  {
    sku: 'HH-TOP-001',
    slug: 'le-creuset-signature-braeter-24-cm',
    query: 'Le Creuset Signature round dutch oven 24 cm',
    pages: [
      'https://www.lecreuset.com/round-dutch-oven/LS2501-247S.html',
    ],
    wikimedia: ['Le Creuset Enamel Cast Iron Cookware.jpg'],
    images: [],
  },
  {
    sku: 'HH-TOP-002',
    slug: 'staub-cocotte-rund-24-cm',
    query: 'Staub Cocotte round 24 cm',
    pages: ['https://www.zwilling.com/de/staub/'],
    wikimedia: [],
    images: [],
  },
  {
    sku: 'HH-TOP-003',
    slug: 'fissler-original-profi-collection-topfset',
    query: 'Fissler Original Profi Collection cookware set',
    pages: ['https://www.fissler.com/de/kochgeschirr/topfsets'],
    images: [],
  },
  {
    sku: 'HH-TOP-004',
    slug: 'wmf-fusiontec-topfset',
    query: 'WMF Fusiontec cookware set',
    pages: ['https://www.wmf.com/de/kochen/toepfe-sets'],
    images: [],
  },
  {
    sku: 'HH-TOP-005',
    slug: 'zwilling-motion-pfannenset',
    query: 'Zwilling Motion frying pan set',
    pages: ['https://www.zwilling.com/de/zwilling/pfannen/'],
    images: [],
  },
  {
    sku: 'HH-MES-001',
    slug: 'wuesthof-classic-ikon-messerblock',
    query: 'Wusthof Classic Ikon knife block',
    pages: ['https://www.wuesthof.com/de-de/'],
    images: [],
  },
  {
    sku: 'HH-MES-002',
    slug: 'zwilling-pro-messerblock-7-tlg',
    query: 'Zwilling Pro knife block 7 piece',
    pages: ['https://www.zwilling.com/de/zwilling/messer/pro/'],
    images: [],
  },
  {
    sku: 'HH-MES-003',
    slug: 'miyabi-5000-mcd-gyutoh',
    query: 'Miyabi 5000 MCD gyutoh chef knife',
    pages: ['https://www.zwilling.com/de/miyabi/'],
    images: [],
  },
  {
    sku: 'HH-MES-004',
    slug: 'kai-shun-classic-kochmesser-20-cm',
    query: 'Kai Shun Classic chef knife 20 cm',
    pages: ['https://shun.kaiusa.com/classic-chef-s-knife-8-in.html'],
    images: [],
  },
  {
    sku: 'HH-GRI-001',
    slug: 'weber-spirit-ii-e-310',
    query: 'Weber Spirit II E-310 gas grill',
    pages: [
      'https://www.weber.com/US/en/grills/gas-grills/spirit/spirit-e-310/45010001.html',
    ],
    images: [],
  },
  {
    sku: 'HH-GRI-002',
    slug: 'weber-master-touch-gbs-57',
    query: 'Weber Master-Touch GBS 57 charcoal kettle',
    pages: [
      'https://www.weber.com/DE/de/grills/holzkohlegrills/master-touch/master-touch-gbs-e-5750.html',
    ],
    wikimedia: [],
    images: [],
  },
  {
    sku: 'HH-GRI-003',
    slug: 'ooni-koda-16',
    query: 'Ooni Koda 16 pizza oven',
    shopify: ['https://eu.ooni.com/products/ooni-koda-16.json'],
    pages: [],
    images: [],
  },
  {
    sku: 'HH-GRI-004',
    slug: 'ooni-karu-12g',
    query: 'Ooni Karu 12G pizza oven',
    shopify: ['https://eu.ooni.com/products/ooni-karu-12g.json'],
    pages: [],
    images: [],
  },
  {
    sku: 'HH-GRI-005',
    slug: 'gozney-roccbox',
    query: 'Gozney Roccbox pizza oven',
    shopify: ['https://eu.gozney.com/products/roccbox.json'],
    pages: [],
    images: [],
  },
];

function decode(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'text/html,application/json,*/*' },
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'image/avif,image/webp,image/*,*/*',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const type = res.headers.get('content-type') || '';
  if (type.includes('text/html') || type.includes('application/json') || type.includes('text/plain')) {
    throw new Error(`not image (${type})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 25000) throw new Error(`too small ${buf.length}`);
  return buf;
}

function extractOgAndJsonLd(html) {
  const urls = [];
  for (const re of [
    /property=["']og:image(?::url)?["'][^>]*content=["']([^"']+)/gi,
    /content=["']([^"']+)["'][^>]*property=["']og:image/gi,
    /["']image["']\s*:\s*["'](https?:\/\/[^"']+)["']/gi,
    /"url"\s*:\s*"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
  ]) {
    for (const m of html.matchAll(re)) urls.push(decode(m[1]));
  }
  return urls;
}

function shopifyImages(jsonText) {
  const data = JSON.parse(jsonText);
  return (data.product?.images || []).map((img) =>
    String(img.src || img).replace(
      /_(pico|icon|thumb|small|compact|medium|large|grande|1024x1024|2048x2048)(?=\.)/,
      ''
    )
  );
}

function usable(url, product) {
  if (!/^https?:\/\//i.test(url)) return false;
  if (BLOCK.test(url)) return false;
  if (product.deny && product.deny.test(url)) return false;
  if (product.allowHost && !product.allowHost.test(url)) return false;
  return /\.(jpg|jpeg|png|webp|avif)(\?|$)/i.test(url) || /\/assets\/\d+/i.test(url) || /is\/image/i.test(url);
}

async function wikimediaFileUrl(filename) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(
    `File:${filename}`
  )}&prop=imageinfo&iiprop=url|size|mime&format=json`;
  const data = JSON.parse(await fetchText(api));
  const info = Object.values(data.query?.pages || {})[0]?.imageinfo?.[0];
  if (!info?.url || info.size < 40000) return null;
  return info.url;
}

async function wikimediaSearch(query) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
    query
  )}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|size|mime&format=json`;
  const data = JSON.parse(await fetchText(api));
  return Object.values(data.query?.pages || {})
    .map((p) => p.imageinfo?.[0])
    .filter((i) => i?.url && i.size > 80000 && /image\//.test(i.mime || ''))
    .map((i) => i.url);
}

async function collectCandidates(product) {
  const found = [];
  const push = (url) => {
    const clean = decode(url).split('&amp;').join('&');
    if (usable(clean, product) && !found.includes(clean)) found.push(clean);
  };

  for (const url of product.images || []) push(url);

  for (const url of product.shopify || []) {
    try {
      shopifyImages(await fetchText(url)).forEach(push);
      console.log(`  shopify ok`);
    } catch (err) {
      console.log(`  shopify fail ${err.message}`);
    }
  }

  for (const url of product.pages || []) {
    try {
      extractOgAndJsonLd(await fetchText(url)).forEach(push);
      console.log(`  page og ${found.length} ${url.slice(0, 70)}`);
    } catch (err) {
      console.log(`  page fail ${err.message}`);
    }
  }

  for (const file of product.wikimedia || []) {
    try {
      const url = await wikimediaFileUrl(file);
      if (url) push(url);
    } catch (err) {
      console.log(`  wiki file fail ${err.message}`);
    }
  }

  if (found.length < 2) {
    try {
      (await wikimediaSearch(product.query)).slice(0, 4).forEach(push);
    } catch (err) {
      console.log(`  wiki search fail ${err.message}`);
    }
  }

  return found.slice(0, 10);
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

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const manifest = {};

  for (const product of PRODUCTS) {
    console.log(`\n== ${product.sku} ${product.slug}`);
    const candidates = await collectCandidates(product);
    const saved = [];

    for (const url of candidates) {
      if (saved.length >= 3) break;
      const dest = path.join(outDir, `${product.slug}-${saved.length + 1}.avif`);
      try {
        const buf = await fetchBuffer(url);
        await toAvif(buf, dest);
        if (fs.statSync(dest).size < 8000) {
          fs.unlinkSync(dest);
          throw new Error('avif too small');
        }
        console.log(`  saved ${path.basename(dest)}`);
        saved.push({ src: `/images/products/${path.basename(dest)}`, source: url });
      } catch (err) {
        console.log(`  skip ${err.message} :: ${url.slice(0, 80)}`);
      }
    }

    manifest[product.sku] = {
      slug: product.slug,
      images: saved,
      tried: candidates.length,
    };
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  const missing = Object.entries(manifest).filter(([, v]) => v.images.length === 0);
  console.log(`\nMissing: ${missing.map(([k]) => k).join(', ') || 'none'}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
