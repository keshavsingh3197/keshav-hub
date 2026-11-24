#!/usr/bin/env node
/**
 * Google Publisher Policy compliance step (support.google.com/publisherpolicies/answer/11035931):
 * Dynamically reads `adsEligible: false` / `noindex: true` from `src/app/app.routes.ts` AND
 * inspects `<meta name="robots" content="...noindex...">` in rendered static HTML so `adsbygoogle.js`
 * never executes on 404 error screens, redirect bridges, `noindex` utility pages, or legal/contact screens.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAppRoutes } from './routes-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const browserDist = resolve(root, 'dist', 'keshav-hub', 'browser');

const ADS_SCRIPT_RE = /<script[^>]+pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*><\/script>\s*/gi;

const blockedRoutes = new Set(
  parseAppRoutes(root)
    .filter((r) => !r.adsEligible && !r.path.includes(':') && r.path !== '**')
    .map((r) => (r.path ? `/${r.path}` : '/')),
);

function walkHtmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkHtmlFiles(full, acc);
    else if (entry === 'index.html') acc.push(full);
  }
  return acc;
}

const files = walkHtmlFiles(browserDist);
let strippedCount = 0;
let retainedCount = 0;

for (const file of files) {
  const relDir = '/' + relative(browserDist, dirname(file)).replace(/\\/g, '/').replace(/^\.$/, '');
  const route = relDir === '/' ? '/' : relDir.replace(/\/$/, '');
  const html = readFileSync(file, 'utf-8');
  const isNoindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);

  if (isNoindex || blockedRoutes.has(route)) {
    const cleaned = html.replace(ADS_SCRIPT_RE, '');
    if (cleaned !== html) {
      writeFileSync(file, cleaned, 'utf-8');
      strippedCount++;
    }
  } else {
    retainedCount++;
  }
}

console.log(
  `AdSense dynamic route hygiene complete: retained adsbygoogle.js on ${retainedCount} content routes; stripped from ${strippedCount} non-content/error/legal routes.`,
);
