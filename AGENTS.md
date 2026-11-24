# Keshav Ecosystem Hub (`keshav-hub`) — Agent & Build Rules

## 1. Canonical Live URLs & Accounts
- **Primary Domain:** `https://keshavsingh.in/`
- **GitHub Repository:** `https://github.com/keshavsingh3197/keshav-hub` (deploys automatically to GitHub Pages on push to `master` or `main` via `.github/workflows/deploy-pages.yml`)
- **Sitemap:** `https://keshavsingh.in/sitemap.xml` (dynamically generated from `src/app/app.routes.ts` + catalogs)
- **AdSense `ads.txt`:** `https://keshavsingh.in/ads.txt` (`google.com, pub-7890828429175364, DIRECT, f08c47fec0942fa0`)
- **Google AdSense Publisher ID:** `pub-7890828429175364`
- **Google AdSense Site Detail URL:** `https://adsense.google.com/adsense/u/2/pub-7890828429175364/sites/detail/url=keshavsingh.in`
- **AdSense-Owning Google Account:** `siranam.singh.3197@gmail.com` (`/u/2/` in Chrome)
- **Connected Sibling Subdomains (`*.keshavsingh.in`):**
  - `https://portfolio.keshavsingh.in/` (Dedicated zero-ad hiring CV & PDF resume)
  - `https://id.keshavsingh.in/` (Central .NET 10 OAuth2 + FIDO2 Passkey SSO)
  - `https://admin.keshavsingh.in/` (RBAC, Website Origin Registry & Global i18n)
  - `https://studio.keshavsingh.in/` (AnimStudio AI 3D Video & Shorts Studio)
  - `https://panchang.keshavsingh.in/` (Hindu Panchang & Vedic Calendar)
  - `https://pratiyogita.keshavsingh.in/` (School Olympiads, Sports & Zero-Log Live Quiz)
  - `https://social.keshavsingh.in/` (SocialPulse Creator Analytics)
  - `https://blog.keshavsingh.in/` (Engineering Content Blog)
  - `https://ghar.keshavsingh.in/` (Ghar Ledger Private Household Book)

## 2. Dynamic Route, Sitemap & AdSense Compliance Rules (Never Skip)
1. **Single Source of Truth (`src/app/app.routes.ts`):**
   - Every new route MUST explicitly declare `data.title`, `data.description`, and when non-content/utility/legal/error, `noindex: true`, `inSitemap: false`, and `adsEligible: false`.
   - `tools/generate-sitemap.mjs` dynamically reads `app.routes.ts` + `guides-cards.catalog.ts` + `creators-plans.catalog.ts` + `apps.catalog.ts`. Never maintain separate hardcoded URL lists.
   - `tools/postbuild-adsense-hygiene.mjs` dynamically strips `adsbygoogle.js` from every route marked `noindex: true` or `adsEligible: false` (including `/404` and `404.html`), while keeping `<meta name="google-adsense-account">` intact.
2. **Editorial & Tool Quality Floors (`tools/verify-ssg-quality.mjs`):**
   - Runs automatically at the end of `npm run build` (and in CI on every push).
   - Every guide under `/guides/:slug` must render >= 900 words of original technical prose (with `GuideCodeBlock` / tables / FAQs) and register in `GUIDE_CARDS` + `guides-part*.data.ts`.
   - Every interactive tool under `/tools/:slug` must render >= 450 words (widget + methodology + worked example + FAQs) and add its icon in `src/app/data/visuals.ts` and translations in `src/assets/i18n/en.json` + `hi.json`.
   - Never hardcode stale dates in calculators—use `todayIsoDate()`.
3. **Verification Before Deployment:**
   - Always run `npm test -- --watch=false` and `npm run build` before committing, and verify live `https://keshavsingh.in` via the `browser` subagent after GitHub Pages deployment completes.
