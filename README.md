# Thornstead — German home & garden storefront

A production-ready ecommerce site for **Thornstead**, an own-brand home and garden company selling to customers in Germany. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS and Stripe Checkout. No database and no CMS — the catalogue is local JSON, so the whole site deploys as static pages plus two small API routes.

The shop is German-only: `de-DE` locale, EUR, 19 % MwSt., DHL shipping inside Germany, and the legal pages German consumer law requires. Solar lights were dropped so the shop does not need ElektroG or BattG registration.

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
    layout.tsx              Root layout, lang="de", Organization + WebSite JSON-LD
    page.tsx                Home
    shop/                   Full catalogue with filters
    kategorien/             Category index + /kategorien/[slug]
    produkte/[slug]/        Product detail page (statically generated)
    merkliste/              Saved items (localStorage, noindex)
    kasse/                  Order review (§ 312j BGB) before Stripe
    kasse/bestaetigung/     Post-payment confirmation
    ueber-uns/ kontakt/ faq/
    impressum/              § 5 DDG
    widerruf/               14-day cancellation + Muster-Widerrufsformular
    datenschutz/            DSGVO + TDDDG
    agb/                    Terms
    versand/                Delivery costs and timescales
    api/checkout/           Creates the Stripe Checkout Session
    api/checkout/session/   Verifies a completed session
    feed/products.xml/      Google Merchant Center feed (XML)
    feed/products.csv/      Same catalogue as CSV
    sitemap.ts robots.ts    Generated from the catalogue
    opengraph-image.tsx     Social preview card
    icon.svg                Favicon
  components/
    brand/                  Logo mark and wordmark
    layout/                 Navbar, footer, search, theme toggle, storage notice
    product/                Gallery, buy box, delivery info, trust panel, GPSR block
    cart/                   Slide-out basket, order review, checkout hook, confirmation
    shop/                   Filterable browser, wishlist grid
    providers/              Cart, wishlist, recently viewed, theme
    ui/                     Button, input, badge, skeleton
  data/
    products.json           The catalogue — single source of truth
    categories.json         Category names and descriptions
  lib/
    config.ts               Brand, business, shipping, GPSR and returns settings
    products.ts             Query helpers over the JSON
    product-feed.ts         Merchant Center XML + CSV generation
    structured-data.ts      Organization, Product, Breadcrumb JSON-LD
    stripe.ts utils.ts      Stripe client, price/shipping helpers
scripts/
  generate-placeholder-images.mjs
public/images/products/     Product photography
```

---

## 2. Editing business information

Everything lives in **`src/lib/config.ts`**. The footer, Impressum, every legal page, checkout, JSON-LD and the product feed all read from it, so the details can never disagree with each other. Inconsistent business information across a site is one of the most common reasons Merchant Center flags Misrepresentation.

Replace every value marked `PLATZHALTER` before going live. Incomplete Impressum, GPSR or LUCID details are a legal risk in Germany, not just a Merchant Center issue:

| Setting | What to put there |
|---|---|
| `url` | Your live domain, also set as `NEXT_PUBLIC_SITE_URL` in Vercel |
| `business.ownerName` | Full first and last name of the sole trader. A brand name alone is not enough for § 5 DDG |
| `business.vatNumber` | USt-IdNr. after § 27a UStG, or `''` until issued |
| `business.smallBusinessScheme` | `true` only if you actually use § 19 UStG. Never show "inkl. MwSt." if you do |
| `contact.*` | A real, serviceable postal address (no PO box), phone and email. Must match Stripe and Merchant Center |
| `gpsr.euResponsiblePerson.*` | An EU-established responsible person. Without this, the products may not be offered in the EU |
| `compliance.lucidNumber` | LUCID registration number (DE + 13 digits) before the first shipment to Germany |
| `social.*` | Real profile URLs only. Leave `''` and the icon disappears — never link to a bare platform homepage |
| `shipping.*` | Delivery cost, free-delivery threshold, handling and transit days |
| `returns.*` | Returns window and who pays return postage (already disclosed on `/widerruf`) |

Changing `shipping.standardCost` or `freeThreshold` updates the product pages, the Versand page, the basket, the order review, the Stripe session and the feed at the same time. Update the matching settings in Merchant Center whenever you change them here.

---

## 3. Adding and editing products

Edit **`src/data/products.json`**. Each entry needs:

```jsonc
{
  "id": "eindeutiger-slug",
  "slug": "eindeutiger-slug",         // becomes /produkte/eindeutiger-slug
  "sku": "THST-011",                  // also used as the feed mpn
  "title": "Produktname",
  "brand": "Thornstead",              // never anything else
  "category": "Gartenwerkzeug",       // must match a name in categories.json
  "categorySlug": "gartenwerkzeug",
  "price": 39.95,                     // EUR, gross including 19 % MwSt.
  "currency": "EUR",
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
  "tags": ["…"],
  "safetyNotes": ["…"]                // optional; otherwise a generic GPSR list is shown
}
```

Rules worth keeping:

- **`brand` is always `Thornstead`.** The moment you list someone else's brand you inherit the burden of proving you are authorised to sell it.
- **Never invent a GTIN.** Leave `gtin` empty and the feed sends `identifier_exists: no` with `brand` + `mpn`, which is exactly what Google asks for on own-brand goods. A wrong barcode is an instant disapproval.
- **Never invent reviews.** `reviewCount` and `ratingValue` stay at `0` until you have real ones. Fabricated ratings in structured data are treated as misrepresentation, and the star display hides itself at 0.
- **Prices are gross.** They already include 19 % MwSt. Stripe is told `tax_behavior: 'inclusive'` so it does not add tax on top.
- **Do not add electrical or battery products** until ElektroG and BattG registration are in place. That is why solar lights are not in the catalogue.

To add a new category, add it to `src/data/categories.json` and use its `name`/`slug` on the product.

### Product images

Photograph each product on a plain background, at least 800 × 800px, ideally 1500 × 1500px. Save as JPEG or PNG with no watermarks, logos, borders or promotional text. Google rejects generic and text-heavy images.

---

## 4. German checkout (Button-Lösung)

German law (§ 312j BGB) requires a review step immediately before the customer places a binding order. The button on that page must say **„Zahlungspflichtig bestellen"** — „Bestellen", „Weiter" or „Kaufen" is not enough, and without the correct label no contract is formed.

That is why neither **Jetzt kaufen** nor **Zur Kasse** go straight to Stripe. Both land on `/kasse`, which shows:

- every article, quantity and unit price
- shipping method, cost and estimated delivery
- the total including 19 % MwSt., with the tax portion itemised
- links to AGB, Widerrufsbelehrung and Datenschutzerklärung
- the labelled order button

Only then is the Stripe session created, with `locale: 'de'`, `allowed_countries: ['DE']` and VAT-inclusive prices.

---

## 5. Stripe keys and testing a purchase

1. Get your keys from [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).
2. Locally, copy `.env.example` to `.env.local` and fill in:

```
STRIPE_SECRET_KEY=sk_test_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Restart `npm run dev`, add something to the basket, go through `/kasse` and press **Zahlungspflichtig bestellen**. Use Stripe's test card `4242 4242 4242 4242` with any future expiry and any CVC.
4. On Vercel, add the same variables under **Settings → Environment Variables** (Production), using your `sk_live_` / `pk_live_` keys, then redeploy.

**Never** paste a secret key into source code, a chat window, a screenshot or a git commit. `.env.local` is gitignored. If a secret key is ever exposed, roll it in the Stripe dashboard immediately.

How the flow works: the browser sends only product IDs and quantities. `src/app/api/checkout/route.ts` looks each ID up in the catalogue server-side and builds the line items from the stored prices, so the amount charged always equals the price on the product page and in the feed — a customer cannot tamper with it, and Google cannot find a mismatch.

---

## 6. The Google Merchant Center feed

Two feeds are generated from the same data that renders the site:

- `https://your-domain/feed/products.xml` — primary feed
- `https://your-domain/feed/products.csv` — same catalogue as CSV

In Merchant Center: **Data sources → Add product source → Scheduled fetch**, paste the XML URL, set the country to **Germany**, currency **EUR**, language **German**, and fetch daily.

Each item carries `id`, `title`, `description`, `link`, `image_link`, `availability`, `price` (gross, `39.95 EUR`), `condition`, `brand`, `mpn`, `identifier_exists`, `google_product_category`, `product_type` and DE `shipping`. Because the feed is built from `products.json`, a price or stock change on the site is reflected in the feed on the next fetch.

Prices in the feed use a dot as the decimal separator. That is required by Google and is deliberately different from the comma used on the website.

### Before you request review

1. **Point both the apex domain and `www` at the deployment.** A missing apex DNS record makes Google's fetch fail with a DNS error even though the site looks fine in a browser.
2. **Claim and verify the domain** in Merchant Center.
3. Set the policy URLs in Merchant Center settings:
   - Returns: `https://your-domain/widerruf`
   - Shipping: `https://your-domain/versand`
4. **Make the shipping settings in Merchant Center match `config.ts` exactly** — same cost (4,95 EUR), same free-delivery threshold (50 EUR), same handling and transit days. A "free shipping" setting against a site that charges 4,95 EUR is a misrepresentation flag.
5. Fill every `PLATZHALTER` in `config.ts` and make sure the same legal name and address appear in Stripe and in Merchant Center.
6. Complete identity verification if Merchant Center asks for it.
7. Test a real checkout end to end with live keys, including the `/kasse` review step.

### Why this build should pass where a reseller store would not

| Common suspension reason | How this site avoids it |
|---|---|
| Counterfeit / unauthorised reseller | Every product is own-brand; no third-party trademarks anywhere |
| Misrepresentation — inconsistent business details | One config file feeds every page, policy and the JSON-LD |
| Mismatched price or availability | Feed, product page, JSON-LD and Stripe all read the same catalogue |
| Missing refund or contact information | Impressum, Widerruf, Versand, AGB, Datenschutz and Kontakt, linked in the footer of every page |
| Fake reviews or unverifiable claims | No synthetic ratings, no invented customer counts, no placeholder social links |
| Invalid product identifiers | No fabricated GTINs; `identifier_exists: no` with brand and MPN instead |
| Unclear checkout | Order review with the legally required button label, then hosted Stripe Checkout |

None of this guarantees approval — Google also assesses your business identity, your domain history and your payment processor — but it removes the site-side reasons for rejection.

---

## 7. Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project** and import the repo. The defaults are correct (`next build`).
3. Add environment variables (Production): `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`.
4. Deploy, then add your domain under **Settings → Domains** — add **both** `thornstead.store` and `www.thornstead.store`, and create the DNS records Vercel shows for each.
5. Confirm these all load before touching Merchant Center:
   - `https://thornstead.store/`
   - `https://thornstead.store/impressum`
   - `https://thornstead.store/feed/products.xml`
   - `https://thornstead.store/sitemap.xml`
   - `https://thornstead.store/robots.txt`

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
