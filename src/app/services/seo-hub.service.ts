import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface RouteSeoMeta {
  title: string;
  description: string;
  path: string;
  keywords?: string;
}

const SITE_ORIGIN = 'https://keshavsingh.in';

@Injectable({ providedIn: 'root' })
export class SeoHubService {
  constructor(
    private readonly titleService: Title,
    private readonly metaService: Meta,
    @Inject(DOCUMENT) private readonly doc: Document,
  ) {}

  update(meta: RouteSeoMeta): void {
    const cleanPath = meta.path.startsWith('/') ? meta.path : `/${meta.path}`;
    const canonicalUrl = `${SITE_ORIGIN}${cleanPath === '/' ? '/' : cleanPath}`;

    this.titleService.setTitle(meta.title);
    this.upsertName('description', meta.description);
    if (meta.keywords) this.upsertName('keywords', meta.keywords);

    this.upsertProperty('og:title', meta.title);
    this.upsertProperty('og:description', meta.description);
    this.upsertProperty('og:url', canonicalUrl);
    this.upsertName('twitter:title', meta.title);
    this.upsertName('twitter:description', meta.description);

    let canonical = this.doc.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = this.doc.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
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
