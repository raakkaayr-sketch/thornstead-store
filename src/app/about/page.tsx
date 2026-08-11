import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { buttonVariants } from '@/components/ui/button-variants';
import { siteConfig, formattedAddress } from '@/lib/config';
import { getAllProducts, getAllCategories } from '@/lib/products';

export const metadata: Metadata = {
  title: 'About Thornstead',
  description:
    'Thornstead is a UK home and garden brand. We design our own range and sell it directly — we are the manufacturer and brand of record, not a marketplace reseller.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const productCount = getAllProducts().length;
  const categoryCount = getAllCategories().length;
  const { business, contact } = siteConfig;

  return (
    <>
      <PageHeader
        title="About Thornstead"
        description="A small UK brand making its own home and garden range, and selling it directly."
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />

      <div className="container-page grid gap-12 px-6 py-12 lg:grid-cols-[1fr_320px]">
        <div className="prose-legal max-w-2xl">
          <h2>We are the brand, not a reseller</h2>
          <p>
            This matters enough to say plainly at the top. Every product on this
            website is designed by Thornstead, made to our specification, sold
            under our name and shipped by us. We are the brand of record for the
            entire range. We do not stock other companies&apos; branded products,
            we do not describe ourselves as an authorised dealer for anyone, and
            you will not find a third-party logo anywhere in this shop.
          </p>
          <p>
            That keeps things simple for you: one company designed it, one
            company sold it to you, and one company answers the phone if
            something is wrong with it.
          </p>

          <h2>How the range came about</h2>
          <p>
            Thornstead started from a frustration that will be familiar to
            anyone who has bought garden equipment online: the kneeler whose
            frame bends in its second season, the planter whose paint flakes
            after one winter, the storage box that lets water in through the lid
            seam. Cheap is not the problem. Designed to be replaced is the
            problem.
          </p>
          <p>
            So we picked a narrow set of things people actually use every week —
            somewhere to kneel, something to plant into, somewhere dry to put the
            cushions, light along a path, a way to deal with peelings, food for
            the birds — and worked on each until it was genuinely worth keeping.
            The range is deliberately small: {productCount} products across{' '}
            {categoryCount} categories, rather than a catalogue of thousands.
          </p>

          <h2>How we sell</h2>
          <p>
            Direct, from this website, to customers in the United Kingdom.
            Selling direct means there is no wholesaler margin and no retailer
            margin stacked on top of what the product actually costs to make,
            which is why a Thornstead piece generally costs less than an
            equivalent one on a high-street shelf.
          </p>
          <p>
            Card payments are processed by Stripe. We never see or store your
            card details. Orders are packed and dispatched from the UK.
          </p>

          <h2>Materials and honesty about them</h2>
          <p>
            We use galvanised steel where it will get wet, closed-cell foam where
            it will sit on wet ground, FSC-certified timber where we use timber
            at all, and coated polyester with taped seams where something needs
            to shed rain. Where a material has a limitation — solar lights run
            shorter in midwinter, bamboo needs re-oiling every couple of years —
            we say so on the product page rather than hoping you will not notice.
          </p>

          <h2>Getting in touch</h2>
          <p>
            {business.legalName} is based at {formattedAddress()}. Email{' '}
            {contact.email} or call {contact.phone}, {contact.hours}. A real
            person reads and answers both.
          </p>
        </div>

        <aside className="h-fit rounded-3xl border border-border p-6 lg:sticky lg:top-24">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider">
            Business details
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Legal name" value={business.legalName} />
            <Row label="Trading as" value={business.tradingName} />
            {business.companyNumber && (
              <Row label="Company number" value={business.companyNumber} />
            )}
            {business.vatNumber && (
              <Row label="VAT number" value={business.vatNumber} />
            )}
            <Row label="Address" value={formattedAddress()} />
            <Row label="Email" value={contact.email} />
            <Row label="Telephone" value={contact.phone} />
            <Row label="Delivers to" value="United Kingdom" />
            <Row label="Currency" value="Pounds sterling (GBP)" />
          </dl>

          <Link
            href="/contact"
            className={`${buttonVariants({ variant: 'brand' })} mt-6 w-full`}
          >
            Contact us
          </Link>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
