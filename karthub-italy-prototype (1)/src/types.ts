export interface Organizer {
  id: string;
  name: string;
  website: string;
  regionCovered: string;
  scrapingStatus: 'ok' | 'pending' | 'fallback' | 'error';
  lastScrapedAt: string;
  totalRacesFound: number;
  manualOverride: boolean;
  contactEmail?: string;
  description?: string;
}

export interface Track {
  id: string;
  name: string;
  region: string;
  province: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  lengthMeters: number;
  turnCount: number;
  direction: 'clockwise' | 'counter-clockwise';
  topSpeedKmh: number;
  allTimeRecord: {
    driverName: string;
    timeSeconds: number;
    timeFormatted: string;
    date: string;
    kartType: string;
  };
  heroImageUrl: string;
  circuitMapUrl?: string;
  description: string;
  weather?: {
    tempC: number;
    condition: string;
    rainChance: number;
  };
}

export interface RaceResultEntry {
  position: number;
  driverName: string;
  teamName?: string;
  kartNumber?: number;
  lapsCompleted?: number;
  totalTimeFormatted?: string;
  bestLapFormatted?: string;
  gapFormatted?: string;
  pointsEarned?: number;
  isCurrentUser?: boolean;
}

export interface Race {
  id: string;
  organizerId: string;
  organizerName: string;
  trackId: string;
  trackName: string;
  trackRegion: string;
  title: string;
  date: string; // ISO format or YYYY-MM-DD
  time: string; // HH:mm
  category: string; // e.g. "Rental 270cc", "Endurance 390cc", "Sprint Heavy 85kg"
  format: 'Endurance' | 'Sprint' | 'Ironman' | 'Night Race';
  durationLabel: string; // e.g., "6 Hours Endurance", "3x 15m Sprints"
  entryFee: number; // EUR
  registeredTeamsCount: number;
  maxGridSize: number;
  registrationDeadline: string;
  registrationUrl: string;
  rulesUrl?: string;
  isScraped: boolean;
  status: 'Upcoming' | 'Live' | 'Completed';
  description: string;
  mandatoryPitStops?: number;
  minWeightKg?: number;
  weatherForecast?: string;
  registeredFriendsIds?: string[];
  championshipName?: string;
  championshipRound?: number;
  totalChampionshipRaces?: number;
  completedChampionshipRaces?: number;
  remainingChampionshipRaces?: number;
  results?: RaceResultEntry[];
}

export type ExperienceLevel = 'Rookie' | 'Amateur' | 'Semi-Pro' | 'Professionist' | 'Kart-Legend';

export interface BenefitReward {
  id: string;
  title: string;
  description: string;
  costStarPoints: number;
  category: 'discount' | 'track_session' | 'telemetry_pro' | 'merch';
  discountAmountEur?: number;
  badgeRequired?: ExperienceLevel;
  imageUrl?: string;
}

export interface BenefitVoucher {
  id: string;
  rewardId: string;
  rewardTitle: string;
  voucherCode: string;
  discountEur?: number;
  redeemedAt: string;
  used: boolean;
}

export interface PurchasedRaceTicket {
  id: string;
  raceId: string;
  raceTitle: string;
  trackName: string;
  date: string;
  time: string;
  teamName: string;
  driversCount: number;
  paidAmountEur: number;
  discountAppliedEur: number;
  purchaseDate: string;
  paymentMethod: 'Credit Card' | 'PayPal' | 'Satispay' | 'Star Points';
  qrCodeToken: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
}

export interface GpsDataPoint {
  lap: number;
  distanceMeters: number;
  speedKmh: number;
  gForceLat: number;
  gForceLon: number;
  timeSec: number;
}

export interface GpsTelemetryImport {
  id: string;
  filename: string;
  importedAt: string;
  trackName: string;
  deviceType: 'MyChron5' | 'Alfano 6' | 'RaceBox GPS' | 'VBOX' | 'GPX/NMEA CSV';
  bestLapFormatted: string;
  bestLapSeconds: number;
  s1Seconds: number;
  s2Seconds: number;
  s3Seconds: number;
  topSpeedKmh: number;
  maxGForce: number;
  theoreticalBestFormatted: string;
  lapsCount: number;
  dataPoints: GpsDataPoint[];
}

export interface CrestConfig {
  shape: 'classic_shield' | 'round_shield' | 'gothic_shield' | 'crown_shield';
  pattern: 'solid' | 'split_v' | 'split_diag' | 'checkered' | 'stripes';
  primaryColor: string;
  secondaryColor: string;
  symbolCategory: 'karting' | 'animals' | 'medieval';
  symbolIcon: string;
  crestInitials?: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  nickname: string;
  avatarUrl: string;
  avatarType?: 'image' | 'crest';
  crestConfig?: CrestConfig;
  activeTitleBadgeId?: string; // ID of the equipped trophy badge
  email: string;
  experienceLevel: ExperienceLevel;
  weightKg: number;
  favoriteTrackIds: string[];
  friendsIds: string[];
  bio: string;
  totalRaces: number;
  podiumsCount: number;
  winsCount: number;
  starPoints: number;
  unlockedBadges: TrophyBadge[];
  redeemedBenefits: BenefitVoucher[];
  purchasedRaces: PurchasedRaceTicket[];
  notifyOnNewRaces: boolean;
  timesVisibility?: 'public' | 'friends' | 'private';
  racesVisibility?: 'public' | 'friends' | 'private';
  isTimesPublic?: boolean; // toggle public/private personal best times
  isRacesPublic?: boolean; // toggle public/private race registrations
  gpsTelemetryLogs?: GpsTelemetryImport[];
}

export interface TrophyBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  titleIcon?: string; // Emoji / Icon tag display e.g. "🏆 [Misano Night GP]" or "🛡️ [Ironman 2026]"
  unlockedAt?: string;
  category: 'milestone' | 'speed' | 'endurance' | 'podium' | 'race_special';
  associatedRaceId?: string;
  associatedTrackName?: string;
}

export interface FriendDriverProfile {
  id: string;
  name: string;
  nickname: string;
  avatarUrl: string;
  avatarType?: 'image' | 'crest';
  crestConfig?: CrestConfig;
  activeTitleBadge?: {
    id: string;
    title: string;
    titleIcon: string;
  };
  experienceLevel: ExperienceLevel;
  weightKg: number;
  bio: string;
  isTimesPublic: boolean;
  isRacesPublic: boolean;
  personalBests: {
    trackId: string;
    trackName: string;
    bestLapFormatted: string;
    bestLapSeconds: number;
    date: string;
  }[];
  registeredRaceIds: string[];
  purchasedRaceTitles?: string[];
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderNickname: string;
  senderAvatarUrl: string;
  senderAvatarType?: 'image' | 'crest';
  senderCrestConfig?: CrestConfig;
  receiverId: string;
  receiverName: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface TelemetryLog {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  raceId?: string;
  trackId: string;
  trackName: string;
  date: string;
  eventTitle: string;
  bestLapSeconds: number;
  bestLapFormatted: string;
  s1Seconds: number;
  s2Seconds: number;
  s3Seconds: number;
  finishPosition: number;
  startingGrid: number;
  totalTeams: number;
  kartNumber: number;
  kartCategory: string;
  notes?: string;
  verified: boolean;
  likesCount: number;
  likedByMe?: boolean;
}

export interface TrackLeaderboardEntry {
  rank: number;
  driverId: string;
  driverName: string;
  driverAvatar: string;
  timeSeconds: number;
  timeFormatted: string;
  deltaToRecordSeconds: number;
  gapToUserSeconds?: number;
  s1: number;
  s2: number;
  s3: number;
  date: string;
  kartCategory: string;
  isFriend?: boolean;
  isCurrentUser?: boolean;
}

export interface ActivityFeedItem {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatar: string;
  type: 'race_completed' | 'personal_best' | 'race_registered' | 'badge_unlocked' | 'generic_post';
  title: string;
  description: string;
  timestamp: string;
  trackName?: string;
  bestLapFormatted?: string;
  position?: number;
  badgeName?: string;
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
  visibility?: 'public' | 'friends_only';
  commentsList?: { id: string; authorName: string; text: string; timestamp: string }[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'new_race' | 'friend_signup' | 'record_broken' | 'scraper_update';
  timestamp: string;
  read: boolean;
  trackId?: string;
  raceId?: string;
}

export interface RaceChangeRecord {
  id: string;
  raceId: string;
  raceTitle: string;
  organizerName: string;
  changeType: 'NEW_RACE' | 'PRICE_CHANGE' | 'DATE_CHANGE' | 'SLOTS_UPDATE' | 'STATUS_CHANGE';
  fieldChanged: string;
  previousValue: string | number;
  newValue: string | number;
  timestamp: string;
}

export function getBadgeSymbolOnly(titleIcon?: string): string {
  if (!titleIcon) return '';
  const symbol = titleIcon.replace(/\s*\[.*\]/g, '').trim();
  return symbol || titleIcon.split(' ')[0] || titleIcon;
}
