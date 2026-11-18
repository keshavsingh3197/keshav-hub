export type GeoTier = 'india' | 'mixed' | 'international';
export type NicheTier = 'entertainment' | 'devotional' | 'tech-dev' | 'finance-edu';

export interface YouTubeEarningsInput {
  monthlyLongViews: number;
  monthlyShortsViews: number;
  geoTier: GeoTier;
  nicheTier: NicheTier;
  monthlySponsorsUsd: number;
  currentWatchHours: number;
  currentShorts90dViews: number;
}

export interface YouTubeEarningsResult {
  calibratedLongRpmUsd: number;
  calibratedShortsRpmUsd: number;
  longRevenueUsd: number;
  shortsRevenueUsd: number;
  totalAdSenseUsd: number;
  totalCombinedUsd: number;
  totalCombinedInr: number;
  blendedRpmUsd: number;
  yppLongProgressPct: number;
  yppShortsProgressPct: number;
}

const GEO_LONG_RPM_USD: Record<GeoTier, number> = {
  india: 1.15,
  mixed: 2.85,
  international: 6.4,
};

const GEO_SHORTS_RPM_USD: Record<GeoTier, number> = {
  india: 0.03,
  mixed: 0.075,
  international: 0.16,
};

const NICHE_MULTIPLIER: Record<NicheTier, number> = {
  entertainment: 0.85,
  devotional: 0.95,
  'tech-dev': 1.75,
  'finance-edu': 2.25,
};

export function calculateYouTubeEarnings(input: YouTubeEarningsInput): YouTubeEarningsResult {
  const longViews = Math.max(0, Number(input.monthlyLongViews) || 0);
  const shortsViews = Math.max(0, Number(input.monthlyShortsViews) || 0);
  const sponsors = Math.max(0, Number(input.monthlySponsorsUsd) || 0);
  const nicheFactor = NICHE_MULTIPLIER[input.nicheTier] ?? 1;

  const calibratedLongRpmUsd = round2(GEO_LONG_RPM_USD[input.geoTier] * nicheFactor);
  const calibratedShortsRpmUsd = round2(GEO_SHORTS_RPM_USD[input.geoTier] * Math.min(1.6, 0.75 + nicheFactor * 0.35));

  const longRevenueUsd = round2((longViews / 1000) * calibratedLongRpmUsd);
  const shortsRevenueUsd = round2((shortsViews / 1000) * calibratedShortsRpmUsd);
  const totalAdSenseUsd = round2(longRevenueUsd + shortsRevenueUsd);
  const totalCombinedUsd = round2(totalAdSenseUsd + sponsors);
  const totalCombinedInr = Math.round(totalCombinedUsd * 85);

  const totalViews = longViews + shortsViews;
  const blendedRpmUsd = totalViews > 0 ? round2((totalAdSenseUsd / totalViews) * 1000) : 0;

  const yppLongProgressPct = Math.min(100, Math.round((Math.max(0, input.currentWatchHours) / 4000) * 100));
  const yppShortsProgressPct = Math.min(100, Math.round((Math.max(0, input.currentShorts90dViews) / 10_000_000) * 100));

  return {
    calibratedLongRpmUsd,
    calibratedShortsRpmUsd,
    longRevenueUsd,
    shortsRevenueUsd,
    totalAdSenseUsd,
    totalCombinedUsd,
    totalCombinedInr,
    blendedRpmUsd,
    yppLongProgressPct,
    yppShortsProgressPct,
  };
}

export interface ShortBeatInput {
  speaker: string;
  emotion: 'excited' | 'funny' | 'surprised' | 'calm' | 'sarcastic';
  dialogue: string;
  visualPrompt: string;
}

export interface ShortPacingResult {
  totalWords: number;
  estimatedSeconds: number;
  hookWords: number;
  hookSeconds: number;
  hookStatus: 'Tight (< 3.5s)' | 'Moderate (3.5s–6s)' | 'Slow (> 6s)';
  beatTimings: { index: number; words: number; seconds: number }[];
}

export function analyzeShortPacing(beats: ShortBeatInput[], wordsPerMinute = 145): ShortPacingResult {
  const safeWpm = Math.max(80, Math.min(240, wordsPerMinute || 145));
  const wordsPerSecond = safeWpm / 60;

  const beatTimings = beats.map((b, idx) => {
    const words = countWords(b.dialogue);
    const seconds = words === 0 ? 1.5 : round2(words / wordsPerSecond + 0.45);
    return { index: idx + 1, words, seconds };
  });

  const totalWords = beatTimings.reduce((sum, x) => sum + x.words, 0);
  const estimatedSeconds = round2(beatTimings.reduce((sum, x) => sum + x.seconds, 0));
  const hookWords = beatTimings[0]?.words ?? 0;
  const hookSeconds = beatTimings[0]?.seconds ?? 0;

  let hookStatus: ShortPacingResult['hookStatus'] = 'Tight (< 3.5s)';
  if (hookSeconds > 6) hookStatus = 'Slow (> 6s)';
  else if (hookSeconds > 3.5) hookStatus = 'Moderate (3.5s–6s)';

  return {
    totalWords,
    estimatedSeconds,
    hookWords,
    hookSeconds,
    hookStatus,
    beatTimings,
  };
}

export interface PanchangKaalResult {
  gregorianDate: string;
  weekdayIndex: number;
  weekdayName: string;
  vikramSamvat: number;
  shakaSamvat: number;
  dayDurationMinutes: number;
  sliceMinutes: number;
  rahuKaal: string;
  yamaganda: string;
  gulikaKaal: string;
  abhijitMuhurat: string;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// 1-based slice index (1..8) per weekday Sun(0)..Sat(6)
const RAHU_SLICE = [8, 2, 7, 5, 6, 4, 3];
const YAMA_SLICE = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_SLICE = [7, 6, 5, 4, 3, 2, 1];

export function calculatePanchangWindows(dateIso: string, sunriseHhMm: string, sunsetHhMm: string): PanchangKaalResult {
  const parsed = parseIsoDate(dateIso);
  const weekdayIndex = parsed.getDay();
  const month = parsed.getMonth() + 1;
  const day = parsed.getDate();
  const gYear = parsed.getFullYear();

  // Chaitra Shukla typically transitions around late March / early April (~March 22)
  const afterChaitraNewYear = month > 3 || (month === 3 && day >= 22);
  const vikramSamvat = gYear + (afterChaitraNewYear ? 57 : 56);
  const shakaSamvat = gYear - (afterChaitraNewYear ? 78 : 79);

  const sunriseMin = parseTimeToMinutes(sunriseHhMm, 6 * 60 + 15);
  let sunsetMin = parseTimeToMinutes(sunsetHhMm, 18 * 60 + 5);
  if (sunsetMin <= sunriseMin) sunsetMin = sunriseMin + 12 * 60;

  const dayDurationMinutes = sunsetMin - sunriseMin;
  const sliceMinutes = round2(dayDurationMinutes / 8);

  const formatSlice = (slice1Based: number) => {
    const start = sunriseMin + (slice1Based - 1) * sliceMinutes;
    const end = start + sliceMinutes;
    return `${minutesToClock(start)} – ${minutesToClock(end)}`;
  };

  // Abhijit spans the 8th of 15 daytime Muhurtas around local solar noon
  const muhurtaLen = dayDurationMinutes / 15;
  const abhijitStart = sunriseMin + 7 * muhurtaLen;
  const abhijitEnd = abhijitStart + muhurtaLen;

  return {
    gregorianDate: dateIso,
    weekdayIndex,
    weekdayName: WEEKDAYS[weekdayIndex],
    vikramSamvat,
    shakaSamvat,
    dayDurationMinutes: Math.round(dayDurationMinutes),
    sliceMinutes,
    rahuKaal: formatSlice(RAHU_SLICE[weekdayIndex]),
    yamaganda: formatSlice(YAMA_SLICE[weekdayIndex]),
    gulikaKaal: formatSlice(GULIKA_SLICE[weekdayIndex]),
    abhijitMuhurat:
      weekdayIndex === 3
        ? `Avoided on Wednesday (Noon window: ${minutesToClock(abhijitStart)} – ${minutesToClock(abhijitEnd)})`
        : `${minutesToClock(abhijitStart)} – ${minutesToClock(abhijitEnd)}`,
  };
}

export interface ApiCapacityInput {
  peakRps: number;
  payloadKb: number;
  cacheHitPct: number;
  dbQueryMs: number;
  internalHops: number;
  protocol: 'grpc' | 'rest';
}

export interface ApiCapacityResult {
  effectiveDbRps: number;
  egressBandwidthMbps: number;
  estimatedP50Ms: number;
  estimatedP95Ms: number;
  recommendedReplicas: number;
  dailyRequestsMillions: number;
}

export function calculateApiCapacity(input: ApiCapacityInput): ApiCapacityResult {
  const rps = Math.max(1, Number(input.peakRps) || 1);
  const payloadKb = Math.max(1, Number(input.payloadKb) || 1);
  const cacheHitRatio = Math.max(0, Math.min(99, Number(input.cacheHitPct) || 0)) / 100;
  const dbQueryMs = Math.max(1, Number(input.dbQueryMs) || 1);
  const hops = Math.max(1, Math.min(10, Number(input.internalHops) || 1));

  const effectiveDbRps = round2(rps * (1 - cacheHitRatio));
  const payloadEfficiency = input.protocol === 'grpc' ? 0.62 : 1;
  const perHopOverhead = input.protocol === 'grpc' ? 1.8 : 4.5;

  const egressBandwidthMbps = round2((rps * payloadKb * payloadEfficiency * 8) / 1000);
  const cacheHitLatency = 2.5;
  const coldPathLatency = dbQueryMs * 1.15;
  const weightedDataMs = cacheHitRatio * cacheHitLatency + (1 - cacheHitRatio) * coldPathLatency;

  const estimatedP50Ms = round2(8 + hops * perHopOverhead + weightedDataMs);
  const estimatedP95Ms = round2(18 + hops * perHopOverhead * 1.9 + dbQueryMs * (1.25 + (1 - cacheHitRatio) * 0.9));

  // Assume ~280 comfortable RPS per .NET 10 container replica under typical JSON/gRPC load
  const perPodCapacity = input.protocol === 'grpc' ? 360 : 250;
  const recommendedReplicas = Math.max(2, Math.ceil((rps * 1.35) / perPodCapacity));
  const dailyRequestsMillions = round2((rps * 86400 * 0.45) / 1_000_000);

  return {
    effectiveDbRps,
    egressBandwidthMbps,
    estimatedP50Ms,
    estimatedP95Ms,
    recommendedReplicas,
    dailyRequestsMillions,
  };
}

function countWords(text: string): number {
  const trimmed = (text || '').trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function parseIsoDate(dateIso: string): Date {
  const parts = (dateIso || '').split('-').map(Number);
  if (parts.length === 3 && !parts.some(Number.isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date();
}

function parseTimeToMinutes(hhmm: string, fallback: number): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec((hhmm || '').trim());
  if (!match) return fallback;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return fallback;
  return h * 60 + m;
}

function minutesToClock(totalMins: number): string {
  const rounded = Math.round(totalMins) % (24 * 60);
  const hrs24 = Math.floor(rounded / 60);
  const mins = rounded % 60;
  const ampm = hrs24 >= 12 ? 'PM' : 'AM';
  const hrs12 = hrs24 % 12 === 0 ? 12 : hrs24 % 12;
  return `${String(hrs12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
}
