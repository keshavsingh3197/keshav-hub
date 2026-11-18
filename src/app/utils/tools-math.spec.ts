import { describe, expect, it } from 'vitest';
import {
  analyzeShortPacing,
  calculateApiCapacity,
  calculatePanchangWindows,
  calculateYouTubeEarnings,
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
    // 2026-11-18 is a Wednesday (weekdayIndex 3)
    const wed = calculatePanchangWindows('2026-11-18', '06:46', '17:27');
    expect(wed.weekdayName).toBe('Wednesday');
    expect(wed.vikramSamvat).toBe(2083);
    expect(wed.shakaSamvat).toBe(1948);
    expect(wed.dayDurationMinutes).toBe(641);
    expect(wed.abhijitMuhurat).toContain('Avoided on Wednesday');
    expect(wed.rahuKaal).toContain('PM');
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
});
