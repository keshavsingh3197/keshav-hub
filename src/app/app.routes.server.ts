import { RenderMode, ServerRoute } from '@angular/ssr';
import { ECOSYSTEM_APPS } from './data/apps.catalog';
import { HUB_TOOLS } from './data/creators-plans.catalog';
import { ENGINEERING_GUIDES } from './data/guides.catalog';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'apps', renderMode: RenderMode.Prerender },
  {
    path: 'apps/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return ECOSYSTEM_APPS.map((a) => ({ slug: a.slug }));
    },
  },
  { path: 'tools', renderMode: RenderMode.Prerender },
  {
    path: 'tools/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return HUB_TOOLS.map((t) => ({ slug: t.slug }));
    },
  },
  { path: 'creators', renderMode: RenderMode.Prerender },
  { path: 'guides', renderMode: RenderMode.Prerender },
  {
    path: 'guides/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return ENGINEERING_GUIDES.map((g) => ({ slug: g.slug }));
    },
  },
  { path: 'plans', renderMode: RenderMode.Prerender },
  { path: 'roadmap', renderMode: RenderMode.Prerender },
  { path: 'interact', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'privacy-policy', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },
  { path: 'cookie-policy', renderMode: RenderMode.Prerender },
  { path: 'disclaimer', renderMode: RenderMode.Prerender },
  { path: 'sitemap', renderMode: RenderMode.Prerender },
  { path: '404', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
