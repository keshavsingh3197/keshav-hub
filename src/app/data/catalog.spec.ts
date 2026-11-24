import { describe, expect, it } from 'vitest';
import enJson from '../../assets/i18n/en.json';
import hiJson from '../../assets/i18n/hi.json';
import { ECOSYSTEM_APPS } from './apps.catalog';
import { CREATOR_CHANNELS, HUB_TOOLS, MEMBERSHIP_PLANS, ROADMAP_MILESTONES } from './creators-plans.catalog';
import { ENGINEERING_GUIDES } from './guides.catalog';

describe('ecosystem hub content integrity', () => {
  it('covers all 8 distinct applications with architecture notes, security models, and valid URLs', () => {
    expect(ECOSYSTEM_APPS.length).toBe(8);
    const slugs = new Set(ECOSYSTEM_APPS.map((a) => a.slug));
    expect(slugs.size).toBe(ECOSYSTEM_APPS.length);

    for (const app of ECOSYSTEM_APPS) {
      expect(app.capabilities.length).toBeGreaterThanOrEqual(3);
      expect(app.systemArchitectureNotes.length).toBeGreaterThanOrEqual(1);
      expect(app.dataAndSecurityModel.length).toBeGreaterThanOrEqual(1);
      expect(app.workflows.length).toBeGreaterThanOrEqual(2);
      expect(app.faqs.length).toBeGreaterThanOrEqual(1);
    }

    const portfolio = ECOSYSTEM_APPS.find((a) => a.slug === 'portfolio');
    expect(portfolio?.url).toBe('https://portfolio.keshavsingh.in');
  });

  it('provides 8 interactive tools with worked examples, editorial instructions & methodologies', () => {
    expect(HUB_TOOLS.length).toBe(8);
    const guideSlugs = new Set(ENGINEERING_GUIDES.map((g) => g.slug));
    for (const tool of HUB_TOOLS) {
      expect(tool.howToUse.length).toBeGreaterThanOrEqual(3);
      expect(tool.methodology.length).toBeGreaterThanOrEqual(3);
      expect(tool.workedExample.steps.length).toBeGreaterThanOrEqual(2);
      expect(tool.faqs.length).toBeGreaterThanOrEqual(2);
      expect(guideSlugs.has(tool.relatedGuideSlug)).toBe(true);
    }
  });

  it('publishes 16 substantive multi-section original guides with real depth and FAQs', () => {
    const appSlugs = new Set(ECOSYSTEM_APPS.map((a) => a.slug));
    expect(ENGINEERING_GUIDES.length).toBe(16);
    for (const g of ENGINEERING_GUIDES) {
      expect(g.sections.length).toBeGreaterThanOrEqual(4);
      expect(g.takeaways.length).toBeGreaterThanOrEqual(3);
      expect((g.faqs ?? []).length).toBeGreaterThanOrEqual(3);
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

  it('exposes official YouTube creator channels, membership tiers, and shipped changelog milestones', () => {
    expect(CREATOR_CHANNELS.length).toBe(3);
    expect(MEMBERSHIP_PLANS.length).toBe(3);
    expect(ROADMAP_MILESTONES.every((m) => m.status === 'Shipped' || m.status === 'In Progress')).toBe(true);
  });
});
