import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const M = {
  delonghi: {
    name: "De'Longhi Appliances S.r.l.",
    street: 'Via L. Seitz 47',
    postcode: '31100',
    city: 'Treviso',
    country: 'Italien',
    email: 'info.de@delonghigroup.com',
  },
  philips: {
    name: 'Philips Domestic Appliances Nederland B.V.',
    street: 'High Tech Campus 42',
    postcode: '5656 AE',
    city: 'Eindhoven',
    country: 'Niederlande',
    email: 'support.deutschland@philips.com',
  },
  sage: {
    name: 'Sage Appliances GmbH',
    street: 'Grafinger Straße 6',
    postcode: '81671',
    city: 'München',
    country: 'Deutschland',
    email: 'info.de@sageappliances.com',
  },
  bsh: {
    name: 'BSH Hausgeräte GmbH',
    street: 'Carl-Wery-Straße 34',
    postcode: '81739',
    city: 'München',
    country: 'Deutschland',
    email: 'kontakt@bshg.com',
  },
  jura: {
    name: 'JURA Elektroapparate AG',
    street: 'Kaffeeweltstraße 10',
    postcode: '4626',
    city: 'Niederbuchsiten',
    country: 'Schweiz',
    email: 'info@jura.com',
  },
  melitta: {
    name: 'Melitta Europa GmbH & Co. KG',
    street: 'Ringstraße 99',
    postcode: '32427',
    city: 'Minden',
    country: 'Deutschland',
    email: 'info@melitta.de',
  },
  kitchenaid: {
    name: 'Whirlpool EMEA S.p.A.',
    street: 'Via Carlo Pisacane 1',
    postcode: '20016',
    city: 'Pero (MI)',
    country: 'Italien',
    email: 'kundenservice@kitchenaid.de',
  },
  kenwood: {
    name: "De'Longhi Kenwood Appliances",
    street: 'Via L. Seitz 47',
    postcode: '31100',
    city: 'Treviso',
    country: 'Italien',
    email: 'info.de@delonghigroup.com',
  },
  vitamix: {
    name: 'Vita-Mix Corporation',
    street: '8615 Usher Road',
    postcode: '44138',
    city: 'Cleveland, OH',
    country: 'USA',
    email: 'europe@vitamix.com',
  },
  braun: {
    name: 'De’Longhi Braun Household GmbH',
    street: 'Carl-Ulrich-Straße 4',
    postcode: '63263',
    city: 'Neu-Isenburg',
    country: 'Deutschland',
    email: 'service.de@braunhousehold.com',
  },
  ninja: {
    name: 'SharkNinja Europe Ltd.',
    street: '1st/2nd Floor Building 3150, Century Way, Thorpe Park',
    postcode: 'LS15 8ZB',
    city: 'Leeds',
    country: 'Vereinigtes Königreich',
    email: 'help.de@ninjakitchen.com',
  },
  instant: {
    name: 'Instant Brands (UK) Limited',
    street: '1st Floor, 1 Park Row',
    postcode: 'LS1 5HN',
    city: 'Leeds',
    country: 'Vereinigtes Königreich',
    email: 'help@instantpot.com',
  },
  lecreuset: {
    name: 'Le Creuset SAS',
    street: '114 rue du 4 Septembre',
    postcode: '59660',
    city: 'Fresnoy-le-Grand',
    country: 'Frankreich',
    email: 'info.de@lecreuset.com',
  },
  zwilling: {
    name: 'ZWILLING J.A. Henckels AG',
    street: 'Grünewalder Straße 14–22',
    postcode: '42657',
    city: 'Solingen',
    country: 'Deutschland',
    email: 'info@zwilling.com',
  },
  fissler: {
    name: 'Fissler GmbH',
    street: 'Harald-Fissler-Straße 1',
    postcode: '55743',
    city: 'Idar-Oberstein',
    country: 'Deutschland',
    email: 'info@fissler.de',
  },
  wmf: {
    name: 'WMF GmbH',
    street: 'WMF Platz 1',
    postcode: '73312',
    city: 'Geislingen an der Steige',
    country: 'Deutschland',
    email: 'info@wmf.de',
  },
  wuesthof: {
    name: 'Ed. Wüsthof Dreizackwerk KG',
    street: 'Kronprinzenstraße 49',
    postcode: '42655',
    city: 'Solingen',
    country: 'Deutschland',
    email: 'info@wuesthof.de',
  },
  kai: {
    name: 'KAI Europe GmbH',
    street: 'Kottendorfer Straße 5',
    postcode: '42697',
    city: 'Solingen',
    country: 'Deutschland',
    email: 'info@kai-europe.com',
  },
  weber: {
    name: 'Weber-Stephen Deutschland GmbH',
    street: 'Rheinstraße 194',
    postcode: '55218',
    city: 'Ingelheim',
    country: 'Deutschland',
    email: 'info-de@weber.com',
  },
  ooni: {
    name: 'Ooni Limited',
    street: 'Unit 5, 97 Giles Street',
    postcode: 'EH6 6BZ',
    city: 'Edinburgh',
    country: 'Vereinigtes Königreich',
    email: 'hello@ooni.com',
  },
  gozney: {
    name: 'Gozney Group Ltd.',
    street: 'Units 18 & 19, Radar Way',
    postcode: 'BH23 4FL',
    city: 'Christchurch',
    country: 'Vereinigtes Königreich',
    email: 'hello@gozney.com',
  },
};

const coffeeSafety = [
  'Heißes Wasser und Dampf — Verbrennungsgefahr. Gerät nur mit trockenen Händen bedienen.',
  'Nur für den privaten Gebrauch in Innenräumen. Nicht von Kindern unbeaufsichtigt nutzen.',
  'Entkalken und Reinigen nach Herstelleranleitung. Gerät vor dem Öffnen abkühlen lassen.',
];
const applianceSafety = [
  'Vor dem Reinigen Netzstecker ziehen. Bewegliche Teile vollständig zum Stillstand kommen lassen.',
  'Nur für den privaten Gebrauch in Innenräumen. Von Kindern fernhalten.',
  'Heiße Oberflächen nach dem Betrieb — Abkühlen lassen.',
];
const cookwareSafety = [
  'Griffe und Deckel werden heiß. Immer Topflappen oder Griffschutz verwenden.',
  'Nicht als Trittfläche verwenden. Auf Induktion nur mit geeignetem Boden.',
  'Von kleinen Kindern fernhalten; Verpackungsmaterial ist kein Spielzeug.',
];
const knifeSafety = [
  'Sehr scharfe Klingen. Immer vom Körper wegschneiden, Kinder nicht unbeaufsichtigt lassen.',
  'Nicht in der Spülmaschine waschen, sofern nicht ausdrücklich angegeben.',
  'Auf sicherer Unterlage lagern (Block, Magnetleiste oder Klingenschutz).',
];
const grillSafety = [
  'Nur im Freien verwenden. Nicht in geschlossenen Räumen oder unter Dächern ohne Abzug betreiben.',
  'Gasanschluss und Dichtheit vor jeder Nutzung prüfen. Heiße Flächen und offene Flammen — Verbrennungs- und Brandgefahr.',
  'Von Kindern und brennbaren Materialien fernhalten. Nach dem Betrieb vollständig abkühlen lassen.',
];

function img(src, alt) {
  return { src, alt };
}

function fillGallery(product) {
  const images = [];
  for (let i = 1; i <= 3; i++) {
    const src = `/images/products/${product.slug}-${i}.avif`;
    if (!fs.existsSync(path.join(root, 'public', src))) continue;
    const existing = product.images.find((image) => image.src === src);
    images.push(
      existing ||
        img(
          src,
          i === 1
            ? product.title
            : i === 2
              ? `${product.title} im Einsatz`
              : `Nahaufnahme: ${product.title}`
        )
    );
  }
  return images.length ? images : product.images;
}

function product(p) {
  return {
    id: p.slug,
    slug: p.slug,
    sku: p.sku,
    title: p.title,
    brand: p.brand,
    manufacturer: p.manufacturer,
    category: p.category,
    categorySlug: p.categorySlug,
    price: p.price,
    currency: 'EUR',
    condition: 'new',
    availability: 'in_stock',
    gtin: p.gtin || '',
    googleProductCategory: p.gpc,
    images: p.images,
    shortDescription: p.short,
    description: p.long,
    features: p.features,
    specifications: p.specs.map(([label, value]) => ({ label, value })),
    reviewCount: 0,
    ratingValue: 0,
    featured: Boolean(p.featured),
    tags: p.tags,
    safetyNotes: p.safety,
  };
}

const coffee = 'Kaffee & Espresso';
const coffeeSlug = 'kaffee-espresso';
const machines = 'Küchenmaschinen';
const machinesSlug = 'kuechenmaschinen';
const air = 'Heißluftfritteusen & Multikocher';
const airSlug = 'heissluftfritteusen-multikocher';
const pots = 'Töpfe & Pfannen';
const potsSlug = 'toepfe-pfannen';
const knives = 'Messer';
const knivesSlug = 'messer';
const grill = 'Grills & Pizzaöfen';
const grillSlug = 'grills-pizzaoefen';

const gpcCoffee =
  'Home & Garden > Kitchen & Dining > Kitchen Appliances > Coffee Makers & Espresso Machines';
const gpcMixer = 'Home & Garden > Kitchen & Dining > Kitchen Appliances > Mixers';
const gpcBlender = 'Home & Garden > Kitchen & Dining > Kitchen Appliances > Blenders';
const gpcFryer = 'Home & Garden > Kitchen & Dining > Kitchen Appliances > Fryers';
const gpcCookware = 'Home & Garden > Kitchen & Dining > Cookware';
const gpcKnives = 'Home & Garden > Kitchen & Dining > Kitchen Tools & Utensils > Kitchen Knives';
const gpcGrill = 'Home & Garden > Lawn & Garden > Outdoor Living > Outdoor Cooking > Outdoor Grills';
const gpcOven = 'Home & Garden > Lawn & Garden > Outdoor Living > Outdoor Cooking > Outdoor Ovens';

const products = [
  product({
    sku: 'HH-KAF-001',
    slug: 'delonghi-magnifica-evo-ecam290',
    title: "De'Longhi Magnifica Evo ECAM290.61.B",
    brand: "De'Longhi",
    manufacturer: M.delonghi,
    category: coffee,
    categorySlug: coffeeSlug,
    price: 400,
    gtin: '8004399021396',
    gpc: gpcCoffee,
    featured: true,
    images: [
      img(
        '/images/products/delonghi-magnifica-evo-ecam290-1.avif',
        "De'Longhi Magnifica Evo ECAM290 Kaffeevollautomat mit LatteCrema-Milchsystem"
      ),
    ],
    short:
      'Kaffeevollautomat für alle, die morgens keine Entscheidungen treffen wollen: Espresso, Kaffee und Milchgetränke auf Knopfdruck.',
    long: 'Ein Gerät für Haushalte, in denen jeder etwas anderes trinkt. Das Kegelmahlwerk sitzt direkt im Gerät, gemahlen wird pro Tasse, die LatteCrema-Kanne schäumt Milchgetränke ohne Schlauchsalat. Fünf Getränke liegen auf farbigen Touch-Tasten, MyLatte verbraucht die eingefüllte Milchmenge ohne Reste in der Kanne. Reinigung und Entkalkung laufen geführt ab, die Brühgruppe lässt sich entnehmen. Schmal genug für die meisten Arbeitsplatten, mit 1,8-Liter-Tank und 250-g-Bohnenbehälter, die nicht nach jeder zweiten Tasse geleert werden müssen.',
    features: [
      'LatteCrema-Milchkanne, spülmaschinengeeignet, mit automatischer Spülung',
      'Kegelmahlwerk, gemahlen wird pro Tasse',
      'Fünf One-Touch-Getränke inklusive MyLatte ohne Milchreste',
      'Herausnehmbare Brühgruppe und geführte Entkalkung',
      'Schlankes Gehäuse, 24 cm breit',
    ],
    specs: [
      ['Modell', 'ECAM290.61.B'],
      ['Leistung', '1450 W'],
      ['Pumpendruck', '15 bar'],
      ['Wassertank', '1,8 l'],
      ['Bohnenbehälter', '250 g'],
      ['Milchsystem', 'LatteCrema Hot, 0,22 l'],
      ['Maße (B × H × T)', '24 × 44 × 36 cm'],
      ['Gewicht', '9,6 kg'],
      ['Farbe', 'Schwarz / Silber'],
    ],
    tags: ['kaffeevollautomat', 'delonghi', 'milchsystem', 'espresso'],
    safety: coffeeSafety,
  }),
  product({
    sku: 'HH-KAF-002',
    slug: 'philips-series-5500-lattego-ep5541',
    title: 'Philips Series 5500 LatteGo EP5541/50',
    brand: 'Philips',
    manufacturer: M.philips,
    category: coffee,
    categorySlug: coffeeSlug,
    price: 550,
    gtin: '8720389032318',
    gpc: gpcCoffee,
    images: [
      img(
        '/images/products/philips-series-5500-lattego-ep5541-1.avif',
        'Philips Series 5500 LatteGo EP5541 Kaffeevollautomat, Vorderansicht'
      ),
      img(
        '/images/products/philips-series-5500-lattego-ep5541-2.avif',
        'Philips Series 5500 LatteGo EP5541 mit Milchsystem'
      ),
    ],
    short:
      'Milchsystem, das sich in zwei Teilen unter fließendem Wasser reinigen lässt — ohne Schläuche.',
    long: 'Der Grund, warum dieses Gerät gekauft wird, ist nicht nur der Kaffee, sondern die Reinigung: Das LatteGo-Milchsystem besteht aus zwei Kunststoffteilen ohne Schläuche. Dazu eine Reihe vorprogrammiereter Getränke, ein Farbdisplay und Profile für unterschiedliche Vorlieben im Haushalt. 15 bar, Keramikmahlwerk, 1,8-Liter-Tank. Wer morgens Cappuccino und nachmittags einen Americano will, stellt beides einmal ein und drückt danach nur noch die Taste.',
    features: [
      'LatteGo-Milchsystem aus zwei Teilen, ohne Schläuche',
      'Keramikmahlwerk mit einstellbarem Mahlgrad',
      'Farbdisplay mit Getränkeübersicht und Nutzerprofilen',
      'Zwei Tassen gleichzeitig bei schwarzem Kaffee',
      'Automatische Spülprogramme',
    ],
    specs: [
      ['Modell', 'EP5541/50'],
      ['Leistung', '1500 W'],
      ['Pumpendruck', '15 bar'],
      ['Wassertank', '1,8 l'],
      ['Tresterbehälter', '12 Portionen'],
      ['Display', 'TFT-Farbdisplay'],
      ['Maße (B × H × T)', '24,6 × 37,1 × 43,3 cm'],
      ['Farbe', 'Schwarz'],
    ],
    tags: ['kaffeevollautomat', 'philips', 'lattego', 'milchsystem'],
    safety: coffeeSafety,
  }),
  product({
    sku: 'HH-KAF-003',
    slug: 'sage-barista-express-ses875',
    title: 'Sage Barista Express SES875',
    brand: 'Sage',
    manufacturer: M.sage,
    category: coffee,
    categorySlug: coffeeSlug,
    price: 650,
    gtin: '9312432030144',
    gpc: gpcCoffee,
    images: [
      img(
        '/images/products/sage-barista-express-ses875-1.avif',
        'Sage Barista Express SES875 Siebträgermaschine mit integriertem Mahlwerk'
      ),
      img(
        '/images/products/sage-barista-express-ses875-2.avif',
        'Sage Barista Express SES875 beim Extrahieren'
      ),
      img(
        '/images/products/sage-barista-express-ses875-3.avif',
        'Sage Barista Express SES875, Seitenansicht'
      ),
    ],
    short: 'Siebträger mit integriertem Mahlwerk — der übliche Einstieg in echten Espresso.',
    long: 'Mahlwerk, Siebträger und Dampflanze in einem Gehäuse, damit der Einstieg nicht drei Anschaffungen braucht. Der Mahlgrad wird direkt am Gerät verstellt, dosiert wird in den 54-mm-Siebträger. Thermocoil mit PID hält die Brühtemperatur, die Pumpe liefert 9 bar Extraktion nach Vorbrühung. Wer später aufrüstet, behält die Maschine und tauscht zuerst die Mühle. Mitgeliefert: Tamper, Razor, Filterkörbe und Milchkanne.',
    features: [
      'Integriertes Kegelmahlwerk mit 16 Mahlgradstufen',
      '54-mm-Siebträger aus Edelstahl',
      'PID-geregelter Thermocoil, 9 bar Extraktion',
      'Manuelle Dampflanze für Mikroschaum',
      '2-Liter-Wassertank, 250-g-Bohnenbehälter',
    ],
    specs: [
      ['Modell', 'SES875 / BES875'],
      ['Leistung', '1850 W'],
      ['Siebträger', '54 mm'],
      ['Wassertank', '2,0 l'],
      ['Bohnenbehälter', '250 g'],
      ['Mahlgradstufen', '16'],
      ['Maße (B × H × T)', '33 × 40 × 31 cm'],
      ['Gehäuse', 'Gebürsteter Edelstahl'],
    ],
    tags: ['siebträger', 'sage', 'mahlwerk', 'espresso'],
    safety: coffeeSafety,
  }),
  product({
    sku: 'HH-KAF-004',
    slug: 'siemens-eq500-integral',
    title: 'Siemens EQ.500 integral',
    brand: 'Siemens',
    manufacturer: M.bsh,
    category: coffee,
    categorySlug: coffeeSlug,
    price: 800,
    gpc: gpcCoffee,
    images: [
      img(
        '/images/products/siemens-eq500-integral-1.avif',
        'Siemens EQ.500 integral Kaffeevollautomat mit Volltext-Display'
      ),
    ],
    short: 'Vollautomat im oberen Segment mit Volltext-Display und Milchbehälter im Gerät.',
    long: 'Für Haushalte, die einen Vollautomaten dauerhaft in der Küche stehen haben und ihn täglich mehrfach nutzen. Der Milchbehälter ist integriert statt aufgesetzt, die Bedienung läuft über Klartext statt über Symbole. Nach jedem Milchgetränk startet die automatische Reinigung. Keramikmahlwerk, 1,7-Liter-Tank, große Getränkeauswahl inklusive Cappuccino und Latte Macchiato auf Knopfdruck.',
    features: [
      'Integrierter Milchbehälter statt Aufsatzkanne',
      'Volltext-Display statt reiner Symboltasten',
      'Automatische Reinigung nach Milchgetränken',
      'CeramDrive-Keramikmahlwerk',
      'Zwei Tassen gleichzeitig',
    ],
    specs: [
      ['Serie', 'EQ.500 integral'],
      ['Leistung', '1500 W'],
      ['Wassertank', '1,7 l'],
      ['Bohnenbehälter', '270 g'],
      ['Milchbehälter', 'integriert'],
      ['Display', 'Klartext'],
      ['Maße (B × H × T)', 'ca. 30 × 38 × 45 cm'],
    ],
    tags: ['kaffeevollautomat', 'siemens', 'eq500', 'milchsystem'],
    safety: coffeeSafety,
  }),
  product({
    sku: 'HH-KAF-005',
    slug: 'jura-e4',
    title: 'JURA E4 Piano Black',
    brand: 'JURA',
    manufacturer: M.jura,
    category: coffee,
    categorySlug: coffeeSlug,
    price: 750,
    gpc: gpcCoffee,
    images: [
      img('/images/products/jura-e4-1.avif', 'JURA E4 Piano Black Kaffeevollautomat, Vorderansicht'),
    ],
    short: 'Schweizer Vollautomat, reduziert auf schwarzen Kaffee und Espresso.',
    long: 'Kein Milchsystem, keine Getränkeliste über zwei Bildschirmseiten — dieses Gerät konzentriert sich auf Espresso, Kaffee und Kaffee lang. Professional Aroma Grinder, Pulse Extraction Process und 3D-Brüheinheit. Entsprechend wenig kann kaputtgehen und entsprechend kurz ist die tägliche Reinigung. CLEARYL-Smart-Filter mit RFID, heißes Wasser über den separaten Auslauf. Preisstabil im Markt, Ersatzteile langfristig verfügbar.',
    features: [
      'Professional Aroma Grinder, gleichbleibende Mahlqualität',
      'Pulse Extraction Process (P.E.P.®) für Espresso',
      'Kein Milchsystem — kurze tägliche Reinigung',
      'Intelligent Water System mit CLEARYL Smart+',
      'Separater Heißwasserauslauf',
    ],
    specs: [
      ['Modell', 'E4 Piano Black (EA)'],
      ['Leistung', '1450 W'],
      ['Wassertank', '1,9 l'],
      ['Bohnenbehälter', '280 g'],
      ['Brüheinheit', '5–16 g'],
      ['Spezialitäten', '5 (ohne Milch)'],
      ['Maße (B × H × T)', '28 × 35,1 × 44,6 cm'],
      ['Gewicht', 'ca. 10 kg'],
    ],
    tags: ['kaffeevollautomat', 'jura', 'espresso', 'ohne milch'],
    safety: coffeeSafety,
  }),
  product({
    sku: 'HH-KAF-006',
    slug: 'melitta-caffeo-barista-ts-smart',
    title: 'Melitta Caffeo Barista TS Smart',
    brand: 'Melitta',
    manufacturer: M.melitta,
    category: coffee,
    categorySlug: coffeeSlug,
    price: 750,
    gtin: '4006508217854',
    gpc: gpcCoffee,
    images: [
      img(
        '/images/products/melitta-caffeo-barista-ts-smart-1.avif',
        'Melitta Caffeo Barista TS Smart Kaffeevollautomat mit Milchkanne'
      ),
    ],
    short: 'Vollautomat mit App-Steuerung, zwei Bohnenkammern und hinterlegbaren Nutzerprofilen.',
    long: 'Rezepte lassen sich am Smartphone anlegen und im Gerät speichern, was in Haushalten mit unterschiedlichen Vorlieben den Streit am Morgen beendet. Zwei Bohnenkammern erlauben den Wechsel zwischen zwei Sorten ohne Nachfüllen, Automatic Bean Select wählt die Kammer zum Getränk. 21 voreingestellte Spezialitäten, IntenseAroma, leises Kegelmahlwerk (Quiet Mark). TFT-Farbdisplay, 1,8-Liter-Tank, entnehmbare Brühgruppe.',
    features: [
      'Zwei Bohnenkammern mit Automatic Bean Select',
      'Melitta Connect App, bis zu acht Nutzerprofile',
      '21 vorprogrammierte Kaffeespezialitäten',
      'Quiet-Mark-Mahlwerk',
      'TFT-Farbdisplay und One-Touch-Milch',
    ],
    specs: [
      ['Modell', 'F860-100'],
      ['Leistung', '1450 W'],
      ['Pumpendruck', '15 bar'],
      ['Wassertank', '1,8 l'],
      ['Bohnenkammern', '2'],
      ['Display', 'TFT-Farbe'],
      ['Maße (B × H × T)', '25,9 × 37,2 × 46,7 cm'],
      ['Gewicht', 'ca. 10,6 kg'],
    ],
    tags: ['kaffeevollautomat', 'melitta', 'app', 'zwei bohnensorten'],
    safety: coffeeSafety,
  }),
  product({
    sku: 'HH-KAF-007',
    slug: 'delonghi-dedica-maestro-ec950',
    title: "De'Longhi Dedica Maestro EC950",
    brand: "De'Longhi",
    manufacturer: M.delonghi,
    category: coffee,
    categorySlug: coffeeSlug,
    price: 280,
    gpc: gpcCoffee,
    images: [
      img(
        '/images/products/delonghi-dedica-maestro-ec950-1.avif',
        "De'Longhi Dedica Maestro EC950 schmale Siebträgermaschine"
      ),
    ],
    short: 'Schmale Siebträgermaschine für Küchen ohne Platzreserve.',
    long: 'Die Dedica-Reihe ist bewusst schlank gebaut und passt dort hin, wo eine normale Espressomaschine nicht mehr steht. Trotz der Breite ein vollwertiger Siebträger mit Dampflanze, Thermoblock und einstellbarer Temperatur. Passende Mühle separat — das ist der naheliegende Cross-Sell. Für Espresso und Milchschaum auf kleinem Fußabdruck, nicht für den Einstieg ins Profi-Barista-Setup mit 58-mm-Gruppe.',
    features: [
      'Sehr schmales Edelstahlgehäuse',
      'Thermoblock, kurze Aufheizzeit',
      'Professionelle Dampflanze',
      'Siebträger mit Einfach- und Doppelsieb',
      'Tassenabstellfläche mit Wärmerückhaltung',
    ],
    specs: [
      ['Modell', 'EC950.M'],
      ['Typ', 'Siebträgermaschine'],
      ['Pumpendruck', '15 bar'],
      ['Wassertank', '1,1 l'],
      ['Breite', 'ca. 15 cm'],
      ['Gehäuse', 'Edelstahl'],
    ],
    tags: ['siebträger', 'delonghi', 'dedica', 'schmal'],
    safety: coffeeSafety,
  }),
  product({
    sku: 'HH-MAS-001',
    slug: 'kitchenaid-artisan-5ksm175ps',
    title: 'KitchenAid Artisan 5KSM175PS',
    brand: 'KitchenAid',
    manufacturer: M.kitchenaid,
    category: machines,
    categorySlug: machinesSlug,
    price: 650,
    gpc: gpcMixer,
    featured: true,
    images: [
      img(
        '/images/products/kitchenaid-artisan-5ksm175ps-1.avif',
        'KitchenAid Artisan 5KSM175PS in Crème mit Schüsseln und Rührwerkzeugen'
      ),
      img(
        '/images/products/kitchenaid-artisan-5ksm175ps-2.avif',
        'KitchenAid Artisan 5KSM175PS, Frontalansicht'
      ),
    ],
    short: 'Die Küchenmaschine, die gekauft wird, weil sie auf der Arbeitsplatte stehen bleiben soll.',
    long: 'Vollmetallgehäuse, Planetenrührwerk und ein Zubehöranschluss, an den sich Fleischwolf, Nudelvorsatz und Gemüseschneider hängen lassen. 4,8-Liter-Schüssel plus zweite 3-Liter-Schüssel, Flexi-Rührer, Flachrührer, Schneebesen und Knethaken. Die Farbauswahl ist kein Detail, sondern der Grund für einen erheblichen Teil der Käufe. Fünf Jahre Herstellergarantie in der EU bei Registrierung.',
    features: [
      'Planetenrührwerk, kippbarer Motorkopf',
      '4,8-l-Edelstahlschüssel plus 3-l-Zusatzschüssel',
      'Flexi-Rührer, Flachrührer, Schneebesen, Knethaken',
      'PowerHub für Vorsätze',
      '5 Jahre Garantie (EU, nach Registrierung)',
    ],
    specs: [
      ['Modell', '5KSM175PS'],
      ['Leistung', '300 W (0,19 PS)'],
      ['Schüssel', '4,8 l + 3,0 l'],
      ['Rührstufen', '10'],
      ['Anschluss', 'PowerHub'],
      ['Garantie', '5 Jahre'],
      ['Farbe dieser Ausführung', 'Crème'],
    ],
    tags: ['küchenmaschine', 'kitchenaid', 'artisan', 'planetenrührwerk'],
    safety: applianceSafety,
  }),
  product({
    sku: 'HH-MAS-002',
    slug: 'kenwood-chef-titanium',
    title: 'Kenwood Titanium Chef Baker',
    brand: 'Kenwood',
    manufacturer: M.kenwood,
    category: machines,
    categorySlug: machinesSlug,
    price: 600,
    gpc: gpcMixer,
    images: [
      img(
        '/images/products/kenwood-chef-titanium-1.avif',
        'Kenwood Titanium Chef Baker Küchenmaschine, silber'
      ),
      img(
        '/images/products/kenwood-chef-titanium-2.avif',
        'Kenwood Titanium Chef Baker, Seitenansicht'
      ),
      img(
        '/images/products/kenwood-chef-titanium-3.avif',
        'Kenwood Titanium Chef Baker mit Schüssel'
      ),
    ],
    short: 'Küchenmaschine für Haushalte, die regelmäßig große Teigmengen verarbeiten.',
    long: 'Der direkte Wettbewerber zur Artisan, traditionell stärker bei Brot- und Hefeteig. 1200 W, integrierte Waage in der Schüssel, 5-Liter- und 3,5-Liter-Edelstahlschüssel, K-Beater, Knethaken, Schneebesen und Creaming Beater. Metallgetriebe und ein breites Zubehörprogramm, das den Kauf über Jahre erweiterbar macht. Smart Power Control passt die Leistung an die Masse an.',
    features: [
      '1200-W-Motor mit Smart Power Control',
      'EasyWeigh-Waage direkt in der Schüssel',
      '5 l und 3,5 l Edelstahlschüssel',
      'K-Beater, Knethaken, Schneebesen, Creaming Beater',
      'Zwei Anschlüsse für Vorsätze',
    ],
    specs: [
      ['Modell', 'KVC85 Titanium Chef Baker'],
      ['Leistung', '1200 W'],
      ['Schüssel', '5,0 l + 3,5 l'],
      ['Geschwindigkeit', 'variabel + Impuls'],
      ['Gehäuse', 'Metall'],
      ['Gewicht', 'ca. 9,5 kg'],
    ],
    tags: ['küchenmaschine', 'kenwood', 'chef', 'teig'],
    safety: applianceSafety,
  }),
  product({
    sku: 'HH-MAS-003',
    slug: 'bosch-mum5-styline',
    title: 'Bosch MUM5 Styline',
    brand: 'Bosch',
    manufacturer: M.bsh,
    category: machines,
    categorySlug: machinesSlug,
    price: 280,
    gpc: gpcMixer,
    images: [
      img('/images/products/bosch-mum5-styline-1.avif', 'Bosch MUM5 Styline Küchenmaschine'),
    ],
    short: 'Der Preiseinstieg, wenn die Artisan zu teuer und das Handrührgerät zu wenig ist.',
    long: 'Deutsche Marke, breite Ersatzteilversorgung und ein Preis, der sie zum häufigsten Hochzeits- und Einzugsgeschenk der Kategorie macht. Für Alltagsteige, Rührteig und Sahne völlig ausreichend. Mehrere Geschwindigkeiten, Kunststoff- oder Edelstahlschüssel je nach Ausführung, Anschluss für Fleischwolf und weiteren Vorsatz. Nicht die Maschine für fünf Kilo Brotteig jede Woche — dafür die, die nach zehn Jahren noch Ersatzteile hat.',
    features: [
      'Alltagstaugliche Leistung für Teig, Sahne und Rühren',
      'Mehrere Geschwindigkeitsstufen plus Impuls',
      'Vorsatzanschluss für Fleischwolf und Schnitzelwerk',
      'Lange Ersatzteilversorgung',
      'Kompaktes Stellmaß',
    ],
    specs: [
      ['Serie', 'MUM5 Styline'],
      ['Leistung', 'ca. 900–1000 W je Ausführung'],
      ['Schüssel', 'ca. 3,9 l'],
      ['Rührstufen', '7 + Impuls'],
      ['Hersteller', 'BSH Hausgeräte, München'],
    ],
    tags: ['küchenmaschine', 'bosch', 'mum5', 'einstieg'],
    safety: applianceSafety,
  }),
  product({
    sku: 'HH-MAS-004',
    slug: 'vitamix-ascent-a2500i',
    title: 'Vitamix Ascent A2500i',
    brand: 'Vitamix',
    manufacturer: M.vitamix,
    category: machines,
    categorySlug: machinesSlug,
    price: 650,
    gpc: gpcBlender,
    images: [
      img(
        '/images/products/vitamix-ascent-a2500i-1.avif',
        'Vitamix Ascent A2500i Hochleistungsmixer'
      ),
    ],
    short: 'Hochleistungsmixer für Smoothies, Suppen und Nussmus in einem Behälter.',
    long: 'Die Drehzahl reicht aus, um Suppen durch Reibung zu erwärmen und Nüsse zu Mus zu verarbeiten. Der Behälter erkennt sich selbst und passt die Programme an. Drei Programme (Smoothie, Heiße Suppe, Gefrorene Desserts), variable Drehzahl, Pulse. Zielgruppe sind Haushalte mit klarem Gesundheits- oder Sportfokus, nicht wer einmal im Monat einen Shake macht. Lange Garantie, Messer und Behälter separat nachkaufbar.',
    features: [
      'Selbstkennende Behälter, Programme passen sich an',
      'Heiße Suppe durch Reibung, ohne Heizstab',
      'Variable Drehzahl plus Pulse',
      'Lange Herstellergarantie',
      'Ersatzmesser und Behälter einzeln erhältlich',
    ],
    specs: [
      ['Modell', 'A2500i Ascent'],
      ['Programme', 'Smoothie, heiße Suppe, gefrorene Desserts'],
      ['Behälter', '2,0 l Tritan'],
      ['Garantie', '10 Jahre (Hersteller, je nach Region)'],
      ['Aufstellort', 'Arbeitsplatte, Innenraum'],
    ],
    tags: ['mixer', 'vitamix', 'smoothie', 'hochleistung'],
    safety: [
      'Scharfe Messer im Behälter. Nie in den laufenden Behälter greifen.',
      'Heiße Suppen unter Druck — Deckel fest verschließen, vorsichtig öffnen.',
      'Nur für den privaten Gebrauch. Netzstecker vor dem Reinigen ziehen.',
    ],
  }),
  product({
    sku: 'HH-MAS-005',
    slug: 'braun-multiquick-9',
    title: 'Braun MultiQuick 9',
    brand: 'Braun',
    manufacturer: M.braun,
    category: machines,
    categorySlug: machinesSlug,
    price: 160,
    gpc: gpcBlender,
    images: [
      img('/images/products/braun-multiquick-9-1.avif', 'Braun MultiQuick 9 Stabmixer mit Becher'),
    ],
    short: 'Stabmixer am unteren Ende der Preisklasse, mit hoher Absatzmenge.',
    long: 'Kleines Ticket, aber hoher Durchsatz und ein guter Warenkorb-Auffüller neben den großen Geräten. ActiveBlade bewegt den Mixfuß, PowerBell Plus reduziert Spritzer. Zubehörsets (Zerkleinerer, Schneebesen, Pürierstab) erhöhen den durchschnittlichen Bestellwert deutlich. Für Suppen im Topf, Smoothies im Becher und Babybrei — nicht als Ersatz für einen Standmixer.',
    features: [
      'ActiveBlade-Mixfuß aus Edelstahl',
      'Hohe Wattzahl für dickflüssige Suppen',
      'Spritzschutz am Mixfuß',
      'Abnehmbarer Schaft, spülmaschinengeeignet',
      'Optional erweiterbar um Zerkleinerer und Schneebesen',
    ],
    specs: [
      ['Serie', 'MultiQuick 9'],
      ['Typ', 'Stabmixer'],
      ['Mixfuß', 'Edelstahl'],
      ['Geschwindigkeit', 'variabel'],
      ['Reinigung', 'Schaft spülmaschinengeeignet'],
    ],
    tags: ['stabmixer', 'braun', 'multiquick', 'pürieren'],
    safety: applianceSafety,
  }),
  product({
    sku: 'HH-HLF-001',
    slug: 'ninja-foodi-max-dual-zone-af400',
    title: 'Ninja Foodi MAX Dual Zone AF400',
    brand: 'Ninja',
    manufacturer: M.ninja,
    category: air,
    categorySlug: airSlug,
    price: 230,
    gpc: gpcFryer,
    featured: true,
    images: [
      img(
        '/images/products/ninja-foodi-max-dual-zone-af400-1.avif',
        'Ninja Foodi MAX Dual Zone Heißluftfritteuse mit zwei Schubladen'
      ),
    ],
    short: 'Zwei getrennte Garkammern — Hauptgericht und Beilage werden gleichzeitig fertig.',
    long: 'Das Verkaufsargument der gesamten Kategorie steckt im Namen: zwei Zonen, zwei Temperaturen, eine Endzeit. Sync-Funktion stimmt unterschiedliche Garzeiten auf denselben Endpunkt ab. Großes Gesamtvolumen für Haushalte ab vier Personen, Körbe mit Antihaftbeschichtung, spülmaschinengeeignet. Genau das löst das Problem, das einfache Heißluftfritteusen haben, wenn mehr als eine Sache auf den Tisch soll.',
    features: [
      'Zwei unabhängig steuerbare Zonen',
      'Sync und Match für gemeinsames Fertigwerden',
      'Mehrere Programme: Heißluftfrittieren, Braten, Backen, Aufwärmen, Dörren',
      'Antihaftkörbe, spülmaschinengeeignet',
      'Großes Gesamtvolumen',
    ],
    specs: [
      ['Modell', 'AF400EU / Dual Zone MAX'],
      ['Zonen', '2'],
      ['Gesamtvolumen', 'ca. 9,5 l'],
      ['Programme', '6'],
      ['Körbe', 'Antihaft, spülmaschinengeeignet'],
    ],
    tags: ['heißluftfritteuse', 'ninja', 'dual zone', 'airfryer'],
    safety: [
      'Sehr heiße Oberflächen und Dampf beim Öffnen der Schubladen.',
      'Nur in Innenräumen auf hitzebeständiger, freier Fläche betreiben. Nicht abdecken.',
      'Von Kindern fernhalten. Gerät vor dem Reinigen abkühlen lassen und Netzstecker ziehen.',
    ],
  }),
  product({
    sku: 'HH-HLF-002',
    slug: 'philips-airfryer-xxl-hd9650',
    title: 'Philips Airfryer XXL HD9650/90',
    brand: 'Philips',
    manufacturer: M.philips,
    category: air,
    categorySlug: airSlug,
    price: 250,
    gpc: gpcFryer,
    images: [
      img(
        '/images/products/philips-airfryer-xxl-hd9650-1.avif',
        'Philips Airfryer XXL HD9650, Vorderansicht'
      ),
    ],
    short: 'Der Ursprung der Kategorie, mit der höchsten Markenbekanntheit im Segment.',
    long: 'Philips hat die Heißluftfritteuse in Deutschland bekannt gemacht, und ein erheblicher Teil der Suchanfragen läuft weiterhin über den Markennamen statt über die Kategorie. XXL-Volumen für Haushalte ab vier Personen, Rapid-Air-Umwälzung, Fat-Removal-Auffang. 7,3-Liter-Korb, digital, spülmaschinengeeignete Teile. Ein ganzes Hähnchen oder 1,4 kg Pommes in einem Durchgang.',
    features: [
      'Rapid-Air-Technologie, wenig bis kein Öl',
      'Fat-Removal fängt überschüssiges Fett auf',
      'XXL-Korb, Familienportionen',
      'Digitales Display mit Voreinstellungen',
      'Korb und Einsatz spülmaschinengeeignet',
    ],
    specs: [
      ['Modell', 'HD9650/90'],
      ['Leistung', '2225 W'],
      ['Korbvolumen', '7,3 l'],
      ['Kapazität Pommes', '1,4 kg'],
      ['Maße', '433 × 321 × 315 mm'],
      ['Gewicht', '7,99 kg'],
    ],
    tags: ['heißluftfritteuse', 'philips', 'airfryer', 'xxl'],
    safety: [
      'Sehr heiße Oberflächen und Dampf beim Öffnen.',
      'Nur in Innenräumen, Abstand zu Wänden einhalten, nicht abdecken.',
      'Von Kindern fernhalten. Vor dem Reinigen abkühlen lassen.',
    ],
  }),
  product({
    sku: 'HH-HLF-003',
    slug: 'ninja-foodi-multikocher-ol750',
    title: 'Ninja Foodi Multikocher OL750',
    brand: 'Ninja',
    manufacturer: M.ninja,
    category: air,
    categorySlug: airSlug,
    price: 280,
    gpc: gpcFryer,
    images: [
      img(
        '/images/products/ninja-foodi-multikocher-ol750-1.avif',
        'Ninja Foodi OL750 Multikocher mit SmartLid'
      ),
    ],
    short: 'Schnellkochtopf, Heißluftfritteuse und Slow Cooker in einem Gerät.',
    long: 'Für kleine Küchen, in denen kein Platz für drei Geräte ist. Die Kombination aus Druckgaren und anschließendem Knusprig-Finish ist das, was in Rezeptvideos gezeigt wird und den Kauf auslöst. SmartLid wechselt zwischen Druck, Heißluft und kombinierter Funktion. 7,5 Liter, mehrere Programme, Zubehörkorb für das Finish.',
    features: [
      'Druckgaren und Heißluft in einem Topf',
      'SmartLid mit Funktionswahl',
      'Mehrere Garprogramme inklusive Slow Cook und Dämpfen',
      'Knusprig-Finish nach dem Druckgaren',
      'Großes 7,5-l-Volumen',
    ],
    specs: [
      ['Modell', 'OL750EU'],
      ['Volumen', '7,5 l'],
      ['Funktionen', 'Druck, Heißluft, Slow Cook, Dämpfen, u. a.'],
      ['Deckel', 'SmartLid'],
    ],
    tags: ['multikocher', 'ninja', 'foodi', 'schnellkochtopf'],
    safety: [
      'Druckkochtopf: Ventil und Dichtung vor jeder Nutzung prüfen. Nie unter Druck gewaltsam öffnen.',
      'Heiße Oberflächen und Dampf. Nur auf fester, ebener Fläche betreiben.',
      'Von Kindern fernhalten. Bedienungsanleitung zum Druckgaren beachten.',
    ],
  }),
  product({
    sku: 'HH-HLF-004',
    slug: 'instant-pot-pro-crisp',
    title: 'Instant Pot Pro Crisp',
    brand: 'Instant',
    manufacturer: M.instant,
    category: air,
    categorySlug: airSlug,
    price: 200,
    gpc: gpcFryer,
    images: [
      img(
        '/images/products/instant-pot-pro-crisp-1.avif',
        'Instant Pot Pro Crisp Multikocher mit Heißluft-Deckel'
      ),
    ],
    short: 'Multikocher mit großer Rezept-Community im Hintergrund.',
    long: 'Der Wert liegt weniger im Gerät als im Ökosystem: Zu kaum einem anderen Küchengerät gibt es so viele frei verfügbare Rezepte und Gruppen. Das senkt die Rückgabequote spürbar, weil Käufer das Gerät tatsächlich benutzen. Pro Crisp kombiniert Druckgaren mit einem zweiten Deckel für Heißluft. Edelstahl-Innentopf, mehrere Programme, 8-Quart-Klasse für Familienportionen.',
    features: [
      'Zwei Deckel: Druck und Heißluft',
      'Große, gut dokumentierte Rezeptbasis',
      'Edelstahl-Innentopf',
      'Mehrere Programme inklusive Joghurt und Sterilisieren',
      'Familiengröße',
    ],
    specs: [
      ['Modell', 'Pro Crisp'],
      ['Volumenklasse', '8 Quart / ca. 7,6 l'],
      ['Funktionen', 'Druck, Heißluft, Slow Cook, Dämpfen, Anbraten'],
      ['Innentopf', 'Edelstahl'],
    ],
    tags: ['multikocher', 'instant pot', 'druck', 'heißluft'],
    safety: [
      'Druckkochtopf: Dichtung und Ventil vor jeder Nutzung prüfen. Nie unter Druck öffnen.',
      'Heiße Oberflächen und Dampf. Nur auf fester Fläche betreiben.',
      'Von Kindern fernhalten.',
    ],
  }),
  product({
    sku: 'HH-TOP-001',
    slug: 'le-creuset-signature-braeter-24-cm',
    title: 'Le Creuset Signature Bräter rund 24 cm',
    brand: 'Le Creuset',
    manufacturer: M.lecreuset,
    category: pots,
    categorySlug: potsSlug,
    price: 300,
    gpc: gpcCookware,
    featured: true,
    images: [
      img(
        '/images/products/le-creuset-signature-braeter-24-cm-1.avif',
        'Le Creuset Signature Bräter rund 24 cm in Kirschrot'
      ),
    ],
    short: 'Gusseisenbräter mit Emaillebeschichtung — Kochgeschirr und Einrichtungsgegenstand zugleich.',
    long: 'Wird selten aus Not gekauft und fast immer aus Wunsch. Gusseisen speichert Wärme lange, die Emaille macht das Anbraten und die Reinigung unkompliziert. 24 cm ist die Größe, die für vier Personen reicht, ohne die Spülmaschine zu sprengen. Backofenfest, induktionsgeeignet, Signature-Griff größer als die Classic-Serie. Die Farbwahl entscheidet den Kauf mit und führt regelmäßig zu Nachkäufen in weiteren Größen.',
    features: [
      'Gusseisen mit Emaille innen und außen',
      'Induktion, Gas, Ceran, Backofen',
      'Signature-Griffe, größer zum Anfassen mit Topflappen',
      'Lebenslange Garantie des Herstellers auf Gusskörper',
      '24 cm — Alltaggröße für 3–4 Personen',
    ],
    specs: [
      ['Serie', 'Signature'],
      ['Form', 'rund'],
      ['Durchmesser', '24 cm'],
      ['Volumen', 'ca. 4,2 l'],
      ['Material', 'Gusseisen, emailliert'],
      ['Induktion', 'ja'],
      ['Backofen', 'bis 260 °C (Griff beachten)'],
    ],
    tags: ['bräter', 'le creuset', 'gusseisen', 'emaille'],
    safety: cookwareSafety,
  }),
  product({
    sku: 'HH-TOP-002',
    slug: 'staub-cocotte-rund-24-cm',
    title: 'Staub Cocotte rund 24 cm',
    brand: 'Staub',
    manufacturer: M.zwilling,
    category: pots,
    categorySlug: potsSlug,
    price: 280,
    gpc: gpcCookware,
    images: [
      img(
        '/images/products/staub-cocotte-rund-24-cm-1.avif',
        'Staub Cocotte rund 24 cm mit Tropfnoppen im Deckel'
      ),
    ],
    short: 'Schwarze Innenemaille und Tropfnoppen im Deckel für kontinuierliches Umbenetzen.',
    long: 'Der Deckel ist innen mit Noppen versehen, an denen Kondenswasser gleichmäßig auf das Gargut zurücktropft. Die dunkle Innenemaille ist unempfindlicher gegen Verfärbungen als helle. Gusseisen, induktionsgeeignet, backofenfest. Dauerpräsenz in Kochbüchern und auf Instagram. 24 cm ist die meistverkaufte Größe — Schmorbraten, Brot backen, Eintopf.',
    features: [
      'Tropfnoppen im Deckel für Selbstsoßierung',
      'Matte schwarze Innenemaille',
      'Gusseisen, induktionsgeeignet',
      'Backofenfest',
      'Messing- oder Nickelknauf je nach Ausführung',
    ],
    specs: [
      ['Serie', 'Cocotte'],
      ['Durchmesser', '24 cm'],
      ['Volumen', 'ca. 3,8 l'],
      ['Material', 'Gusseisen, emailliert'],
      ['Induktion', 'ja'],
      ['Innenemaille', 'schwarz, matt'],
    ],
    tags: ['bräter', 'staub', 'cocotte', 'gusseisen'],
    safety: cookwareSafety,
  }),
  product({
    sku: 'HH-TOP-003',
    slug: 'fissler-original-profi-collection-topfset',
    title: 'Fissler Original Profi Collection Topfset',
    brand: 'Fissler',
    manufacturer: M.fissler,
    category: pots,
    categorySlug: potsSlug,
    price: 550,
    gpc: gpcCookware,
    images: [
      img(
        '/images/products/fissler-original-profi-collection-topfset-1.avif',
        'Fissler Original Profi Collection Edelstahl-Topfset'
      ),
    ],
    short: 'Deutsches Premium-Topfset, klassisches Hochzeits- und Einzugsgeschenk.',
    long: 'Edelstahl, massive Cookstar-Böden und ein Aufbau, der auf Jahrzehnte ausgelegt ist. Das Set wird typisch einmal im Leben gekauft, entsprechend hoch ist die Beratungsintensität und entsprechend gut funktionieren ausführliche Produktseiten. Deckel sitzen innen, Schwitzwasser rinnt zurück, Skala innen. Induktion, Backofen, Spülmaschine. Lange Herstellergarantie auf den Boden.',
    features: [
      'Cookstar-Allherdboden, auch Induktion',
      'Innenskalierung in Litern',
      'Kondensatführende Deckel',
      'Edelstahl 18/10',
      'Lange Garantie auf den Boden',
    ],
    specs: [
      ['Serie', 'Original Profi Collection'],
      ['Material', 'Edelstahl 18/10'],
      ['Induktion', 'ja'],
      ['Backofen', 'ja, Deckel beachten'],
      ['Spülmaschine', 'ja'],
      ['Herstellung', 'Deutschland'],
    ],
    tags: ['topfset', 'fissler', 'edelstahl', 'profi collection'],
    safety: cookwareSafety,
  }),
  product({
    sku: 'HH-TOP-004',
    slug: 'wmf-fusiontec-topfset',
    title: 'WMF Fusiontec Topfset',
    brand: 'WMF',
    manufacturer: M.wmf,
    category: pots,
    categorySlug: potsSlug,
    price: 450,
    gpc: gpcCookware,
    images: [
      img('/images/products/wmf-fusiontec-topfset-1.avif', 'WMF Fusiontec Topfset in Platinum'),
    ],
    short: 'Materialmix aus Stahlkern und keramischer Oberfläche.',
    long: 'WMF ist die bekannteste Haushaltswarenmarke Deutschlands, was die Kaufentscheidung erheblich verkürzt. Fusiontec liegt zwischen Edelstahl und Gusseisen: kratzfeste keramische Oberfläche bei geringerem Gewicht als Guss. Induktion, Backofen, pflegeleicht. Farbvarianten (Platinum, Dark Brass und andere) machen das Set zum Einrichtungsgegenstand, nicht nur zum Werkzeug.',
    features: [
      'Fusiontec-Oberfläche, kratzunempfindlich im Alltag',
      'Leichter als Gusseisenbräter',
      'Induktionsgeeignet',
      'Stapelbare Töpfe',
      'Bekannte Marke, einfache Entscheidung',
    ],
    specs: [
      ['Serie', 'Fusiontec'],
      ['Material', 'Stahlkern mit keramischer Oberfläche'],
      ['Induktion', 'ja'],
      ['Backofen', 'ja'],
      ['Farbe dieser Ausführung', 'Platinum / dunkel'],
    ],
    tags: ['topfset', 'wmf', 'fusiontec', 'induktion'],
    safety: cookwareSafety,
  }),
  product({
    sku: 'HH-TOP-005',
    slug: 'zwilling-motion-pfannenset',
    title: 'Zwilling Motion Pfannenset',
    brand: 'Zwilling',
    manufacturer: M.zwilling,
    category: pots,
    categorySlug: potsSlug,
    price: 200,
    gpc: gpcCookware,
    images: [
      img(
        '/images/products/zwilling-motion-pfannenset-1.avif',
        'Zwilling Motion Antihaft-Pfannenset'
      ),
    ],
    short: 'Solinger Markenname im Einstiegssegment der Antihaftpfannen.',
    long: 'Aluminium mit Antihaftbeschichtung, deutlich leichter als Guss und für den Alltag gedacht. Der Markenname trägt die Kaufentscheidung, der Preis macht sie leicht. Induktionsfähig je nach Ausführung, backofenfest in einem begrenzten Temperaturbereich. Kein Bräterersatz, sondern die Pfanne für Eier, Pfannkuchen und das schnelle Anbraten.',
    features: [
      'Antihaftbeschichtung für fettarmes Braten',
      'Leichtes Aluminium',
      'Edelstahlgriff',
      'Alltagstauglich, kein Gussgewicht',
      'Set aus zwei Größen',
    ],
    specs: [
      ['Serie', 'Motion'],
      ['Material', 'Aluminium, antihaftbeschichtet'],
      ['Induktion', 'ja (bodenabhängig, Ausführung prüfen)'],
      ['Spülmaschine', 'Handspüle verlängert die Beschichtung'],
    ],
    tags: ['pfanne', 'zwilling', 'antihaft', 'set'],
    safety: cookwareSafety,
  }),
  product({
    sku: 'HH-MES-001',
    slug: 'wuesthof-classic-ikon-messerblock',
    title: 'Wüsthof Classic Ikon Messerblock',
    brand: 'Wüsthof',
    manufacturer: M.wuesthof,
    category: knives,
    categorySlug: knivesSlug,
    price: 650,
    featured: true,
    gpc: gpcKnives,
    images: [
      img(
        '/images/products/wuesthof-classic-ikon-messerblock-1.avif',
        'Wüsthof Classic Ikon bestückter Messerblock'
      ),
    ],
    short: 'Bestückter Messerblock im oberen Preissegment, klassisches Hochzeitsgeschenk.',
    long: 'Solinger Fertigung, durchgehender Erl und ein Griff, der nach hinten ausgestellt ist — das Erkennungszeichen der Ikon-Linie. Der höchste durchschnittliche Bestellwert der Messerkategorie. PEtec-Schliff, X50CrMoV15, Härte um 58 HRC. Nicht spülmaschinengeeignet. Gravur auf der Klinge ist der naheliegende Zusatz, der den Preisvergleich aushebelt.',
    features: [
      'Geschmiedet in Solingen, durchgehender Erl',
      'Classic-Ikon-Griff, nach hinten ausgestellt',
      'PEtec-Präzisionsschliff',
      'Bestückter Holzblock',
      'Handwäsche, nicht spülmaschinengeeignet',
    ],
    specs: [
      ['Serie', 'Classic Ikon'],
      ['Stahl', 'X50CrMoV15'],
      ['Härte', 'ca. 58 HRC'],
      ['Schliff', 'PEtec'],
      ['Griff', 'Kunststoff, vernietet'],
      ['Spülmaschine', 'nein'],
    ],
    tags: ['messerblock', 'wüsthof', 'classic ikon', 'solingen'],
    safety: knifeSafety,
  }),
  product({
    sku: 'HH-MES-002',
    slug: 'zwilling-pro-messerblock-7-tlg',
    title: 'Zwilling Pro Messerblock, 7-tlg.',
    brand: 'Zwilling',
    manufacturer: M.zwilling,
    category: knives,
    categorySlug: knivesSlug,
    price: 400,
    gpc: gpcKnives,
    images: [
      img(
        '/images/products/zwilling-pro-messerblock-7-tlg-1.avif',
        'Zwilling Pro Messerblock 7-teilig'
      ),
    ],
    short: 'Die bekannteste Messermarke Deutschlands im meistverkauften Set-Format.',
    long: 'Der gebogene Klingenübergang (Friodur, Sigmaforge) erlaubt das Wiegeschnitt-Arbeiten bis zum Griff. Für die meisten Käufer ist dieser Block der erste bewusste Messerkauf ihres Lebens — Beratungstexte zahlen sich hier direkt aus. Sieben Teile im Holzblock, Solinger Fertigung, nicht spülmaschinengeeignet. Allzweck, Kochmesser, Brot, Schälmesser — die Grundausstattung ohne Spezialklingen.',
    features: [
      'Gebogener Klingenübergang für Wiegeschnitt',
      'Sigmaforge, Friodur-Eishärtung',
      '7-teilig inkl. Block',
      'Solinger Marke',
      'Handwäsche',
    ],
    specs: [
      ['Serie', 'Pro'],
      ['Teile', '7 inklusive Block'],
      ['Stahl', 'rostfrei, eishart'],
      ['Herkunft', 'Solingen'],
      ['Spülmaschine', 'nein'],
    ],
    tags: ['messerblock', 'zwilling', 'pro', 'solingen'],
    safety: knifeSafety,
  }),
  product({
    sku: 'HH-MES-003',
    slug: 'miyabi-5000-mcd-gyutoh',
    title: 'Miyabi 5000 MCD Gyutoh 20 cm',
    brand: 'Miyabi',
    manufacturer: M.zwilling,
    category: knives,
    categorySlug: knivesSlug,
    price: 330,
    gpc: gpcKnives,
    images: [
      img(
        '/images/products/miyabi-5000-mcd-gyutoh-1.avif',
        'Miyabi 5000 MCD Gyutoh Kochmesser 20 cm mit Damastklinge'
      ),
    ],
    short: 'Japanische Klingengeometrie mit deutschem Vertrieb im Hintergrund.',
    long: 'Damaszierter Klingenaufbau um einen MicroCarbide-Kern, sehr hohe Härte und ein dünner Schliff, der feines Arbeiten erlaubt. Gyutoh 20 cm ist das westliche Kochmesser-Format in japanischer Geometrie. Pakkaholzgriff. Käufer dieser Kategorie recherchieren gründlich und honorieren Produktseiten mit echten Daten statt Marketingtext. Nicht spülmaschinengeeignet, nicht für Knochen oder gefrorene Lebensmittel.',
    features: [
      'MC63-MicroCarbide-Kern, Damastlagen',
      'Sehr hohe Härte, dünner Schliff',
      'Gyutoh 20 cm',
      'Pakkaholzgriff',
      'Handwäsche, Horngriffpflege',
    ],
    specs: [
      ['Serie', '5000 MCD'],
      ['Klinge', 'Gyutoh / Kochmesser 20 cm'],
      ['Kernstahl', 'MicroCarbide MC63'],
      ['Härte', 'ca. 61–63 HRC'],
      ['Griff', 'Pakkaholz'],
      ['Spülmaschine', 'nein'],
    ],
    tags: ['kochmesser', 'miyabi', 'damast', 'gyutoh'],
    safety: knifeSafety,
  }),
  product({
    sku: 'HH-MES-004',
    slug: 'kai-shun-classic-kochmesser-20-cm',
    title: 'KAI Shun Classic Kochmesser 20 cm',
    brand: 'KAI',
    manufacturer: M.kai,
    category: knives,
    categorySlug: knivesSlug,
    price: 175,
    gpc: gpcKnives,
    images: [
      img(
        '/images/products/kai-shun-classic-kochmesser-20-cm-1.avif',
        'KAI Shun Classic Kochmesser 20 cm mit Damastklinge'
      ),
    ],
    short: 'Der übliche Einstieg in japanische Küchenmesser in Deutschland.',
    long: 'Damastlagen um einen harten VG-MAX-Kernstahl, D-förmiger Griff aus Pakkaholz. Hohe Bekanntheit durch Fernsehpräsenz, entsprechend viel Suchvolumen auf dem Modellnamen. 20 cm ist die Standardlänge. Nicht spülmaschinengeeignet. Für den Alltag schärfer als Solinger Haushaltsware, empfindlicher gegen Hebeln und Knochen.',
    features: [
      'VG-MAX-Kern mit Damastlagen',
      'D-Griff aus Pakkaholz',
      '20 cm Kochmesser',
      'Hohe Bekanntheit, einfacher Nachkauf von Ersatz',
      'Handwäsche',
    ],
    specs: [
      ['Modell', 'DM0706'],
      ['Klingenlänge', '20 cm'],
      ['Kernstahl', 'VG-MAX'],
      ['Härte', 'ca. 61 HRC'],
      ['Griff', 'Pakkaholz, D-Form'],
      ['Spülmaschine', 'nein'],
    ],
    tags: ['kochmesser', 'kai', 'shun', 'damast'],
    safety: knifeSafety,
  }),
  product({
    sku: 'HH-GRI-001',
    slug: 'weber-spirit-ii-e-310',
    title: 'Weber Spirit II E-310',
    brand: 'Weber',
    manufacturer: M.weber,
    category: grill,
    categorySlug: grillSlug,
    price: 650,
    gpc: gpcGrill,
    images: [
      img(
        '/images/products/weber-spirit-ii-e-310-1.avif',
        'Weber Spirit Gasgrill mit drei Brennern, Vorderansicht'
      ),
    ],
    short: 'Meistverkaufter Gasgrill Deutschlands, drei Brenner, Anzündung per Knopfdruck.',
    long: 'Weber ist im Gasgrillsegment die Marke, die ohne lange Recherche gekauft wird. Drei Brenner, Flavorizer Bars, Deckelthermometer, Seitenablagen. Der eigentliche Ertrag liegt im Zubehör — Abdeckhaube, Grillrost, Thermometer und Reinigungsbürste hängen mit hoher Rate am Warenkorb. Nur im Freien betreiben, Gasflasche separat. Nachfolgemodelle der Spirit-Reihe sind bauähnlich; diese Seite führt das E-310-Format.',
    features: [
      'Drei Edelstahlbrenner, elektronische Zündung',
      'Flavorizer Bars gegen Flammenrückschlag',
      'Deckelthermometer',
      'Seitentische',
      'Offenes Zubehörprogramm',
    ],
    specs: [
      ['Modellreihe', 'Spirit II E-310 / Spirit E-310'],
      ['Brenner', '3'],
      ['Brennstoff', 'Propangas'],
      ['Grillrost', 'porzellanemailliert'],
      ['Aufstellort', 'nur Außenbereich'],
    ],
    tags: ['gasgrill', 'weber', 'spirit', 'drei brenner'],
    safety: grillSafety,
  }),
  product({
    sku: 'HH-GRI-002',
    slug: 'weber-master-touch-gbs-57',
    title: 'Weber Master-Touch GBS 57 cm',
    brand: 'Weber',
    manufacturer: M.weber,
    category: grill,
    categorySlug: grillSlug,
    price: 300,
    gpc: gpcGrill,
    images: [
      img(
        '/images/products/weber-master-touch-gbs-57-1.avif',
        'Weber Master-Touch GBS 57 cm Kugelgrill'
      ),
    ],
    short: 'Kugelgrill-Referenz mit austauschbarem Rosteinsatz.',
    long: 'Der Gourmet-BBQ-System-Rost lässt sich in der Mitte gegen Pfanne, Pizzastein oder Wok tauschen — daraus entsteht eine Zubehörkette, die weit über den Grillkauf hinausgeht. 57 cm ist die Größe, die in deutschen Gärten als Standard gilt. Deckelthermometer, One-Touch-Reinigung, Deckelhalter. Robuste Verarbeitung, hoher Wiederverkaufswert. Nur Holzkohle, nur außen.',
    features: [
      'GBS-Rost mit wechselbarem Mitteleinsatz',
      '57 cm Kessel',
      'One-Touch-Reinigungssystem',
      'Deckelthermometer und Deckelhalter',
      'Großes Zubehörprogramm',
    ],
    specs: [
      ['Modellreihe', 'Master-Touch GBS'],
      ['Durchmesser', '57 cm'],
      ['Brennstoff', 'Holzkohle'],
      ['System', 'Gourmet BBQ System'],
      ['Aufstellort', 'nur Außenbereich'],
    ],
    tags: ['holzkohlegrill', 'weber', 'kugelgrill', 'gbs'],
    safety: grillSafety,
  }),
  product({
    sku: 'HH-GRI-003',
    slug: 'ooni-koda-16',
    title: 'Ooni Koda 16',
    brand: 'Ooni',
    manufacturer: M.ooni,
    category: grill,
    categorySlug: grillSlug,
    price: 600,
    featured: true,
    gpc: gpcOven,
    images: [
      img('/images/products/ooni-koda-16-1.avif', 'Ooni Koda 16 Gas-Pizzaofen von vorn, in Betrieb'),
      img('/images/products/ooni-koda-16-2.avif', 'Ooni Koda 16 Pizzaofen'),
      img('/images/products/ooni-koda-16-3.avif', 'Ooni Koda 16, schräge Ansicht'),
    ],
    short: 'Gasbetriebener Pizzaofen für Steinofentemperaturen auf dem Gartentisch.',
    long: 'Die Kategorie mit dem stärksten Nachfragezuwachs im Außenbereich. L-Brenner, Aufheizzeit im Minutenbereich, Backfläche für Pizzen bis 16 Zoll. Faltbare Beine, um die 19 kg. Schieber, Ersatzstein und Infrarotthermometer sind der naheliegende Zubehörverkauf. Nur im Freien, Propangas. 500 °C sind erreichbar — Handschuhe und Abstand sind keine Dekoration.',
    features: [
      'L-förmiger Gasbrenner, eine Umdrehung der Pizza',
      'Bis 500 °C in rund 20 Minuten',
      '16-Zoll-Backfläche',
      'Klappbare Beine, transportabel',
      'Stein und Schlauch je nach Set enthalten oder separat',
    ],
    specs: [
      ['Modell', 'Koda 16'],
      ['Brennstoff', 'Propangas'],
      ['Max. Temperatur', '500 °C'],
      ['Backfläche', '16 Zoll / ca. 40 cm'],
      ['Aufheizzeit', 'ca. 20 min'],
      ['Gewicht', 'ca. 18–19 kg'],
    ],
    tags: ['pizzaofen', 'ooni', 'koda', 'gas'],
    safety: grillSafety,
  }),
  product({
    sku: 'HH-GRI-004',
    slug: 'ooni-karu-12g',
    title: 'Ooni Karu 12',
    brand: 'Ooni',
    manufacturer: M.ooni,
    category: grill,
    categorySlug: grillSlug,
    price: 450,
    gpc: gpcOven,
    images: [
      img('/images/products/ooni-karu-12g-1.avif', 'Ooni Karu 12 Pizzaofen, Größenvergleich'),
      img('/images/products/ooni-karu-12g-2.avif', 'Ooni Karu 12 mit Holzfeuer und Pizza'),
      img('/images/products/ooni-karu-12g-3.avif', 'Ooni Karu 12 schräg mit Tür'),
    ],
    short: 'Pizzaofen für Holz und Gas — Einstieg in die Marke zum niedrigeren Preis.',
    long: 'Wer mit Holz befeuern will, bekommt den Rauchgeschmack; wer es unkompliziert mag, hängt den Gasbrenner an. Diese Wahlmöglichkeit ist das Kaufargument gegenüber reinen Gasmodellen. 12-Zoll-Pizza, Schornstein, Tür. Karu 12G und Karu 12 sind bauähnlich; geliefert wird die aktuelle Karu-12-Generation. Nur außen, Handschuhe, Stein nicht mit kaltem Wasser abschrecken.',
    features: [
      'Holz und optional Gas',
      '12-Zoll-Backfläche',
      'Schornstein und Tür',
      'Kompakter als Koda 16',
      'Passender Gasbrenner als Zubehör',
    ],
    specs: [
      ['Modell', 'Karu 12'],
      ['Brennstoff', 'Holz, Holzkohle, optional Gas'],
      ['Max. Temperatur', '500 °C'],
      ['Backfläche', '12 Zoll'],
      ['Aufstellort', 'nur Außenbereich'],
    ],
    tags: ['pizzaofen', 'ooni', 'karu', 'holz'],
    safety: grillSafety,
  }),
  product({
    sku: 'HH-GRI-005',
    slug: 'gozney-roccbox',
    title: 'Gozney Roccbox',
    brand: 'Gozney',
    manufacturer: M.gozney,
    category: grill,
    categorySlug: grillSlug,
    price: 500,
    gpc: gpcOven,
    images: [
      img('/images/products/gozney-roccbox-1.avif', 'Gozney Roccbox Pizzaofen von vorn, in Betrieb'),
      img('/images/products/gozney-roccbox-2.avif', 'Gozney Roccbox'),
      img('/images/products/gozney-roccbox-3.avif', 'Gozney Roccbox, Seitenansicht'),
    ],
    short: 'Kompakter Pizzaofen mit Silikonmantel und eigener Anhängerschaft.',
    long: 'Die Premium-Alternative zu Ooni, mit dickerer Isolierung, abnehmbarem Standfuß und Silikonhülle, die man anfassen kann, ohne sich sofort zu verbrennen. Gasbrenner serienmäßig, Holzbrenner separat. Kleinere, aber sehr markentreue Zielgruppe, die überdurchschnittlich viel Zubehör mitkauft. 12-Zoll-Pizza, 500 °C, nur außen.',
    features: [
      'Starke Isolierung, Silikonmantel',
      'Gasbrenner serienmäßig, Holzbrenner optional',
      'Abnehmbare Beine',
      'Steinboden, 12-Zoll-Pizza',
      'Hohe Wärmespeicherung von Pizza zu Pizza',
    ],
    specs: [
      ['Modell', 'Roccbox'],
      ['Brennstoff', 'Gas, optional Holz'],
      ['Max. Temperatur', '500 °C'],
      ['Pizza', 'bis 12 Zoll'],
      ['Aufheizzeit', 'unter 20 min bis Betriebstemperatur'],
    ],
    tags: ['pizzaofen', 'gozney', 'roccbox', 'gas'],
    safety: grillSafety,
  }),
];

const catalog = products.map((product) => ({
  ...product,
  images: fillGallery(product),
}));

const out = path.join(root, 'src', 'data', 'kitchen-products.json');
fs.writeFileSync(out, JSON.stringify(catalog, null, 2) + '\n');
console.log('wrote', catalog.length, 'products to', out);
console.log(
  'image counts',
  catalog.map((p) => `${p.sku}:${p.images.length}`).join(' ')
);
console.log('featured', catalog.filter((p) => p.featured).map((p) => p.sku).join(', '));
