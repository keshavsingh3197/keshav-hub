import { describe, expect, it } from 'vitest';
import enJson from '../../assets/i18n/en.json';
import hiJson from '../../assets/i18n/hi.json';
import { ECOSYSTEM_APPS } from './apps.catalog';
import { CREATOR_CHANNELS, HUB_TOOLS, MEMBERSHIP_PLANS } from './creators-plans.catalog';
import { ENGINEERING_GUIDES } from './guides.catalog';

describe('ecosystem hub content integrity', () => {
  it('covers all 8 distinct applications with unique slugs and valid URLs', () => {
    expect(ECOSYSTEM_APPS.length).toBe(8);
    const slugs = new Set(ECOSYSTEM_APPS.map((a) => a.slug));
    expect(slugs.size).toBe(ECOSYSTEM_APPS.length);

    for (const app of ECOSYSTEM_APPS) {
      expect(app.capabilities.length).toBeGreaterThanOrEqual(3);
      expect(app.workflows.length).toBeGreaterThanOrEqual(2);
      expect(app.faqs.length).toBeGreaterThanOrEqual(1);
    }

    const portfolio = ECOSYSTEM_APPS.find((a) => a.slug === 'portfolio');
    expect(portfolio?.url).toBe('https://portfolio.keshavsingh.in');
  });

  it('provides 4 interactive tools with complete editorial instructions & methodologies', () => {
    expect(HUB_TOOLS.length).toBe(4);
    for (const tool of HUB_TOOLS) {
      expect(tool.howToUse.length).toBeGreaterThanOrEqual(3);
      expect(tool.methodology.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('publishes substantive multi-section original guides referencing real apps', () => {
    const appSlugs = new Set(ECOSYSTEM_APPS.map((a) => a.slug));
    expect(ENGINEERING_GUIDES.length).toBeGreaterThanOrEqual(8);
    for (const g of ENGINEERING_GUIDES) {
      expect(g.sections.length).toBeGreaterThanOrEqual(2);
      expect(g.takeaways.length).toBeGreaterThanOrEqual(3);
      expect(appSlugs.has(g.relatedAppSlug)).toBe(true);
    }
  });

  it('keeps English and Hindi i18n JSON files synchronized for all keys', () => {
    function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
      return Object.entries(obj).flatMap(([k, v]) => {
        const key = prefix ? `${prefix}.${k}` : k;
        return v && typeof v === 'object' ? flattenKeys(v as Record<string, unknown>, key) : [key];
      });
    }
    const enKeys = flattenKeys(enJson as Record<string, unknown>).sort();
    const hiKeys = flattenKeys(hiJson as Record<string, unknown>).sort();
    expect(hiKeys).toEqual(enKeys);
  });

  it('exposes official YouTube creator channels and membership tiers', () => {
    expect(CREATOR_CHANNELS.length).toBe(3);
    expect(MEMBERSHIP_PLANS.length).toBe(3);
  });
});
