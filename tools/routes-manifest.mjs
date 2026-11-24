import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Parses `src/app/app.routes.ts` dynamically so sitemap generation, AdSense script hygiene,
 * and post-build SSG checks share one single source of truth without hardcoded URL lists.
 */
export function parseAppRoutes(rootDir) {
  const src = readFileSync(resolve(rootDir, 'src/app/app.routes.ts'), 'utf-8');
  const results = [];

  const pathRegex = /\{\s*path:\s*'([^']*)'([\s\S]*?)(?=\n\s*\},|\n\];)/g;
  for (const m of src.matchAll(pathRegex)) {
    const routePath = m[1];
    const body = m[2];
    const noindex = /\bnoindex:\s*true\b/.test(body);
    const inSitemapExplicitFalse = /\binSitemap:\s*false\b/.test(body);
    const adsEligibleExplicitFalse = /\badsEligible:\s*false\b/.test(body);
    const canonMatch = /\bcanonicalPath:\s*'([^']+)'/.exec(body);

    results.push({
      path: routePath,
      noindex,
      inSitemap: !noindex && !inSitemapExplicitFalse && !routePath.includes(':') && routePath !== '**',
      adsEligible: !noindex && !adsEligibleExplicitFalse && routePath !== '**',
      canonicalPath: canonMatch ? canonMatch[1] : null,
    });
  }

  return results;
}
