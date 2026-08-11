/**
 * Generates the placeholder product images referenced by src/data/products.json.
 *
 * These are deliberately labelled as placeholders. Google Merchant Center
 * rejects generic or text-only images, so every one of these must be replaced
 * with real photography (JPEG or PNG, at least 800x800, no watermarks or
 * promotional text) before the feed is submitted.
 *
 * Run with: npm run placeholders
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'images', 'products');
const products = JSON.parse(
  fs.readFileSync(path.join(root, 'src', 'data', 'products.json'), 'utf8')
);

const palettes = [
  { bg: '#eceee6', shape: '#c9d3bd', ink: '#3b5333' },
  { bg: '#e8e5de', shape: '#cfc6b4', ink: '#4a4034' },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Wraps a title onto at most three lines of roughly 22 characters. */
function wrap(title) {
  const words = title.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > 22) {
      lines.push(line.trim());
      line = word;
    } else {
      line = `${line} ${word}`;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 3);
}

function svg(title, variant) {
  const palette = palettes[variant % palettes.length];
  const lines = wrap(title);
  // Keep everything inside the middle of the square so it survives the
  // object-cover crop used by non-square thumbnails.
  const startY = 470 - (lines.length - 1) * 24;

  const text = lines
    .map(
      (line, index) =>
        `  <text x="400" y="${startY + index * 48}" text-anchor="middle" font-family="Georgia, serif" font-size="38" fill="${palette.ink}">${escapeXml(line)}</text>`
    )
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img">
  <rect width="800" height="800" fill="${palette.bg}"/>
  <circle cx="400" cy="300" r="170" fill="${palette.shape}" opacity="0.8"/>
  <rect x="${variant === 0 ? 250 : 420}" y="215" width="170" height="170" rx="26" fill="${palette.shape}" opacity="0.55"/>
  <g transform="translate(356,130)">
    <rect width="44" height="44" rx="12" fill="${palette.ink}"/>
    <path d="M22 34V18" stroke="${palette.bg}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M22 24c0-4.5 3.3-8.2 7.4-8.2 0 4.5-3.3 8.2-7.4 8.2Z" fill="${palette.bg}"/>
    <path d="M22 29.5c0-3.8-2.7-6.9-6.3-6.9 0 3.8 2.7 6.9 6.3 6.9Z" fill="${palette.bg}" opacity="0.7"/>
    <text x="58" y="30" font-family="Georgia, serif" font-size="22" fill="${palette.ink}">Thornstead</text>
  </g>
${text}
  <text x="400" y="${startY + lines.length * 48 + 18}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="17" fill="${palette.ink}" opacity="0.6">Placeholder — replace with product photography</text>
</svg>
`;
}

fs.mkdirSync(outDir, { recursive: true });

let written = 0;
for (const product of products) {
  product.images.forEach((image, index) => {
    const file = path.join(outDir, path.basename(image.src));
    fs.writeFileSync(file, svg(product.title, index));
    written += 1;
  });
}

console.log(`[placeholders] wrote ${written} images to public/images/products`);
