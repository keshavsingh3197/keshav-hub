import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface RouteSeoMeta {
  title: string;
  description: string;
  path: string;
  canonicalPath?: string;
  keywords?: string;
  /** Exclude the page from search indexes (404, utility pages). */
  noindex?: boolean;
  /** `og:type`; defaults to `website`. Guides use `article`. */
  ogType?: 'website' | 'article';
  /** Short label for the final breadcrumb; defaults to the title before the first `|` or `—`. */
  crumbName?: string;
  /** Extra schema.org nodes (Article, SoftwareApplication, FAQPage…) merged into the route graph. */
  schema?: Record<string, unknown>[];
}

export const SITE_ORIGIN = 'https://keshavsingh.in';
export const SOCIAL_IMAGE = `${SITE_ORIGIN}/assets/k.png`;
const ROUTE_LD_ID = 'route-structured-data';

const SEGMENT_LABELS: Record<string, string> = {
  apps: 'Apps',
  tools: 'Tools',
  guides: 'Guides',
  creators: 'Creators',
  plans: 'Plans',
  roadmap: 'Roadmap',
  interact: 'Interact',
  about: 'About',
  contact: 'Contact',
  security: 'Security',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms',
  'cookie-policy': 'Cookie Policy',
  disclaimer: 'Disclaimer',
  'data-deletion': 'Data Deletion',
  sitemap: 'Sitemap',
};

@Injectable({ providedIn: 'root' })
export class SeoHubService {
  constructor(
    private readonly titleService: Title,
    private readonly metaService: Meta,
    @Inject(DOCUMENT) private readonly doc: Document,
  ) {}

  update(meta: RouteSeoMeta): void {
    const canonicalUrl = toAbsoluteUrl(meta.canonicalPath || meta.path);

    this.titleService.setTitle(meta.title);
    this.upsertName('description', meta.description);
    if (meta.keywords) this.upsertName('keywords', meta.keywords);
    this.upsertName('robots', meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');

    this.upsertProperty('og:type', meta.ogType ?? 'website');
    this.upsertProperty('og:title', meta.title);
    this.upsertProperty('og:description', meta.description);
    this.upsertProperty('og:url', canonicalUrl);
    this.upsertProperty('og:image', SOCIAL_IMAGE);
    this.upsertProperty('og:image:alt', 'keshavsingh.in logo');
    this.upsertName('twitter:card', 'summary');
    this.upsertName('twitter:title', meta.title);
    this.upsertName('twitter:description', meta.description);
    this.upsertName('twitter:image', SOCIAL_IMAGE);

    let canonical = this.doc.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = this.doc.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    this.writeStructuredData(meta, canonicalUrl);
  }

  private writeStructuredData(meta: RouteSeoMeta, canonicalUrl: string): void {
    const graph: Record<string, unknown>[] = [];
    if (!meta.noindex) {
      const crumbs = buildBreadcrumbs(meta.canonicalPath || meta.path, meta.crumbName ?? shortTitle(meta.title));
      if (crumbs.length > 1) {
        graph.push({
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
        });
      }
      graph.push(...(meta.schema ?? []));
    }

    let script = this.doc.getElementById(ROUTE_LD_ID);
    if (!graph.length) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('id', ROUTE_LD_ID);
      this.doc.head.appendChild(script);
    }
    script.textContent = serializeJsonLd({ '@context': 'https://schema.org', '@graph': graph });
  }

  private upsertName(name: string, content: string): void {
    const tag = this.metaService.getTag(`name='${name}'`);
    if (tag) this.metaService.updateTag({ name, content });
    else this.metaService.addTag({ name, content });
  }

  private upsertProperty(property: string, content: string): void {
    const tag = this.metaService.getTag(`property='${property}'`);
    if (tag) this.metaService.updateTag({ property, content });
    else this.metaService.addTag({ property, content });
  }
}

export function toAbsoluteUrl(path: string): string {
  const clean = path.split(/[?#]/)[0] || '/';
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  return `${SITE_ORIGIN}${withSlash}`;
}

/**
 * JSON for an inline `<script type="application/ld+json">`. `<`, `>` and `&` are escaped as unicode
 * so content can never close the script element early, whatever the catalog strings contain.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

export function buildBreadcrumbs(path: string, leafName: string): { name: string; url: string }[] {
  const segments = (path.split(/[?#]/)[0] || '/').split('/').filter(Boolean);
  const crumbs = [{ name: 'Home', url: `${SITE_ORIGIN}/` }];
  segments.forEach((seg, i) => {
    const isLeaf = i === segments.length - 1;
    crumbs.push({
      name: isLeaf ? leafName : SEGMENT_LABELS[seg] ?? seg,
      url: `${SITE_ORIGIN}/${segments.slice(0, i + 1).join('/')}`,
    });
  });
  return crumbs;
}

function shortTitle(title: string): string {
  return title.split(/\s[|—]\s/)[0].trim();
}
