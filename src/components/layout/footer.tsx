import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { siteConfig, formattedAddress } from '@/lib/config';
import { getAllCategories } from '@/lib/products';
import { isRealProfileUrl } from '@/lib/social';

const shopLinks = [
  { href: '/shop', label: 'All products' },
  { href: '/categories', label: 'Categories' },
  { href: '/wishlist', label: 'Wishlist' },
];

const companyLinks = [
  { href: '/about', label: 'About Thornstead' },
  { href: '/contact', label: 'Contact us' },
  { href: '/faq', label: 'FAQ' },
];

const policyLinks = [
  { href: '/shipping-policy', label: 'Shipping & delivery' },
  { href: '/returns-policy', label: 'Returns & refunds' },
  { href: '/privacy-policy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms & conditions' },
];

const socials = [
  { href: siteConfig.social.instagram, icon: Instagram, label: 'Instagram' },
  { href: siteConfig.social.facebook, icon: Facebook, label: 'Facebook' },
].filter((s) => isRealProfileUrl(s.href));

export function Footer() {
  const categories = getAllCategories();
  const { business, contact } = siteConfig;

  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="container-page px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo showTagline />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Thornstead designs its own range of home and garden essentials and
              sells them direct to customers across the United Kingdom.
            </p>

            <address className="mt-6 space-y-2 text-sm not-italic text-muted-foreground">
              <span className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {formattedAddress()}
              </span>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phoneHref}`}
                className="flex items-center gap-2.5 transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {contact.phone}
              </a>
            </address>

            {socials.length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn
            title="Categories"
            links={categories.slice(0, 6).map((c) => ({
              href: `/categories/${c.slug}`,
              label: c.name,
            }))}
          />
          <div className="space-y-8">
            <FooterColumn title="Company" links={companyLinks} />
            <FooterColumn title="Policies" links={policyLinks} />
          </div>
        </div>

        <div className="mt-12 space-y-3 border-t border-border pt-8 text-xs text-muted-foreground">
          <p>
            {[
              `© ${new Date().getFullYear()} ${business.legalName}. All rights reserved.`,
              business.companyNumber &&
                `Registered in England and Wales, company number ${business.companyNumber}.`,
              business.vatNumber &&
                `VAT registration number ${business.vatNumber}.`,
            ]
              .filter(Boolean)
              .join(' ')}
          </p>
          <p>
            Card payments are processed securely by Stripe. Thornstead never
            sees or stores your full card details. Prices include VAT where
            applicable and are shown in pounds sterling (GBP).
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
