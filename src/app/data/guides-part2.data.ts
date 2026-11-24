import type { GuideFaq, GuideSection } from './guides-cards.catalog';

export const GUIDE_BODIES_PART2: Record<string, { sections: GuideSection[]; faqs: GuideFaq[] }> = {
  'grassroots-competitions-pratiyogita-zero-log-quiz': {
    sections: [
      {
        heading: '1. Why Grassroots School Olympiads Need Modular Monolith Discipline',
        paragraphs: [
          'Local academic olympiads and inter-school sports tournaments across Indian districts still run largely on WhatsApp PDFs, paper score sheets, and ad-hoc Google Forms. When we designed Pratiyogita (pratiyogita.keshavsingh.in) to give schools, students, and livestream communities verifiable scoreboards, we needed strict domain boundaries without drowning a small ops footprint in twelve separate Kubernetes deployments.',
          'We structured the .NET 10 backend as a strict Modular Monolith partitioned into four isolated domain assemblies: LocationsAndSchools, CompetitionsAndFixtures, LiveStreamQuizClaims, and PatronContributions. Each module owns dedicated MongoDB collections and communicates across boundaries via explicit C# application interfaces—giving us single-binary deployment simplicity today and zero-refactor microservice extraction paths tomorrow.',
        ],
      },
      {
        heading: '2. Eliminating Free-Text Campus Duplication on District Leaderboards',
        paragraphs: [
          'The fastest way to ruin an academic leaderboard is allowing students to type their school name into a free-text input box. Within one hundred registrations, the same institution fragments into "DPS Jaipur", "Delhi Public School Jaipur", "D.P.S. Ajmer Road", and typos—breaking school-level aggregation and topper badges.',
          'Pratiyogita enforces a normalized geographic hierarchy: State -> District -> City/Block -> Verified School Entity (with deterministic codes such as RJ-JPR-SCH-0104). If a coordinator’s campus is not yet listed, they submit an inline onboarding record that enters a Pending state—allowing student sign-ups to reference the provisional ID immediately while holding public school leaderboard publication until an administrator approves canonical naming.',
        ],
        codeOrTable: {
          caption: 'Pratiyogita Domain Module & Data Isolation Matrix',
          headers: ['Domain Module', 'Owned Collections', 'Public Read Cache', 'Write Authorization'],
          rows: [
            ['Locations & Schools', 'states, districts, schools', '10m in-memory + CDN', 'SSO Verified Coordinator / Admin'],
            ['Competitions & Results', 'events, registrations, scores', '5s micro-cache during finals', 'Organizer Role + Score Audit Log'],
            ['Live Quiz Arena', 'quiz_rounds, verified_claims', '3s leaderboard snapshot', 'Ephemeral OAuth RAM Verification'],
            ['Supporter Ledger', 'upi_pledges, verified_patrons', '60s verified board', 'UTR Reference + Admin Reconciliation'],
          ],
        },
      },
      {
        heading: '3. Zero-Log Ephemeral YouTube Channel Verification for Livestream Quizzes',
        paragraphs: [
          'Running live trivia quizzes on @keshavsinghworld or @OmkarShivBhakti creates an immediate identity problem when winners claim badges on the website: if a form simply asks "What is your YouTube handle?", opportunistic viewers type the top commenter’s @handle to hijack their win. Conversely, asking casual viewers to grant offline Google OAuth scopes and storing their Google tokens in a database introduces unnecessary privacy liability.',
          'Our Zero-Log verification flow uses an ephemeral authorization code exchange with minimal read-only channel identity scope, inspects channels.list(mine=true) strictly inside volatile C# request memory to extract the cryptographic channel ID hash and public @handle, writes only the verified quiz claim record, and immediately revokes/discards the short-lived access token before the HTTP response completes.',
        ],
        codeBlock: {
          language: 'csharp',
          caption: 'EphemeralYouTubeHandleVerifier.cs — Verify public @handle in RAM and discard token immediately',
          code: `public async Task<VerifiedChannelClaim> VerifyHandleEphemerallyAsync(string oauthCode, CancellationToken ct)
{
    // 1. Exchange single-use PKCE code in volatile memory (request offline_access = false)
    using var tokenResponse = await ExchangeCodeInMemoryAsync(oauthCode, ct);
    var accessToken = tokenResponse.RootElement.GetProperty("access_token").GetString()!;

    try
    {
        // 2. Read public channel snippet only — never request email or private video scopes
        using var req = new HttpRequestMessage(HttpMethod.Get,
            "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        using var res = await httpClient.SendAsync(req, ct);
        res.EnsureSuccessStatusCode();
        using var doc = await JsonDocument.ParseAsync(await res.Content.ReadAsStreamAsync(ct), cancellationToken: ct);

        var item = doc.RootElement.GetProperty("items")[0];
        var channelId = item.GetProperty("id").GetString()!;
        var customUrl = item.GetProperty("snippet").GetProperty("customUrl").GetString() ?? channelId;

        return new VerifiedChannelClaim(
            ChannelHash: Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(channelId))),
            PublicHandle: customUrl);
    }
    finally
    {
        // 3. Proactively revoke token and never persist it to disk, logs, or MongoDB
        _ = RevokeTokenFireAndForgetAsync(accessToken);
    }
}`,
        },
      },
      {
        heading: '4. Transparent Grassroots UPI Patronage Without Storing Payment Credentials',
        paragraphs: [
          'Local shopkeepers, alumni, and parents often wish to chip in ₹500 or ₹2,000 toward student medals and exam stationery, provided they can see transparent acknowledgement and never have to type credit card CVVs onto a community website. Pratiyogita generates standard RFC-compliant upi://pay deep-link intents handled natively by the donor’s installed UPI app (BHIM, GPay, PhonePe, Paytm), then accepts only the 12-digit Bank UTR reference number for manual statement reconciliation before publishing supporter acknowledgement.',
        ],
        bullets: [
          'Zero card numbers, bank account digits, or UPI PINs ever touch Pratiyogita web forms or servers.',
          'Unique UTR index constraints in MongoDB prevent duplicate submission of the same transaction reference.',
          'Public supporter boards display only donor-approved display names, sponsored event tiers, and verified dates.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does Zero-Log YouTube verification access my private videos or Google Drive?',
        answer:
          'Never. The OAuth consent screen requests only public YouTube channel identity (no email, no Drive, no upload permissions, and no offline refresh token), and the temporary access token is revoked immediately after reading your public @handle.',
      },
      {
        question: 'How does Pratiyogita handle sudden leaderboard traffic spikes at the end of a livestream?',
        answer:
          'Read endpoints sit behind a 3-to-5 second in-memory/Redis snapshot cache so 1,000 simultaneous refreshes generate only one MongoDB query every few seconds.',
      },
      {
        question: 'Can schools download printable PDF merit lists after an olympiad?',
        answer:
          'Yes. Verified coordinators can filter results by grade and district and print clean white-background merit sheets directly from the browser.',
      },
    ],
  },

  'micro-app-monetization-ethics-user-trust': {
    sections: [
      {
        heading: '1. Why One Root Domain Should Not Mix Hiring Resumes, Private Family Logs & Ad Inventory',
        paragraphs: [
          'Developers who build side projects alongside an engineering career often pile everything onto a single domain: `/resume` for job recruiters, `/ledger` for personal family expenses, `/videos` for YouTube embeds, and Auto Ads across the global `<head>`. Every single visitor persona ends up compromised.',
          'Engineering managers reviewing a senior backend candidate want crisp architecture history and a one-click PDF CV without programmatic display banners shifting the layout. Families logging daily milk deliveries in Ghar Ledger or sharing step counts inside FamSphere deserve ironclad privacy with zero third-party ad-network pixels running near household data. Meanwhile, public readers searching for FFmpeg bitrate math, Vedic Panchang calculators, or .NET 10 SSO guides expect comprehensive, free documentation supported transparently.',
        ],
      },
      {
        heading: '2. Subdomain Isolation Architecture Across *.keshavsingh.in',
        paragraphs: [
          'Splitting responsibilities cleanly across dedicated subdomains gives every application a clear security, UX, and monetization contract from first byte:',
        ],
        codeOrTable: {
          caption: 'Data Classification, Monetization & Consent Policy Across Ecosystem Hosts',
          headers: ['Host / Package', 'Primary Audience', 'Personal Data Sensitivity', 'Third-Party Ad Scripts'],
          rows: [
            ['keshavsingh.in', 'Public developers, creators & learners', 'Anonymous browser calculators', 'Content pages only (consent-gated)'],
            ['portfolio.keshavsingh.in', 'Recruiters & hiring engineering leads', 'Public career CV & GitHub links', 'Zero ads (100% distraction-free)'],
            ['ghar.keshavsingh.in', 'Authenticated household members', 'Private household vendor tallies', 'Zero ads / zero ad-network pixels'],
            ['in.keshavsingh.famsphere', 'Android & iOS family circles', 'Explicit OS opt-in sensors & PDFs', 'Zero ads (Play Store Family safe)'],
            ['id.keshavsingh.in', 'Central authentication ceremonies', 'Credentials & passkey assertions', 'Zero third-party scripts (strict CSP)'],
          ],
        },
      },
      {
        heading: '3. Engineering Fail-Closed Consent Before Third-Party Scripts Execute',
        paragraphs: [
          'Many cookie banners are cosmetic theater: they load personalized tracking scripts immediately in `<head>` and only toggle a UI flag if the visitor clicks Reject ten seconds later. On `keshavsingh.in`, we engineered fail-closed consent right inside the synchronous pre-paint initializer in `index.html` and `ConsentService`.',
          'Before `adsbygoogle.js` initializes on eligible content routes, our inline bootstrap inspects `localStorage.getItem("ks_hub_consent")`. Unless the visitor has explicitly chosen `accepted`, `window.adsbygoogle.requestNonPersonalizedAds = 1` is set synchronously on first load, and first-party visit telemetry (`trackVisit`) stays completely disabled.',
        ],
        codeBlock: {
          language: 'typescript',
          caption: 'Fail-closed consent enforcement: non-personalized ads & zero telemetry until explicit opt-in',
          code: `export function syncConsentBeforeAdsLoad(storage: Storage | null): { nonPersonalizedAds: 0 | 1; allowTelemetry: boolean } {
  try {
    const choice = storage?.getItem('ks_hub_consent');
    if (choice === 'accepted') {
      return { nonPersonalizedAds: 0, allowTelemetry: true };
    }
  } catch {
    // Private browsing or blocked storage falls back to strictest privacy posture
  }
  return { nonPersonalizedAds: 1, allowTelemetry: false };
}`,
        },
      },
      {
        heading: '4. Google Play Data Safety Alignment for Companion Mobile Apps',
        paragraphs: [
          'Hosting official privacy and data-deletion documentation on the apex domain (`keshavsingh.in/privacy-policy` and `/data-deletion`) satisfies Google Play Console verification for `in.keshavsingh.famsphere` because Play reviewers check that the privacy URL matches the verified publisher domain, discloses hardware permissions (pedometer activity, camera for QR/Image-to-PDF, optional contacts/location) in plain language, and offers a self-service deletion request channel without forcing users to reinstall the app.',
        ],
        bullets: [
          'Never load third-party ad tags on authentication (`id.*`), private household (`ghar.*`), or career CV (`portfolio.*`) origins.',
          'Default `requestNonPersonalizedAds = 1` whenever consent has not yet been granted.',
          'Keep a permanent "Cookie settings" button in the global footer so visitors can downgrade from Accepted to Essential-only in two clicks.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are any inputs typed into calculators on keshavsingh.in sent to a backend server?',
        answer:
          'No. All eight calculators (YouTube RPM, Short Pacing, Samvat/Kaal, API Capacity, FFmpeg Bitrate, Lunar Tithi, JSON-LD Generator, and Cron/JWT Planner) run 100% client-side in your browser memory.',
      },
      {
        question: 'Why keep /privacy as a canonicalized alias to /privacy-policy?',
        answer:
          'Older mobile builds and external references sometimes link to /privacy; serving the complete policy there with canonicalPath="/privacy-policy" and noindex on the alias guarantees human readers never hit a 404 while search engines index a single canonical URL.',
      },
      {
        question: 'Does Ghar Ledger or FamSphere share data with advertising networks?',
        answer:
          'Never. Both Ghar Ledger and FamSphere operate completely outside advertising networks and never sell, rent, or profile family records.',
      },
    ],
  },

  'two-channel-comedy-strategy-local-vs-international': {
    sections: [
      {
        heading: '1. How Mixed-Language Feeds Confuse Shorts Seed-Cohort Testing',
        paragraphs: [
          'Every time you publish a YouTube Short, the recommendation engine runs an exploration phase across a seed cohort of 200 to 1,500 viewers drawn heavily from recent engaged viewers and topic-matched clusters. Two metrics dominate whether that Short expands to 100,000+ impressions: Viewed-vs-Swiped-Away rate (ideally >72%) and Average Percentage Viewed (>95–115% on sub-35s loops).',
          'Suppose Monday’s upload is a fast Hinglish family roast packed with North Indian Khadi Bhasha idioms, and Wednesday’s upload on the exact same channel is a silent 3D physical slapstick loop aimed at US, Brazilian, and European viewers. International subscribers earned on Wednesday swipe away within 1.8 seconds when Friday’s Hindi dialogue skit hits their feed—crushing Viewed-vs-Swiped-Away metrics right inside the seed test window!',
        ],
      },
      {
        heading: '2. Architectural Split: Regional Sitcom Track vs Global Visual Slapstick Track',
        paragraphs: [
          'Inside AnimStudio AI’s Comedy Workspace, we solved cohort dilution by splitting creative presets, audio mixing templates, and metadata generators into two distinct channel pipelines:',
        ],
        codeOrTable: {
          caption: 'Engineering & Creative Specifications Across Dual 3D Comedy Tracks',
          headers: ['Production Parameter', 'Indian Regional Track (@KESHAV-ANIM-FF)', 'Global Slapstick Track (International)'],
          rows: [
            ['Opening 0–2.5s Hook', 'Immediate Hinglish accusation / household crisis', 'Visual hazard, prop malfunction, or doorway gag'],
            ['Dialogue Density', '140–155 WPM expressive multi-voice banter', 'Zero-dialogue / universal exclamations ("Uh-oh!", gasps)'],
            ['Audio Mix Priority', 'Crisp center-channel speech + comic rimshot stingers', 'Spatialized foley (boings, whooshes, crashes) + rhythmic BGM'],
            ['Caption Strategy', 'High-contrast Hinglish / Devanagari karaoke pop-ins', 'Minimal visual-sound onomatopoeia or clean English titles'],
            ['Replay Loop Mechanic', 'Callback punchline echoing Scene 1 accusation', 'Seamless visual frame-match loop back to Frame 0'],
          ],
        },
      },
      {
        heading: '3. Pacing Math: Designing the 3-Beat Escalation Curve in 28–42 Seconds',
        paragraphs: [
          'Whether regional or international, high-retention 3D animated Shorts follow a strict Rule-of-Three escalation curve where every 4-to-6 seconds introduces either a visual camera cut, a character reaction double-take, or a status reversal. In our Short Hook Pacing Planner (/tools/short-hook-pacing-planner), we enforce three timing invariants before rendering:',
        ],
        bullets: [
          'Beat 1 (0.0s – 3.2s, Premise Collision): Establish the stakes immediately—never show a 4-second studio logo bumper or slow walking entrance.',
          'Beat 2 (3.2s – 16.0s, Failed Cover-Up / Escalation): The protagonist attempts an absurd shortcut that makes the problem twice as bad, punctuated by 180-degree shot/reverse-shot cuts.',
          'Beat 3 (16.0s – 29.0s, Twist Payoff & Hard Cut): Deliver the unexpected reversal and cut hard on the peak comic reaction frame—leaving zero dead tail air so the Short loops above 100% retention.',
        ],
      },
      {
        heading: '4. Procedural Foley & Reaction Timing Code in AnimStudio AI',
        paragraphs: [
          'In 3D animation, a joke lands 40% harder when a sharp foley transient (eyebrow spring, neck whip-pan whoosh, or tabla/rimshot hit) aligns within ±35 milliseconds of the visual apex. Rather than dragging WAV clips manually across ten tracks, AnimStudio binds SFX triggers declaratively to character emotion keyframes in the storyboard JSON:',
        ],
        codeBlock: {
          language: 'typescript',
          caption: 'Declarative Foley Cue Alignment in AnimStudio Timeline Compiler',
          code: `export interface FoleyCue {
  sfxId: 'whip_pan' | 'jaw_drop_boing' | 'comic_rimshot' | 'record_scratch';
  offsetFromBeatStartMs: number;
  gainDb: number;
}

export function scheduleReactionFoley(emotion: string, beatDurationMs: number): FoleyCue[] {
  switch (emotion) {
    case 'surprised':
      return [{ sfxId: 'whip_pan', offsetFromBeatStartMs: 60, gainDb: -6.0 },
              { sfxId: 'jaw_drop_boing', offsetFromBeatStartMs: 240, gainDb: -4.5 }];
    case 'sarcastic':
      return [{ sfxId: 'comic_rimshot', offsetFromBeatStartMs: Math.max(200, beatDurationMs - 380), gainDb: -5.0 }];
    default:
      return [];
  }
}`,
        },
      },
    ],
    faqs: [
      {
        question: 'Should I use YouTube Multi-Language Audio tracks on 30-second comedy Shorts?',
        answer:
          'Multi-language audio tracks work wonderfully on 10-minute educational/documentary videos, but comedic timing and lip-synced punchlines rarely translate 1-to-1; dedicated visual vs regional feeds consistently achieve cleaner swipe-retention.',
      },
      {
        question: 'What is the ideal runtime for an animated comedy Short?',
        answer:
          'Data across vertical comedy shows two sweet spots: ultra-tight 18–26 second visual loops (maximizing >110% replay percentage) and 38–52 second narrative sitcom skits (maximizing total watch-seconds per impression).',
      },
      {
        question: 'Why avoid 3-second "Subscribe!" end screens on Shorts?',
        answer:
          'Viewers recognize end-screen outros instantly and swipe away at 88% completion, dragging down Average Percentage Viewed. Cutting sharply on the final laugh frame triggers automatic loop-overs.',
      },
    ],
  },

  'responsive-ssg-web-vitals-adsense-ux': {
    sections: [
      {
        heading: '1. Why Client-Only SPAs Struggle With Mobile LCP and Crawler Snapshots',
        paragraphs: [
          'Traditional Angular, React, and Vue Single Page Applications ship an almost empty `<body><app-root></app-root></body>` shell alongside a 650+ kB JavaScript bundle. On a mid-range Android phone over congested 4G, downloading, parsing, and executing that script before painting the article headline pushes Largest Contentful Paint (LCP) past 3.8 seconds—failing Google’s 2.5-second Core Web Vitals threshold and forcing search/ad crawlers through expensive second-wave JavaScript rendering queues.',
          'Enabling `"outputMode": "static"` with `@angular/build:application` and `@angular/ssr` evaluates every parameterized route (`/guides/:slug`, `/tools/:slug`, `/apps/:slug`) in Node.js during CI build time. Each route emits a self-contained `index.html` containing complete semantic `<article>` prose, `<title>`, `<link rel="canonical">`, and Schema.org JSON-LD—painting readable typography on first TCP response before a single line of client JS boots.',
        ],
      },
      {
        heading: '2. Eliminating Flash of Unstyled Theme (FOUC) and Cumulative Layout Shift (CLS)',
        paragraphs: [
          'Two subtle frontend mistakes routinely push Cumulative Layout Shift (CLS) above 0.15 on content hubs: late-resolving dark/light mode toggles and layout-pushing cookie banners. If your Angular component waits until `ngOnInit` in the browser to read `localStorage` and flip `data-theme="dark"`, visitors experience a blinding white flash followed by font/token reflow.',
          'On `keshavsingh.in`, a 15-line synchronous `<script>` inside `<head>` inspects `ks_hub_theme` and `prefers-color-scheme` before first paint, locking CSS custom properties immediately. Meanwhile, the sticky site header uses an explicit `height: 68px` and the consent bar uses `position: fixed` above the viewport bottom edge so zero document content ever shifts vertically during hydration.',
        ],
        codeOrTable: {
          caption: 'Core Web Vitals Engineering Targets & Fixes on keshavsingh.in',
          headers: ['Web Vital Metric', 'Good Threshold', 'Common SPA Failure Cause', 'Applied Engineering Fix'],
          rows: [
            ['Largest Contentful Paint (LCP)', '<= 2.5 sec', 'Empty <app-root> waiting on 600kB main.js', 'Build-time SSG HTML + lazy route chunks (< 350kB initial)'],
            ['Cumulative Layout Shift (CLS)', '<= 0.10', 'Un-sized icons, sticky header jumps, banner push', 'Explicit SVG width/height, fixed 68px header, fixed overlay consent'],
            ['Interaction to Next Paint (INP)', '<= 200 ms', 'Heavy synchronous search/filter re-renders', 'OnPush SVG icons + lightweight computed Angular signals'],
          ],
        },
      },
      {
        heading: '3. Route-Level Code Splitting: Keeping Initial JS Lean Despite 25,000+ Words of Guides',
        paragraphs: [
          'A hidden trap in static site generation is importing your entire article catalog eagerly inside `app.routes.ts` or your root `AppComponent` navbar search. Even though SSG pre-renders static HTML, eager imports pack all 16 full-length articles into `main.js`, bloating every visitor’s initial JS download!',
          'We solved this cleanly by splitting lightweight card metadata (`guides-cards.catalog.ts`, ~10 kB) from full article bodies (`guides.catalog.ts`) and switching `app.routes.ts` to `loadComponent: () => import(...)`. Visitors landing on `/` or `/tools` download a lean initial bundle, while `/guides/:slug` still pre-renders 100% of its static HTML at build time and lazy-loads its hydration chunk on demand.',
        ],
        codeBlock: {
          language: 'typescript',
          caption: 'Route-level lazy loading in app.routes.ts paired with build-time SSG prerendering',
          code: `export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full', data: { /* ... */ } },
  {
    path: 'guides/:slug',
    loadComponent: () => import('./pages/guides/guide-detail.page').then((m) => m.GuideDetailPageComponent),
  },
  {
    path: 'tools/:slug',
    loadComponent: () => import('./pages/tools/tool-detail.page').then((m) => m.ToolDetailPageComponent),
  },
];`,
        },
      },
      {
        heading: '4. Fluid Typography, WCAG Contrast & Horizontal Overflow Prevention',
        paragraphs: [
          'Technical articles containing wide comparison tables and multi-line CLI snippets frequently cause horizontal scrollbar overflow on 360px mobile viewports—triggering Google Search Console Mobile Usability warnings. Wrapping tables in `.table-scroll { overflow-x: auto }` and `<pre>` code blocks in `max-width: 100%; overflow-x: auto`, alongside fluid `clamp()` headings and `76ch` prose measure, keeps reading effortless across phones, tablets, and ultrawide monitors.',
        ],
        bullets: [
          'Maintain >= 4.5:1 body text contrast in both Light (`#0f172a` on `#f7f8fc`) and Dark (`#f8fafc` on `#0a0f1e`) palettes.',
          'Keep interactive tap targets at least 36–44px tall with visible `:focus-visible` keyboard outlines.',
          'Honor `@media (prefers-reduced-motion: reduce)` by disabling decorative float animations and smooth-scroll jumps.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does lazy-loading routes in Angular prevent static SSG HTML prerendering?',
        answer:
          'No! Angular’s static builder resolves lazy `loadComponent` promises in Node.js at build time and writes the full rendered HTML into `dist/.../browser/<route>/index.html`, while keeping browser JS chunks split cleanly.',
      },
      {
        question: 'Why inline SVG paths in an OnPush component instead of loading FontAwesome or Material Icons?',
        answer:
          'Icon fonts add 90–180 kB of blocking font downloads and often flash raw ligature words ("arrow_forward") on slow mobile networks before the `.woff2` finishes loading. Inline SVG paths render crisp on byte one with zero extra requests.',
      },
      {
        question: 'What is the ideal line length for long-form technical guides?',
        answer:
          'Between 65 and 76 characters (`max-width: 76ch`) with a generous `1.75` line-height prevents eye-tracking fatigue across multi-thousand-word articles.',
      },
    ],
  },
};
