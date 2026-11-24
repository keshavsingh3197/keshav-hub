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
const RAHU_SLICE = [8, 2, 7, 5, 6, 4, 3];
const YAMA_SLICE = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_SLICE = [7, 6, 5, 4, 3, 2, 1];

export function calculatePanchangWindows(dateIso: string, sunriseHhMm: string, sunsetHhMm: string): PanchangKaalResult {
  const parsed = parseIsoDate(dateIso);
  const weekdayIndex = parsed.getDay();
  const month = parsed.getMonth() + 1;
  const day = parsed.getDate();
  const gYear = parsed.getFullYear();

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

// Tool 5: FFmpeg Video Bitrate, CRF & Cloud Storage Estimator
export type VideoPresetRes = 'shorts-1080p' | 'fhd-1080p' | 'qhd-1440p' | 'uhd-4k';
export type VideoCodecChoice = 'h264' | 'h265' | 'av1';
export type MotionProfile = 'low' | 'medium' | 'high';

export interface FfmpegBitrateInput {
  resolution: VideoPresetRes;
  fps: number;
  codec: VideoCodecChoice;
  motion: MotionProfile;
  audioKbps: number;
  durationSeconds: number;
  monthlyDeliveries: number;
}

export interface FfmpegBitrateResult {
  width: number;
  height: number;
  videoKbps: number;
  totalMbps: number;
  recommendedCrf: number;
  fileSizeMb: number;
  hourlyStorageGb: number;
  monthlyCdnGb: number;
  ffmpegCommand: string;
}

const RES_DIMS: Record<VideoPresetRes, { w: number; h: number }> = {
  'shorts-1080p': { w: 1080, h: 1920 },
  'fhd-1080p': { w: 1920, h: 1080 },
  'qhd-1440p': { w: 2560, h: 1440 },
  'uhd-4k': { w: 3840, h: 2160 },
};

const MOTION_BPP: Record<MotionProfile, number> = {
  low: 0.065,
  medium: 0.105,
  high: 0.155,
};

const CODEC_FACTOR: Record<VideoCodecChoice, { eff: number; crfBase: number; encoder: string; ext: string }> = {
  h264: { eff: 1.0, crfBase: 20, encoder: 'libx264 -preset slow -profile:v high', ext: 'mp4' },
  h265: { eff: 0.64, crfBase: 24, encoder: 'libx265 -preset medium -tag:v hvc1', ext: 'mp4' },
  av1: { eff: 0.48, crfBase: 28, encoder: 'libsvtav1 -preset 6', ext: 'mp4' },
};

export function calculateFfmpegBitrate(input: FfmpegBitrateInput): FfmpegBitrateResult {
  const dims = RES_DIMS[input.resolution] ?? RES_DIMS['fhd-1080p'];
  const fps = Math.max(15, Math.min(120, Number(input.fps) || 30));
  const audioKbps = Math.max(64, Math.min(512, Number(input.audioKbps) || 192));
  const durationSeconds = Math.max(1, Number(input.durationSeconds) || 60);
  const deliveries = Math.max(0, Number(input.monthlyDeliveries) || 0);

  const bpp = MOTION_BPP[input.motion] ?? MOTION_BPP.medium;
  const codec = CODEC_FACTOR[input.codec] ?? CODEC_FACTOR.h264;

  // Frame scaling sub-linear above 30fps since inter-frame temporal prediction improves at 60fps
  const effectiveFps = fps <= 30 ? fps : 30 + (fps - 30) * 0.65;
  const rawBitsPerSec = dims.w * dims.h * effectiveFps * bpp * codec.eff;
  const videoKbps = Math.max(600, Math.round(rawBitsPerSec / 1000));
  const totalKbps = videoKbps + audioKbps;
  const totalMbps = round2(totalKbps / 1000);

  const recommendedCrf = codec.crfBase + (input.motion === 'low' ? 2 : input.motion === 'high' ? -2 : 0);
  const fileSizeMb = round2((totalKbps * durationSeconds) / 8 / 1024);
  const hourlyStorageGb = round2(((totalKbps * 3600) / 8) / (1024 * 1024));
  const monthlyCdnGb = round2((fileSizeMb * deliveries) / 1024);

  const maxRateK = Math.round(videoKbps * 1.25);
  const bufSizeK = maxRateK * 2;
  const ffmpegCommand =
    `ffmpeg -i input.mp4 -vf "scale=${dims.w}:${dims.h}:flags=lanczos,fps=${fps}" ` +
    `-c:v ${codec.encoder} -crf ${recommendedCrf} -maxrate ${maxRateK}k -bufsize ${bufSizeK}k ` +
    `-pix_fmt yuv420p -c:a aac -b:a ${audioKbps}k -movflags +faststart output.${codec.ext}`;

  return {
    width: dims.w,
    height: dims.h,
    videoKbps,
    totalMbps,
    recommendedCrf,
    fileSizeMb,
    hourlyStorageGb,
    monthlyCdnGb,
    ffmpegCommand,
  };
}

// Tool 6: Vedic Tithi, Paksha, Nakshatra, Yoga & Karana Astronomical Limb Explorer
export interface VedicLunarLimbResult {
  elongationDeg: number;
  paksha: 'Shukla Paksha (Waxing)' | 'Krishna Paksha (Waning)';
  tithiNumber: number;
  tithiName: string;
  tithiElapsedPct: number;
  degreesToNextTithi: number;
  nakshatraNumber: number;
  nakshatraName: string;
  nakshatraPada: number;
  yogaNumber: number;
  yogaName: string;
  karanaName: string;
}

const TITHI_NAMES_15 = [
  'Pratipada',
  'Dwitiya',
  'Tritiya',
  'Chaturthi',
  'Panchami',
  'Shashthi',
  'Saptami',
  'Ashtami',
  'Navami',
  'Dashami',
  'Ekadashi',
  'Dwadashi',
  'Trayodashi',
  'Chaturdashi',
];

const NAKSHATRA_NAMES_27 = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const YOGA_NAMES_27 = [
  'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula',
  'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
  'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
];

const MOVABLE_KARANAS_7 = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)'];

export function calculateVedicLunarLimbs(sunLongitudeDeg: number, moonLongitudeDeg: number): VedicLunarLimbResult {
  const sun = normalizeDeg(sunLongitudeDeg);
  const moon = normalizeDeg(moonLongitudeDeg);
  const elongationDeg = round2(normalizeDeg(moon - sun));

  const rawTithiFloat = elongationDeg / 12;
  const tithiZeroIdx = Math.min(29, Math.floor(rawTithiFloat));
  const tithiNumber = tithiZeroIdx + 1;
  const paksha = tithiNumber <= 15 ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)';

  let tithiName: string;
  if (tithiNumber === 15) tithiName = 'Purnima (Full Moon)';
  else if (tithiNumber === 30) tithiName = 'Amavasya (New Moon)';
  else tithiName = `${tithiNumber <= 15 ? 'Shukla' : 'Krishna'} ${TITHI_NAMES_15[(tithiNumber - 1) % 15]}`;

  const withinTithiDeg = elongationDeg - tithiZeroIdx * 12;
  const tithiElapsedPct = round2((withinTithiDeg / 12) * 100);
  const degreesToNextTithi = round2(12 - withinTithiDeg);

  const nakSpan = 360 / 27; // 13.3333... deg
  const nakIdx = Math.min(26, Math.floor(moon / nakSpan));
  const withinNak = moon - nakIdx * nakSpan;
  const nakshatraPada = Math.min(4, Math.floor(withinNak / (nakSpan / 4)) + 1);

  const sumDeg = normalizeDeg(moon + sun);
  const yogaIdx = Math.min(26, Math.floor(sumDeg / nakSpan));

  // 60 half-tithis (each 6 deg)
  const karanaHalfIdx = Math.min(59, Math.floor(elongationDeg / 6));
  let karanaName: string;
  if (karanaHalfIdx === 0) karanaName = 'Kimstughna';
  else if (karanaHalfIdx === 57) karanaName = 'Shakuni';
  else if (karanaHalfIdx === 58) karanaName = 'Chatushpada';
  else if (karanaHalfIdx === 59) karanaName = 'Naga';
  else karanaName = MOVABLE_KARANAS_7[(karanaHalfIdx - 1) % 7];

  return {
    elongationDeg,
    paksha,
    tithiNumber,
    tithiName,
    tithiElapsedPct,
    degreesToNextTithi,
    nakshatraNumber: nakIdx + 1,
    nakshatraName: NAKSHATRA_NAMES_27[nakIdx],
    nakshatraPada,
    yogaNumber: yogaIdx + 1,
    yogaName: YOGA_NAMES_27[yogaIdx],
    karanaName,
  };
}

// Tool 7: JSON-LD Structured Data & OpenGraph Snippet Generator
export type SchemaTemplateKind = 'TechArticle' | 'SoftwareApplication' | 'FAQPage';

export interface SeoSchemaGeneratorInput {
  kind: SchemaTemplateKind;
  title: string;
  description: string;
  canonicalUrl: string;
  authorName: string;
  publishedIso: string;
  faqQuestion: string;
  faqAnswer: string;
}

export interface SeoSchemaGeneratorResult {
  titleLength: number;
  titleStatus: 'Optimal (45–65 chars)' | 'Too Short (< 45)' | 'Truncates in SERP (> 65)';
  descLength: number;
  descStatus: 'Optimal (110–160 chars)' | 'Too Short (< 110)' | 'Truncates in SERP (> 160)';
  canonicalValid: boolean;
  htmlHeadSnippet: string;
}

export function buildSeoAuditAndSchema(input: SeoSchemaGeneratorInput): SeoSchemaGeneratorResult {
  const title = (input.title || '').trim();
  const desc = (input.description || '').trim();
  const url = (input.canonicalUrl || '').trim();
  const author = (input.authorName || 'Keshav Singh').trim();
  const dateIso = /^\d{4}-\d{2}-\d{2}$/.test((input.publishedIso || '').trim())
    ? input.publishedIso.trim()
    : todayIsoDate();

  const titleLength = title.length;
  const titleStatus: SeoSchemaGeneratorResult['titleStatus'] =
    titleLength < 45 ? 'Too Short (< 45)' : titleLength > 65 ? 'Truncates in SERP (> 65)' : 'Optimal (45–65 chars)';

  const descLength = desc.length;
  const descStatus: SeoSchemaGeneratorResult['descStatus'] =
    descLength < 110 ? 'Too Short (< 110)' : descLength > 160 ? 'Truncates in SERP (> 160)' : 'Optimal (110–160 chars)';

  const canonicalValid = /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/[^\s?#]*)?$/i.test(url);

  let schemaObj: Record<string, unknown>;
  if (input.kind === 'SoftwareApplication') {
    schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title,
      description: desc,
      url,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any (web browser)',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      author: { '@type': 'Person', name: author },
    };
  } else if (input.kind === 'FAQPage') {
    schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: (input.faqQuestion || 'How does this work?').trim(),
          acceptedAnswer: {
            '@type': 'Answer',
            text: (input.faqAnswer || desc).trim(),
          },
        },
      ],
    };
  } else {
    schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: title,
      description: desc,
      datePublished: dateIso,
      dateModified: dateIso,
      mainEntityOfPage: url,
      author: { '@type': 'Person', name: author },
    };
  }

  const safeJson = JSON.stringify(schemaObj, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  const escAttr = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const ogType = input.kind === 'TechArticle' ? 'article' : 'website';

  const htmlHeadSnippet = [
    `<title>${escAttr(title)}</title>`,
    `<meta name="description" content="${escAttr(desc)}">`,
    `<link rel="canonical" href="${escAttr(url)}">`,
    `<meta property="og:type" content="${ogType}">`,
    `<meta property="og:title" content="${escAttr(title)}">`,
    `<meta property="og:description" content="${escAttr(desc)}">`,
    `<meta property="og:url" content="${escAttr(url)}">`,
    `<script type="application/ld+json">\n${safeJson}\n</script>`,
  ].join('\n');

  return {
    titleLength,
    titleStatus,
    descLength,
    descStatus,
    canonicalValid,
    htmlHeadSnippet,
  };
}

// Tool 8: Cron Schedule, Epoch Timestamp & JWT TTL Security Planner
export interface CronTokenAuditInput {
  cronExpression: string;
  epochSeconds: number;
  accessTtlMinutes: number;
  refreshTtlDays: number;
}

export interface CronTokenAuditResult {
  validCron: boolean;
  cronSummaryUtc: string;
  cronSummaryIst: string;
  utcIso: string;
  istFormatted: string;
  rotationsPerSession: number;
  tokenPosture: 'Hardened (<= 15m access)' | 'Balanced (16m–60m access)' | 'Wide Exposure (> 60m access)';
}

export function analyzeCronAndTokenSchedule(input: CronTokenAuditInput): CronTokenAuditResult {
  const parts = (input.cronExpression || '').trim().split(/\s+/);
  let validCron = parts.length === 5;
  let cronSummaryUtc = 'Invalid 5-field cron (expected: min hour dom month dow)';
  let cronSummaryIst = 'Fix the 5 cron fields to compute IST (+05:30) wall-clock offset';

  if (validCron) {
    const [minField, hourField, domField, monField, dowField] = parts;
    const fieldValid = [minField, hourField, domField, monField, dowField].every((f) => /^[0-9*,/-]+$/.test(f));
    validCron = fieldValid;
    if (fieldValid) {
      const dowLabel = dowField === '*' ? 'every day' : dowField === '1-5' ? 'weekdays (Mon–Fri)' : `day-of-week ${dowField}`;
      const domLabel = domField === '*' ? '' : ` on day ${domField}`;
      const monLabel = monField === '*' ? '' : ` in month ${monField}`;

      if (/^\d+$/.test(minField) && /^\d+$/.test(hourField)) {
        const utcM = Number(minField);
        const utcH = Number(hourField);
        if (utcM <= 59 && utcH <= 23) {
          const totalIst = (utcH * 60 + utcM + 330) % 1440;
          const dayShift = utcH * 60 + utcM + 330 >= 1440 ? ' (+1d)' : '';
          cronSummaryUtc = `Runs at ${pad2(utcH)}:${pad2(utcM)} UTC ${dowLabel}${domLabel}${monLabel}`;
          cronSummaryIst = `Runs at ${minutesToClock(totalIst)} IST${dayShift} ${dowLabel}${domLabel}${monLabel}`;
        } else {
          validCron = false;
        }
      } else if (minField.startsWith('*/') && hourField === '*') {
        const step = minField.slice(2);
        cronSummaryUtc = `Runs every ${step} minutes around the clock (${dowLabel})`;
        cronSummaryIst = `Same ${step}-minute cadence in IST (UTC+05:30)`;
      } else {
        cronSummaryUtc = `Schedule [m:${minField} h:${hourField} dom:${domField} mon:${monField} dow:${dowField}] UTC`;
        cronSummaryIst = `Offset +05h 30m ahead of UTC for Asia/Kolkata wall clock`;
      }
    }
  }

  const safeEpoch = Math.max(0, Math.floor(Number(input.epochSeconds) || 0));
  const dUtc = new Date(safeEpoch * 1000);
  const utcIso = dUtc.toISOString();
  const dIst = new Date((safeEpoch + 19800) * 1000);
  const istFormatted = dIst.toISOString().replace('T', ' ').slice(0, 19) + ' IST (+05:30)';

  const accessMin = Math.max(1, Number(input.accessTtlMinutes) || 15);
  const refreshDays = Math.max(1, Number(input.refreshTtlDays) || 14);
  const rotationsPerSession = Math.max(1, Math.round((refreshDays * 1440) / accessMin));

  const tokenPosture: CronTokenAuditResult['tokenPosture'] =
    accessMin <= 15
      ? 'Hardened (<= 15m access)'
      : accessMin <= 60
        ? 'Balanced (16m–60m access)'
        : 'Wide Exposure (> 60m access)';

  return {
    validCron,
    cronSummaryUtc,
    cronSummaryIst,
    utcIso,
    istFormatted,
    rotationsPerSession,
    tokenPosture,
  };
}

export function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = pad2(now.getMonth() + 1);
  const d = pad2(now.getDate());
  return `${y}-${m}-${d}`;
}

function normalizeDeg(deg: number): number {
  const n = Number(deg) || 0;
  return ((n % 360) + 360) % 360;
}

function pad2(n: number): string {
  return String(Math.floor(n)).padStart(2, '0');
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
