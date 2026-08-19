import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { siteConfig, formattedAddress, vatNote } from '@/lib/config';
import { getAllCategories } from '@/lib/products';
import { isRealProfileUrl } from '@/lib/social';
import { formatPrice } from '@/lib/utils';

const shopLinks = [
  { href: '/shop', label: 'Alle Produkte' },
  { href: '/kategorien', label: 'Kategorien' },
  { href: '/merkliste', label: 'Merkliste' },
];

const companyLinks = [
  { href: '/ueber-uns', label: 'Über Thornstead' },
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/faq', label: 'Häufige Fragen' },
];

/**
 * Impressum und Datenschutzerklärung müssen nach § 5 DDG und Art. 12 ff. DSGVO
 * von jeder Seite aus leicht erkennbar, unmittelbar erreichbar und ständig
 * verfügbar sein. Deshalb stehen sie hier im Footer und nicht nur auf einer
 * Unterseite — die Reihenfolge beginnt bewusst mit dem Impressum.
 */
const legalLinks = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
  { href: '/agb', label: 'AGB' },
  { href: '/widerruf', label: 'Widerrufsrecht' },
  { href: '/versand', label: 'Versand & Lieferung' },
];

const socials = [
  { href: siteConfig.social.instagram, icon: Instagram, label: 'Instagram' },
  { href: siteConfig.social.facebook, icon: Facebook, label: 'Facebook' },
].filter((s) => isRealProfileUrl(s.href));

export function Footer() {
  const categories = getAllCategories();
  const { business, contact, shipping, payment } = siteConfig;

  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="container-page px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo showTagline />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Thornstead entwickelt eigene Produkte für Garten und Zuhause und
              verkauft sie direkt an Kundinnen und Kunden in Deutschland.
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
            title="Kategorien"
            links={categories.slice(0, 6).map((c) => ({
              href: `/kategorien/${c.slug}`,
              label: c.name,
            }))}
          />
          <div className="space-y-8">
            <FooterColumn title="Unternehmen" links={companyLinks} />
            <FooterColumn title="Rechtliches" links={legalLinks} />
          </div>
        </div>

        <div className="mt-12 space-y-3 border-t border-border pt-8 text-xs text-muted-foreground">
          <p>
            {[
              `© ${new Date().getFullYear()} ${business.ownerName}, ${business.tradingName}. Alle Rechte vorbehalten.`,
              business.vatNumber && `USt-IdNr. ${business.vatNumber}.`,
            ]
              .filter(Boolean)
              .join(' ')}
          </p>
          <p>
            Alle Preise {vatNote()} zzgl. Versandkosten.{' '}
            {shipping.freeThreshold !== null &&
              `Versandkostenfrei ab ${formatPrice(shipping.freeThreshold)}. `}
            Versand ausschließlich innerhalb Deutschlands.
          </p>
          <p>
            Kartenzahlungen werden sicher über {payment.processor} abgewickelt.
            Thornstead sieht und speichert Ihre vollständigen Kartendaten nie.
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
