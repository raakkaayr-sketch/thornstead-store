import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'images', 'products');
const previewDir = path.join(root, 'scripts', 'image-preview');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

function swap(slug, a, b) {
  const pa = path.join(outDir, `${slug}-${a}.avif`);
  const pb = path.join(outDir, `${slug}-${b}.avif`);
  const tmp = pa + '.tmp';
  fs.renameSync(pa, tmp);
  fs.renameSync(pb, pa);
  fs.renameSync(tmp, pb);
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/avif,image/webp,image/*,*/*' },
    redirect: 'follow',
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(String(res.status));
  const type = res.headers.get('content-type') || '';
  if (type.includes('text/html') || type.includes('application/json')) {
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
  if (slot === 1) {
    await sharp(dest)
      .jpeg({ quality: 82 })
      .toFile(path.join(previewDir, `${slug}-1.jpg`));
  }
  console.log(`  saved ${path.basename(dest)} ${meta.width}x${meta.height} <- ${url.slice(0, 110)}`);
}

async function fillSlots(slug, startSlot, urls) {
  let slot = startSlot;
  for (const url of urls) {
    if (slot > 3) break;
    try {
      await writeSlot(slug, slot, url);
      slot += 1;
    } catch (err) {
      console.log(`  skip ${err.message} :: ${url.slice(0, 110)}`);
    }
  }
}

async function preview(slug, i) {
  await sharp(path.join(outDir, `${slug}-${i}.avif`))
    .jpeg({ quality: 82 })
    .toFile(path.join(previewDir, `${slug}-${i}.jpg`));
}

swap('kitchenaid-artisan-5ksm175ps', 1, 2);
swap('kai-shun-classic-kochmesser-20-cm', 1, 3);
await preview('kitchenaid-artisan-5ksm175ps', 1);
await preview('kai-shun-classic-kochmesser-20-cm', 1);
console.log('swapped kitchenaid + kai heroes');

console.log('\n== kenwood 2-3');
await fillSlots('kenwood-chef-titanium', 2, [
  'https://dam.delonghi.com/1200x1200/assets/214478',
  'https://dam.delonghi.com/1200x1200/assets/214479',
  'https://dam.delonghi.com/1200x1200/assets/214481',
  'https://dam.delonghi.com/1200x1200/assets/214482',
  'https://dam.delonghi.com/1200x1200/assets/214483',
  'https://dam.delonghi.com/1200x1200/assets/214485',
  'https://dam.delonghi.com/1200x1200/assets/214486',
  'https://dam.delonghi.com/1200x1200/assets/214487',
  'https://dam.delonghi.com/1200x1200/assets/214488',
  'https://dam.delonghi.com/1200x1200/assets/214489',
  'https://dam.delonghi.com/1200x1200/assets/214490',
  'https://dam.delonghi.com/1200x1200/assets/214491',
  'https://dam.delonghi.com/1200x1200/assets/214492',
]);

console.log('\n== ninja 2-3');
await fillSlots('ninja-foodi-max-dual-zone-af400', 2, [
  'https://ninjakitchenstore.com/wp-content/uploads/2024/07/AF400ANZ_45DegRight_DrawersOpen.webp',
  'https://ninjakitchenstore.com/wp-content/uploads/2024/07/AF400ANZ_PackShotAllItems.webp',
  'https://ninjakitchenstore.com/wp-content/uploads/2024/07/AF400-1_bb4525f4-c19b-4e0a-89ae-b31116c37b72.webp',
  'https://assets.sharkninja.com/image/upload/f_auto,q_auto,w_1600/SharkNinja-EU/AF400EU_02.png',
  'https://assets.sharkninja.com/image/upload/f_auto,q_auto,w_1600/SharkNinja-EU/AF400EU_03.png',
  'https://assets.sharkninja.com/image/upload/f_auto,q_auto,w_1600/SharkNinja-EU/AF400UK_01.png',
  'https://assets.sharkninja.com/image/upload/f_auto,q_auto,w_1600/SharkNinja-EU/AF400UK_02.png',
]);

console.log('\n== le creuset 3');
await fillSlots('le-creuset-signature-braeter-24-cm', 3, [
  'https://cdn.shopify.com/s/files/1/2176/1321/products/le-creuset-signature-french-oven-cerise-24cm-117244.jpg?width=2000',
  'https://cdn.shopify.com/s/files/1/2176/1321/products/le-creuset-signature-french-oven-cerise-24cm-250238.jpg?width=2000',
  'https://cdn.shopify.com/s/files/1/2176/1321/products/le-creuset-signature-french-oven-cerise-24cm-672018.jpg?width=2000',
]);
