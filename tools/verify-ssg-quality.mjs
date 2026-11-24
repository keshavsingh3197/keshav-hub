#!/usr/bin/env node
/**
 * Post-build SSG quality & SEO gate: runs automatically on every `npm run build` (and GitHub Actions deploy)
 * so new guides, tools, apps, or routes can never silently ship with thin content, missing canonicals,
 * stale sitemap entries, or AdSense script leaks on noindex/error pages.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAppRoutes } from './routes-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const browserDist = resolve(root, 'dist', 'keshav-hub', 'browser');

const errors = [];

function walkHtmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) walkHtmlFiles(full, acc);
    else if (entry === 'index.html') acc.push(full);
  }
  return acc;
}

const routeMetaMap = new Map(
  parseAppRoutes(root)
    .filter((r) => !r.path.includes(':') && r.path !== '**')
    .map((r) => [r.path ? `/${r.path}` : '/', r]),
);

const htmlFiles = walkHtmlFiles(browserDist);
for (const file of htmlFiles) {
  const relDir = '/' + relative(browserDist, dirname(file)).replace(/\\/g, '/').replace(/^\.$/, '');
  const route = relDir === '/' ? '/' : relDir.replace(/\/$/, '');
  const html = readFileSync(file, 'utf-8');

  const titleMatch = /<title>(.*?)<\/title>/i.exec(html);
  const canonMatch = /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i.exec(html);
  const robotsMatch = /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i.exec(html);
  const hasAdsScript = /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i.test(html);

  if (!titleMatch || !titleMatch[1].trim()) {
    errors.push(`[SEO] Missing <title> on ${route}`);
  }
  if (!canonMatch) {
    errors.push(`[SEO] Missing <link rel="canonical"> on ${route}`);
  } else {
    const expectedPath = routeMetaMap.get(route)?.canonicalPath ?? route;
    const expectedCanon = `https://keshavsingh.in${expectedPath}`;
    if (canonMatch[1] !== expectedCanon) {
      errors.push(`[SEO] Canonical mismatch on ${route}: got ${canonMatch[1]}, expected ${expectedCanon}`);
    }
  }

  const isNoindex = Boolean(robotsMatch && /noindex/i.test(robotsMatch[1]));
  const meta = routeMetaMap.get(route);
  if ((isNoindex || (meta && !meta.adsEligible)) && hasAdsScript) {
    errors.push(`[AdSense] adsbygoogle.js leaked onto non-content/noindex route ${route}`);
  }

  // Word-count quality floor for primary content routes
  const mainMatch = /<main[^>]*>([\s\S]*?)<\/main>/i.exec(html);
  const bodyText = (mainMatch ? mainMatch[1] : '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;

  if (route.startsWith('/guides/') && wordCount < 900) {
    errors.push(`[Content] Guide ${route} has only ${wordCount} words (minimum 900)`);
  }
  if (route.startsWith('/tools/') && wordCount < 450) {
    errors.push(`[Content] Tool ${route} has only ${wordCount} words (minimum 450)`);
  }
}

// Verify sitemap.xml & ads.txt
const sitemapPath = resolve(browserDist, 'sitemap.xml');
const adsTxtPath = resolve(browserDist, 'ads.txt');
if (!existsSync(sitemapPath)) {
  errors.push('[SEO] Missing dist/keshav-hub/browser/sitemap.xml');
} else {
  const sitemapXml = readFileSync(sitemapPath, 'utf-8');
  const locs = Array.from(sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1]);
  if (locs.length < 30) {
    errors.push(`[SEO] sitemap.xml only contains ${locs.length} URLs`);
  }
  for (const loc of locs) {
    const pathPart = loc.replace('https://keshavsingh.in', '') || '/';
    const meta = routeMetaMap.get(pathPart);
    if (meta && (meta.noindex || !meta.inSitemap)) {
      errors.push(`[SEO] sitemap.xml contains excluded/noindex URL: ${loc}`);
    }
  }
}

if (!existsSync(adsTxtPath) || !readFileSync(adsTxtPath, 'utf-8').includes('pub-7890828429175364')) {
  errors.push('[AdSense] ads.txt missing or does not contain pub-7890828429175364');
}

if (errors.length) {
  console.error('SSG Quality Gate FAILED:\n' + errors.map((e) => ` - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`SSG Quality Gate PASSED across ${htmlFiles.length} prerendered routes, sitemap.xml, and ads.txt.`);
