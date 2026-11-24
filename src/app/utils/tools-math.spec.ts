import { describe, expect, it } from 'vitest';
import {
  analyzeCronAndTokenSchedule,
  analyzeShortPacing,
  buildSeoAuditAndSchema,
  calculateApiCapacity,
  calculateFfmpegBitrate,
  calculatePanchangWindows,
  calculateVedicLunarLimbs,
  calculateYouTubeEarnings,
  todayIsoDate,
} from './tools-math';

describe('tools-math calculators', () => {
  it('computes YouTube long-form, Shorts, blended RPM and YPP progress cleanly', () => {
    const res = calculateYouTubeEarnings({
      monthlyLongViews: 20_000,
      monthlyShortsViews: 200_000,
      geoTier: 'mixed',
      nicheTier: 'tech-dev',
      monthlySponsorsUsd: 100,
      currentWatchHours: 2000,
      currentShorts90dViews: 2_500_000,
    });

    expect(res.calibratedLongRpmUsd).toBeGreaterThan(3);
    expect(res.longRevenueUsd).toBeGreaterThan(0);
    expect(res.shortsRevenueUsd).toBeGreaterThan(0);
    expect(res.totalCombinedUsd).toBeGreaterThan(res.totalAdSenseUsd);
    expect(res.yppLongProgressPct).toBe(50);
    expect(res.yppShortsProgressPct).toBe(25);
  });

  it('analyzes Short pacing, opening hook speed, and word counts accurately', () => {
    const pacing = analyzeShortPacing([
      { speaker: 'Dad', emotion: 'excited', dialogue: 'Look at this bill now', visualPrompt: 'living room' },
      { speaker: 'Son', emotion: 'surprised', dialogue: 'That was only one coffee', visualPrompt: 'closeup' },
    ]);

    expect(pacing.totalWords).toBe(10);
    expect(pacing.beatTimings.length).toBe(2);
    expect(pacing.hookStatus).toBe('Tight (< 3.5s)');
    expect(pacing.estimatedSeconds).toBeGreaterThan(3);
  });

  it('calculates Vikram Samvat, Shaka Samvat, and 8-slice daytime periods', () => {
    const wed = calculatePanchangWindows('2026-11-18', '06:46', '17:27');
    expect(wed.weekdayName).toBe('Wednesday');
    expect(wed.vikramSamvat).toBe(2083);
    expect(wed.shakaSamvat).toBe(1948);
    expect(wed.dayDurationMinutes).toBe(641);
    expect(wed.abhijitMuhurat).toContain('Avoided on Wednesday');
    expect(wed.rahuKaal).toContain('PM');
    expect(todayIsoDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('models API database read reduction via Redis caching and gRPC speedup', () => {
    const rest = calculateApiCapacity({
      peakRps: 1000,
      payloadKb: 20,
      cacheHitPct: 50,
      dbQueryMs: 25,
      internalHops: 4,
      protocol: 'rest',
    });
    const grpc = calculateApiCapacity({
      peakRps: 1000,
      payloadKb: 20,
      cacheHitPct: 90,
      dbQueryMs: 25,
      internalHops: 4,
      protocol: 'grpc',
    });

    expect(rest.effectiveDbRps).toBe(500);
    expect(grpc.effectiveDbRps).toBe(100);
    expect(grpc.estimatedP95Ms).toBeLessThan(rest.estimatedP95Ms);
    expect(grpc.recommendedReplicas).toBeLessThan(rest.recommendedReplicas);
  });

  it('computes FFmpeg bitrates, codec savings (AV1 < H.265 < H.264) and valid CLI commands', () => {
    const h264 = calculateFfmpegBitrate({
      resolution: 'shorts-1080p',
      fps: 30,
      codec: 'h264',
      motion: 'medium',
      audioKbps: 192,
      durationSeconds: 60,
      monthlyDeliveries: 1000,
    });
    const av1 = calculateFfmpegBitrate({
      resolution: 'shorts-1080p',
      fps: 30,
      codec: 'av1',
      motion: 'medium',
      audioKbps: 192,
      durationSeconds: 60,
      monthlyDeliveries: 1000,
    });

    expect(av1.videoKbps).toBeLessThan(h264.videoKbps);
    expect(h264.ffmpegCommand).toContain('-movflags +faststart');
    expect(h264.ffmpegCommand).toContain('-pix_fmt yuv420p');
  });

  it('computes Vedic Tithi, Paksha, Nakshatra Pada, Yoga and Karana from Sun-Moon longitudes', () => {
    const ekadashi = calculateVedicLunarLimbs(208.4, 334.4);
    expect(ekadashi.elongationDeg).toBe(126);
    expect(ekadashi.tithiNumber).toBe(11);
    expect(ekadashi.tithiName).toContain('Ekadashi');
    expect(ekadashi.paksha).toContain('Shukla');
    expect(ekadashi.nakshatraNumber).toBe(26);
    expect(ekadashi.nakshatraPada).toBe(1);
  });

  it('builds XSS-escaped JSON-LD and OpenGraph head tags with SERP length diagnostics', () => {
    const res = buildSeoAuditAndSchema({
      kind: 'TechArticle',
      title: 'Federated OAuth2 & Passkey SSO Across .NET 10 Subdomain Apps',
      description:
        'A complete production guide to WebAuthn passkeys, dynamic CORS origin validation, and HttpOnly refresh token rotation in .NET 10.',
      canonicalUrl: 'https://keshavsingh.in/guides/federated-sso-dotnet-angular-architecture',
      authorName: 'Keshav </script> Singh',
      publishedIso: '2026-11-24',
      faqQuestion: '',
      faqAnswer: '',
    });

    expect(res.canonicalValid).toBe(true);
    expect(res.titleStatus).toContain('Optimal');
    expect(res.descStatus).toContain('Optimal');
    expect(res.htmlHeadSnippet).not.toContain('Keshav </script>');
    expect(res.htmlHeadSnippet).toContain('\\u003c/script\\u003e');
  });

  it('translates UTC 5-field cron schedules into Asia/Kolkata IST (+05:30) and audits JWT TTLs', () => {
    const res = analyzeCronAndTokenSchedule({
      cronExpression: '15 0 * * *',
      epochSeconds: 1795478400,
      accessTtlMinutes: 15,
      refreshTtlDays: 14,
    });

    expect(res.validCron).toBe(true);
    expect(res.cronSummaryUtc).toContain('00:15 UTC');
    expect(res.cronSummaryIst).toContain('05:45 AM IST');
    expect(res.tokenPosture).toContain('Hardened');
  });
});
