export interface GuideCodeBlock {
  language: string;
  caption: string;
  code: string;
}

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  codeBlock?: GuideCodeBlock;
  codeOrTable?: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideCardMeta {
  slug: string;
  title: string;
  category: 'Architecture' | 'Creator & Media' | 'Vedic Astronomy' | 'Policy & Monetization';
  publishedDate: string;
  updatedDate: string;
  readMinutes: number;
  summary: string;
  takeaways: string[];
  relatedAppSlug: string;
  relatedToolSlug?: string;
}

export interface EngineeringGuide extends GuideCardMeta {
  sections: GuideSection[];
  faqs?: GuideFaq[];
}

export const GUIDE_CARDS: GuideCardMeta[] = [
  {
    slug: 'federated-sso-dotnet-angular-architecture',
    title: 'One Identity Across Eight Domains: Designing .keshavsingh.in SSO with .NET 10, Passkeys & Dynamic CORS',
    category: 'Architecture',
    publishedDate: '2026-10-12',
    updatedDate: '2026-11-24',
    readMinutes: 14,
    summary:
      'How we unified Admin, AnimStudio AI, Hindu Panchang, Pratiyogita, SocialPulse, Ghar Ledger, and Content Blog around a single .NET 10 identity server (id.keshavsingh.in) with FIDO2 passkeys, Web Locks refresh serialization, and zero wildcard CORS rules.',
    takeaways: [
      'A wildcard CORS rule on *.keshavsingh.in creates subdomain-takeover blast radius whenever DNS outlives a retired deployment.',
      'Stateless sibling APIs validate short-lived JWTs while rotating HttpOnly refresh cookies exclusively against id.keshavsingh.in.',
      'Serializing concurrent multi-tab token refreshes via navigator.locks eliminates false-positive replay revocations.',
    ],
    relatedAppSlug: 'portfolio',
    relatedToolSlug: 'cron-jwt-epoch-developer-toolkit',
  },
  {
    slug: 'ai-3d-animation-pipeline-ffmpeg-webgl',
    title: 'Building AnimStudio AI: Deterministic Storyboards, Three.js 3D Stages, FFmpeg xfade & Motion Copy',
    category: 'Creator & Media',
    publishedDate: '2026-10-28',
    updatedDate: '2026-11-24',
    readMinutes: 15,
    summary:
      'An end-to-end engineering walkthrough of how AnimStudio AI bridges deterministic Story Agent JSON schemas, real-time WebGL viewport scrubbing, multi-speaker neural TTS, and native FFmpeg filtergraphs for 9:16 Shorts and 16:9 episodes.',
    takeaways: [
      'Decoupling storyboard JSON from video encoding lets creators tweak one line of dialogue without invalidating approved 3D renders.',
      'Browser WebGL approximates transitions at 60fps during editing while headless FFmpeg compiles exact frame-accurate master MP4s.',
      'Automated pre-publish audits verify loudness, safe-zone captions, custom thumbnails, and YouTube schedule timestamps before upload.',
    ],
    relatedAppSlug: 'animstudio',
    relatedToolSlug: 'short-hook-pacing-planner',
  },
  {
    slug: 'astronomical-vedic-panchang-calculations',
    title: 'Engineering Accurate Hindu Panchang Timings: Sunrise-Anchored Tithi, Nakshatra & 8-Slice Planetary Kaal',
    category: 'Vedic Astronomy',
    publishedDate: '2026-11-01',
    updatedDate: '2026-11-24',
    readMinutes: 13,
    summary:
      'Why naive midnight-rollover UTC lookup tables break Indian festival calendars, and how panchang.keshavsingh.in computes Udaya Tithi, geographic sunrise equations, Rahu Kaal, and Abhijit Muhurat across longitudes.',
    takeaways: [
      'A classical Vedic civil day (Savana Dina) runs from local apparent sunrise to the next local sunrise—never 00:00 midnight.',
      'Rahu Kaal, Yamaganda, and Gulika divide actual daylight (Sunset minus Sunrise) into eight seasonal segments rather than fixed 90-minute clocks.',
      'Udaya Tithi rules and Evening-Before festival windows require distinct astronomical checks for morning vs night observances.',
    ],
    relatedAppSlug: 'panchang',
    relatedToolSlug: 'panchang-samvat-converter',
  },
  {
    slug: 'youtube-shorts-retention-vs-adsense-compliance',
    title: 'YouTube Partner Program vs Website AdSense: Solving Low Value Content, Crawl Hygiene & Policy Separation',
    category: 'Policy & Monetization',
    publishedDate: '2026-11-10',
    updatedDate: '2026-11-24',
    readMinutes: 15,
    summary:
      'A practical engineering and publisher breakdown of how Google separates YouTube monetization (YPP) from AdSense for Content, why link-hub SPAs fail review, and how static prerendering, deep tools, and non-content route guards earn trust.',
    takeaways: [
      'AdSense for YouTube (YPP) and AdSense for Content (Sites) apply completely separate review criteria under one payee profile.',
      'Executing adsbygoogle.js on 404 error screens, redirect bridges, or thin legal stubs violates Google Publisher Policy on non-content screens.',
      'Genuine standalone browser calculators plus 1,200+ word first-hand technical guides establish durable E-E-A-T publisher value.',
    ],
    relatedAppSlug: 'social-analytics',
    relatedToolSlug: 'youtube-earnings-estimator',
  },
  {
    slug: 'grassroots-competitions-pratiyogita-zero-log-quiz',
    title: 'Pratiyogita Architecture: Modular Monolith Boundaries, Verified School Hierarchies & Zero-Log Live Quizzes',
    category: 'Architecture',
    publishedDate: '2026-11-12',
    updatedDate: '2026-11-24',
    readMinutes: 13,
    summary:
      'Inside pratiyogita.keshavsingh.in: eliminating free-text school duplication on district leaderboards, verifying YouTube livestream quiz winners strictly in request memory, and auditing community UPI patronage without card storage.',
    takeaways: [
      'Canonical State -> District -> Verified School entity codes eliminate duplicate campus rows across multi-school academic olympiads.',
      'Ephemeral OAuth channel-handle inspection proves livestream commenter identity in RAM without persisting Google tokens.',
      'UPI intent deep-links paired with UTR verification queues provide transparent grassroots sponsorship without PCI-DSS card liability.',
    ],
    relatedAppSlug: 'pratiyogita',
    relatedToolSlug: 'api-latency-capacity-planner',
  },
  {
    slug: 'micro-app-monetization-ethics-user-trust',
    title: 'Domain Topology & Privacy Boundaries: Separating Public Publisher Hubs, Hiring CVs & Private Family Apps',
    category: 'Policy & Monetization',
    publishedDate: '2026-11-15',
    updatedDate: '2026-11-24',
    readMinutes: 12,
    summary:
      'Why mixing a personal resume, private family ledgers, and ad-supported creator utilities on one SPA creates UX and policy friction—and how clean subdomain isolation protects recruiters, families, and readers.',
    takeaways: [
      'Isolating portfolio.keshavsingh.in gives hiring managers a fast, zero-ad technical CV while freeing keshavsingh.in for deep public tools.',
      'Private household and mobile apps (Ghar Ledger, FamSphere) enforce strict ad-free data boundaries around personal records.',
      'Fail-closed consent storage defaults AdSense to non-personalized mode until a visitor explicitly opts into full telemetry.',
    ],
    relatedAppSlug: 'ghar-ledger',
    relatedToolSlug: 'json-ld-seo-schema-generator',
  },
  {
    slug: 'two-channel-comedy-strategy-local-vs-international',
    title: 'Dual-Track 3D Comedy Engineering: Global Visual Slapstick Loops vs Indian Khadi Bhasha Sitcoms',
    category: 'Creator & Media',
    publishedDate: '2026-11-17',
    updatedDate: '2026-11-24',
    readMinutes: 13,
    summary:
      'Why blending regional Hindi banter and silent international physical comedy inside one YouTube channel fractures recommendation cohorts—and how AnimStudio AI powers distinct retention-tuned production tracks.',
    takeaways: [
      'YouTube Shorts seed testing relies on clean language and humor cohort signals during the first 60 minutes after publication.',
      'Global slapstick relies on sub-2-second visual hazards, universal prop physics, and foley stingers rather than translated idioms.',
      'Regional Hinglish sitcoms win repeat binge sessions through recurring household characters, punchy callbacks, and 145 WPM pacing.',
    ],
    relatedAppSlug: 'animstudio',
    relatedToolSlug: 'short-hook-pacing-planner',
  },
  {
    slug: 'responsive-ssg-web-vitals-adsense-ux',
    title: 'Zero-CLS Static Prerendering & Core Web Vitals in Angular 22: Typography, Lazy Chunks & Theme Hydration',
    category: 'Architecture',
    publishedDate: '2026-11-18',
    updatedDate: '2026-11-24',
    readMinutes: 13,
    summary:
      'How Angular 22 static output mode, pre-paint theme scripts, route-level code splitting, fluid clamp() grids, and WCAG AA contrast tokens deliver instant LCP and sub-100ms INP on budget mobile networks.',
    takeaways: [
      'Running a tiny synchronous theme + consent initializer in <head> eliminates dark-mode flash and layout shifts during hydration.',
      'Splitting heavy catalog bodies into lazy route chunks cuts initial JavaScript download in half while keeping 100% static SSG HTML.',
      'Constrained 72ch prose measure, horizontal table scroll wrappers, and 40px+ touch targets prevent mobile viewport overflow.',
    ],
    relatedAppSlug: 'content-blog',
    relatedToolSlug: 'json-ld-seo-schema-generator',
  },
  {
    slug: 'multi-key-llm-failover-circuit-breaker-dotnet',
    title: 'Resilient Multi-Key Gemini & OpenAI API Pools in .NET 10: AES-256-GCM Encryption, Quota Cooldowns & Failover',
    category: 'Architecture',
    publishedDate: '2026-11-20',
    updatedDate: '2026-11-24',
    readMinutes: 15,
    summary:
      'Designing a zero-downtime LLM and TTS provider key pool in .NET 10 that encrypts API credentials at rest with AES-256-GCM, detects HTTP 429 rate-limit headers vs billing exhaustion, and fails over mid-pipeline without dropping batch jobs.',
    takeaways: [
      'Single hardcoded LLM API keys turn overnight batch rendering into brittle single points of failure whenever RPM or RPD quotas trip.',
      'Distinguishing transient 429 per-minute throttling from hard 403/billing exhaustion prevents cycling dead keys on every request.',
      'Envelope encryption with AES-256-GCM plus masked UI fingerprints lets admins rotate and test keys safely without exposing plaintext secrets.',
    ],
    relatedAppSlug: 'animstudio',
    relatedToolSlug: 'api-latency-capacity-planner',
  },
  {
    slug: 'ffmpeg-xfade-loudnorm-subtitle-burnin-pipeline',
    title: 'Production FFmpeg Filtergraphs for Creator Studios: Exact xfade Offset Math, EBU R128 Ducking & Devanagari Subtitles',
    category: 'Creator & Media',
    publishedDate: '2026-11-21',
    updatedDate: '2026-11-24',
    readMinutes: 15,
    summary:
      'Solving cumulative audio-video drift in multi-scene FFmpeg xfade timelines, sidechaincompress dialogue ducking over background music, two-pass EBU R128 loudness normalization (-14 LUFS), and crisp HarfBuzz Devanagari ASS subtitle rendering.',
    takeaways: [
      'Chained xfade filters shorten total video timeline by N * transitionDuration—ignoring cumulative overlap causes progressive audio desync.',
      'Sidechain compression ducks ambient music cleanly by 9–12 dB only during active speech syllables and restores warmth in pauses.',
      'Libass with HarfBuzz shaping is essential so Devanagari matras and conjunct ligatures never detach inside burned-in Shorts captions.',
    ],
    relatedAppSlug: 'animstudio',
    relatedToolSlug: 'ffmpeg-video-bitrate-storage-calculator',
  },
  {
    slug: 'surya-siddhanta-lahiri-ayanamsa-tithi-math',
    title: 'Nirayana Longitude & Tithi Mathematics: Implementing Lahiri Chitrapaksha Ayanamsa, Nakshatra & Karana in Code',
    category: 'Vedic Astronomy',
    publishedDate: '2026-11-21',
    updatedDate: '2026-11-24',
    readMinutes: 14,
    summary:
      'A rigorous developer guide to Julian Ephemeris Days (JDE), solar/lunar equation-of-center anomalies, Lahiri Chitrapaksha precession correction, Newton-Raphson root-finding for exact Tithi transition timestamps, and Kshaya/Adhika Tithi edge cases.',
    takeaways: [
      'Synodic Tithi depends on (Moon - Sun) where Ayanamsa cancels out, whereas Nakshatra and Nitya Yoga require exact Nirayana sidereal subtraction.',
      'Finding the exact minute a Tithi ends is a root-finding problem solved cleanly in 3–4 Secant or Newton-Raphson iterations over ephemeris longitudes.',
      'Lunar orbital eccentricity causes Tithi durations to swing between ~19.4 hours and ~26.8 hours, producing Kshaya and Adhika Tithis.',
    ],
    relatedAppSlug: 'panchang',
    relatedToolSlug: 'tithi-nakshatra-lunar-phase-calculator',
  },
  {
    slug: 'mongodb-indexing-multi-tenant-dotnet-microservices',
    title: 'MongoDB Schema & Compound Index Design for .NET 10 Platforms: The ESR Rule, Idempotent Upserts & TTL Collections',
    category: 'Architecture',
    publishedDate: '2026-11-22',
    updatedDate: '2026-11-24',
    readMinutes: 14,
    summary:
      'Practical data modeling patterns across our .NET 10 ecosystem: ordering Equality-Sort-Range (ESR) compound indexes, atomic findOneAndUpdate token rotation, TTL auto-expiry for OTPs/sessions, and avoiding unbounded array growth.',
    takeaways: [
      'Compound indexes ordered by Equality -> Sort -> Range (ESR) avoid in-memory blocking sorts and slash MongoDB collection scans.',
      'TTL indexes on expiresAt fields purge expired refresh tokens, OTP challenges, and webhook idempotency keys automatically with zero cron jobs.',
      'Bounded bucketing beats unbounded embedded document arrays once per-channel telemetry or household ledger entries cross hundreds of rows.',
    ],
    relatedAppSlug: 'ghar-ledger',
    relatedToolSlug: 'api-latency-capacity-planner',
  },
  {
    slug: 'procedural-threejs-webgl-character-rigging-shorts',
    title: 'Procedural 3D Character Animation in Three.js: Spring-Damper Expressions, Viseme Lip-Sync & Deterministic Capture',
    category: 'Creator & Media',
    publishedDate: '2026-11-22',
    updatedDate: '2026-11-24',
    readMinutes: 14,
    summary:
      'How to animate expressive 3D cartoon and devotional characters in WebGL without massive mocap files: damped harmonic spring physics, RMS/formant vowel viseme mapping, camera framing rules, and fixed-timestep frame export.',
    takeaways: [
      'Critically and slightly under-damped spring equations give procedural head turns and jaw-drops organic cartoon overshoot.',
      'Driving frame capture from an explicit fixed timestep (dt = 1/30s) instead of requestAnimationFrame wall clock guarantees repeatable MP4 renders.',
      'Three-point Rim + Key + Warm Bounce lighting separates 3D characters cleanly from busy vertical backgrounds on small phone screens.',
    ],
    relatedAppSlug: 'animstudio',
    relatedToolSlug: 'ffmpeg-video-bitrate-storage-calculator',
  },
  {
    slug: 'choghadiya-hora-muhurta-planetary-timekeeping',
    title: 'Classical Vedic Timekeeping Algorithms: Computing Day/Night Choghadiya, Planetary Hora & Equation of Time',
    category: 'Vedic Astronomy',
    publishedDate: '2026-11-23',
    updatedDate: '2026-11-24',
    readMinutes: 13,
    summary:
      'Complete algorithmic specification for Day Dinamana and Night Ratrimana octets (Choghadiya), Chaldean 24-Hora weekday rulership proof, Brahma Muhurta, and why solar noon drifts ±16 minutes across the year via the Equation of Time.',
    takeaways: [
      'Nighttime Choghadiya slices span today’s Sunset to tomorrow’s Sunrise—never symmetric with daytime duration outside equinoxes.',
      'The 7-planet Chaldean Hora cycle mod 24 hours mathematically generates the universal weekday order (Sun -> Moon -> Mars -> Mercury -> Jupiter -> Venus -> Saturn).',
      'Apparent solar noon differs from 12:00 civil time due to both longitude offset from 82.5°E and Earth’s orbital Equation of Time.',
    ],
    relatedAppSlug: 'panchang',
    relatedToolSlug: 'panchang-samvat-converter',
  },
  {
    slug: 'technical-seo-angular-ssg-cwv-publisher-checklist',
    title: 'Angular Static Prerendering (SSG) & Technical SEO Audit Playbook: Canonical Graphs, JSON-LD & Crawl Budget',
    category: 'Policy & Monetization',
    publishedDate: '2026-11-23',
    updatedDate: '2026-11-24',
    readMinutes: 14,
    summary:
      'A repeatable pre-deployment audit for Angular static sites: verifying self-referencing canonicals in raw build HTML, escaping inline JSON-LD safely, pruning thin utility URLs from sitemap.xml, and handling 404 fallbacks cleanly.',
    takeaways: [
      'Never trust client-only DevTools inspection—always verify raw prerendered dist/**/index.html files for unique <title> and <link rel="canonical">.',
      'Keep sitemap.xml strictly focused on 200-OK indexable canonical content pages; exclude noindex aliases, bridges, and error routes.',
      'Unicode-escape <, >, and & inside inline JSON-LD scripts so user or catalog strings can never break HTML document parsing.',
    ],
    relatedAppSlug: 'content-blog',
    relatedToolSlug: 'json-ld-seo-schema-generator',
  },
  {
    slug: 'oauth2-pkce-webauthn-passkeys-token-security',
    title: 'Hardening Browser Authentication in 2026: OAuth 2.1 PKCE, FIDO2 Passkey Ceremonies, Token Rotation & CSP',
    category: 'Architecture',
    publishedDate: '2026-11-24',
    updatedDate: '2026-11-24',
    readMinutes: 14,
    summary:
      'Defense-in-depth patterns for modern Angular + .NET web applications: replacing localStorage tokens with in-memory bearers, implementing WebAuthn challenge-response ceremonies, detecting refresh-token family theft, and deploying strict CSP headers.',
    takeaways: [
      'Storing long-lived bearer JWTs in localStorage exposes full account takeover to any single XSS gadget; keep access tokens in memory only.',
      'Refresh-token family tracking revokes the entire token lineage immediately if an already-rotated token is replayed by an attacker.',
      'FIDO2 passkeys eliminate phishing entirely because cryptographic signatures bind strictly to the browser-verified RP ID origin.',
    ],
    relatedAppSlug: 'portfolio',
    relatedToolSlug: 'cron-jwt-epoch-developer-toolkit',
  },
];
