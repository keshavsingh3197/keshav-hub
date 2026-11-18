export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  codeOrTable?: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
}

export interface EngineeringGuide {
  slug: string;
  title: string;
  category: 'Architecture' | 'Creator & Media' | 'Vedic Astronomy' | 'Policy & Monetization';
  publishedDate: string;
  updatedDate: string;
  readMinutes: number;
  summary: string;
  takeaways: string[];
  sections: GuideSection[];
  relatedAppSlug: string;
  relatedToolSlug?: string;
}

export const ENGINEERING_GUIDES: EngineeringGuide[] = [
  {
    slug: 'federated-sso-dotnet-angular-architecture',
    title: 'One Identity Across Eight Domains: Designing .keshavsingh.in SSO with .NET 10, Passkeys & Dynamic CORS',
    category: 'Architecture',
    publishedDate: '2026-10-12',
    updatedDate: '2026-11-18',
    readMinutes: 9,
    summary:
      'How we unified Admin, AnimStudio AI, Hindu Panchang, Pratiyogita, Social Analytics, Ghar Ledger, and Content Blog around a single identity provider (id.keshavsingh.in) with FIDO2 passkeys, replay-safe refresh rotation, and zero hardcoded CORS wildcards.',
    takeaways: [
      'A wildcard CORS rule on *.keshavsingh.in creates subdomain-takeover blast radius if DNS outlives an old service.',
      'Scoped apps validate symmetric HS256 JWTs issued by id.keshavsingh.in without maintaining separate password databases.',
      'WebAuthn RelyingPartyId is pinned to keshavsingh.in while login ceremonies remain restricted to explicit origin allowlists.'
    ],
    relatedAppSlug: 'portfolio',
    relatedToolSlug: 'api-latency-capacity-planner',
    sections: [
      {
        heading: 'Why Multiple Independent Logins Break Multi-App Ecosystems',
        paragraphs: [
          'When a digital ecosystem grows from one site into eight specialized applications, duplicating user tables across every database quickly turns into a maintenance trap. Password resets drift out of sync, audit logs fragment across separate services, and users hesitate to register again on a sibling tool they only plan to test for two minutes.',
          'Rather than embedding local login screens inside Pratiyogita, Hindu Panchang, Ghar Ledger, or AnimStudio AI, we separated authentication cleanly. A single .NET 10 identity service running on id.keshavsingh.in owns password verification, two-factor challenges, FIDO2 passkeys, and short-lived access tokens. Every sibling website acts strictly as a stateless resource server validating tokens issued under a shared issuer and audience contract.'
        ]
      },
      {
        heading: 'Preventing Subdomain Takeover With Explicit Origin Validation',
        paragraphs: [
          'Sharing an HTTP-only refresh cookie across .keshavsingh.in requires disciplined cross-origin controls. Because credentialed CORS responses tell the browser to carry the shared session cookie, admitting an unconstrained wildcard rule across every subdomain would let any forgotten CNAME or retired test deployment inherit session authority.',
          'Our DynamicEcosystemCorsPolicyProvider combines startup config origins with active records in MongoDB website registry metadata, enforcing HTTPS scheme checks and exact origin comparisons in production.'
        ],
        codeOrTable: {
          caption: 'Boundary Responsibilities Across Central Identity and Resource APIs',
          headers: ['Layer', 'Host', 'Primary Responsibility', 'Session State'],
          rows: [
            ['Central Identity API', 'id.keshavsingh.in', 'Passwords, OTP, FIDO2 Passkeys, Token Rotation', 'Mongo refresh_tokens'],
            ['Admin Workspace', 'admin.keshavsingh.in', 'RBAC grants, Website Registry, Global i18n Seeds', 'Bearer JWT + Cookie'],
            ['AnimStudio AI', 'studio.keshavsingh.in', 'Storyboards, FFmpeg renders, Channel scheduling', 'JWT Validation Only'],
            ['Ghar Ledger', 'ghar.keshavsingh.in', 'Household vendor entries mapped to SSO sub ID', 'JWT Validation Only']
          ]
        }
      },
      {
        heading: 'Handling Multi-Tab Refresh Races Safely',
        paragraphs: [
          'In modern browser apps, a visitor often keeps two ecosystem tabs open side by side. If both tabs notice an expired access token at the exact same millisecond and fire simultaneous refresh calls, naive token rotation flags the second request as replay theft and revokes the user session.',
          'Inside sibling frontends like AnimStudio AI, refresh POST calls opt out of blind HTTP retry loops and serialize concurrent browser-tab refresh attempts using the Web Locks API where supported, while preserving clean cookie domain upgrades on matching production hosts.'
        ],
        bullets: [
          'Never auto-retry state-changing refresh POST calls in transient HTTP failure interceptors.',
          'Bind FIDO2 RelyingPartyId to keshavsingh.in once, but allowlist exact ceremony Origins only.',
          'Serve non-secret cross-site configuration through public GET /api/config so UI shells never drift.'
        ]
      }
    ]
  },
  {
    slug: 'ai-3d-animation-pipeline-ffmpeg-webgl',
    title: 'Building AnimStudio AI: Multi-Track Timelines, FFmpeg Transitions, WebGL Scenes & Motion Copy',
    category: 'Creator & Media',
    publishedDate: '2026-10-28',
    updatedDate: '2026-11-18',
    readMinutes: 10,
    summary:
      'A practical engineering walkthrough of how AnimStudio AI unites Three.js procedural 3D characters, Comedy & Story Agent storyboards, multi-voice emotional TTS, and FFmpeg xfade rendering into reproducible 9:16 Shorts and 16:9 YouTube episodes.',
    takeaways: [
      'Deterministic scene-level JSON schemas let creators work seamlessly either with AI models or zero-cost manual prompts.',
      'WebGL viewport approximations stay fast during scrubbing while FFmpeg owns the deterministic final composite render.',
      'Pre-publish metadata verification stops scheduled YouTube uploads from going live with empty thumbnails or mismatched tags.'
    ],
    relatedAppSlug: 'animstudio',
    relatedToolSlug: 'short-hook-pacing-planner',
    sections: [
      {
        heading: 'Designing a Reliable Script-to-Timeline Data Model',
        paragraphs: [
          'Most browser AI video generators break down the moment a creator needs to fix line three without regenerating lines one, two, and four. AnimStudio AI avoids black-box generation by enforcing an explicit scene storyboard document between writing and video encoding.',
          'Each scene holds exact spoken dialogue, speaker identity, emotional delivery tag, camera framing hint, duration budget, attached visual asset or procedural 3D archetype, and transition metadata. Creators can edit dialogue timing or swap expressions without invalidating already approved renders.'
        ]
      },
      {
        heading: 'Bridging Real-Time Browser Preview and Native FFmpeg Export',
        paragraphs: [
          'Waiting twenty seconds on a server encode after tweaking a fade duration ruins creative flow. Our studio timeline approximates dips, blur-through transitions, zooms, and aspect framing using lightweight browser preview layers synchronized with exact millisecond cues.',
          'When the creator approves the timing, the .NET backend compiles clean FFmpeg filtergraphs using native xfade filters, audio ducking across dialogue and background beds, and burn-in Devanagari or Latin subtitles rendered with readable padding inside safe UI margins for YouTube Shorts.'
        ],
        codeOrTable: {
          caption: 'Aspect Framing & Output Profiles in AnimStudio AI',
          headers: ['Preset', 'Dimensions', 'Primary Destination', 'Caption & Title Zone'],
          rows: [
            ['Vertical Short', '1080 x 1920 (9:16)', 'YouTube Shorts & Reels', 'Centered upper-middle safe frame avoiding bottom buttons'],
            ['Cinema Episode', '1920 x 1080 (16:9)', 'Standard YouTube & Edu', 'Lower-third clean subtitle band'],
            ['Square Feed', '1080 x 1080 (1:1)', 'Social Posts & Community', 'Symmetric safe padding']
          ]
        }
      },
      {
        heading: 'Originality With 3D Comedy Archetypes & Motion Copy',
        paragraphs: [
          'YouTube viewers quickly swipe away from static slideshows or unedited reposted clips. To build authentic visual identity, AnimStudio combines procedural 3D characters (including stylized comedy archetypes with exaggerated double-take reactions) with a Motion Copy workflow that drives clean 3D characters from reference motion cues over bespoke stages.',
          'Paired with mandatory pre-upload inspection of titles, tags, descriptions, and custom thumbnails before scheduled publication windows, creators keep both viewer retention and channel quality safeguards high.'
        ]
      }
    ]
  },
  {
    slug: 'astronomical-vedic-panchang-calculations',
    title: 'Engineering Accurate Hindu Panchang Timings: Sunrise-Anchored Tithi, Nakshatra & Rahu Kaal',
    category: 'Vedic Astronomy',
    publishedDate: '2026-11-01',
    updatedDate: '2026-11-18',
    readMinutes: 8,
    summary:
      'Why naive UTC lookup tables break Indian festival and muhurat websites, and how panchang.keshavsingh.in computes astronomical solar-lunar limbs, Vikram Samvat epochs, and location-specific planetary kaal slices.',
    takeaways: [
      'A Hindu Panchang day runs from local sunrise to the next local sunrise rather than midnight to midnight.',
      'Rahu Kaal, Yamaganda, and Gulika Kaal split exact daytime length into eight unequal-by-season segments.',
      'Separating ephemeris math cleanly from content editorial pipelines prevents publishing misdated festival shorts.'
    ],
    relatedAppSlug: 'panchang',
    relatedToolSlug: 'panchang-samvat-converter',
    sections: [
      {
        heading: 'Midnight Calendars vs Sunrise-Anchored Vedic Days',
        paragraphs: [
          'The most frequent defect across lightweight devotional calendars on the web is applying Western midnight rollovers directly to Hindu festival and Tithi dates. In classical Panchang calculations, the civil day belongs to the Tithi prevailing at local sunrise (Udaya Tithi), while transitional ending moments shift significantly from east to west across India and international timezones.',
          'When we engineered Hindu Panchang (panchang.keshavsingh.in) alongside Daily Auto-Post video scripting in AnimStudio AI, we built explicit astronomical verification so morning events, festival names, and Aaj Ka Itihaas dates never display mismatched times or wrong-day announcements.'
        ]
      },
      {
        heading: 'Computing Eight-Part Planetary Slices (Rahu Kaal & Choghadiya)',
        paragraphs: [
          'Popular tables sometimes memorize "7:30 AM to 9:00 AM" on Mondays as a fixed constant, forgetting that summer days in Delhi stretch over thirteen hours while winter days shrink toward ten hours. Real planetary periods divide actual duration from local sunrise to sunset by eight equal slices.',
          'You can test this exact math firsthand using our interactive Samvat & Kaal Calculator right inside this hub before inspecting full multi-city lunar longitudes on panchang.keshavsingh.in.'
        ],
        bullets: [
          'Monday Rahu Kaal falls on Slice 2 of 8; Saturday uses Slice 3; Friday uses Slice 4.',
          'Tuesday, Wednesday, Thursday, and Sunday follow Slices 7, 5, 6, and 8 respectively.',
          'Abhijit Muhurat occupies roughly the 8th of 15 daytime Muhurtas centered on local solar noon (avoided on Wednesdays by several regional traditions).'
        ]
      }
    ]
  },
  {
    slug: 'youtube-shorts-retention-vs-adsense-compliance',
    title: 'YouTube Partner Program vs Website AdSense: Avoiding Low Value Content & External Link Mistakes',
    category: 'Policy & Monetization',
    publishedDate: '2026-11-10',
    updatedDate: '2026-11-18',
    readMinutes: 11,
    summary:
      'A clear breakdown of how Google separates AdSense for YouTube (YPP) from Website AdSense, why personal resume portfolios trigger Low Value Content rejections, and the structural fixes required before requesting site review.',
    takeaways: [
      'YouTube channel monetization reviews video originality and Community Guidelines independently of having an AdSense-approved website.',
      'Personal single-page portfolios fail Website AdSense because sparse CV text and CSR SPAs lack deep, crawlable publisher value.',
      'Static Site Generation (prerendering), ads.txt, original tools, privacy disclosures, and 1,000-word guides satisfy both search bots and ad quality raters.'
    ],
    relatedAppSlug: 'social-analytics',
    relatedToolSlug: 'youtube-earnings-estimator',
    sections: [
      {
        heading: 'Why Creators Confuse YouTube AdSense and Website AdSense',
        paragraphs: [
          'Creators scaling their presence beyond YouTube frequently assume their channel’s monetization depends on attaching a website under the same AdSense account. In reality, Google maintains two completely distinct approval tracks under one payee umbrella.',
          'AdSense for YouTube must be initiated directly inside YouTube Studio under the Earn tab once a channel crosses watch-hour or Shorts-view eligibility thresholds. Reviewers inspect video originality, transformation, voice/visual authorship, and YouTube advertiser-friendly rules. By contrast, adding a domain inside AdSense -> Sites triggers AdSense for Content crawlers that audit written editorial depth, navigation clarity, E-E-A-T trust signals, and publisher inventory value.'
        ]
      },
      {
        heading: 'Why Portfolio SPAs Get Flagged as "Low Value Content"',
        paragraphs: [
          'When an apex domain serves a personal developer resume built as a client-rendered Single Page Application with only a home route, a CV route, and boilerplate legal links, two automated rejection signals fire simultaneously:',
          'First, without server-side rendering or static route prerendering, initial HTTP responses carry minimal semantic HTML text before JavaScript executes dynamic API fetches. Second, a personal portfolio is inherently commercial self-promotion rather than an informational resource with 20+ indexable guides, tools, or community utilities.',
          'Third, linking out to separate functional web apps on subdomains without substantive first-party explainers or interactive utilities on the apex domain can appear like a lightweight directory.'
        ],
        codeOrTable: {
          caption: 'Portfolio Domain Audit vs Dedicated Ecosystem Publisher Hub',
          headers: ['Signal Checked by Reviewers', 'Legacy Resume SPA on Apex', 'Dedicated Hub on keshavsingh.in'],
          rows: [
            ['Indexable HTML at Request Time', 'Client CSR shell + 8 sitemap URLs', '25+ static SSG prerendered routes'],
            ['Primary Purpose of Site', 'Personal engineering resume & CV', 'Interactive tools, platform docs, guides, creator hub'],
            ['Native Interactive Utilities', 'None on apex domain', '4 client calculators with live formulas & FAQs'],
            ['Editorial Substance per Route', 'Short bullets / dynamic widgets', 'Multi-section 800–1,200 word original guides'],
            ['External Link Alignment', 'Mixed portfolio + raw video links', 'Clear product walkthroughs, policies & channel attribution']
          ]
        }
      },
      {
        heading: 'Checklist Before Linking Website URLs Inside YouTube Descriptions',
        paragraphs: [
          'YouTube’s External Links Policy permits linking to your official website from channel headers, video descriptions, and end screens as long as the destination enforces honest navigation, clean HTTPS delivery, accurate privacy policies, and zero deceptive downloads or spam redirects.',
          'Separating the software resume onto portfolio.keshavsingh.in while hosting rich tools, guides, creator updates, and transparent plans on keshavsingh.in ensures every viewer arriving from @keshavsinghworld, @OmkarShivBhakti, or @KESHAV-ANIM-FF lands on an immediately useful page.'
        ]
      }
    ]
  },
  {
    slug: 'grassroots-competitions-pratiyogita-zero-log-quiz',
    title: 'Pratiyogita Architecture: Verified Community Tournaments & Zero-Log YouTube Live Quiz Claims',
    category: 'Architecture',
    publishedDate: '2026-11-12',
    updatedDate: '2026-11-18',
    readMinutes: 8,
    summary:
      'Inside the design of pratiyogita.keshavsingh.in: standardized school and district hierarchies, modular monolith domain boundaries, zero-storage YouTube viewer identity verification, and transparent UPI supporter auditing.',
    takeaways: [
      'Modular monoliths with strict per-module MongoDB collections avoid premature distributed complexity while keeping microservice split lines clear.',
      'In-memory OAuth channel checks prove commenter identity on livestream quiz claims without storing refresh tokens or user emails.',
      'Deep-linked UPI intents keep sensitive card and banking credentials completely out of community donation flows.'
    ],
    relatedAppSlug: 'pratiyogita',
    sections: [
      {
        heading: 'Solving Free-Text Chaos in District & School Leaderboards',
        paragraphs: [
          'Anyone who has tried aggregating scores across dozens of local schools knows the spelling trap: "St. Xavier", "St Xavier High School", and "Saint Xaviers Jaipur" scatter the same campus across three separate leaderboard rows. Pratiyogita solves this from day one with normalized Location entities and admin-verified School codes.',
          'A registered user can onboard a school immediately, while its Pending status prevents spoofed campuses from flooding official topper boards before review.'
        ]
      },
      {
        heading: 'Designing Zero-Log Livestream Quiz Claims',
        paragraphs: [
          'Interactive livestream quizzes bring real excitement to creator channels, but claiming a spot on the Hall of Winners introduces an impersonation challenge: anyone watching a stream could otherwise type someone else’s handle into a form.',
          'Rather than saving long-lived Google OAuth tokens in our database, Pratiyogita performs an ephemeral read of the viewer’s public YouTube channel title solely in request memory to verify handle ownership, records the verified claim with timestamp and quiz ID, and never persists secrets or private YouTube scopes.'
        ]
      }
    ]
  },
  {
    slug: 'micro-app-monetization-ethics-user-trust',
    title: 'Why We Split keshavsingh.in (Hub) From portfolio.keshavsingh.in: Designing Ad-Safe Utility Platforms',
    category: 'Policy & Monetization',
    publishedDate: '2026-11-18',
    updatedDate: '2026-11-18',
    readMinutes: 8,
    summary:
      'The architectural reasoning behind separating our software developer CV onto portfolio.keshavsingh.in, dedicating the apex domain keshavsingh.in to original tools and documentation, and keeping family utilities ad-light.',
    takeaways: [
      'A personal hiring portfolio serves recruiters best when fast, distraction-free, and devoid of display ad clutter.',
      'High-utility hubs earn trust by shipping working interactive calculators, honest methodology explanations, and full privacy clarity.',
      'Sensitive personal/family apps such as Ghar Ledger and FamSphere never monetize private user logs through third-party ad networks.'
    ],
    relatedAppSlug: 'ghar-ledger',
    relatedToolSlug: 'panchang-samvat-converter',
    sections: [
      {
        heading: 'Respecting Context Across Hiring, Utility Tools & Family Privacy',
        paragraphs: [
          'One domain trying to act simultaneously as a software engineer’s CV, a marketing launcher, a video gallery, and a mobile app privacy anchor creates friction for every group reading it. Recruiters looking for .NET microservices architecture do not need display banners next to bullet points; AdSense quality systems looking for informational value do not want sparse resume headers; and Google Play privacy reviewers expect crystal-clear data disclosures.',
          'Moving Omkr.WebApp.Portfolio cleanly onto portfolio.keshavsingh.in lets recruiters focus purely on engineering experience, skills, GitHub work, and downloadable PDF CVs.'
        ]
      },
      {
        heading: 'Elevating the Apex Domain With First-Party Substance',
        paragraphs: [
          'Meanwhile, keshavsingh.in now operates as the genuine front door to the ecosystem: documenting every sibling application end to end, providing client-side calculators that work immediately without sign-in, showcasing @keshavsinghworld, @OmkarShivBhakti, and @KESHAV-ANIM-FF creator series, publishing full engineering guides, and outlining transparent community membership plans and roadmap milestones.'
        ],
        bullets: [
          'Privacy-first boundary: FamSphere (in.keshavsingh.famsphere) and Ghar Ledger household data remain completely outside ad profiling.',
          'Central ads.txt sits cleanly at https://keshavsingh.in/ads.txt alongside transparent DoubleClick/AdSense cookie choices.',
          'Static route prerendering guarantees every guide, tool page, app page, and legal disclosure is crawlable on first byte.'
        ]
      }
    ]
  }
];
