import type { EcosystemAppDetail } from '../data/apps.catalog';
import type { HubToolMeta } from '../data/creators-plans.catalog';
import type { EngineeringGuide } from '../data/guides.catalog';
import { SITE_ORIGIN, SOCIAL_IMAGE } from './seo-hub.service';

/** schema.org builders for rich results. Pure functions so they are unit-testable without a DOM. */

const PERSON_REF = { '@id': `${SITE_ORIGIN}/#person` };
const ORG_REF = { '@id': `${SITE_ORIGIN}/#org` };

function faqPage(url: string, faqs: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function appSchema(app: EcosystemAppDetail): Record<string, unknown>[] {
  const url = `${SITE_ORIGIN}/apps/${app.slug}`;
  const isMobile = app.slug === 'famsphere';
  const nodes: Record<string, unknown>[] = [
    {
      '@type': isMobile ? 'MobileApplication' : 'WebApplication',
      '@id': `${url}#app`,
      name: app.name,
      description: app.shortTagline,
      url: app.url.startsWith('http') ? app.url : url,
      applicationCategory: app.category === 'Engineering & Career' ? 'DeveloperApplication' : 'LifestyleApplication',
      operatingSystem: isMobile ? 'Android, iOS' : 'Any (web browser)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      author: PERSON_REF,
      publisher: ORG_REF,
      image: SOCIAL_IMAGE,
    },
  ];
  if (app.faqs.length) nodes.push(faqPage(url, app.faqs));
  return nodes;
}

export function toolSchema(tool: HubToolMeta): Record<string, unknown>[] {
  const url = `${SITE_ORIGIN}/tools/${tool.slug}`;
  const nodes: Record<string, unknown>[] = [
    {
      '@type': 'WebApplication',
      '@id': `${url}#tool`,
      name: tool.title,
      description: tool.shortDesc,
      url,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any (web browser)',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      author: PERSON_REF,
    },
  ];
  if (tool.faqs.length) nodes.push(faqPage(url, tool.faqs));
  return nodes;
}

export function guideSchema(guide: EngineeringGuide): Record<string, unknown>[] {
  const url = `${SITE_ORIGIN}/guides/${guide.slug}`;
  const words = [
    guide.title,
    guide.summary,
    ...guide.takeaways,
    ...guide.sections.flatMap((s) => [
      s.heading,
      ...s.paragraphs,
      ...(s.bullets ?? []),
      s.codeBlock?.caption ?? '',
      s.codeBlock?.code ?? '',
    ]),
    ...(guide.faqs ?? []).flatMap((f) => [f.question, f.answer]),
  ]
    .join(' ')
    .trim()
    .split(/\s+/).length;

  const nodes: Record<string, unknown>[] = [
    {
      '@type': 'TechArticle',
      '@id': `${url}#article`,
      headline: guide.title,
      description: guide.summary,
      articleSection: guide.category,
      datePublished: guide.publishedDate,
      dateModified: guide.updatedDate,
      timeRequired: `PT${guide.readMinutes}M`,
      wordCount: words,
      mainEntityOfPage: url,
      image: SOCIAL_IMAGE,
      inLanguage: 'en',
      author: { '@type': 'Person', name: 'Keshav Singh', url: `${SITE_ORIGIN}/about` },
      publisher: ORG_REF,
    },
  ];
  if (guide.faqs?.length) nodes.push(faqPage(url, guide.faqs));
  return nodes;
}
