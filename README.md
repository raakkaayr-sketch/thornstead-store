# Thornstead — UK home & garden storefront

A production-ready ecommerce site for **Thornstead**, a UK own-brand home and garden company. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS and Stripe Checkout. No database and no CMS — the catalogue is local JSON, so the whole site deploys as static pages plus two small API routes.

Everything is designed around one rule that decides whether Google Merchant Center approves you: **every product is Thornstead's own brand.** There are no third-party trademarks, no "authorised dealer" claims and no reseller language anywhere in the code or copy. That removes the counterfeit and unauthorised-reseller risk that gets most new stores suspended.

```bash
npm install
npm run dev        # http://localhost:3000
```

---

## 1. Folder structure

```
src/
  app/
    layout.tsx              Root layout, Organization + WebSite JSON-LD
    page.tsx                Home
    shop/                   Full catalogue with filters
    categories/             Category index + /categories/[slug]
    products/[slug]/        Product detail page (statically generated)
    wishlist/               Saved items (localStorage, noindex)
    about/ contact/ faq/    Trust pages
    shipping-policy/        Delivery costs and timescales
    returns-policy/         14-day statutory right + 30-day window
    privacy-policy/         UK GDPR / ICO wording + cookies
    terms/                  Terms & conditions
    checkout/success/       Post-payment confirmation
    api/checkout/           Creates the Stripe Checkout Session
    api/checkout/session/   Verifies a completed session
    feed/products.xml/      Google Merchant Center feed (XML)
    feed/products.csv/      Same catalogue as CSV
    sitemap.ts robots.ts    Generated from the catalogue
    opengraph-image.tsx     Social preview card
    icon.svg                Favicon
  components/
    brand/                  Logo mark and wordmark
    layout/                 Navbar, footer, search, theme toggle, cookie banner
    product/                Gallery, buy box, delivery info, trust panel
    cart/                   Slide-out basket, checkout hook, confirmation
    shop/                   Filterable browser, wishlist grid
    providers/              Cart, wishlist, recently viewed, theme
    ui/                     Button, input, badge, skeleton
  data/
    products.json           The catalogue — single source of truth
    categories.json         Category names and descriptions
  lib/
    config.ts               Brand, business, shipping and returns settings
    products.ts             Query helpers over the JSON
    product-feed.ts         Merchant Center XML + CSV generation
    structured-data.ts      Organization, Product, Breadcrumb JSON-LD
    stripe.ts utils.ts      Stripe client, price/shipping helpers
scripts/
  generate-placeholder-images.mjs
public/images/products/     Placeholder product images (replace these)
```

---

## 2. Editing business information

Everything lives in **`src/lib/config.ts`**. The footer, contact page, every policy page, the checkout, the JSON-LD and the product feed all read from it, so the details can never disagree with each other. Inconsistent business information across a site is one of the most common reasons Merchant Center flags Misrepresentation.

Replace every value marked `REPLACE` before going live:

| Setting | What to put there |
|---|---|
| `url` | Your live domain, also set as `NEXT_PUBLIC_SITE_URL` in Vercel |
| `business.legalName` | Your registered company or sole-trader name, exactly as it appears on Companies House and in Stripe |
| `business.companyNumber` | Companies House number, or `''` if you are a sole trader |
| `business.vatNumber` | VAT number, or `''` if not registered |
| `contact.*` | A real UK address, phone number and email you can be reached on |
| `social.*` | Real profile URLs only. Leave `''` and the icon disappears — never link to a bare platform homepage |
| `shipping.*` | Delivery cost, free-delivery threshold, handling and transit days |
| `returns.*` | Your returns window and who pays return postage |

Changing `shipping.standardCost` or `freeThreshold` updates the product pages, the shipping policy, the basket, the Stripe session and the feed at the same time. Update the matching settings in Merchant Center whenever you change them here.

---

## 3. Adding and editing products

Edit **`src/data/products.json`**. Each entry needs:

```jsonc
{
  "id": "unique-slug",
  "slug": "unique-slug",              // becomes /products/unique-slug
  "sku": "THST-011",                  // also used as the feed mpn
  "title": "Product name",
  "brand": "Thornstead",              // never anything else
  "category": "Garden Tools",         // must match a name in categories.json
  "categorySlug": "garden-tools",
  "price": 34.95,                     // GBP
  "currency": "GBP",
  "condition": "new",
  "availability": "in_stock",         // or out_of_stock / preorder
  "gtin": "",                         // real barcode only, otherwise leave empty
  "googleProductCategory": "Home & Garden > ...",
  "images": [{ "src": "/images/products/x-1.jpg", "alt": "…" }],
  "shortDescription": "One or two sentences — used in the feed and meta description.",
  "description": "Longer copy for the product page.",
  "features": ["…"],
  "specifications": [{ "label": "Material", "value": "…" }],
  "reviewCount": 0,
  "ratingValue": 0,
  "featured": false,
  "tags": ["…"]
}
```

Rules worth keeping:

- **`brand` is always `Thornstead`.** The moment you list someone else's brand you inherit the burden of proving you are authorised to sell it.
- **Never invent a GTIN.** Leave `gtin` empty and the feed sends `identifier_exists: no` with `brand` + `mpn`, which is exactly what Google asks for on own-brand goods. A wrong barcode is an instant disapproval.
- **Never invent reviews.** `reviewCount` and `ratingValue` stay at `0` until you have real ones. Fabricated ratings in structured data are treated as misrepresentation, and the star display hides itself at 0.
- **Price realistically.** Prices far below market for a category are a manual-review trigger in their own right.

To add a new category, add it to `src/data/categories.json` and use its `name`/`slug` on the product.

### Product images

`public/images/products/` currently holds generated SVG placeholders, clearly labelled as such. **Google will reject these** — generic and text-heavy images breach the image requirements. Before submitting your feed:

1. Photograph each product on a plain background, at least 800 × 800px, ideally 1500 × 1500px.
2. Save as JPEG or PNG with no watermarks, logos, borders or promotional text.
3. Drop them into `public/images/products/` and point each product's `images[].src` at them.

Regenerate the placeholders any time with `npm run placeholders`.

---

## 4. Stripe keys and testing a purchase

1. Get your keys from [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).
2. Locally, copy `.env.example` to `.env.local` and fill in:

```
STRIPE_SECRET_KEY=sk_test_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Restart `npm run dev`, add something to the basket and press **Secure checkout**. Use Stripe's test card `4242 4242 4242 4242` with any future expiry and any CVC.
4. On Vercel, add the same variables under **Settings → Environment Variables** (Production), using your `sk_live_` / `pk_live_` keys, then redeploy.

**Never** paste a secret key into source code, a chat window, a screenshot or a git commit. `.env.local` is gitignored. If a secret key is ever exposed, roll it in the Stripe dashboard immediately.

How the flow works: the browser sends only product IDs and quantities. `src/app/api/checkout/route.ts` looks each ID up in the catalogue server-side and builds the line items from the stored prices, so the amount charged always equals the price on the product page and in the feed — a customer cannot tamper with it, and Google cannot find a mismatch.

---

## 5. The Google Merchant Center feed

Two feeds are generated from the same data that renders the site:

- `https://your-domain/feed/products.xml` — primary feed
- `https://your-domain/feed/products.csv` — same catalogue as CSV

In Merchant Center: **Data sources → Add product source → Scheduled fetch**, paste the XML URL, set the country to **United Kingdom**, currency **GBP**, and fetch daily.

Each item carries `id`, `title`, `description`, `link`, `image_link`, `availability`, `price`, `condition`, `brand`, `mpn`, `identifier_exists`, `google_product_category`, `product_type` and UK `shipping`. Because the feed is built from `products.json`, a price or stock change on the site is reflected in the feed on the next fetch.

### Before you request review

1. **Point both the apex domain and `www` at the deployment.** A missing apex DNS record makes Google's fetch fail with a DNS error even though the site looks fine in a browser.
2. **Claim and verify the domain** in Merchant Center.
3. Set the policy URLs in Merchant Center settings:
   - Returns: `https://your-domain/returns-policy`
   - Shipping: `https://your-domain/shipping-policy`
4. **Make the shipping settings in Merchant Center match `config.ts` exactly** — same cost, same free-delivery threshold, same handling and transit days. A "free shipping" setting against a site that charges £3.95 is a misrepresentation flag.
5. Replace all placeholder images with real photography.
6. Put your real registered business details in `config.ts`, and make sure the same legal name appears in Stripe and in Merchant Center.
7. Complete identity verification if Merchant Center asks for it.
8. Test a real checkout end to end with live keys.

### Why this build should pass where a reseller store would not

| Common suspension reason | How this site avoids it |
|---|---|
| Counterfeit / unauthorised reseller | Every product is own-brand; no third-party trademarks anywhere |
| Misrepresentation — inconsistent business details | One config file feeds every page, policy and the JSON-LD |
| Mismatched price or availability | Feed, product page, JSON-LD and Stripe all read the same catalogue |
| Missing refund or contact information | Dedicated returns, shipping, privacy, terms and contact pages, linked in the footer of every page |
| Fake reviews or unverifiable claims | No synthetic ratings, no invented customer counts, no placeholder social links |
| Invalid product identifiers | No fabricated GTINs; `identifier_exists: no` with brand and MPN instead |
| Unclear checkout | Hosted Stripe Checkout with the total shown before payment |

None of this guarantees approval — Google also assesses your business identity, your domain history and your payment processor — but it removes the site-side reasons for rejection.

---

## 6. Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project** and import the repo. The defaults are correct (`next build`).
3. Add environment variables (Production): `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`.
4. Deploy, then add your domain under **Settings → Domains** — add **both** `your-domain.co.uk` and `www.your-domain.co.uk`, and create the DNS records Vercel shows for each.
5. Confirm these all load before touching Merchant Center:
   - `https://your-domain/`
   - `https://your-domain/feed/products.xml`
   - `https://your-domain/sitemap.xml`
   - `https://your-domain/robots.txt`

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript check with no emit |
| `npm run lint` | ESLint |
| `npm run placeholders` | Regenerate placeholder product images |
