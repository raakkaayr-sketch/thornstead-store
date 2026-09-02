/**
 * Overwrites amateur / wrong product photos with official manufacturer packshots.
 * Run: node scripts/replace-bad-product-photos.mjs
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

const PAGES = {
  'kitchenaid-artisan-5ksm175ps': [
    'https://www.kitchenaid.de/kuechenmaschine/mittel/859701501000/kuechenmaschine-mit-kippbarem-motorkopf-48-l-artisan-mit-zusaetzlichem-zubehoer-5ksm175-creme',
    'https://www.kitchenaid.de/kuechenmaschine/mittel/859701501000/kuechenmaschine-mit-kippbarem-motorkopf-47-l-artisan-mit-zusaetzlichem-zubehoer-5ksm175-creme',
  ],
  'kenwood-chef-titanium': [
    'https://www.kenwoodworld.com/en-au/p/titanium-chef-baker-titanium-chef-baker-silver-kvc85.004si/KVC85.004SI.html',
    'https://www.kenwoodworld.com/de-de/p/titanium-chef-baker-titanium-chef-baker-silver-kvc85.004si/KVC85.004SI.html',
    'https://www.kenwoodworld.com/en-gb/p/chef-baker-titanium-chef-baker-xl-silver-kvl85.004si/KVL85.004SI.html',
  ],
  'le-creuset-signature-braeter-24-cm': [
    'https://www.lecreuset.de/rund-brater-signature-24-cm-kirschrot/21177240602430.html',
    'https://www.lecreuset.com.my/pdp/sig-rd-cass-oven-24-cerise/21177240602430.html',
    'https://www.lecreuset.co.uk/en_GB/casseroles/cast-iron-casseroles/signature-cast-iron-round-casserole/LS2501-2467.html',
    'https://www.minimax.com.au/products/le-creuset-signature-round-french-oven-cerise-24cm-4-2l.json',
  ],
  'kai-shun-classic-kochmesser-20-cm': [
    'https://www.teddingtons.com.au/shun-classic-chefs-knife-20cm',
    'https://www.mij.co.uk/products/kai-shun-classic-chefs-knife-20cm.json',
    'https://www.webstaurantstore.com/knife-chef-8-classic-bla/921DM0706.html',
    'https://www.kai-group.com/products/brand/shun/products/dm0706.html',
  ],
  'weber-spirit-ii-e-310': [
    'https://www.weber.com/AU/en/gas/spirit-ii/spirit-ii-e310-lp-black/spirit-ii-e310-lp-black/45010224.html',
    'https://www.weber.com/ID/en/gas/spirit/spirit-ii-e-310-gas-grill/45010008.html',
    'https://www.weber.com/DE/de/grills/gasgrills/spirit/spirit-ii-e-310-gbs-gasgrill-black/45010179.html',
  ],
  'ninja-foodi-max-dual-zone-af400': [
    'https://www.ninjakitchen.de/products/ninja-foodi-max-dual-zone-airfryer-af400eu.json',
    'https://www.ninjakitchen.co.uk/products/af400uk.json',
    'https://www.ninjakitchen.eu/products/ninja-foodi-max-dual-zone-airfryer-af400eu.json',
    'https://www.sharkninja.se/ninja-foodi-max-dual-zone-airfryer-af400eu/AF400EU.html',
  ],
  'jura-e4': [
    'https://www.jura.com/de/homeproducts/machines/E4-Piano-Black-EA-15435',
    'https://www.jura.com/en/homeproducts/machines/E4-Piano-Black-EA-15435',
  ],
};

const DIRECT = {
  'kitchenaid-artisan-5ksm175ps': [
    'https://www.whirlpool.com/is/image/content/dam/emea/kitchenaid/image/product-shot/kit/5KSM175PSEAC.jpg?wid=1600&hei=1600&fmt=jpg',
    'https://kitchenaid.scene7.com/is/image/kitchenaid/5KSM175PSEAC?wid=1600&hei=1600&fmt=jpg',
    'https://kitchenaid.scene7.com/is/image/kitchenaid/5KSM175PSEAC_1?wid=1600&hei=1600&fmt=jpg',
    'https://kitchenaid.scene7.com/is/image/kitchenaid/5KSM175PSEAC_2?wid=1600&hei=1600&fmt=jpg',
    'https://media.cdn.kaufland.de/product-images/1500x1500/5ksm175pseac.jpg',
  ],
  'kenwood-chef-titanium': [
    'https://dam.delonghi.com/1200x1200/assets/214476',
    'https://dam.delonghi.com/1200x1200/assets/214480',
    'https://dam.delonghi.com/1200x1200/assets/214484',
    'https://dam.delonghi.com/1600x1600/assets/214476',
  ],
  'le-creuset-signature-braeter-24-cm': [
    'https://www.lecreuset.com/dw/image/v2/BDSR_PRD/on/demandware.static/-/Sites-lecreuset-master-catalog/default/dw/images/hi-res/LS2501-2467.jpg?sw=1600&sh=1600',
    'https://www.minimax.com.au/cdn/shop/files/LeCreusetSignatureRoundFrenchOvenCerise24cm_4.2L.jpg?v=1721626825&width=1600',
    'https://www.lecreuset.co.uk/dw/image/v2/BDSR_PRD/on/demandware.static/-/Sites-lecreuset-master-catalog/default/dw8c0e5e5e/images/large/LS2501-2467.jpg?sw=1200',
  ],
  'kai-shun-classic-kochmesser-20-cm': [
    'https://cdnimg.webstaurantstore.com/images/products/large/572830/2102544.jpg',
    'https://cdnimg.webstaurantstore.com/images/products/large/572830/2079692.jpg',
    'https://cdnimg.webstaurantstore.com/images/products/large/572830/2079693.jpg',
  ],
  'weber-spirit-ii-e-310': [
    'https://dw-images.weber.com/images/grills/spirit-ii/spirit-ii-e-310/hero.png',
  ],
  'ninja-foodi-max-dual-zone-af400': [
    'https://assets.sharkninja.com/image/upload/f_auto,q_auto,w_1600/v1/Ninja/AF400EU_01.png',
    'https://assets.sharkninja.com/image/upload/f_auto,q_auto,w_1600/SharkNinja-EU/AF400EU_01.png',
    'https://www.euronics.lv/UserFiles/Products/Images/386294-581085.avif',
    'https://www.novastar.lt/UserFiles/Products/Images/386294-581085.avif',
  ],
};

function uniq(list) {
  return [...new Set(list.filter(Boolean))];
}

async function fetchRes(url, accept = '*/*') {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: accept,
      'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(25000),
  });
  return res;
}

function extractUrls(html, base) {
  const found = [];
  const patterns = [
    /(?:src|href|content|data-src|data-zoom-image)=["']([^"']+\.(?:jpe?g|png|webp|avif)[^"']*)/gi,
    /["'](https?:\/\/[^"']+\.(?:jpe?g|png|webp|avif)(?:\?[^"']*)?)["']/gi,
    /"(https?:\\\/\\\/[^"]+\.(?:jpe?g|png|webp)[^"]*)"/gi,
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
      if (/logo|sprite|icon|favicon|flag|pixel|1x1|placeholder|badge/i.test(url)) continue;
      found.push(url.split('&amp;').join('&'));
    }
  }
  return uniq(found);
}

async function pageImages(url) {
  const res = await fetchRes(url, 'text/html,application/json,*/*');
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const text = await res.text();
  if (url.endsWith('.json')) {
    try {
      const data = JSON.parse(text);
      const imgs = data.product?.images || [];
      return imgs.map((img) =>
        String(img.src || img)
          .replace(
            /_(pico|icon|thumb|small|compact|medium|large|grande|1024x1024|2048x2048)(?=\.)/,
            ''
          )
          .replace(/width=\d+/, 'width=1600')
      );
    } catch {
      /* fall through */
    }
  }
  return extractUrls(text, url);
}

async function fetchBuffer(url) {
  const res = await fetchRes(url, 'image/avif,image/webp,image/*,*/*');
  if (!res.ok) throw new Error(String(res.status));
  const type = res.headers.get('content-type') || '';
  if (
    type.includes('text/html') ||
    type.includes('application/json') ||
    type.includes('text/plain')
  ) {
    throw new Error(`not image (${type})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 25000) throw new Error(`too small ${buf.length}`);
  return buf;
}

async function toAvif(buffer, dest) {
  await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize(1600, 1600, {
      fit: 'contain',
      background: { r: 250, g: 248, b: 244, alpha: 1 },
    })
    .avif({ quality: 72, effort: 4 })
    .toFile(dest);
}

async function toPreview(avifPath, slug, i) {
  fs.mkdirSync(previewDir, { recursive: true });
  if (i !== 1) return;
  await sharp(avifPath)
    .jpeg({ quality: 82 })
    .toFile(path.join(previewDir, `${slug}-1.jpg`));
}

async function collectCandidates(slug) {
  const urls = [...(DIRECT[slug] || [])];
  for (const page of PAGES[slug] || []) {
    try {
      const found = await pageImages(page);
      console.log(`  page ${found.length} imgs <- ${page.slice(0, 90)}`);
      urls.push(...found.slice(0, 40));
    } catch (err) {
      console.log(`  page fail ${err.message} :: ${page.slice(0, 90)}`);
    }
  }
  return uniq(urls);
}

async function replaceSlug(slug) {
  console.log(`\n== ${slug}`);
  const candidates = await collectCandidates(slug);
  console.log(`  ${candidates.length} candidates`);
  let saved = 0;
  for (const url of candidates) {
    if (saved >= 3) break;
    const dest = path.join(outDir, `${slug}-${saved + 1}.avif`);
    try {
      const buf = await fetchBuffer(url);
      const meta = await sharp(buf, { failOn: 'none' }).metadata();
      const w = meta.width || 0;
      const h = meta.height || 0;
      if (Math.max(w, h) < 500) throw new Error(`tiny ${w}x${h}`);
      await toAvif(buf, dest);
      if (fs.statSync(dest).size < 12000) {
        fs.unlinkSync(dest);
        throw new Error('avif too small');
      }
      await toPreview(dest, slug, saved + 1);
      console.log(`  saved ${path.basename(dest)} ${w}x${h} <- ${url.slice(0, 110)}`);
      saved += 1;
    } catch (err) {
      console.log(`  skip ${err.message} :: ${url.slice(0, 110)}`);
    }
  }
  return saved;
}

async function main() {
  const slugs = process.argv.slice(2);
  const targets = slugs.length ? slugs : Object.keys({ ...PAGES, ...DIRECT });
  for (const slug of targets) {
    await replaceSlug(slug);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
