/**
 * Replace remaining amateur / wrong / duplicate gallery photos.
 * Run: node scripts/fix-gallery-quality.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'images', 'products');
const previewDir = path.join(root, 'scripts', 'image-preview');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const JOBS = [
  {
    slug: 'le-creuset-signature-braeter-24-cm',
    slot: 3,
    urls: [
      'https://cdn.shopify.com/s/files/1/2176/1321/products/le-creuset-signature-french-oven-cerise-24cm-228627.jpg?v=1663030716&width=2000',
      'https://cdn.shopify.com/s/files/1/2176/1321/products/le-creuset-signature-french-oven-cerise-24cm-117244.jpg?v=1721626827&width=2000',
      'https://cdn.shopify.com/s/files/1/2176/1321/products/le-creuset-signature-french-oven-cerise-24cm-250238.jpg?v=1721626827&width=2000',
    ],
  },
  {
    slug: 'kitchenaid-artisan-5ksm175ps',
    slot: 2,
    urls: [
      'https://kitchenaid.scene7.com/is/image/kitchenaid/5KSM175PSEAC?wid=1600&hei=1600&fmt=jpg',
      'https://www.whirlpool.com/is/image/content/dam/emea/kitchenaid/image/product-shot/kit/5KSM175PSEAC.jpg?wid=1600&hei=1600&fmt=jpg',
      'https://kitchenaid.scene7.com/is/image/kitchenaid/5KSM175PSEAC_1?wid=1600&hei=1600&fmt=jpg',
      'https://media.cdn.kaufland.de/product-images/1500x1500/5ksm175pseac.jpg',
    ],
  },
  {
    slug: 'sage-barista-express-ses875',
    slot: 2,
    urls: [
      'https://sage-baltic.eu/wp-content/uploads/2025/12/sage-ses875bss.png',
      'https://breville-production-aem-assets.s3.us-west-2.amazonaws.com/BES875/BES875BSS1BNA1_hero.png',
      'https://breville-production-aem-assets.s3.us-west-2.amazonaws.com/BES875/BES875BSS1BNA1_1.png',
      'https://breville-production-aem-assets.s3.us-west-2.amazonaws.com/BES875/BES875EUK_CAROUSEL1.png',
      'https://assets.breville.com/cdn-cgi/image/width=1600,format=auto/https://assets.breville.com/bes875/BES875BSS.jpg',
    ],
  },
  {
    slug: 'sage-barista-express-ses875',
    slot: 3,
    urls: [
      'https://breville-production-aem-assets.s3.us-west-2.amazonaws.com/BES875/BES875BSS1BNA1_2.png',
      'https://breville-production-aem-assets.s3.us-west-2.amazonaws.com/BES875/BES875BSS1BNA1_3.png',
      'https://breville-production-aem-assets.s3.us-west-2.amazonaws.com/BES875/BES875EUK_CAROUSEL2.png',
      'https://breville-production-aem-assets.s3.us-west-2.amazonaws.com/BES875/BES875EUK_CAROUSEL3.png',
      'https://www.sageappliances.com/dw/image/v2/BDTJ_PRD/on/demandware.static/-/Sites-sage-master-catalog/default/dw/images/hi-res/SES875BSS4EEU1.jpg?sw=1600&sh=1600',
    ],
  },
  {
    slug: 'kenwood-chef-titanium',
    slot: 3,
    urls: [
      'https://dam.delonghi.com/1200x1200/assets/214476',
      'https://dam.delonghi.com/1200x1200/assets/214484',
      'https://dam.delonghi.com/1200x1200/assets/214480',
      'https://dam.delonghi.com/1200x1200/assets/214481',
      'https://dam.delonghi.com/1200x1200/assets/214482',
    ],
  },
];

const PAGES = [
  'https://www.sageappliances.com/en-gb/product/bes875',
  'https://www.sageappliances.com/de-de/product/ses875',
  'https://www.breville.com/us/en/products/espresso/bes875.html',
];

async function fetchRes(url, accept = '*/*') {
  return fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: accept,
      'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(25000),
  });
}

function extractUrls(html, base) {
  const found = [];
  const patterns = [
    /(?:src|href|content|data-src)=["']([^"']+\.(?:jpe?g|png|webp|avif)[^"']*)/gi,
    /["'](https?:\/\/[^"']+\.(?:jpe?g|png|webp|avif)(?:\?[^"']*)?)["']/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) {
      let url = m[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/');
      if (url.startsWith('//')) url = `https:${url}`;
      if (url.startsWith('/')) {
        try {
          url = new URL(url, base).href;
        } catch {
          continue;
        }
      }
      if (!/^https?:/i.test(url)) continue;
      if (/logo|sprite|icon|favicon|flag|pixel|placeholder|badge|youtube/i.test(url)) continue;
      found.push(url.split('&amp;').join('&'));
    }
  }
  return [...new Set(found)];
}

async function scrapeSage() {
  const urls = [];
  for (const page of PAGES) {
    try {
      const res = await fetchRes(page, 'text/html,*/*');
      if (!res.ok) {
        console.log(`  page ${res.status} ${page}`);
        continue;
      }
      const html = await res.text();
      const found = extractUrls(html, page).filter((u) =>
        /bes875|ses875|barista.?express/i.test(u)
      );
      console.log(`  page ${found.length} sage imgs <- ${page}`);
      urls.push(...found);
    } catch (err) {
      console.log(`  page fail ${err.message} :: ${page}`);
    }
  }
  return [...new Set(urls)];
}

async function fetchBuffer(url) {
  const res = await fetchRes(url, 'image/avif,image/webp,image/*,*/*');
  if (!res.ok) throw new Error(String(res.status));
  const type = res.headers.get('content-type') || '';
  if (type.includes('text/html') || type.includes('application/json') || type.includes('text/plain')) {
    throw new Error(`not image (${type})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 18000) throw new Error(`too small ${buf.length}`);
  return buf;
}

async function writeSlot(slug, slot, url) {
  const dest = path.join(outDir, `${slug}-${slot}.avif`);
  const buf = await fetchBuffer(url);
  const meta = await sharp(buf, { failOn: 'none' }).metadata();
  if (Math.max(meta.width || 0, meta.height || 0) < 500) {
    throw new Error(`tiny ${meta.width}x${meta.height}`);
  }
  await sharp(buf, { failOn: 'none' })
    .rotate()
    .resize(1600, 1600, {
      fit: 'contain',
      background: { r: 250, g: 248, b: 244, alpha: 1 },
    })
    .avif({ quality: 72, effort: 4 })
    .toFile(dest);
  if (fs.statSync(dest).size < 12000) {
    fs.unlinkSync(dest);
    throw new Error('avif too small');
  }
  await sharp(dest)
    .jpeg({ quality: 82 })
    .toFile(path.join(previewDir, `${slug}-${slot}.jpg`));
  console.log(`  saved ${path.basename(dest)} ${meta.width}x${meta.height} <- ${url.slice(0, 120)}`);
  return true;
}

async function fillJob(job) {
  console.log(`\n== ${job.slug} #${job.slot}`);
  for (const url of job.urls) {
    try {
      await writeSlot(job.slug, job.slot, url);
      return true;
    } catch (err) {
      console.log(`  skip ${err.message} :: ${url.slice(0, 120)}`);
    }
  }
  return false;
}

const sageExtras = await scrapeSage();
const sage2 = JOBS.find((j) => j.slug.startsWith('sage') && j.slot === 2);
const sage3 = JOBS.find((j) => j.slug.startsWith('sage') && j.slot === 3);
if (sage2) sage2.urls = [...sageExtras, ...sage2.urls];
if (sage3) sage3.urls = [...sageExtras.slice(1), ...sage3.urls];

for (const job of JOBS) {
  await fillJob(job);
}
