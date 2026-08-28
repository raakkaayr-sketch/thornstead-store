/**
 * Import Depop camera CSV → products.json (German, EUR).
 * Usage: node scripts/import-depop-cameras.mjs [path-to-csv]
 */
import fs from 'node:fs';
import path from 'node:path';

const USD_TO_EUR = 0.928;
const csvPath =
  process.argv[2] ||
  path.join(process.env.USERPROFILE || '', 'Downloads', 'depop-cameras-import.csv');

const CATEGORIES = [
  {
    name: 'Kompaktkameras',
    slug: 'kompaktkameras',
    description:
      'Kompakte Digitalkameras und Vlogging-Modelle — leicht, schnell startklar.',
  },
  {
    name: 'Systemkameras',
    slug: 'systemkameras',
    description:
      'Spiegellose Kameras mit wechselbaren Objektiven für Foto und Video.',
  },
  {
    name: 'Spiegelreflexkameras',
    slug: 'spiegelreflexkameras',
    description:
      'DSLR-Kameras mit optischem Sucher und bewährtem Objektivsystem.',
  },
];

const CAMERA_SAFETY = [
  'Nur für den privaten Gebrauch bestimmt.',
  'Akku nur mit dem Original-Ladegerät oder einem vom Hersteller freigegebenen Ersatz laden.',
  'Kleinteile und Batterien von Kindern fernhalten.',
];

/** German catalogue data keyed by SKU. */
const CATALOG = {
  'PHTR-001': {
    title: 'Canon PowerShot G7 X Mark II — 20,1 MP, schwarz',
    categorySlug: 'kompaktkameras',
    shortDescription:
      'Kompakte Canon PowerShot G7 X Mark II in gutem Zustand, mit zwei Akkus, Original-Ladegerät und Tragetasche.',
    description:
      'Die Canon PowerShot G7 X Mark II ist eine beliebte Kompaktkamera mit 20,1 Megapixel und hellem f/1,8–2,8-Objektiv — ideal für Reise, Street und Alltag. Dieses Exemplar befindet sich in gutem Zustand. Im Lieferumfang sind zwei Akkus, das Original-Ladegerät und eine Tragetasche enthalten. Bitte prüfen Sie die Fotos auf kleinere Gebrauchsspuren.',
    features: [
      '20,1 MP 1"-CMOS-Sensor mit DIGIC 7',
      '4,2-fach optisches Zoomobjektiv (f/1,8–2,8)',
      'Full-HD-Videoaufnahme',
      'Zwei Akkus und Original-Ladegerät inklusive',
      'Tragetasche im Lieferumfang',
    ],
    specs: [
      { label: 'Marke', value: 'Canon' },
      { label: 'Modell', value: 'PowerShot G7 X Mark II' },
      { label: 'Farbe', value: 'Schwarz' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['canon', 'kompaktkamera', 'powershot', 'schwarz'],
    featured: true,
  },
  'PHTR-002': {
    title: 'Canon PowerShot G7 X Mark II — gebraucht, ohne Ladegerät',
    categorySlug: 'kompaktkameras',
    shortDescription:
      'Canon PowerShot G7 X Mark II in gutem Zustand. Leichte Kratzer auf dem Display, funktioniert einwandfrei. Nur Kamera, kein Ladegerät.',
    description:
      'Solide Canon PowerShot G7 X Mark II für alle, die eine kompakte Kamera mit großem Sensor suchen. Das Gerät ist in gutem Zustand und voll funktionsfähig; am Bildschirm sind leichte Kratzer sichtbar. Geliefert wird nur die Kamera — kein Ladegerät.',
    features: [
      '20,1 MP Kompaktkamera mit 1"-Sensor',
      'Kleines, helles Objektiv für schwaches Licht',
      'Leichte Displaykratzer, keine Funktionseinschränkung',
      'Voll funktionsfähig geprüft',
    ],
    specs: [
      { label: 'Marke', value: 'Canon' },
      { label: 'Modell', value: 'PowerShot G7 X Mark II' },
      { label: 'Farbe', value: 'Schwarz' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
      { label: 'Lieferumfang', value: 'Nur Kamera' },
    ],
    tags: ['canon', 'kompaktkamera', 'powershot'],
    featured: false,
  },
  'PHTR-003': {
    title: 'Sony ZV-1 Mark II — weiß, gebraucht',
    categorySlug: 'kompaktkameras',
    shortDescription:
      'Sony ZV-1 Mark II in weiß, guter Zustand. Mit Windschutz für das Mikrofon und einem Akku. Ohne Ladegerät.',
    description:
      'Die Sony ZV-1 Mark II ist auf Vlogging und Content-Erstellung ausgelegt. Dieses weiße Exemplar ist in gutem Zustand; am Objektivanschluss sind leichte Gebrauchsspuren sichtbar. Enthalten sind der Windschutz für das Mikrofon und ein Akku. Ein Ladegerät ist nicht im Lieferumfang.',
    features: [
      'Vlogging-Kompaktkamera mit Weitwinkelobjektiv',
      'Windschutz für das integrierte Mikrofon',
      'Ein Akku enthalten',
      'Ohne Ladegerät',
    ],
    specs: [
      { label: 'Marke', value: 'Sony' },
      { label: 'Modell', value: 'ZV-1 Mark II' },
      { label: 'Farbe', value: 'Weiß' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['sony', 'vlogging', 'kompaktkamera', 'weiss'],
    featured: false,
  },
  'PHTR-004': {
    title: 'Canon PowerShot G7 X Mark II — mit Speicherkarte & Ladegerät',
    categorySlug: 'kompaktkameras',
    shortDescription:
      'Voll funktionsfähige Canon G7 X Mark II mit Kabel, Universal-Ladegerät und 32-GB-Speicherkarte.',
    description:
      'Diese Canon PowerShot G7 X Mark II ist voll funktionsfähig. Im Inneren des Objektivs befindet sich ein weißer Fleck ohne Einfluss auf die Bildqualität. Mitgeliefert werden ein Kabel, ein Universal-Ladegerät und eine 32-GB-Speicherkarte.',
    features: [
      'Voll funktionsfähig',
      '32-GB-Speicherkarte inklusive',
      'Universal-Ladegerät und Kabel',
      'Kompakte Reisekamera mit 20,1 MP',
    ],
    specs: [
      { label: 'Marke', value: 'Canon' },
      { label: 'Modell', value: 'PowerShot G7 X Mark II' },
      { label: 'Speicherkarte', value: '32 GB' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['canon', 'kompaktkamera', 'speicherkarte'],
    featured: false,
  },
  'PHTR-005': {
    title: 'Sony Alpha ZV-E10 II — mit 35 mm & 16–50 mm Objektiv',
    categorySlug: 'systemkameras',
    shortDescription:
      'Sony ZV-E10 II in sehr gutem Zustand mit SEL35F18 (35 mm) und SELP1650 (16–50 mm). Akku dabei, ohne Ladegerät.',
    description:
      'Die Sony Alpha ZV-E10 II ist eine vielseitige Systemkamera für Foto und Video. Dieses Set ist in ausgezeichnetem Zustand und enthält die Objektive SEL35F18 (35 mm) und SELP16502 (16–50 mm) sowie einen Akku. Ein Ladegerät ist nicht enthalten. Originalrechnungen und Garantieunterlagen können beiliegen.',
    features: [
      'Spiegellose APS-C-Systemkamera',
      'Zwei Objektive: 35 mm f/1,8 und 16–50 mm',
      'Sehr guter optischer Zustand',
      'Akku im Lieferumfang',
      'Ideal für Video und Fotografie',
    ],
    specs: [
      { label: 'Marke', value: 'Sony' },
      { label: 'Modell', value: 'Alpha ZV-E10 II' },
      { label: 'Objektive', value: '35 mm + 16–50 mm' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['sony', 'systemkamera', 'zv-e10', 'objektiv-set'],
    featured: true,
  },
  'PHTR-006': {
    title: 'Sony ZV-1F — 20,1 MP, 4K Vlogging-Kamera',
    categorySlug: 'kompaktkameras',
    shortDescription:
      'Sony ZV-1F in ausgezeichnetem Zustand mit Schutztasche, Ladegerät und Akku.',
    description:
      'Die Sony ZV-1F ist eine kompakte 4K-Vlogging-Kamera mit hellem f/2-Objektiv. Dieses Exemplar ist in ausgezeichnetem Zustand und wird mit Schutztasche, Ladegerät, Akku und Zubehör geliefert. Originalunterlagen können beiliegen.',
    features: [
      '20,1 MP, 4K-Video',
      'Helles f/2-Weitwinkelobjektiv',
      'Schutztasche und Originalzubehör',
      'Ladegerät und Akku enthalten',
    ],
    specs: [
      { label: 'Marke', value: 'Sony' },
      { label: 'Modell', value: 'ZV-1F' },
      { label: 'Video', value: '4K' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['sony', 'vlogging', '4k', 'zv-1f'],
    featured: true,
  },
  'PHTR-007': {
    title: 'Sony ZV-1F — 20,1 MP, sehr guter Zustand',
    categorySlug: 'kompaktkameras',
    shortDescription:
      'Sony ZV-1F in sehr gutem Zustand mit Akku, Tasche und USB-Kabel. Werkseinstellungen zurückgesetzt.',
    description:
      'Gepflegte Sony ZV-1F mit kaum sichtbaren Gebrauchsspuren am Gehäuse. Display in sehr gutem Zustand. Enthalten sind Kamera, Ersatzakku (nicht original), Tasche und USB-Kabel. Originalverpackung und Ladegerät fehlen. Auf Werkseinstellungen zurückgesetzt und geprüft.',
    features: [
      '20,1 MP Kompaktkamera',
      'Display in sehr gutem Zustand',
      'Auf Werkseinstellungen zurückgesetzt',
      'Akku, Tasche und USB-Kabel inklusive',
    ],
    specs: [
      { label: 'Marke', value: 'Sony' },
      { label: 'Modell', value: 'ZV-1F' },
      { label: 'Zustand', value: 'Gebraucht — sehr gut' },
      { label: 'Lieferumfang', value: 'Ohne Original-Ladegerät' },
    ],
    tags: ['sony', 'zv-1f', 'kompaktkamera'],
    featured: false,
  },
  'PHTR-008': {
    title: 'Sony Alpha ZV-E10 — mit 16–50 mm & Zubehör-Set',
    categorySlug: 'systemkameras',
    shortDescription:
      'Sony ZV-E10 mit 16–50-mm-Objektiv, Rode-Mikrofon, SmallRig-Akku/ Ladegerät, Ringlicht und Cage.',
    description:
      'Komplettes Creator-Set rund um die Sony Alpha ZV-E10 mit 16–50-mm-Kit-Objektiv. In ausgezeichnetem Zustand. Enthalten sind Rode Pro Mikrofon, SmallRig-Akkus mit Ladegerät, Ringlicht und SmallRig Cage. Originalunterlagen können beiliegen.',
    features: [
      'Sony ZV-E10 mit 16–50-mm-Objektiv',
      'Rode Pro Mikrofon',
      'SmallRig Cage, Akkus und Ladegerät',
      'Ringlicht für Video',
      'Ausgezeichneter Zustand',
    ],
    specs: [
      { label: 'Marke', value: 'Sony' },
      { label: 'Modell', value: 'Alpha ZV-E10' },
      { label: 'Objektiv', value: '16–50 mm' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['sony', 'systemkamera', 'vlogging', 'creator-set'],
    featured: false,
  },
  'PHTR-009': {
    title: 'Canon PowerShot G7 X Mark II — Ersatzteile / Reparatur',
    categorySlug: 'kompaktkameras',
    shortDescription:
      'Canon G7 X Mark II defekt — für Ersatzteile oder Reparatur. Schaltet nicht ein, USB zeigt orangefarbenes Licht.',
    description:
      'Diese Canon PowerShot G7 X Mark II ist nach einem Sturz beschädigt und schaltet nicht mehr ein. Per USB erscheint ein orangefarbenes Betriebslicht. Verkauf ausschließlich als Ersatzteilspender oder für erfahrene Reparateure. Keine Rücknahme.',
    features: [
      '20,1 MP 1"-Sensor, DIGIC 7',
      'Defekt — schaltet nicht ein',
      'Für Ersatzteile oder Reparatur',
      'Verkauf ohne Gewährleistung auf Funktion',
    ],
    specs: [
      { label: 'Marke', value: 'Canon' },
      { label: 'Modell', value: 'PowerShot G7 X Mark II' },
      { label: 'Zustand', value: 'Gebraucht — mäßig / defekt' },
      { label: 'Hinweis', value: 'Nur Ersatzteile / Reparatur' },
    ],
    tags: ['canon', 'ersatzteile', 'reparatur'],
    featured: false,
  },
  'PHTR-010': {
    title: 'Canon EOS 77D — mit 18–55 mm & 55–250 mm Objektiv',
    categorySlug: 'spiegelreflexkameras',
    shortDescription:
      'Canon EOS 77D DSLR mit 18–55-mm- und 55–250-mm-Objektiv. Gut geprüft, mit Akku und Ladegerät.',
    description:
      'Die Canon EOS 77D ist eine vielseitige 24,2-MP-DSLR mit Dual Pixel AF, 45 Kreuzpunkt-AF und WLAN. Dieses Set enthält die Objektive EF-S 18–55 mm und EF-S 55–250 mm sowie Akku und Ladegerät. Alle Funktionen wurden geprüft.',
    features: [
      '24,2 MP APS-C CMOS-Sensor',
      'Dual Pixel CMOS AF und 45-Punkt-AF',
      'Zwei Zoomobjektive im Set',
      'WLAN, NFC und Bluetooth',
      'Schwenkbares Touch-Display',
    ],
    specs: [
      { label: 'Marke', value: 'Canon' },
      { label: 'Modell', value: 'EOS 77D' },
      { label: 'Auflösung', value: '24,2 MP' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['canon', 'dslr', 'eos-77d', 'objektiv-set'],
    featured: true,
  },
  'PHTR-011': {
    title: 'Nikon D850 — 45,7 MP Gehäuse',
    categorySlug: 'spiegelreflexkameras',
    shortDescription:
      'Nikon D850 Vollformat-DSLR, 6.116 Auslösungen. Getestet und voll funktionsfähig. Ohne Akku, Ladegerät und Gurt.',
    description:
      'Die Nikon D850 ist eine professionelle 45,7-MP-Vollformat-DSLR mit 153-Punkt-AF, 4K-Video und wetterfestem Magnesiumgehäuse. Auslösungszähler: 6.116. Voll funktionsfähig geprüft. Geliefert wird nur das Gehäuse — ohne Akku, Ladegerät, Tragegurt und Verpackung.',
    features: [
      '45,7 MP Vollformat ohne Tiefpassfilter',
      '153-Punkt-Autofokus',
      '4K-UHD-Video',
      'Nur 6.116 Auslösungen',
      'Wetterfestes Magnesiumgehäuse',
    ],
    specs: [
      { label: 'Marke', value: 'Nikon' },
      { label: 'Modell', value: 'D850' },
      { label: 'Auslösungen', value: '6.116' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['nikon', 'vollformat', 'd850', 'dslr'],
    featured: true,
  },
  'PHTR-012': {
    title: 'Canon EOS Rebel T7 — mit 18–55 mm & 75–300 mm',
    categorySlug: 'spiegelreflexkameras',
    shortDescription:
      'Canon EOS Rebel T7 (EOS 2000D) mit zwei Objektiven. 24,1 MP, WLAN, voll funktionsfähig geprüft.',
    description:
      'Einsteigerfreundliche Canon EOS Rebel T7 mit 24,1 MP und zwei Zoomobjektiven (18–55 mm und 75–300 mm). Ideal für Urlaub, Sport und Familie. WLAN für einfaches Teilen. Vollständig getestet und funktionsfähig.',
    features: [
      '24,1 MP Auflösung',
      'Zwei Objektive: 18–55 mm und 75–300 mm',
      '3"-Display und eingebauter Blitz',
      'WLAN-Konnektivität',
      'Gesichtserkennung',
    ],
    specs: [
      { label: 'Marke', value: 'Canon' },
      { label: 'Modell', value: 'EOS Rebel T7 / 2000D' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['canon', 'dslr', 'einsteiger', 'objektiv-set'],
    featured: false,
  },
  'PHTR-013': {
    title: 'Nikon COOLPIX P1000 — 125-fach Superzoom',
    categorySlug: 'kompaktkameras',
    shortDescription:
      'Nikon P1000 mit 125-fach Zoom (24–3000 mm), Objektivblende, Tragegurt und Akkukabel. Voll funktionsfähig.',
    description:
      'Die Nikon COOLPIX P1000 bietet ein außergewöhnliches 125-fach-Zoom (24–3000 mm) — ideal für Mond- und Naturaufnahmen. Dieses US-Modell ist in gutem Zustand und voll funktionsfähig. Mitgeliefert werden Objektivblende, Tragegurt und Akkukabel.',
    features: [
      '16 MP mit 125-fach optischem Zoom',
      'Brennweite 24–3000 mm, f/2,8',
      'Spezialmodus für Mondaufnahmen',
      '4K-Video',
      'WLAN und Bluetooth',
    ],
    specs: [
      { label: 'Marke', value: 'Nikon' },
      { label: 'Modell', value: 'COOLPIX P1000' },
      { label: 'Zoom', value: '125x (24–3000 mm)' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['nikon', 'superzoom', 'p1000'],
    featured: false,
  },
  'PHTR-014': {
    title: 'Nikon COOLPIX P1000 — 16 MP, schwarz',
    categorySlug: 'kompaktkameras',
    shortDescription:
      'Nikon Coolpix P1000 Kompaktkamera mit 125-fach Zoom und 4K-Video. Getestet, voll funktionsfähig.',
    description:
      'Kompakte Nikon P1000 mit 16 MP, 125-fach optischem Zoom und 4K-Videoaufnahme. WLAN, Bluetooth und 3"-Display. In gutem Zustand, alle Funktionen geprüft.',
    features: [
      '16 MP, 125-fach Zoom',
      '4K-Video und UHD-Aufnahme',
      'WLAN und Bluetooth',
      '3"-Display',
      'Stativgewinde',
    ],
    specs: [
      { label: 'Marke', value: 'Nikon' },
      { label: 'Modell', value: 'COOLPIX P1000' },
      { label: 'Farbe', value: 'Schwarz' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['nikon', 'superzoom', 'p1000', '4k'],
    featured: false,
  },
  'PHTR-015': {
    title: 'Nikon D7500 — Gehäuse, schwarz',
    categorySlug: 'spiegelreflexkameras',
    shortDescription:
      'Nikon D7500 DSLR-Gehäuse in gutem Zustand. Wenige Gebrauchsspuren, von Fachpersonal geprüft.',
    description:
      'Das Nikon D7500 Gehäuse ist in gutem, sauberem Zustand mit wenigen leichten Gebrauchsspuren. Die Funktion wurde von Fachpersonal geprüft und arbeitet einwandfrei. Bitte Fotos für das genaue Lieferumfang prüfen.',
    features: [
      'APS-C DSLR-Gehäuse',
      'Sauberer, gepflegter Zustand',
      'Funktion von Fachpersonal geprüft',
      'Wenige sichtbare Gebrauchsspuren',
    ],
    specs: [
      { label: 'Marke', value: 'Nikon' },
      { label: 'Modell', value: 'D7500' },
      { label: 'Farbe', value: 'Schwarz' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['nikon', 'dslr', 'd7500'],
    featured: false,
  },
  'PHTR-016': {
    title: 'Nikon Z 50 — mit 16–50 mm VR Objektiv, ~4.700 Auslösungen',
    categorySlug: 'systemkameras',
    shortDescription:
      'Nikon Z 50 mit 16–50-mm-VR-Objektiv. Nur 4.703 Auslösungen. Akku, Ladegerät und Tragegurt.',
    description:
      'Kompakte Nikon Z 50 Systemkamera mit nur 4.703 Auslösungen. Normaler Gebrauchsspuren am Gehäuse; Sensor mit kleinen, unsichtbaren Markierungen. Enthalten sind Gehäuse, Frontdeckel (ohne hinteren Objektivdeckel), Tragegurt, Nikon-Akku und Ladegerät.',
    features: [
      '20,9 MP spiegellose APS-C-Kamera',
      'Nur 4.703 Auslösungen',
      '16–50-mm-VR-Kit-Objektiv',
      'Akku und Ladegerät inklusive',
    ],
    specs: [
      { label: 'Marke', value: 'Nikon' },
      { label: 'Modell', value: 'Z 50' },
      { label: 'Auslösungen', value: '4.703' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['nikon', 'z50', 'systemkamera', 'kit'],
    featured: false,
  },
  'PHTR-017': {
    title: 'Nikon Z50 — nur Gehäuse mit SmallRig Cage',
    categorySlug: 'systemkameras',
    shortDescription:
      'Nikon Z50 Gehäuse mit SmallRig Cage. 10.007 Auslösungen. Mit Tragegurt, Akku und Ladegerät.',
    description:
      'Nikon Z50 Kameragehäuse für das Z-Bajonett, ausgestattet mit einem SmallRig Cage. Auslösungszähler: 10.007. Geliefert werden Gehäuse, Cage, Tragegurt, Akku und Ladegerät.',
    features: [
      'Nikon Z50 Gehäuse',
      'SmallRig Cage inklusive',
      '10.007 Auslösungen',
      'Akku, Ladegerät und Tragegurt',
    ],
    specs: [
      { label: 'Marke', value: 'Nikon' },
      { label: 'Modell', value: 'Z50' },
      { label: 'Auslösungen', value: '10.007' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['nikon', 'z50', 'cage', 'gehaeuse'],
    featured: false,
  },
  'PHTR-018': {
    title: 'Nikon Z50 — Gehäuse mit 128-GB-SD-Karte & Tasche',
    categorySlug: 'systemkameras',
    shortDescription:
      'Nikon Z50 in gutem Zustand, nur ~105 Auslösungen. Mit 128-GB-SD-Karte und kleiner Kameratasche.',
    description:
      'Kaum benutzte Nikon Z50 mit nur etwa 105 Auslösungen. Voll funktionsfähig. Enthalten sind Gehäuse, Tragegurt, Akku, 128-GB-SD-Karte und kleine Kameratasche. Ohne Ladegerät und Objektiv.',
    features: [
      'Nur ca. 105 Auslösungen',
      '128-GB-SD-Karte inklusive',
      'Kleine Kameratasche',
      'Akku und Tragegurt',
    ],
    specs: [
      { label: 'Marke', value: 'Nikon' },
      { label: 'Modell', value: 'Z50' },
      { label: 'Auslösungen', value: '~105' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['nikon', 'z50', 'sd-karte'],
    featured: false,
  },
  'PHTR-019': {
    title: 'Nikon D3300 — mit 18–55 mm & 55–200 mm, WLAN-Adapter',
    categorySlug: 'spiegelreflexkameras',
    shortDescription:
      'Nikon D3300 mit zwei Objektiven und WU-1A WLAN-Adapter. 18–55-mm-Objektiv mit Erkennungsproblem.',
    description:
      'Nikon D3300 mit 18–55-mm- und 55–200-mm-Objektiv sowie WU-1A WLAN-Adapter. Akku geladen, Kamera schaltet ein. Das 18–55-mm-Objektiv wird teilweise nicht erkannt; das 55–200-mm-Objektiv funktioniert. Ladegerät und Tasche inklusive.',
    features: [
      '24,2 MP DSLR',
      'Zwei Objektive und WLAN-Adapter',
      '55–200-mm-Objektiv funktioniert einwandfrei',
      'Hinweis: 18–55-mm-Objektiv wird nicht immer erkannt',
      'Ladegerät und Tasche inklusive',
    ],
    specs: [
      { label: 'Marke', value: 'Nikon' },
      { label: 'Modell', value: 'D3300' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
      { label: 'Hinweis', value: 'Kit-Objektiv mit Kontaktproblem' },
    ],
    tags: ['nikon', 'dslr', 'd3300', 'wlan'],
    featured: false,
  },
  'PHTR-020': {
    title: 'Nikon D3500 — mit 18–55 mm VR Objektiv',
    categorySlug: 'spiegelreflexkameras',
    shortDescription:
      'Nikon D3500 Kit mit 18–55-mm-VR-Objektiv. Voll getestet, mit Akku, Ladegerät und Tasche.',
    description:
      'Beliebtes Nikon D3500 Einsteiger-Set mit 18–55-mm-VR-Objektiv. Vollständig getestet und funktionsfähig. Enthalten sind Akku, Ladegerät und Tasche.',
    features: [
      '24,2 MP DSLR',
      '18–55-mm-VR-Kit-Objektiv',
      'Vollständig getestet',
      'Akku, Ladegerät und Tasche',
    ],
    specs: [
      { label: 'Marke', value: 'Nikon' },
      { label: 'Modell', value: 'D3500' },
      { label: 'Zustand', value: 'Gebraucht — gut' },
    ],
    tags: ['nikon', 'dslr', 'd3500', 'einsteiger'],
    featured: false,
  },
};

const CONDITION_MAP = {
  used_good: 'used',
  used_excellent: 'used',
  used_fair: 'used',
};

const GOOGLE_CATEGORY = 'Cameras & Optics > Cameras > Digital Cameras';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ',') {
      row.push(field);
      field = '';
      continue;
    }

    if (ch === '\n') {
      row.push(field);
      field = '';
      if (row.some((cell) => cell.trim() !== '')) rows.push(row);
      row = [];
      continue;
    }

    if (ch === '\r') continue;
    field += ch;
  }

  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== '')) rows.push(row);
  }

  const [header, ...data] = rows;
  return data.map((cells) =>
    Object.fromEntries(header.map((key, index) => [key, cells[index] ?? '']))
  );
}

function eurPrice(usd) {
  const raw = Number(usd) * USD_TO_EUR;
  const rounded = Math.round(raw * 100) / 100;
  const whole = Math.floor(rounded);
  return whole + 0.95 > rounded ? whole + 0.95 : whole + 0.95;
}

function extractBrand(raw) {
  const match = raw.match(/^([^(]+)/);
  return (match?.[1] || raw).trim();
}

function extractCondition(raw) {
  const match = raw.match(/\(([^)]+)\)/);
  return match?.[1] || 'used_good';
}

function imageColumns(record) {
  return [
    record['Picture Hero url'],
    record['Picture 2 url'],
    record['Picture 3 url'],
    record['Picture 4 url'],
    record['Picture 5 url'],
    record['Picture 6 url'],
    record['Picture 7 url'],
    record['Picture 8 url'],
  ].filter(Boolean);
}

function buildProduct(record) {
  const sku = record.SKU.trim();
  const meta = CATALOG[sku];
  if (!meta) throw new Error(`Missing German catalogue entry for ${sku}`);

  const brand = extractBrand(record.Brand);
  const depopCondition = extractCondition(record.Condition);
  const condition = CONDITION_MAP[depopCondition] || 'used';
  const category = CATEGORIES.find((c) => c.slug === meta.categorySlug);
  const urls = imageColumns(record);
  const slug = slugify(meta.title);

  return {
    id: slug,
    slug,
    sku,
    title: meta.title,
    brand,
    category: category.name,
    categorySlug: meta.categorySlug,
    price: eurPrice(record.Price),
    currency: 'EUR',
    condition,
    availability: 'in_stock',
    gtin: '',
    googleProductCategory: GOOGLE_CATEGORY,
    images: urls.map((src, index) => ({
      src,
      alt:
        index === 0
          ? `${brand} ${meta.title} — Hauptbild`
          : `${brand} ${meta.title} — Bild ${index + 1}`,
    })),
    shortDescription: meta.shortDescription,
    description: meta.description,
    features: meta.features,
    specifications: meta.specs,
    reviewCount: 0,
    ratingValue: 0,
    featured: Boolean(meta.featured),
    tags: meta.tags,
    safetyNotes: CAMERA_SAFETY,
  };
}

const csv = fs.readFileSync(csvPath, 'utf8');
const records = parseCsv(csv);
const products = records.map(buildProduct);
const root = path.resolve(import.meta.dirname, '..');

fs.writeFileSync(
  path.join(root, 'src/data/products.json'),
  `${JSON.stringify(products, null, 2)}\n`
);
fs.writeFileSync(
  path.join(root, 'src/data/categories.json'),
  `${JSON.stringify(CATEGORIES, null, 2)}\n`
);

console.log(`Imported ${products.length} cameras to src/data/products.json`);
console.log(`EUR prices: ${products.map((p) => `${p.sku} ${p.price}`).join(', ')}`);
