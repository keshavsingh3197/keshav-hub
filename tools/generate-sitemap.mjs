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

function extractGuideDates(relPath) {
  const src = readFileSync(resolve(root, relPath), 'utf-8');
  const map = new Map();
  const blocks = src.split(/\{\s*\n\s*slug:/g).slice(1);
  for (const b of blocks) {
    const slugMatch = /^\s*'([^']+)'/.exec(b);
    const updMatch = /updatedDate:\s*'(\d{4}-\d{2}-\d{2})'/.exec(b);
    if (slugMatch) {
      map.set(`guides/${slugMatch[1]}`, updMatch ? updMatch[1] : null);
    }
  }
  return map;
}

// Strictly canonical, high-substance content, tool, case-study, and author routes.
// Non-content utility/bridge/legal routes remain crawlable via footer links without inflating sitemap.xml.
const staticContentRoutes = [
  '',
  'guides',
  'tools',
  'apps',
  'creators',
  'about',
];

const guideSlugs = extractSlugs('src/app/data/guides-cards.catalog.ts');
const guideDateMap = extractGuideDates('src/app/data/guides-cards.catalog.ts');
const toolSlugs = extractSlugs('src/app/data/creators-plans.catalog.ts');
const appSlugs = extractSlugs('src/app/data/apps.catalog.ts');

const dynamicRoutes = [
  ...guideSlugs.map((s) => `guides/${s}`),
  ...toolSlugs.map((s) => `tools/${s}`),
  ...appSlugs.map((s) => `apps/${s}`),
];

const allPaths = Array.from(new Set([...staticContentRoutes, ...dynamicRoutes]));
const today = new Date().toISOString().split('T')[0];

function priorityFor(path) {
  if (path === '') return '1.0';
  if (path === 'guides' || path === 'tools' || path.startsWith('guides/') || path.startsWith('tools/')) return '0.9';
  if (path === 'apps' || path.startsWith('apps/') || path === 'creators' || path === 'about') return '0.8';
  return '0.7';
}

const xmlEntries = allPaths
  .map((p) => {
    const loc = p ? `${BASE_URL}/${p}` : `${BASE_URL}/`;
    const lastmod = guideDateMap.get(p) || today;
    const freq = p === '' || p === 'guides' || p === 'tools' || p === 'creators' ? 'weekly' : 'monthly';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priorityFor(p)}</priority>\n  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries}\n</urlset>\n`;
writeFileSync(resolve(root, 'src/sitemap.xml'), sitemap, 'utf-8');
console.log(`Generated src/sitemap.xml with ${allPaths.length} canonical content URLs for ${BASE_URL}`);
