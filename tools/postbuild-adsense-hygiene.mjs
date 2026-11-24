#!/usr/bin/env node
/**
 * Google Publisher Policy compliance step (support.google.com/publisherpolicies/answer/11035931):
 * Ensures `<script ... pagead2.googlesyndication.com/pagead/js/adsbygoogle.js ...>` NEVER executes
 * on 404 error fallbacks, redirect bridges, `noindex` utility views, or thin legal/behavioral screens,
 * while keeping `<meta name="google-adsense-account">` intact everywhere and serving full AdSense scripts
 * on all publisher content, calculator, and guide routes.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const browserDist = resolve(__dirname, '..', 'dist', 'keshav-hub', 'browser');

const ADS_SCRIPT_RE = /<script[^>]+pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*><\/script>\s*/gi;

const NON_CONTENT_PREFIXES = new Set([
  '/404',
  '/resume',
  '/robots',
  '/sitemap',
  '/contact',
  '/privacy-policy',
  '/privacy',
  '/terms',
  '/terms-and-conditions',
  '/cookie-policy',
  '/cookies',
  '/disclaimer',
  '/data-deletion',
  '/security',
  '/interact',
  '/plans',
  '/roadmap',
]);

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

  if (isNoindex || NON_CONTENT_PREFIXES.has(route)) {
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
  `AdSense route hygiene complete: retained adsbygoogle.js on ${retainedCount} publisher content routes; stripped from ${strippedCount} non-content/error/legal routes.`,
);
