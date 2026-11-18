#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const BASE_URL = (process.env.SITEMAP_BASE_URL || 'https://keshavsingh.in').replace(/\/$/, '');

function extractSlugs(relPath) {
  const src = readFileSync(resolve(root, relPath), 'utf-8');
  return Array.from(src.matchAll(/slug:\s*'([^']+)'/g)).map((m) => m[1]);
}

const staticRoutes = [
  '',
  'apps',
  'tools',
  'creators',
  'guides',
  'plans',
  'roadmap',
  'interact',
  'about',
  'contact',
  'privacy-policy',
  'terms',
  'cookie-policy',
  'disclaimer',
  'sitemap',
];

const dynamicRoutes = [
  ...extractSlugs('src/app/data/apps.catalog.ts').map((s) => `apps/${s}`),
  ...extractSlugs('src/app/data/creators-plans.catalog.ts').map((s) => `tools/${s}`),
  ...extractSlugs('src/app/data/guides.catalog.ts').map((s) => `guides/${s}`),
];

const allPaths = Array.from(new Set([...staticRoutes, ...dynamicRoutes]));
const today = new Date().toISOString().split('T')[0];

function priorityFor(path) {
  if (path === '') return '1.0';
  if (path.startsWith('tools') || path.startsWith('guides') || path.startsWith('apps')) return '0.9';
  if (['creators', 'plans', 'roadmap', 'interact', 'about', 'contact'].includes(path)) return '0.8';
  return '0.4';
}

const xmlEntries = allPaths
  .map((p) => {
    const loc = p ? `${BASE_URL}/${p}` : `${BASE_URL}/`;
    const freq = p === '' || p === 'creators' || p === 'guides' ? 'weekly' : 'monthly';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priorityFor(p)}</priority>\n  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries}\n</urlset>\n`;
writeFileSync(resolve(root, 'src/sitemap.xml'), sitemap, 'utf-8');
console.log(`Generated src/sitemap.xml with ${allPaths.length} URLs for ${BASE_URL}`);
