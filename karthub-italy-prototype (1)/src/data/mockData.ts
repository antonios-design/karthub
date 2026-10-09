import { Organizer, Track, Race, DriverProfile, TelemetryLog, TrackLeaderboardEntry, ActivityFeedItem, SystemNotification, TrophyBadge, BenefitReward, FriendDriverProfile } from '../types';

export const INITIAL_ORGANIZERS: Organizer[] = [
  {
    id: 'org-futura',
    name: 'Futura Corse',
    website: 'https://futuracorse.it/',
    regionCovered: 'Toscana & Umbria',
    scrapingStatus: 'ok',
    lastScrapedAt: '2026-10-09 08:30',
    totalRacesFound: 15,
    manualOverride: false,
    contactEmail: 'info@futuracorse.it',
    description: 'Campionati SWS Sprint, Endurance, Ironman e Junior in Toscana con flotta Sodi RT8 e RT10.'
  },
  {
    id: 'org-werace',
    name: 'We Race Championship',
    website: 'https://we-race.it/',
    regionCovered: 'Lazio & Campania',
    scrapingStatus: 'ok',
    lastScrapedAt: '2026-10-09 08:30',
    totalRacesFound: 16,
    manualOverride: false,
    contactEmail: 'iscrizioni@we-race.it',
    description: 'Campionato Karting amatoriale e SWS Centro Italia con CRG Centurion e TB Kart su Viterbo, Guidonia, Arce e Volturno.'
  },
  {
    id: 'org-rkc',
    name: 'RKC ASI Karting',
    website: 'https://www.rkcasikarting.it/',
    regionCovered: 'Lombardia, Piemonte & Nord Italia',
    scrapingStatus: 'ok',
    lastScrapedAt: '2026-10-09 08:30',
    totalRacesFound: 18,
    manualOverride: false,
    contactEmail: 'info@rkcasikarting.it',
    description: 'Rental Kart Championship riconosciuto ASI con gare Endurance e Sprint Nazionali su Ottobiano, Lonato e Rozzano.'
  },
  {
    id: 'org-pomposa',
    name: 'Pomposa Endurance',
    website: 'https://www.pomposaendurance.com/',
    regionCovered: 'Emilia-Romagna (San Giuseppe di Comacchio - FE)',
    scrapingStatus: 'ok',
    lastScrapedAt: '2026-10-09 08:30',
    totalRacesFound: 18,
    manualOverride: false,
    contactEmail: 'info@pomposaendurance.com',
    description: 'Organizzatore ufficiale delle serie Summer Series, Iron Cup, Sprint Series e RKC ASI 2H Series oltre alla 500 Miglia al Circuito di Pomposa.'
  },
  {
    id: 'org-rrk',
    name: 'Romagna Rental Karting',
    website: 'https://www.romagnarentalkarting.it',
    regionCovered: 'Emilia-Romagna & Marche',
    scrapingStatus: 'ok',
    lastScrapedAt: '2026-10-09 08:30',
    totalRacesFound: 14,
    manualOverride: false,
    contactEmail: 'info@romagnarentalkarting.it',
    description: 'Premier regional rental karting series with Sodi RT8 270cc & 390cc karts tra Pomposa e Misano.'
  },
  {
    id: 'org-misanino',
    name: 'Misanino Cup',
    website: 'https://www.misanino.it',
    regionCovered: 'Emilia-Romagna (Misano Adriatico - MWC)',
    scrapingStatus: 'ok',
    lastScrapedAt: '2026-10-09 08:30',
    totalRacesFound: 16,
    manualOverride: false,
    contactEmail: 'booking@misanino.it',
    description: 'Campionati ufficiali Misanino Cup 2026 (Endurance, Sprint e Iron) al Misano World Circuit Marco Simoncelli.'
  },
  {
    id: 'org-xrace',
    name: 'Xrace Endurance Series',
    website: 'https://www.xrace.it',
    regionCovered: 'National (Italy)',
    scrapingStatus: 'ok',
    lastScrapedAt: '2026-10-09 08:30',
    totalRacesFound: 14,
    manualOverride: false,
    contactEmail: 'race@xrace.it',
    description: 'National endurance league featuring 6h, 12h, and 24h team races.'
  },
  {
    id: 'org-vrk',
    name: 'Veneto Rental Karting',
    website: 'https://www.venetorentalkarting.it',
    regionCovered: 'Veneto & Friuli',
    scrapingStatus: 'ok',
    lastScrapedAt: '2026-10-09 08:30',
    totalRacesFound: 10,
    manualOverride: false,
    contactEmail: 'vrk@venetorentalkarting.it',
    description: 'Championship for individual drivers and teams in Northeast Italy (Jesolo).'
  },
  {
    id: 'org-extrema',
    name: 'Extrema Kart',
    website: 'https://extremakart.it/tesseramento-asi/',
    regionCovered: 'Emilia-Romagna (Finale Emilia - Modena)',
    scrapingStatus: 'ok',
    lastScrapedAt: '2026-10-09 08:30',
    totalRacesFound: 12,
    manualOverride: false,
    contactEmail: 'eventi@extremakart.it',
    description: 'Circuito karting a Finale Emilia (Modena) affiliato ASI. Organizza il Trofeo Extrema Kart ASI Sprint, Endurance ed Ironman.'
  }
];

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-pomposa',
    name: 'Circuito di Pomposa',
    region: 'Emilia-Romagna',
    province: 'Ferrara',
    city: 'San Giuseppe di Comacchio',
    address: 'Via San Giuseppe, 153, 44020 Comacchio FE',
    lat: 44.7175,
    lng: 12.2355,
    lengthMeters: 1600,
    turnCount: 16,
    direction: 'clockwise',
    topSpeedKmh: 98,
    allTimeRecord: {
      driverName: 'Marco "Apex" Rossi',
      timeSeconds: 58.421,
      timeFormatted: '0:58.421',
      date: '2026-05-14',
      kartType: 'Sodi RT8 390cc'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    description: 'Uno dei circuiti rental più lunghi e tecnici d\'Europa, famoso per la 500 Miglia ed il rettilineo da 98 km/h.',
    weather: { tempC: 28, condition: 'Soleggiato', rainChance: 5 }
  },
  {
    id: 'track-siena',
    name: 'Circuito Internazionale di Siena',
    region: 'Toscana',
    province: 'Siena',
    city: 'Castelnuovo Berardenga',
    address: 'Str. per Vagliagli, 53019 Castelnuovo Berardenga SI',
    lat: 43.3325,
    lng: 11.4550,
    lengthMeters: 1037,
    turnCount: 14,
    direction: 'clockwise',
    topSpeedKmh: 90,
    allTimeRecord: {
      driverName: 'Lorenzo "Pistolero" Romano',
      timeSeconds: 49.304,
      timeFormatted: '0:49.304',
      date: '2026-07-02',
      kartType: 'Sodi RT8 390cc'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    description: 'Immerso nelle colline toscane. Utilizzato da Futura Corse per le tappe ufficiali SWS Endurance e Sprint.',
    weather: { tempC: 29, condition: 'Soleggiato', rainChance: 0 }
  },
  {
    id: 'track-casetta',
    name: 'Pista Casetta Karting',
    region: 'Toscana',
    province: 'Arezzo',
    city: 'Monte San Savino',
    address: 'Loc. Casetta, 52048 Monte San Savino AR',
    lat: 43.3320,
    lng: 11.7240,
    lengthMeters: 850,
    turnCount: 11,
    direction: 'clockwise',
    topSpeedKmh: 82,
    allTimeRecord: {
      driverName: 'Filippo "TuscanApex" Neri',
      timeSeconds: 42.880,
      timeFormatted: '0:42.880',
      date: '2026-06-18',
      kartType: 'Sodi RT8 270cc'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?auto=format&fit=crop&w=1200&q=80',
    description: 'Tracciato dinamico e guidato nell\'aretino, tappa fissa dei trofei Futura Corse Sprint.',
    weather: { tempC: 27, condition: 'Sereno', rainChance: 0 }
  },
  {
    id: 'track-viterbo',
    name: 'Circuito Internazionale Viterbo',
    region: 'Lazio',
    province: 'Viterbo',
    city: 'Viterbo',
    address: 'Strada Cassia Nord Km 87, 01100 Viterbo VT',
    lat: 42.4280,
    lng: 12.0620,
    lengthMeters: 1300,
    turnCount: 16,
    direction: 'counter-clockwise',
    topSpeedKmh: 95,
    allTimeRecord: {
      driverName: 'Riccardo "Gladiatore" De Luca',
      timeSeconds: 54.205,
      timeFormatted: '0:54.205',
      date: '2026-05-30',
      kartType: 'CRG Centurion 390cc'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    description: 'Tracciato antiorario ad alte sollecitazioni G. Sede storica delle gare We Race 6h Endurance.',
    weather: { tempC: 30, condition: 'Soleggiato', rainChance: 0 }
  },
  {
    id: 'track-guidonia',
    name: 'Pista d\'Oro Guidonia',
    region: 'Lazio',
    province: 'Roma',
    city: 'Guidonia Montecelio',
    address: 'Via Tiburtina Km 22.800, 00015 Guidonia RM',
    lat: 41.9780,
    lng: 12.6880,
    lengthMeters: 920,
    turnCount: 12,
    direction: 'clockwise',
    topSpeedKmh: 84,
    allTimeRecord: {
      driverName: 'Claudio "Capitale" Conti',
      timeSeconds: 43.510,
      timeFormatted: '0:43.510',
      date: '2026-06-10',
      kartType: 'TB Kart 270cc'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    description: 'Circuito storico della provincia di Roma, celebre per le sfide tirate del campionato We Race.',
    weather: { tempC: 28, condition: 'Soleggiato', rainChance: 5 }
  },
  {
    id: 'track-arce',
    name: 'Circuito Valle Liri Arce',
    region: 'Lazio',
    province: 'Frosinone',
    city: 'Arce',
    address: 'Via Casilina Km 111, 03032 Arce FR',
    lat: 41.5790,
    lng: 13.5620,
    lengthMeters: 1200,
    turnCount: 14,
    direction: 'clockwise',
    topSpeedKmh: 91,
    allTimeRecord: {
      driverName: 'Simone "Ciociaria" Rinaldi',
      timeSeconds: 51.290,
      timeFormatted: '0:51.290',
      date: '2026-05-22',
      kartType: 'CRG Centurion'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    description: 'Pista ampia con staccate profonde ed un rettilineo da brivido nel ciociaro.',
    weather: { tempC: 27, condition: 'Sereno', rainChance: 0 }
  },
  {
    id: 'track-volturno',
    name: 'Circuito Internazionale del Volturno',
    region: 'Campania',
    province: 'Benevento',
    city: 'Limatola',
    address: 'Via Giardini, 82030 Limatola BN',
    lat: 41.1420,
    lng: 14.3910,
    lengthMeters: 1100,
    turnCount: 13,
    direction: 'clockwise',
    topSpeedKmh: 88,
    allTimeRecord: {
      driverName: 'Ciro "Vesuvio" Esposito',
      timeSeconds: 47.920,
      timeFormatted: '0:47.920',
      date: '2026-06-28',
      kartType: 'CRG Centurion'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?auto=format&fit=crop&w=1200&q=80',
    description: 'Sede delle tappe campane del trofeo We Race con gare serali e asfalto ad altissimo grip.',
    weather: { tempC: 29, condition: 'Soleggiato', rainChance: 0 }
  },
  {
    id: 'track-south-garba',
    name: 'South Garba International Circuit',
    region: 'Lombardia',
    province: 'Brescia',
    city: 'Lonato del Garda',
    address: 'Via del Duca, 2, 25017 Lonato BS',
    lat: 45.4410,
    lng: 10.4615,
    lengthMeters: 1200,
    turnCount: 15,
    direction: 'clockwise',
    topSpeedKmh: 102,
    allTimeRecord: {
      driverName: 'Davide "LonatoKing" Ferrari',
      timeSeconds: 52.180,
      timeFormatted: '0:52.180',
      date: '2026-04-18',
      kartType: 'Parolin XT40 390cc'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    description: 'La mecca mondiale del karting a Lonato del Garda. Tappa regina per RKC ASI Karting ed Xrace.',
    weather: { tempC: 27, condition: 'Soleggiato', rainChance: 10 }
  },
  {
    id: 'track-ottobiano',
    name: 'Circuito Internazionale di Ottobiano',
    region: 'Lombardia',
    province: 'Pavia',
    city: 'Ottobiano',
    address: 'Cascina San Martino, 27030 Ottobiano PV',
    lat: 45.1610,
    lng: 8.8250,
    lengthMeters: 1380,
    turnCount: 17,
    direction: 'counter-clockwise',
    topSpeedKmh: 96,
    allTimeRecord: {
      driverName: 'Andrea "OttobianoPro" Villa',
      timeSeconds: 56.110,
      timeFormatted: '0:56.110',
      date: '2026-05-15',
      kartType: 'Sodi RT8 390cc'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    description: 'Complesso motoristico d\'eccellenza in provincia di Pavia, ospita la 12 Ore RKC ASI Karting.',
    weather: { tempC: 26, condition: 'Sereno', rainChance: 5 }
  },
  {
    id: 'track-rozzano',
    name: 'Rozzano Indoor & Outdoor Karting',
    region: 'Lombardia',
    province: 'Milano',
    city: 'Rozzano',
    address: 'ViaGuglielmo Marconi, 20089 Rozzano MI',
    lat: 45.3850,
    lng: 9.1520,
    lengthMeters: 680,
    turnCount: 10,
    direction: 'clockwise',
    topSpeedKmh: 75,
    allTimeRecord: {
      driverName: 'Matteo "MilanoExpress" Pozzi',
      timeSeconds: 36.420,
      timeFormatted: '0:36.420',
      date: '2026-06-22',
      kartType: 'Sodi LR5 Electric'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    description: 'Pista milanese al coperto ed all\'aperto per trofei notturni RKC ASI con Kart Elettrici ad accelerazione fulminea.',
    weather: { tempC: 24, condition: 'Indoor Al Coperto', rainChance: 0 }
  },
  {
    id: 'track-winner',
    name: 'Pista Winner Nizza Monferrato',
    region: 'Piemonte',
    province: 'Asti',
    city: 'Nizza Monferrato',
    address: 'Strada Alessandria, 40, 14049 Nizza Monferrato AT',
    lat: 44.7780,
    lng: 8.3580,
    lengthMeters: 1080,
    turnCount: 13,
    direction: 'clockwise',
    topSpeedKmh: 89,
    allTimeRecord: {
      driverName: 'Stefano "Monferrato" Galli',
      timeSeconds: 50.110,
      timeFormatted: '0:50.110',
      date: '2026-06-25',
      kartType: 'Birel N35-XR'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?auto=format&fit=crop&w=1200&q=80',
    description: 'Gioiello del karting piemontese, amato per i cordoli veloci e le staccate cieche.',
    weather: { tempC: 23, condition: 'Poco Nuvoloso', rainChance: 20 }
  },
  {
    id: 'track-mugellino',
    name: 'Circuito del Mugellino',
    region: 'Toscana',
    province: 'Firenze',
    city: 'Scarperia e San Piero',
    address: 'Via S. Giovanni Battista, 33, 50038 Scarperia FI',
    lat: 43.9975,
    lng: 11.3715,
    lengthMeters: 1000,
    turnCount: 12,
    direction: 'clockwise',
    topSpeedKmh: 92,
    allTimeRecord: {
      driverName: 'Matteo "TuscanyFlyer" Bianchi',
      timeSeconds: 47.890,
      timeFormatted: '0:47.890',
      date: '2026-06-01',
      kartType: 'Birel ART N35'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?auto=format&fit=crop&w=1200&q=80',
    description: 'Pista gemella del Mugello Circuit con sali-scendi mozzafiato e tornanti in salita.',
    weather: { tempC: 24, condition: 'Poco Nuvoloso', rainChance: 15 }
  },
  {
    id: 'track-misanino',
    name: 'Misanino Circuit',
    region: 'Emilia-Romagna',
    province: 'Rimini',
    city: 'Misano Adriatico',
    address: 'Via Daijiro Kato, 10, 47843 Misano Adriatico RN',
    lat: 43.9615,
    lng: 12.6845,
    lengthMeters: 900,
    turnCount: 11,
    direction: 'clockwise',
    topSpeedKmh: 88,
    allTimeRecord: {
      driverName: 'Alessandro "Speedy" Valli',
      timeSeconds: 44.112,
      timeFormatted: '0:44.112',
      date: '2026-06-20',
      kartType: 'CRG Centurion 390cc'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    description: 'Situato all\'interno del Misano World Circuit Marco Simoncelli, perfetto per gare in notturna.',
    weather: { tempC: 26, condition: 'Sereno Notturno', rainChance: 0 }
  },
  {
    id: 'track-jesolo',
    name: 'Pista Azzurra Jesolo',
    region: 'Veneto',
    province: 'Venezia',
    city: 'Lido di Jesolo',
    address: 'Via Roma Sinistra, 79, 30016 Jesolo VE',
    lat: 45.5030,
    lng: 12.6280,
    lengthMeters: 1045,
    turnCount: 12,
    direction: 'clockwise',
    topSpeedKmh: 91,
    allTimeRecord: {
      driverName: 'Giacomo "VenetoTurbo" Marini',
      timeSeconds: 48.995,
      timeFormatted: '0:48.995',
      date: '2026-06-12',
      kartType: 'Sodi RT10'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    description: 'Tracciato storico della costa veneta, tappa del trofeo estivo SWS.',
    weather: { tempC: 25, condition: 'Soleggiato', rainChance: 5 }
  },
  {
    id: 'track-extrema',
    name: 'Extrema Kart',
    region: 'Emilia-Romagna',
    province: 'Modena',
    city: 'Finale Emilia',
    address: 'Via Abbà e Motto 5/a, 41034 Finale Emilia MO',
    lat: 44.8322,
    lng: 11.2952,
    lengthMeters: 850,
    turnCount: 14,
    direction: 'clockwise',
    topSpeedKmh: 82,
    allTimeRecord: {
      driverName: 'Marco "EmiliaSpeed" Rossi',
      timeSeconds: 42.180,
      timeFormatted: '0:42.180',
      date: '2026-06-18',
      kartType: 'Extrema Sodi RT8 270cc'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    description: 'Circuito karting ad alte prestazioni situato in Via Abbà e Motto 5/a a Finale Emilia (Modena), affiliato ASI per trofei Sprint ed Endurance.',
    weather: { tempC: 25, condition: 'Sereno', rainChance: 0 }
  }
];

export { INITIAL_RACES } from './racesData';

export const BENEFIT_CATALOG: BenefitReward[] = [
  {
    id: 'benefit-10eur',
    title: 'Buono Sconto €10 Iscrizione Gara',
    description: 'Sconto immediato di €10 applicabile al checkout per qualsiasi gara Endurance o Sprint su KARTHUB.',
    costStarPoints: 100,
    category: 'discount',
    discountAmountEur: 10
  },
  {
    id: 'benefit-25eur',
    title: 'Buono Sconto €25 Iscrizione Gara',
    description: 'Sconto di €25 valido per gare Endurance a squadre (es. Pomposa 6 Hours, Misanino Night GP).',
    costStarPoints: 250,
    category: 'discount',
    discountAmountEur: 25
  },
  {
    id: 'benefit-kart125',
    title: 'Giro di Prova Kart 125cc 2 Tempi (15m)',
    description: 'Sessione individuale da 15 minuti su Kart da competizione 125cc (IAME / Rotax Max 28-30hp) al Circuito di Pomposa o Misanino.',
    costStarPoints: 500,
    category: 'track_session',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'benefit-telemetry',
    title: 'Sessione Telemetria 1-on-1 con Ingegneri Pro',
    description: '1 ora di analisi comparativa sovrapposta dei dati GPS/MyChron5 con un ingegnere di pista professionista.',
    costStarPoints: 350,
    category: 'telemetry_pro'
  },
  {
    id: 'benefit-merch',
    title: 'Tuta Ufficiale KARTHUB & Patch Pilota Custom',
    description: 'Kit gara con patch personalizzata col tuo nickname e livello di esperienza per la tua tuta.',
    costStarPoints: 200,
    category: 'merch'
  }
];

export const CURRENT_USER: DriverProfile = {
  id: 'driver-me',
  name: 'Antonio Santoro',
  nickname: 'ApexAnto',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  avatarType: 'crest',
  crestConfig: {
    shape: 'classic_shield',
    pattern: 'split_v',
    primaryColor: '#dc2626',
    secondaryColor: '#18181b',
    symbolCategory: 'karting',
    symbolIcon: 'steering_wheel',
    crestInitials: 'APEX'
  },
  activeTitleBadgeId: 'badge-4',
  email: 'antonio.santoro8959@gmail.com',
  experienceLevel: 'Semi-Pro',
  weightKg: 78,
  favoriteTrackIds: ['track-pomposa', 'track-misanino', 'track-mugellino'],
  friendsIds: [],
  bio: 'Endurance enthusiast • Sodi RT8 lover • Cacciatore di pole position a Pomposa!',
  totalRaces: 14,
  podiumsCount: 5,
  winsCount: 2,
  starPoints: 650,
  notifyOnNewRaces: true,
  isTimesPublic: true,
  isRacesPublic: true,
  redeemedBenefits: [
    {
      id: 'voucher-001',
      rewardId: 'benefit-10eur',
      rewardTitle: 'Buono Sconto €10 Iscrizione Gara',
      voucherCode: 'KH10-STAR-98A2',
      discountEur: 10,
      redeemedAt: '2026-07-20',
      used: false
    }
  ],
  purchasedRaces: [
    {
      id: 'ticket-991',
      raceId: 'race-pomposa-summer-3',
      raceTitle: 'Pomposa Summer Series Round #3 - 6H Night Endurance',
      trackName: 'Circuito di Pomposa',
      date: '2026-08-08',
      time: '18:00',
      teamName: 'Apex Racing Team Italia',
      driversCount: 3,
      paidAmountEur: 470,
      discountAppliedEur: 10,
      purchaseDate: '2026-07-21',
      paymentMethod: 'Credit Card',
      qrCodeToken: 'KH-PASS-8840192',
      status: 'CONFIRMED'
    }
  ],
  gpsTelemetryLogs: [
    {
      id: 'gps-001',
      filename: 'Pomposa_Session_MyChron5_20260715.csv',
      importedAt: '2026-07-15 17:45',
      trackName: 'Circuito di Pomposa',
      deviceType: 'MyChron5',
      bestLapFormatted: '0:58.610',
      bestLapSeconds: 58.610,
      s1Seconds: 18.150,
      s2Seconds: 21.310,
      s3Seconds: 19.150,
      topSpeedKmh: 97.4,
      maxGForce: 1.85,
      theoreticalBestFormatted: '0:58.320',
      lapsCount: 18,
      dataPoints: [
        { lap: 1, distanceMeters: 100, speedKmh: 45, gForceLat: 0.4, gForceLon: 0.8, timeSec: 3.2 },
        { lap: 1, distanceMeters: 400, speedKmh: 92, gForceLat: 1.2, gForceLon: -0.3, timeSec: 15.1 },
        { lap: 1, distanceMeters: 800, speedKmh: 68, gForceLat: 1.8, gForceLon: -1.2, timeSec: 31.4 },
        { lap: 1, distanceMeters: 1200, speedKmh: 96, gForceLat: 0.8, gForceLon: 0.5, timeSec: 46.8 },
        { lap: 1, distanceMeters: 1600, speedKmh: 97, gForceLat: 0.2, gForceLon: 0.9, timeSec: 58.61 }
      ]
    }
  ],
  unlockedBadges: [
    {
      id: 'badge-1',
      title: 'First Green Light',
      description: 'Completata la prima gara ufficiale di karting rental.',
      icon: 'flag',
      titleIcon: '🏁 [Debuttante GP]',
      unlockedAt: '2025-09-12',
      category: 'milestone'
    },
    {
      id: 'badge-2',
      title: 'Night Owl Driver',
      description: 'Tagliato il traguardo di una gara notturna sotto i riflettori.',
      icon: 'moon',
      titleIcon: '🌙 [Night Rider]',
      unlockedAt: '2026-05-18',
      category: 'endurance'
    },
    {
      id: 'badge-3',
      title: 'Podium Finisher',
      description: 'Conquistato il podio top 3 in una gara endurance di campionato.',
      icon: 'trophy',
      titleIcon: '🏆 [Podium Fighter]',
      unlockedAt: '2026-06-20',
      category: 'podium'
    },
    {
      id: 'badge-4',
      title: 'Apex Specialist',
      description: 'Registrato un giro entro 0.5s dal record assoluto di pista.',
      icon: 'zap',
      titleIcon: '⚡ [Apex Predator]',
      unlockedAt: '2026-07-02',
      category: 'speed'
    },
    {
      id: 'badge-misanino-night',
      title: 'Misanino Night GP Hero',
      description: 'Iscritto e partecipante alla Misano Night GP Sprint Cup.',
      icon: 'moon',
      titleIcon: '🌙 [Misano Night King]',
      unlockedAt: '2026-07-28',
      category: 'race_special',
      associatedRaceId: 'race-misanino-sprint-4'
    },
    {
      id: 'badge-pomposa-500',
      title: '500 Miglia Pomposa Veteran',
      description: 'Registrato per la leggendaria 500 Miglia di Pomposa 2026.',
      icon: 'clock',
      titleIcon: '⏱️ [Pomposa 500 Legend]',
      unlockedAt: '2026-07-15',
      category: 'race_special',
      associatedRaceId: 'race-pomposa-500miglia'
    }
  ]
};

export const DEMO_USERS: DriverProfile[] = [
  CURRENT_USER
];

export const TROPHY_CATALOG: TrophyBadge[] = [
  {
    id: 'badge-1',
    title: 'First Green Light',
    description: 'Completata la prima gara ufficiale di karting rental.',
    icon: 'flag',
    titleIcon: '🏁 [Debuttante GP]',
    category: 'milestone'
  },
  {
    id: 'badge-2',
    title: 'Night Owl Driver',
    description: 'Tagliato il traguardo di una gara notturna sotto i riflettori.',
    icon: 'moon',
    titleIcon: '🌙 [Night Rider]',
    category: 'endurance'
  },
  {
    id: 'badge-3',
    title: 'Podium Finisher',
    description: 'Conquistato il podio top 3 in una gara endurance di campionato.',
    icon: 'trophy',
    titleIcon: '🏆 [Podium Fighter]',
    category: 'podium'
  },
  {
    id: 'badge-4',
    title: 'Apex Specialist',
    description: 'Registrato un giro entro 0.5s dal record assoluto di pista.',
    icon: 'zap',
    titleIcon: '⚡ [Apex Predator]',
    category: 'speed'
  },
  {
    id: 'badge-misanino-night',
    title: 'Misanino Night GP Hero',
    description: 'Iscritto alla Misano Night GP Sprint Cup #4 su CRG 390cc.',
    icon: 'moon',
    titleIcon: '🌙 [Misano Night King]',
    category: 'race_special',
    associatedRaceId: 'race-misanino-sprint-4',
    associatedTrackName: 'Misanino Circuit'
  },
  {
    id: 'badge-pomposa-500',
    title: '500 Miglia Pomposa Veteran',
    description: 'Iscritto alla storica 500 Miglia Endurance al Circuito di Pomposa.',
    icon: 'clock',
    titleIcon: '⏱️ [Pomposa 500 Legend]',
    category: 'race_special',
    associatedRaceId: 'race-pomposa-500miglia',
    associatedTrackName: 'Circuito di Pomposa'
  },
  {
    id: 'badge-summer-series',
    title: 'Summer Series Challenger',
    description: 'Iscritto al Campionato Pomposa Summer Series 2026 6H Night.',
    icon: 'flame',
    titleIcon: '☀️ [Summer Series 2026]',
    category: 'race_special',
    associatedRaceId: 'race-pomposa-summer-3',
    associatedTrackName: 'Circuito di Pomposa'
  },
  {
    id: 'badge-iron-cup',
    title: 'Iron Cup Marathon Solo',
    description: 'Partecipazione ad una gara individuale Ironman di 90+ minuti.',
    icon: 'swords',
    titleIcon: '⚔️ [Ironman Titan]',
    category: 'race_special',
    associatedRaceId: 'race-misanino-iron-2',
    associatedTrackName: 'Misanino Circuit'
  },
  {
    id: 'badge-rkc-asi',
    title: 'RKC ASI 2H Challenger',
    description: 'Pilota schierato nel trofeo nazionale RKC ASI 2H Endurance.',
    icon: 'award',
    titleIcon: '🏅 [ASI Endurance Master]',
    category: 'race_special',
    associatedRaceId: 'race-pomposa-rkc-3',
    associatedTrackName: 'Circuito di Pomposa'
  },
  {
    id: 'badge-5',
    title: 'Endurance Warrior',
    description: 'Accumulate oltre 12 ore complessive di guida in gara a squadre.',
    icon: 'clock',
    titleIcon: '⏱️ [Endurance Warrior]',
    category: 'endurance'
  },
  {
    id: 'badge-6',
    title: 'Globe Trotter',
    description: 'Gareggiato in almeno 5 circuiti diversi in Italia.',
    icon: 'map-pin',
    titleIcon: '🗺️ [Italian Globe Trotter]',
    category: 'milestone'
  },
  {
    id: 'badge-telemetry-pro',
    title: 'MyChron & GPS Telemetrista',
    description: 'Importato ed analizzato un file di telemetria GPS su KARTHUB.',
    icon: 'activity',
    titleIcon: '📡 [Telemetry Engineer]',
    category: 'speed'
  },
  {
    id: 'badge-star-points',
    title: 'Star Points Millionaire',
    description: 'Raggiunto un saldo di oltre 500 Star Points fedeltà.',
    icon: 'sparkles',
    titleIcon: '⭐ [Star Points Legend]',
    category: 'milestone'
  }
];

export const INITIAL_COMMUNITY_FRIENDS: FriendDriverProfile[] = [];


export const INITIAL_TELEMETRY: TelemetryLog[] = [
  {
    id: 'log-1',
    driverId: 'driver-me',
    driverName: 'Antonio Santoro',
    driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    raceId: 'race-pomposa-past',
    trackId: 'track-pomposa',
    trackName: 'Circuito di Pomposa',
    date: '2026-06-28',
    eventTitle: 'Pomposa Summer Sprint Cup',
    bestLapSeconds: 58.784,
    bestLapFormatted: '0:58.784',
    s1Seconds: 18.210,
    s2Seconds: 21.402,
    s3Seconds: 19.172,
    finishPosition: 2,
    startingGrid: 4,
    totalTeams: 24,
    kartNumber: 14,
    kartCategory: 'Sodi RT8 390cc',
    notes: 'Great kart #14! Smooth through Sector 2 chicane. P2 after late pit overtake.',
    verified: true,
    likesCount: 12,
    likedByMe: true
  },
  {
    id: 'log-2',
    driverId: 'driver-me',
    driverName: 'Antonio Santoro',
    driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    raceId: 'race-misanino-past',
    trackId: 'track-misanino',
    trackName: 'Misanino Circuit',
    date: '2026-06-20',
    eventTitle: 'Misano Night GP #2',
    bestLapSeconds: 44.450,
    bestLapFormatted: '0:44.450',
    s1Seconds: 14.110,
    s2Seconds: 15.300,
    s3Seconds: 15.040,
    finishPosition: 1,
    startingGrid: 2,
    totalTeams: 18,
    kartNumber: 7,
    kartCategory: 'CRG Centurion',
    notes: 'P1 Victory under the lights! Perfect launch at start and defended turn 4 tight.',
    verified: true,
    likesCount: 18,
    likedByMe: true
  },
  {
    id: 'log-3',
    driverId: 'driver-2',
    driverName: 'Marco "Apex" Rossi',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    trackId: 'track-pomposa',
    trackName: 'Circuito di Pomposa',
    date: '2026-05-14',
    eventTitle: 'RRK Master Cup',
    bestLapSeconds: 58.421,
    bestLapFormatted: '0:58.421',
    s1Seconds: 18.090,
    s2Seconds: 21.280,
    s3Seconds: 19.051,
    finishPosition: 1,
    startingGrid: 1,
    totalTeams: 26,
    kartNumber: 9,
    kartCategory: 'Sodi RT8 390cc',
    notes: 'All-time track record lap set in Q2 with fresh tire pressures!',
    verified: true,
    likesCount: 34,
    likedByMe: false
  },
  {
    id: 'log-4',
    driverId: 'driver-3',
    driverName: 'Matteo "TuscanyFlyer" Bianchi',
    driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    trackId: 'track-mugellino',
    trackName: 'Circuito del Mugellino',
    date: '2026-06-01',
    eventTitle: 'Mugellino Spring Sprint',
    bestLapSeconds: 47.890,
    bestLapFormatted: '0:47.890',
    s1Seconds: 15.110,
    s2Seconds: 16.480,
    s3Seconds: 16.300,
    finishPosition: 1,
    startingGrid: 1,
    totalTeams: 16,
    kartNumber: 3,
    kartCategory: 'Birel ART N35',
    notes: 'Uphill section was mega today. New PB set on Lap 12.',
    verified: true,
    likesCount: 15,
    likedByMe: true
  }
];

export const INITIAL_LEADERBOARD_POMPOSA: TrackLeaderboardEntry[] = [
  {
    rank: 1,
    driverId: 'driver-2',
    driverName: 'Marco "Apex" Rossi',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    timeSeconds: 58.421,
    timeFormatted: '0:58.421',
    deltaToRecordSeconds: 0.000,
    s1: 18.090,
    s2: 21.280,
    s3: 19.051,
    date: '2026-05-14',
    kartCategory: 'Sodi RT8 390cc',
    isFriend: true
  },
  {
    rank: 2,
    driverId: 'driver-me',
    driverName: 'Antonio Santoro',
    driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    timeSeconds: 58.784,
    timeFormatted: '0:58.784',
    deltaToRecordSeconds: +0.363,
    gapToUserSeconds: 0.000,
    s1: 18.210,
    s2: 21.402,
    s3: 19.172,
    date: '2026-06-28',
    kartCategory: 'Sodi RT8 390cc',
    isCurrentUser: true
  },
  {
    rank: 3,
    driverId: 'driver-3',
    driverName: 'Matteo "TuscanyFlyer" Bianchi',
    driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    timeSeconds: 59.012,
    timeFormatted: '0:59.012',
    deltaToRecordSeconds: +0.591,
    gapToUserSeconds: +0.228,
    s1: 18.330,
    s2: 21.510,
    s3: 19.172,
    date: '2026-06-12',
    kartCategory: 'Sodi RT8 390cc',
    isFriend: true
  },
  {
    rank: 4,
    driverId: 'driver-4',
    driverName: 'Giulia "RacerGirl" Moretti',
    driverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    timeSeconds: 59.240,
    timeFormatted: '0:59.240',
    deltaToRecordSeconds: +0.819,
    gapToUserSeconds: +0.456,
    s1: 18.410,
    s2: 21.600,
    s3: 19.230,
    date: '2026-06-28',
    kartCategory: 'Sodi RT8 390cc',
    isFriend: true
  },
  {
    rank: 5,
    driverId: 'driver-5',
    driverName: 'Federico "BolognaFullGas" Neri',
    driverAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    timeSeconds: 59.510,
    timeFormatted: '0:59.510',
    deltaToRecordSeconds: +1.089,
    gapToUserSeconds: +0.726,
    s1: 18.520,
    s2: 21.710,
    s3: 19.280,
    date: '2026-05-30',
    kartCategory: 'CRG Centurion'
  }
];

export const INITIAL_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'act-1',
    driverId: 'driver-me',
    driverName: 'Antonio Santoro',
    driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    type: 'personal_best',
    title: 'New Personal Best at Circuito di Pomposa!',
    description: 'Lowered lap time to 0:58.784 in kart #14 during RRK Summer Cup.',
    timestamp: '2 hours ago',
    trackName: 'Circuito di Pomposa',
    bestLapFormatted: '0:58.784',
    position: 2,
    likesCount: 14,
    likedByMe: true,
    commentsCount: 3
  },
  {
    id: 'act-2',
    driverId: 'driver-2',
    driverName: 'Marco "Apex" Rossi',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    type: 'race_registered',
    title: 'Registered for 6 Hours Summer Endurance Pomposa SWS',
    description: 'Team Apex Romagna confirmed grid slot #12!',
    timestamp: '5 hours ago',
    trackName: 'Circuito di Pomposa',
    likesCount: 9,
    likedByMe: false,
    commentsCount: 1
  },
  {
    id: 'act-3',
    driverId: 'driver-3',
    driverName: 'Matteo "TuscanyFlyer" Bianchi',
    driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    type: 'badge_unlocked',
    title: 'Unlocked "Ironman Champion" Trophy Badge',
    description: 'Completed 90 continuous solo minutes at Mugellino without stopping!',
    timestamp: '1 day ago',
    badgeName: 'Ironman Champion',
    likesCount: 22,
    likedByMe: true,
    commentsCount: 5
  },
  {
    id: 'act-4',
    driverId: 'driver-4',
    driverName: 'Giulia "RacerGirl" Moretti',
    driverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    type: 'race_completed',
    title: 'Finished P3 in Misano Night GP #2',
    description: 'Drove through from P7 starting grid to secure podium step 3.',
    timestamp: '2 days ago',
    trackName: 'Misanino Circuit',
    bestLapFormatted: '0:44.890',
    position: 3,
    likesCount: 19,
    likedByMe: true,
    commentsCount: 2
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'New Race Listed at Circuito di Pomposa!',
    message: 'Romagna Rental Karting published "6 Hours Summer Endurance Pomposa SWS" on August 8.',
    type: 'new_race',
    timestamp: '10 min ago',
    read: false,
    trackId: 'track-pomposa',
    raceId: 'race-pomposa-6h'
  },
  {
    id: 'notif-2',
    title: 'Friend Signed Up!',
    message: 'Marco "Apex" Rossi registered for Xrace 12 Hours of Lonato.',
    type: 'friend_signup',
    timestamp: '2 hours ago',
    read: false,
    raceId: 'race-xrace-12h'
  },
  {
    id: 'notif-3',
    title: 'Daily Auto-Scraper Finished',
    message: 'Successfully scraped 8 organizer sites. 3 new race dates discovered.',
    type: 'scraper_update',
    timestamp: '3 hours ago',
    read: true
  }
];
