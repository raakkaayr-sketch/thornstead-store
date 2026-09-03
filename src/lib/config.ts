/**
 * Hainholt — zentrale Quelle für Marken-, Unternehmens- und Rechtsdaten.
 *
 * Jede kundenseitige Fläche (Footer, Kontaktseite, Rechtstexte, Kasse,
 * JSON-LD, Merchant-Center-Feed) liest aus dieser Datei. Google vergleicht die
 * Unternehmensangaben auf der Website mit denen im Merchant Center und beim
 * Zahlungsdienstleister — Abweichungen führen zu einer Sperrung wegen
 * Falschdarstellung. Werte ausschließlich hier ändern, niemals in einzelnen
 * Seiten.
 *
 * VOR DEM LIVEGANG: jeden Wert ersetzen, der mit "PLATZHALTER" markiert ist.
 * Diese Angaben sind in Deutschland gesetzlich vorgeschrieben (§ 5 DDG,
 * GPSR Art. 19, VerpackG) — unvollständige Angaben sind abmahnbar.
 */

const LIVE_SITE_URL = 'https://hainholt.de';
const LEGACY_UK_HOST = 'thornstead.store';

function resolveSiteUrl() {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/$/, '');
  if (!fromEnv) return LIVE_SITE_URL;

  try {
    const host = new URL(fromEnv).hostname.replace(/^www\./, '');
    if (host === LEGACY_UK_HOST) return LIVE_SITE_URL;
  } catch {
    return LIVE_SITE_URL;
  }

  return fromEnv;
}

export const siteConfig = {
  name: 'Hainholt',
  tagline: 'Ausgewählte Küchengeräte.',
  description:
    'Hainholt führt ausgewählte Küchengeräte bekannter Marken — Kaffeevollautomaten, Küchenmaschinen, Kochgeschirr, Messer und Grills — mit Versand innerhalb Deutschlands, versandkostenfrei ab 50 €.',
  /**
   * Live-Shop-URL für Canonicals, Sitemap, JSON-LD und den Merchant-Center-Feed.
   * Live ist hainholt.de; NEXT_PUBLIC_SITE_URL in Vercel überschreibt den Wert
   * nur für Vorschau-Umgebungen. Die alte UK-Domain thornstead.store wird
   * ignoriert, damit Google nicht auf den alten Shop geschickt wird.
   */
  url: resolveSiteUrl(),
  locale: 'de-DE',
  currency: 'EUR',
  currencySymbol: '€',

  /**
   * Rechtsträger hinter dem Shop. Muss mit Stripe und Merchant Center
   * übereinstimmen.
   */
  business: {
    legalName: 'Hainholt',
    tradingName: 'Hainholt',
    /**
     * PLATZHALTER — vollständiger Vor- und Nachname des Inhabers.
     * Bei Einzelunternehmen zwingend im Impressum (§ 5 Abs. 1 Nr. 1 DDG);
     * ein reiner Markenname genügt dort nicht.
     */
    ownerName: 'PLATZHALTER — Vor- und Nachname des Inhabers',
    /** Leer lassen bei Einzelunternehmen (keine Handelsregistereintragung). */
    registerNumber: '',
    registerCourt: '',
    /** PLATZHALTER — USt-IdNr. nach § 27a UStG, falls vorhanden. */
    vatNumber: '',
    /**
     * Kleinunternehmerregelung nach § 19 UStG. Bei true wird keine
     * Umsatzsteuer ausgewiesen und der Preishinweis ändert sich entsprechend —
     * "inkl. MwSt." anzugeben, ohne Umsatzsteuer abzuführen, verstößt gegen
     * die PAngV.
     */
    smallBusinessScheme: false,
    /** Umsatzsteuersatz in Prozent. 19 = Regelsatz, 7 = ermäßigt. */
    vatRate: 19,
    countryCode: 'DE',
    country: 'Deutschland',
  },

  /**
   * Ladungsfähige Anschrift im Impressum. Ein Postfach ist nicht zulässig.
   * Die Adresse muss mit Stripe und dem Merchant Center übereinstimmen.
   */
  contact: {
    email: 'kontakt@hainholt.de',
    street: 'Finkenweg 12',
    city: 'Halle (Saale)',
    postcode: '06110',
    country: 'Deutschland',
    countryCode: 'DE',
    hours: 'Montag bis Freitag, 9:00–17:00 Uhr (MEZ)',
  },

  /**
   * Nur echte Profile. Ein leerer Wert bedeutet, dass das Icon nirgends
   * gerendert wird — ein Link auf eine bloße Plattform-Startseite ist ein
   * Vertrauensproblem.
   */
  social: {
    instagram: '',
    facebook: '',
    pinterest: '',
  },

  /**
   * Produktsicherheit nach GPSR (Verordnung (EU) 2023/988), Art. 19.
   *
   * Diese Angaben müssen direkt auf der Produktseite stehen, nicht nur im
   * Impressum oder in den AGB. Der Hersteller ist in Deutschland niedergelassen,
   * daher ist keine gesonderte EU-Verantwortliche außerhalb des Unternehmens
   * erforderlich — Name, Anschrift und E-Mail des Herstellers genügen.
   */
  gpsr: {
    manufacturerName: 'Hainholt',
    euResponsiblePerson: {
      name: 'Hainholt',
      street: 'Finkenweg 12',
      postcode: '06110',
      city: 'Halle (Saale)',
      country: 'Deutschland',
      email: 'kontakt@hainholt.de',
    },
  },

  /**
   * Verpackungsgesetz. Die Registrierung im Verpackungsregister LUCID ist
   * vor dem ersten Versand nach Deutschland zwingend, unabhängig von der
   * Menge. Format: DE + 13 Ziffern.
   */
  compliance: {
    lucidNumber: '',
  },

  /**
   * Versand. Genau diese Zahlen erscheinen auf Produktseiten, in den
   * Versandinformationen, an der Kasse und im Merchant-Center-Feed. Die
   * Einstellungen unter Merchant Center → Versand müssen dazu passen.
   */
  shipping: {
    /** Standardversandkosten in EUR. */
    standardCost: 4.95,
    /** Ab diesem Bestellwert versandkostenfrei. null = immer berechnen. */
    freeThreshold: 50,
    handlingDaysMin: 1,
    handlingDaysMax: 2,
    transitDaysMin: 1,
    transitDaysMax: 3,
    /** Nur Deutschland. Weitere Länder erfordern eine Anpassung im Merchant Center. */
    shipToCountries: ['DE'] as const,
    serviceName: 'DHL Standardversand',
  },

  /**
   * Widerruf und Rückgabe. Das gesetzliche Widerrufsrecht beträgt 14 Tage
   * (§ 355 BGB); darüber hinaus gewähren wir freiwillig ein längeres
   * Rückgaberecht.
   */
  returns: {
    days: 30,
    statutoryCancellationDays: 14,
    /**
     * Nach § 357 Abs. 6 BGB trägt die Kundin oder der Kunde die
     * unmittelbaren Rücksendekosten nur, wenn darüber in der
     * Widerrufsbelehrung informiert wurde. Das ist auf /widerruf der Fall.
     */
    returnShippingPaidBy: 'customer' as 'customer' | 'merchant',
    restockingFee: false,
  },

  /**
   * Google Ads. Der Tag wird ausschließlich nach Einwilligung geladen
   * (§ 25 Abs. 1 TDDDG) — siehe src/lib/consent.ts.
   *
   * conversionLabel ist NICHT die Tag-ID. Das Label steht in Google Ads unter
   * Ziele → Conversions → die Conversion-Aktion "Kauf" → Tag einrichten und
   * sieht aus wie "AbC-D_efGhIjKlMn". Solange es leer ist, wird zwar das
   * purchase-Ereignis gesendet, aber keine Ads-Conversion gezählt.
   */
  analytics: {
    googleAdsId: 'AW-18399591655',
    purchaseConversionLabel: 'o_K1CLvejO0cEOf5zcVE',
  },

  /** Akzeptierte Zahlungsarten, anzugeben nach § 312j Abs. 1 BGB. */
  payment: {
    methods: ['Visa', 'Mastercard', 'American Express', 'Google Pay', 'Apple Pay'],
    processor: 'Stripe',
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Vollständige Anschrift in einer Zeile, für Footer, Rechtstexte und JSON-LD. */
export function formattedAddress() {
  const { street, postcode, city, country } = siteConfig.contact;
  return `${street}, ${postcode} ${city}, ${country}`;
}

/** Anschrift der EU-Verantwortlichen in einer Zeile (GPSR Art. 19). */
export function euResponsibleAddress() {
  const { street, postcode, city, country } = siteConfig.gpsr.euResponsiblePerson;
  return `${street}, ${postcode} ${city}, ${country}`;
}

/** Geschätzte Gesamtlieferzeit (Bearbeitung + Transport) in Werktagen. */
export function deliveryWindow() {
  const { handlingDaysMin, handlingDaysMax, transitDaysMin, transitDaysMax } =
    siteConfig.shipping;
  return {
    min: handlingDaysMin + transitDaysMin,
    max: handlingDaysMax + transitDaysMax,
  };
}

/**
 * Umsatzsteuerhinweis für Preisangaben nach § 1 PAngV. Kleinunternehmer nach
 * § 19 UStG dürfen keine Mehrwertsteuer ausweisen.
 */
export function vatNote() {
  return siteConfig.business.smallBusinessScheme
    ? 'kein Umsatzsteuerausweis nach § 19 UStG'
    : `inkl. ${siteConfig.business.vatRate} % MwSt.`;
}
