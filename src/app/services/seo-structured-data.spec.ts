import { describe, expect, it } from 'vitest';
import enJson from '../../assets/i18n/en.json';
import hiJson from '../../assets/i18n/hi.json';
import { ECOSYSTEM_APPS } from '../data/apps.catalog';
import { CREATOR_CHANNELS, HUB_TOOLS } from '../data/creators-plans.catalog';
import { ENGINEERING_GUIDES } from '../data/guides.catalog';
import { APP_VISUALS, CHANNEL_VISUALS, GUIDE_CATEGORY_VISUALS, TOOL_VISUALS } from '../data/visuals';
import { isValidContact } from '../pages/contact-about/about-contact.page';
import { buildBreadcrumbs, serializeJsonLd, toAbsoluteUrl } from './seo-hub.service';
import { appSchema, guideSchema, toolSchema } from './structured-data';

function leafKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? leafKeys(v as Record<string, unknown>, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe('SEO helpers', () => {
  it('escapes characters that could break out of an inline JSON-LD script', () => {
    const out = serializeJsonLd({ name: '</script><script>alert(1)</script> & co' });
    expect(out).not.toContain('<');
    expect(out).not.toContain('>');
    expect(JSON.parse(out).name).toBe('</script><script>alert(1)</script> & co');
  });

  it('builds absolute canonical URLs without query or hash', () => {
    expect(toAbsoluteUrl('/')).toBe('https://keshavsingh.in/');
    expect(toAbsoluteUrl('tools?x=1#a')).toBe('https://keshavsingh.in/tools');
  });

  it('builds breadcrumbs from the path with a readable leaf', () => {
    const crumbs = buildBreadcrumbs('/apps/animstudio', 'AnimStudio AI');
    expect(crumbs.map((c) => c.name)).toEqual(['Home', 'Apps', 'AnimStudio AI']);
    expect(crumbs[2].url).toBe('https://keshavsingh.in/apps/animstudio');
    expect(buildBreadcrumbs('/', 'Home')).toHaveLength(1);
  });
});

describe('structured data builders', () => {
  it('emits an application node plus FAQPage for every app with FAQs', () => {
    for (const app of ECOSYSTEM_APPS) {
      const nodes = appSchema(app);
      expect(['WebApplication', 'MobileApplication']).toContain(nodes[0]['@type']);
      expect(nodes.some((n) => n['@type'] === 'FAQPage')).toBe(app.faqs.length > 0);
    }
  });

  it('emits a free WebApplication for every tool', () => {
    for (const tool of HUB_TOOLS) {
      const [node] = toolSchema(tool);
      expect(node['@type']).toBe('WebApplication');
      expect(node['isAccessibleForFree']).toBe(true);
    }
  });

  it('emits a TechArticle with ISO dates for every guide', () => {
    for (const guide of ENGINEERING_GUIDES) {
      const [node] = guideSchema(guide);
      expect(node['@type']).toBe('TechArticle');
      expect(String(node['datePublished'])).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(String(node['dateModified'])).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe('visual identity coverage', () => {
  it('gives every app, tool, channel and guide category its own icon', () => {
    for (const a of ECOSYSTEM_APPS) expect(APP_VISUALS[a.slug], a.slug).toBeDefined();
    for (const t of HUB_TOOLS) expect(TOOL_VISUALS[t.slug], t.slug).toBeDefined();
    for (const c of CREATOR_CHANNELS) expect(CHANNEL_VISUALS[c.key], c.key).toBeDefined();
    for (const g of ENGINEERING_GUIDES) expect(GUIDE_CATEGORY_VISUALS[g.category], g.category).toBeDefined();
  });
});

describe('contact form pre-validation', () => {
  it('accepts a complete message and rejects incomplete or oversized input', () => {
    expect(isValidContact('Aarav', 'aarav@example.com', 'Hello, I would like to collaborate.')).toBe(true);
    expect(isValidContact('', 'aarav@example.com', 'Hello there, long enough')).toBe(false);
    expect(isValidContact('Aarav', 'not-an-email', 'Hello there, long enough')).toBe(false);
    expect(isValidContact('Aarav', 'aarav@example.com', 'short')).toBe(false);
    expect(isValidContact('A'.repeat(81), 'aarav@example.com', 'Hello there, long enough')).toBe(false);
    expect(isValidContact('Aarav', 'aarav@example.com', 'x'.repeat(4001))).toBe(false);
  });
});

describe('i18n bundles', () => {
  it('defines every new UI key in both English and Hindi', () => {
    const sections = ['nav', 'footer', 'consent', 'home', 'contact'];
    const en = leafKeys(enJson as Record<string, unknown>).filter((k) => sections.includes(k.split('.')[0]));
    const hi = new Set(leafKeys(hiJson as Record<string, unknown>));
    const missing = en.filter((k) => !hi.has(k));
    expect(missing).toEqual([]);
  });
});
