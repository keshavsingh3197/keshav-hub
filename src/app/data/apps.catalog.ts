export interface AppFaqItem {
  question: string;
  answer: string;
}

export interface EcosystemAppDetail {
  slug: string;
  key: string;
  name: string;
  badge: string;
  category: 'Creator & Media' | 'Culture & Knowledge' | 'Community & Family' | 'Engineering & Career';
  url: string;
  ctaLabel: string;
  shortTagline: string;
  summary: string;
  whoItIsFor: string;
  architectureStack: string[];
  capabilities: string[];
  workflows: { title: string; detail: string }[];
  privacyAndTrust: string;
  faqs: AppFaqItem[];
}

export const ECOSYSTEM_APPS: EcosystemAppDetail[] = [
  {
    slug: 'animstudio',
    key: 'studio',
    name: 'AnimStudio AI',
    badge: '3D Video & Shorts Studio',
    category: 'Creator & Media',
    url: 'https://studio.keshavsingh.in',
    ctaLabel: 'Open AnimStudio AI',
    shortTagline: 'Multi-track 2D/3D video production engine, Story Agent, comedy workspace, Motion Copy & YouTube scheduler.',
    summary:
      'AnimStudio AI is a browser-and-FFmpeg video production workstation built for creators who publish regular storytelling, devotional katha reels, and 3D comedy shorts. Instead of juggling scattered scripts, voiceovers, subtitles, and upload dashboards, creators draft scenes, synthesize speech, preview real-time transitions, replace characters via Motion Copy, and schedule compliant metadata to connected YouTube channels from one workspace.',
    whoItIsFor: 'Digital storytellers, animation creators, educational channels, and solo media teams managing bilingual Hindi + English video pipelines.',
    architectureStack: ['.NET 10 Web API', 'Angular 22 Standalone UI', 'FFmpeg xfade & audio ducking', 'Three.js / WebGL 3D scenes', 'Central SSO (id.keshavsingh.in)'],
    capabilities: [
      'Multi-track timeline with playhead trimming, split points, Music Video xfade transitions, and audio ducking over ambient beds.',
      'Story Agent with source-grounded citation checking (including Wikisource Granth references) and character-level emotion tagging.',
      'Comedy & Funny Stories workspace supporting Funny Levels, Comedy Challenge, and Misunderstanding structures in 30s and 60s presets.',
      'Motion Copy 3D pipeline for driving custom 3D animated rigs and replacement backdrops while stripping source backgrounds.',
      'Daily Auto-Post Hub synchronizing Hindu Panchang timings, Aaj Ka Itihaas, Pratiyogita highlights, and YouTube scheduled metadata verification.'
    ],
    workflows: [
      {
        title: '1. Script to Verified Storyboard',
        detail: 'Pick an archetype (Daily Vedic Katha, Funny Story, or Explainer), generate or paste a structured JSON storyboard, and audit every line, speaker emotion, and visual prompt before rendering.'
      },
      {
        title: '2. Render 9:16 Shorts or 16:9 Episodes',
        detail: 'Switch aspect ratios cleanly between vertical reels and widescreen YouTube episodes with automatic safe framing, custom stingers, and synthesized multi-character TTS narration.'
      },
      {
        title: '3. Verify Schedule & Publish',
        detail: 'Review title, description, tags, thumbnails, and publish timestamps directly against YouTube channel state so scheduled uploads never ship with missing metadata.'
      }
    ],
    privacyAndTrust: 'No auto-publishing happens without creator review. Referenced external links go through URL normalization and explicit user confirmation before YouTube upload.',
    faqs: [
      {
        question: 'Does AnimStudio AI publish videos without my approval?',
        answer: 'No. Every storyboard, rendered MP4 preview, thumbnail, title, tag list, and scheduled time requires explicit review inside the studio before submission.'
      },
      {
        question: 'Can I use AnimStudio AI without configuring a paid LLM key?',
        answer: 'Yes. Built-in templates and the paste-JSON import mode let you draft or refine stories anywhere and assemble audio, subtitles, transitions, and renders locally.'
      },
      {
        question: 'What aspect ratios are supported for export?',
        answer: 'Native presets cover 9:16 (YouTube Shorts / Reels), 16:9 (Widescreen YouTube), 1:1 (Square feed), and 4:5 portrait layouts.'
      }
    ]
  },
  {
    slug: 'panchang',
    key: 'panchang',
    name: 'Hindu Panchang & Sanskriti Hub',
    badge: 'Daily Panchang & Vedic Calendar',
    category: 'Culture & Knowledge',
    url: 'https://panchang.keshavsingh.in',
    ctaLabel: 'Check Today’s Panchang',
    shortTagline: 'Location-aware Tithi, Nakshatra, Yoga, Karana, sunrise/sunset muhurats, Choghadiya & Aaj Ka Itihaas.',
    summary:
      'Hindu Panchang & Sanskriti Hub calculates daily Vedic calendar limbs anchored accurately to local sunrise and geographic coordinates rather than generic fixed templates. Visitors can switch dates and cities, verify Rahu Kaal and Abhijit windows, explore Vrat/Festival dates, read daily historical milestones (Aaj Ka Itihaas), and watch curated devotional kathas.',
    whoItIsFor: 'Families checking daily Shubh Muhurat and fasting dates, cultural researchers, and viewers following @OmkarShivBhakti spiritual series.',
    architectureStack: ['.NET 10 Ephemeris Engine', 'Angular 22 Bilingual (HI/EN)', 'MongoDB Festival Catalog', 'Central Localization API'],
    capabilities: [
      'Complete 5-limb Panchang: Tithi, Nakshatra, Yoga, Karana, and Vaara alongside Vikram Samvat and Shaka Samvat year tracking.',
      'Location-sensitive Sunrise, Sunset, Moonrise, Abhijit Muhurat, Brahma Muhurat, Rahu Kaal, Yamaganda, and Gulika Kaal intervals.',
      'Interactive Day & Night Choghadiya planner showing Amrit, Shubh, Labh, Char, Rog, Kaal, and Udveg periods.',
      'Daily Aaj Ka Itihaas historical milestones, classical Sanskrit mantras, and Pauranik Katha moral reflections.'
    ],
    workflows: [
      {
        title: '1. Select Date & City',
        detail: 'Choose your city and target date to recalculate sunrise-anchored lunar Tithi transitions and daytime planetary periods.'
      },
      {
        title: '2. Plan Auspicious Activities',
        detail: 'Cross-check Abhijit Muhurat and Choghadiya windows while avoiding Rahu Kaal during daily planning or festival observances.'
      },
      {
        title: '3. Explore Cultural Context',
        detail: 'Read verified historical notes and watch matching 3D devotional explainers directly in English or Hindi.'
      }
    ],
    privacyAndTrust: 'Public calendar calculations run freely without requiring sign-in; editor publishing routes under /manage are strictly role-gated via Central SSO.',
    faqs: [
      {
        question: 'Why does changing the city change Panchang timings?',
        answer: 'Vedic Panchang intervals such as Rahu Kaal, Choghadiya, and Brahma Muhurat are fractions derived from local sunrise and sunset at your longitude and latitude.'
      },
      {
        question: 'Is Hindi supported natively?',
        answer: 'Yes. The portal defaults cleanly with bilingual English and Devanagari Hindi labels managed through Central Localization.'
      }
    ]
  },
  {
    slug: 'pratiyogita',
    key: 'pratiyogita',
    name: 'Pratiyogita',
    badge: 'Exams, Sports & Live Quiz Winners',
    category: 'Community & Family',
    url: 'https://pratiyogita.keshavsingh.in',
    ctaLabel: 'Visit Pratiyogita',
    shortTagline: 'Grassroots school olympiads, local sports fixtures, verified toppers leaderboard & zero-log YouTube live quiz arena.',
    summary:
      'Pratiyogita brings structured fairness to grassroots school exams, neighborhood sports tournaments, and interactive community live quizzes. Schools can register students under location-standardized city/district hierarchies, view match fixtures and scoreboards, contribute transparently with UPI reference verification, and claim YouTube livestream quiz wins.',
    whoItIsFor: 'Schools, students, local sports organizers, community patrons, and viewers participating in verified YouTube livestream quizzes.',
    architectureStack: ['.NET 10 Modular Monolith', 'Angular 22 Standalone + Signals', 'Zero-Log YouTube Identity Check', 'UPI Deep-Link Intent Flow'],
    capabilities: [
      'Academic exams/olympiads and community sports tournament registrations scoped by verified school and city/district codes.',
      'Fixture schedules, round results, and multi-filter leaderboards highlighting location and school toppers.',
      'Zero-log YouTube Channel verification for Live Stream Quiz claims: inspects your public channel title in memory without saving OAuth tokens.',
      'Transparent UPI contribution workflow withUTR audit references and Admin verification queue — zero card numbers stored.'
    ],
    workflows: [
      {
        title: '1. Browse Competitions & Toppers',
        detail: 'Filter Academic and Sports categories by location, level (School to State), and season to inspect live fixtures and official leaderboards.'
      },
      {
        title: '2. Participate in Live Stream Quiz',
        detail: 'Open /winners during an active livestream, verify your channel name in memory without persistent OAuth storage, and submit your answer.'
      },
      {
        title: '3. Support Community Events',
        detail: 'Generate a verified UPI pay intent and submit the transaction reference for public acknowledgement on the supporter board.'
      }
    ],
    privacyAndTrust: 'Pratiyogita never collects bank passwords or credit card numbers and never writes YouTube OAuth tokens to disk or database during quiz verification.',
    faqs: [
      {
        question: 'How does Zero-Log YouTube verification protect viewers?',
        answer: 'Sign-in checks only your public channel display name in request memory to stop impersonation on prize claims and immediately discards session tokens.'
      },
      {
        question: 'Are schools verified before appearing on public leaderboards?',
        answer: 'Yes. Self-registered schools stay Pending until reviewed and assigned a unique school code by an administrator.'
      }
    ]
  },
  {
    slug: 'social-analytics',
    key: 'social',
    name: 'SocialPulse Analytics',
    badge: 'Creator Telemetry & RPM',
    category: 'Creator & Media',
    url: 'https://social.keshavsingh.in',
    ctaLabel: 'Open SocialPulse Analytics',
    shortTagline: 'Multi-platform growth benchmarking, Views-per-Subscriber outlier tracking, RPM calculator & AI hook diagnostics.',
    summary:
      'SocialPulse Analytics empowers independent creators to understand why specific videos break out organically instead of guessing. By comparing Views-per-Subscriber ratios across channels, simulating niche/geography RPM curves, and reviewing hook and CTR telemetry, creators turn raw upload history into repeatable production playbooks.',
    whoItIsFor: 'YouTube, Shorts, and Instagram creators analyzing content outliers, retention drop-offs, and cross-platform funnel conversions.',
    architectureStack: ['.NET 10 Analytics API', 'Angular 22 Signals UI', 'MongoDB Telemetry Collections', 'Central SSO (id.keshavsingh.in)'],
    capabilities: [
      'Views-per-Subscriber outlier benchmarking to isolate formats that outperform subscriber baseline.',
      'Public earnings and RPM simulator for estimating long-form, Shorts, affiliate, and sponsor revenue.',
      'Title CTR, hook pacing, and regional publish-window diagnostics tuned for Indian and global audiences.',
      'Unified traffic attribution tracking readers moving from social videos onto ecosystem web utilities.'
    ],
    workflows: [
      {
        title: '1. Spot High-Multiplier Formats',
        detail: 'Rank recent uploads by views-to-subscribers ratio to identify comedic archetypes, cultural kathas, or developer explainers with breakout reach.'
      },
      {
        title: '2. Model Regional RPM Scenarios',
        detail: 'Compare blended income when targeting India vs international Tier-1 viewers across Shorts and long-form playlists.'
      }
    ],
    privacyAndTrust: 'Public calculators run anonymously on first load while personal channel workspaces authenticate strictly via Central SSO.',
    faqs: [
      {
        question: 'Do I need to connect a channel before testing benchmarks?',
        answer: 'No. Public Visitor Mode lets any creator run growth projections and study public benchmarks without creating an account.'
      }
    ]
  },
  {
    slug: 'content-blog',
    key: 'blog',
    name: 'Engineering Content Blog',
    badge: 'Technical Knowledge Base',
    category: 'Engineering & Career',
    url: 'https://blog.keshavsingh.in',
    ctaLabel: 'Read the Tech Blog',
    shortTagline: 'Hands-on software engineering notes on C#/.NET, Azure, AWS, Docker, Kubernetes, SQL & GoF design patterns.',
    summary:
      'The Engineering Content Blog serves as an open-source technical reference written from real enterprise backend delivery experience. Rather than shallow news summaries, every markdown note walks through concrete tradeoffs: CLR memory internals, AWS KMS encryption, Azure DevOps YAML pipelines, SQL tuning, Kubernetes deployment topology, and interview Q&A.',
    whoItIsFor: 'Backend engineers, cloud practitioners, and students preparing for senior .NET and distributed-systems interviews.',
    architectureStack: ['Angular 22 Markdown Reader', '.NET 10 Comment & Media API', 'GitHub-synced Markdown Corpus', 'Print-optimized Light Stylesheet'],
    capabilities: [
      'Organized topic folders covering C#, Azure, AWS, Containerization, SQL, GoF Design Patterns, Networking, and Interview Prep.',
      'Instant full-text search, case-insensitive tag index, table-of-contents outline, and reading time estimates.',
      'Clean print-friendly stylesheet stripping dark shells and menus when engineers print study sheets or export PDFs.',
      'Authenticated community comments powered by Central SSO with manual account approval to prevent bot spam.'
    ],
    workflows: [
      {
        title: '1. Browse by Stack or Tag',
        detail: 'Jump directly into C#, Azure, AWS, SQL, or Design Patterns and switch between interactive reading and printable study mode.'
      },
      {
        title: '2. Join Moderated Discussions',
        detail: 'Sign in with Central SSO to post code corrections, follow-up questions, and production edge cases beneath any tutorial.'
      }
    ],
    privacyAndTrust: 'Zero third-party ad trackers inside code snippets; reader comments are human-approved to keep threads spam-free and constructive.',
    faqs: [
      {
        question: 'Can I print chapters cleanly for offline interview prep?',
        answer: 'Yes. Every document includes a Print button that automatically switches to a clean white background, wraps code lines, and renders link URLs inline.'
      }
    ]
  },
  {
    slug: 'ghar-ledger',
    key: 'ghar-ledger',
    name: 'Ghar Ledger',
    badge: 'Household Daily Expense & Vendor Tracker',
    category: 'Community & Family',
    url: 'https://ghar.keshavsingh.in',
    ctaLabel: 'Open Ghar Ledger',
    shortTagline: 'Track daily household vendors—milk, newspaper, house help, tuition & groceries—and reconcile monthly totals effortlessly.',
    summary:
      'Most finance apps focus on complex stock portfolios while overlooking the daily recurring vendor bills every Indian household actually settles at the end of the month. Ghar Ledger provides a fast, calm household book specifically designed for daily quantity entries (liters of milk, skipped days, extra deliveries, tiffin counts) and crystal-clear monthly summaries shared within your household.',
    whoItIsFor: 'Families and shared households replacing paper diaries and WhatsApp notes for monthly vendor settlements.',
    architectureStack: ['.NET 10 Web API', 'Angular 22 Standalone UI', 'MongoDB (GharLedgerDb)', 'Central SSO Household Scopes'],
    capabilities: [
      'Dedicated vendor profiles for milk delivery, newspaper, maid/help, tuition, water cans, and local shops.',
      'Calendar-day check-in grid recording exact daily quantities, missed delivery deductions, and price changes without rewriting history.',
      'Shared household workspace allowing family members signed in via Central SSO to view the same live monthly bill.'
    ],
    workflows: [
      {
        title: '1. Add Recurring Vendors',
        detail: 'Configure unit rates (e.g., milk per liter, daily rate, or monthly retainer) once for your household.'
      },
      {
        title: '2. Log Skipped or Extra Days in Seconds',
        detail: 'Mark holidays or extra quantity directly on the date row and inspect exact month-end payables before paying via UPI.'
      }
    ],
    privacyAndTrust: 'Access is strictly scoped to approved SSO members belonging to your specific household record.',
    faqs: [
      {
        question: 'Does Ghar Ledger link directly to my bank account?',
        answer: 'No. It works as a private, lightweight household tally book with zero bank scraping or credential collection.'
      }
    ]
  },
  {
    slug: 'famsphere',
    key: 'famsphere',
    name: 'FamSphere Mobile App',
    badge: 'Android & iOS Family Companion',
    category: 'Community & Family',
    url: '/apps/famsphere',
    ctaLabel: 'Read Privacy & Features',
    shortTagline: 'Expo React Native mobile app uniting family QR onboarding, step tracking, Image-to-PDF tools & private circle safety.',
    summary:
      'FamSphere (package ID in.keshavsingh.famsphere) extends the keshavsingh.in platform to Android and iOS devices using React Native and Expo. Designed with explicit permission transparency for Google Play policies, FamSphere brings local pedometer fitness insights, offline-capable document scanning/Image-to-PDF conversion, QR family pairing, and private circle utilities into one ad-free mobile companion.',
    whoItIsFor: 'Families using the private keshavsingh.in ecosystem on Android and iOS smartphones.',
    architectureStack: ['React Native / Expo 57', 'Android & iOS Native Modules', 'Biometric Local Auth', 'Private Central Sync API'],
    capabilities: [
      'QR-based family device pairing with encrypted session tokens and biometric unlock support.',
      'Local physical-activity step tracking and distance/calorie estimates kept on-device or synced solely to your private family circle.',
      'Built-in camera Image-to-PDF document utility and printable receipt export.',
      'Permission-transparent family contacts helper and emergency circle whereabouts sharing.'
    ],
    workflows: [
      {
        title: '1. Explicit Permission Opt-In',
        detail: 'Every hardware permission—camera for QR/PDF, steps sensor, or location—explains its exact purpose before requesting OS consent.'
      },
      {
        title: '2. Private Family Circle Sync',
        detail: 'Pair family devices safely using signed QR codes managed under your own Central SSO household.'
      }
    ],
    privacyAndTrust: 'Detailed disclosures for Health & Fitness data, Files & Media, Contacts, and Location are published verbatim in our main Privacy Policy at https://keshavsingh.in/privacy-policy.',
    faqs: [
      {
        question: 'Where is FamSphere’s official privacy policy hosted?',
        answer: 'Right on keshavsingh.in/privacy-policy, satisfying Google Play Console transparency requirements for in.keshavsingh.famsphere.'
      }
    ]
  },
  {
    slug: 'portfolio',
    key: 'portfolio',
    name: 'Developer Portfolio & CV',
    badge: 'Dedicated Engineering Resume Subdomain',
    category: 'Engineering & Career',
    url: 'https://portfolio.keshavsingh.in',
    ctaLabel: 'Open portfolio.keshavsingh.in',
    shortTagline: 'Focused software architecture resume, enterprise experience timeline, open-source GitHub repositories & instant PDF CV export.',
    summary:
      'To keep keshavsingh.in focused on community web utilities, interactive calculators, creator works, and long-form publishing, Keshav Singh’s engineering resume now lives cleanly at portfolio.keshavsingh.in. Recruiters, hiring managers, and engineering peers can inspect work history (Publicis Sapient, R Systems, Marlabs, Unthinkable Solutions), B.Tech CS credentials, live GitHub repositories, and download a formatted PDF resume.',
    whoItIsFor: 'Technical recruiters, engineering managers, and enterprise clients reviewing .NET, Azure, AWS, and Angular experience.',
    architectureStack: ['Angular 22 Material UI', 'pdfmake Client PDF Builder', 'GitHub REST Feed', 'Central Runtime Config API'],
    capabilities: [
      'Interactive career timeline detailing enterprise deliveries across .NET Core, Angular, Blazor, Azure AD B2C, Kubernetes, and AWS microservices.',
      'Instant client-side PDF resume generator powered by pdfmake alongside print-ready web resume view.',
      'Dynamic GitHub repository showcase highlighting open-source packages and modular libraries.'
    ],
    workflows: [
      {
        title: '1. Review Role Experience & Stack',
        detail: 'Switch tabs across Publicis Sapient, R Systems, Marlabs, and Unthinkable Solutions to inspect architecture outcomes and stack tags.'
      },
      {
        title: '2. Generate PDF CV or Reach Out',
        detail: 'Export an up-to-date PDF resume from /resume or send a project inquiry straight to the Admin inbox.'
      }
    ],
    privacyAndTrust: 'Kept distraction-free on a dedicated subdomain (portfolio.keshavsingh.in) specifically for career review and hiring teams.',
    faqs: [
      {
        question: 'Why was the developer portfolio moved from keshavsingh.in to portfolio.keshavsingh.in?',
        answer: 'Separating personal career CV pages onto portfolio.keshavsingh.in allows the root domain keshavsingh.in to serve rich interactive utilities, original multi-page guides, creator hubs, and community resources cleanly.'
      }
    ]
  }
];
