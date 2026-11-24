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
  systemArchitectureNotes: string[];
  dataAndSecurityModel: string[];
  capabilities: string[];
  workflows: { title: string; detail: string }[];
  privacyAndTrust: string;
  relatedGuideSlug: string;
  relatedToolSlug: string;
  faqs: AppFaqItem[];
}

export const ECOSYSTEM_APPS: EcosystemAppDetail[] = [
  {
    slug: 'animstudio',
    key: 'studio',
    name: 'AnimStudio AI',
    badge: '3D Video & Shorts Production Studio',
    category: 'Creator & Media',
    url: 'https://studio.keshavsingh.in',
    ctaLabel: 'Open AnimStudio AI',
    shortTagline: 'Multi-track 2D/3D video production workstation, Story Agent, comedy workspace, Motion Copy & YouTube scheduler.',
    summary:
      'AnimStudio AI is a deterministic browser-and-FFmpeg video production workstation engineered for creators who publish regular storytelling, Pauranik katha reels, and 3D comedy Shorts. Rather than black-box single-prompt video generation that forces re-rendering an entire clip to fix one line, creators author structured JSON storyboards, synthesize multi-character emotional speech, scrub 60fps Three.js WebGL previews, retarget 3D rigs via Motion Copy, and schedule verified uploads to connected YouTube channels.',
    whoItIsFor: 'Digital storytellers, 3D animation creators, devotional educators, and solo media teams running bilingual Hindi + English video pipelines.',
    architectureStack: ['.NET 10 Web API', 'Angular 22 Standalone + Signals', 'FFmpeg xfade & EBU R128 Ducking', 'Three.js / WebGL 3D Rigs', 'AES-256-GCM Multi-Key AI Pool'],
    systemArchitectureNotes: [
      'Separates authoring into four inspectable stages: Storyboard JSON -> Multi-Speaker Neural TTS + Viseme Envelopes -> Browser Three.js 60fps Timeline Scrubbing -> Server-Side Fixed-Timestep FFmpeg Composite.',
      'Computes exact cumulative xfade timeline offsets across scenes so multi-minute episodes maintain millisecond lip-sync without progressive audio drift.',
      'Routes AI script and voiceover requests through an encrypted multi-key failover pool (/admin/api-keys) that classifies transient HTTP 429 RPM bursts separately from daily RPD quota exhaustion.',
    ],
    dataAndSecurityModel: [
      'Authenticates workspace members via stateless JWTs issued by id.keshavsingh.in while encrypting third-party LLM and YouTube channel credentials at rest with AES-256-GCM.',
      'Runs mandatory ffprobe loudness (-14 LUFS), safe-zone Devanagari/Latin subtitle margin checks, and keyframe non-blackness verification before marking any render publishable.',
    ],
    capabilities: [
      'Multi-track timeline with playhead trimming, split points, Music Video xfade transitions, and sidechain audio ducking over ambient beds.',
      'Story Agent with source-grounded citation checking (including Wikisource Granth references) and character-level emotion tagging.',
      'Comedy & Funny Stories workspace supporting Funny Levels, Comedy Challenge, and Misunderstanding structures in 30s and 60s presets.',
      'Motion Copy 3D pipeline for driving custom 3D animated rigs and replacement stages while stripping source backgrounds.',
      'Daily Auto-Post Hub synchronizing Hindu Panchang sunrise timings, Aaj Ka Itihaas, and YouTube scheduled metadata verification.',
    ],
    workflows: [
      {
        title: '1. Script to Verified Storyboard',
        detail: 'Pick an archetype (Daily Vedic Katha, Funny Story, or Explainer), generate or paste a structured JSON storyboard from our Pacing Planner, and audit every line, speaker emotion, and camera prompt before rendering.',
      },
      {
        title: '2. Render 9:16 Shorts or 16:9 Episodes',
        detail: 'Switch aspect ratios cleanly between vertical reels and widescreen YouTube episodes with automatic Shorts UI safe framing, custom foley stingers, and multi-character TTS narration.',
      },
      {
        title: '3. Verify Loudness, Thumbnail & Schedule',
        detail: 'Inspect integrated loudness, burned-in subtitle margins, custom JPEG thumbnails, and publish timestamps directly against YouTube Data API state before scheduled release.',
      },
    ],
    privacyAndTrust: 'Zero auto-publishing occurs without explicit creator confirmation. External reference links undergo normalization and human review prior to YouTube upload.',
    relatedGuideSlug: 'ai-3d-animation-pipeline-ffmpeg-webgl',
    relatedToolSlug: 'short-hook-pacing-planner',
    faqs: [
      {
        question: 'Does AnimStudio AI publish videos without my approval?',
        answer: 'No. Every storyboard, rendered MP4 preview, thumbnail, title, tag list, and scheduled publish window requires explicit review inside the studio before submission.',
      },
      {
        question: 'Can I use AnimStudio AI without configuring a paid LLM key?',
        answer: 'Yes. Built-in templates and paste-JSON import mode (compatible with our free Short Hook Pacing Planner on keshavsingh.in/tools) let you assemble audio, subtitles, transitions, and renders without external LLM calls.',
      },
      {
        question: 'What aspect ratios and loudness standards are supported for export?',
        answer: 'Native presets cover 9:16 (1080x1920 Shorts/Reels), 16:9 (1920x1080 YouTube), and 1:1 (1080x1080 Square), mastered to -14 LUFS / -1.0 dBTP in yuv420p MP4.',
      },
    ],
  },
  {
    slug: 'panchang',
    key: 'panchang',
    name: 'Hindu Panchang & Sanskriti Hub',
    badge: 'Astronomical Panchang & Vedic Calendar',
    category: 'Culture & Knowledge',
    url: 'https://panchang.keshavsingh.in',
    ctaLabel: 'Open Hindu Panchang',
    shortTagline: 'Location-aware Tithi, Nakshatra, Yoga, Karana, sunrise/sunset muhurats, Choghadiya & Aaj Ka Itihaas.',
    summary:
      'Hindu Panchang & Sanskriti Hub computes daily five-limb Vedic calendar intervals anchored mathematically to local geographic sunrise and Lahiri Chitrapaksha sidereal longitudes rather than static midnight lookup tables. Visitors switch cities and dates to inspect Udaya Tithi, Nakshatra Padas, Rahu Kaal, Abhijit Muhurat, Day/Night Choghadiya octets, Vrat calendars, and daily historical milestones (Aaj Ka Itihaas).',
    whoItIsFor: 'Families checking daily Shubh Muhurat and fasting dates, Jyotisha/astronomy learners, and viewers following @OmkarShivBhakti cultural explainers.',
    architectureStack: ['.NET 10 Ephemeris Engine', 'Lahiri Chitrapaksha Ayanamsa', 'Angular 22 Bilingual (HI/EN)', 'MongoDB Festival Rule Catalog'],
    systemArchitectureNotes: [
      'Evaluates solar declination, Equation of Time, and atmospheric-refraction zenith angles (90.8333°) per city coordinate so sunrise and Dinamana reflect true local horizons across India and global timezones.',
      'Solves exact Tithi and Nakshatra ending instants via iterative root-finding over solar-lunar ecliptic longitudes rather than linear 24-hour averages, handling Kshaya and Adhika Tithis accurately.',
      'Shares deterministic festival-date APIs with AnimStudio AI so Evening-Before devotional Katha videos always match next morning’s Udaya or Nishita observance.',
    ],
    dataAndSecurityModel: [
      'All public calendar, festival, and muhurat endpoints run anonymously with zero login requirement and zero location tracking beyond user-selected city presets.',
      'Editorial Katha and mantra curation routes under /manage require role-verified Central SSO JWTs.',
    ],
    capabilities: [
      'Complete 5-limb Panchang: Tithi, Nakshatra (with Pada 1–4), Nitya Yoga, Karana, and Vaara alongside Vikram Samvat and Shaka Samvat eras.',
      'Location-sensitive Sunrise, Sunset, Moonrise, Abhijit Muhurat, Brahma Muhurat, Rahu Kaal, Yamaganda, and Gulika Kaal intervals.',
      'Algorithmic Day (Dinamana) & Night (Ratrimana) Choghadiya planner highlighting Amrit, Shubh, Labh, and Char windows.',
      'Daily Aaj Ka Itihaas historical milestones, classical Sanskrit mantras with translations, and Pauranik Katha reflections.',
    ],
    workflows: [
      {
        title: '1. Select Date & Geographic City',
        detail: 'Pick your city and calendar date to recompute sunrise-anchored lunar Tithi transitions and seasonal 8-part daytime/nighttime planetary slices.',
      },
      {
        title: '2. Cross-Check Auspicious Windows',
        detail: 'Verify Abhijit Muhurat and Shubh/Amrit Choghadiya slots while avoiding Rahu Kaal and Vishti (Bhadra) intervals when planning ceremonies.',
      },
      {
        title: '3. Read Cultural & Historical Context',
        detail: 'Explore verified festival significance notes and Aaj Ka Itihaas entries seamlessly in English or Devanagari Hindi.',
      },
    ],
    privacyAndTrust: 'Public calendar calculations run freely without requiring sign-in; editor publishing routes under /manage are strictly role-gated via Central SSO.',
    relatedGuideSlug: 'astronomical-vedic-panchang-calculations',
    relatedToolSlug: 'panchang-samvat-converter',
    faqs: [
      {
        question: 'Why does changing the city within India change Panchang timings even though IST is one timezone?',
        answer: 'Physical sunrise in eastern India occurs over an hour earlier than western Gujarat; because Rahu Kaal, Choghadiya, and Udaya Tithi depend on local sunrise and sunset, city coordinates shift every window significantly.',
      },
      {
        question: 'Is Devanagari Hindi supported natively?',
        answer: 'Yes. Every limb name, Rasi, Nakshatra, festival note, and UI label switches cleanly between English and Devanagari Hindi.',
      },
    ],
  },
  {
    slug: 'pratiyogita',
    key: 'pratiyogita',
    name: 'Pratiyogita',
    badge: 'Exams, Sports & Zero-Log Live Quiz Arena',
    category: 'Community & Family',
    url: 'https://pratiyogita.keshavsingh.in',
    ctaLabel: 'Open Pratiyogita',
    shortTagline: 'Grassroots school olympiads, local sports fixtures, verified toppers leaderboard & zero-log YouTube live quiz arena.',
    summary:
      'Pratiyogita brings structured digital fairness to grassroots school olympiads, district sports tournaments, and interactive YouTube livestream quizzes. Built as a .NET 10 Modular Monolith, it standardizes State-District-School codes so campus leaderboards never fragment, verifies YouTube livestream quiz winners ephemerally in RAM without storing Google OAuth tokens, and audits community UPI sponsorships via bank UTR references.',
    whoItIsFor: 'Schools, students, local sports organizers, community patrons, and viewers participating in verified YouTube livestream quizzes.',
    architectureStack: ['.NET 10 Modular Monolith', 'Angular 22 Standalone + Signals', 'Ephemeral OAuth RAM Verifier', 'MongoDB ESR Score Indexes', 'UPI Deep-Link Intents'],
    systemArchitectureNotes: [
      'Partitions domain logic into four isolated C# modules (LocationsAndSchools, CompetitionsAndFixtures, LiveStreamQuizClaims, PatronContributions) backed by ESR-indexed MongoDB collections.',
      'Uses 3-to-5 second micro-cached leaderboard snapshots to absorb simultaneous refresh bursts when hundreds of livestream viewers check final standings.',
    ],
    dataAndSecurityModel: [
      'Zero-Log YouTube claim verification exchanges single-use PKCE codes strictly in volatile request memory, hashes the public channel ID, and revokes the token immediately—zero OAuth tokens ever touch disk.',
      'Community sponsorship uses native upi://pay OS intents plus 12-digit UTR reconciliation—zero credit cards, CVVs, or bank credentials are collected.',
    ],
    capabilities: [
      'Academic exams/olympiads and community sports tournament registrations scoped by verified school and city/district codes.',
      'Fixture schedules, round results, and multi-filter leaderboards highlighting location and school toppers.',
      'Zero-log YouTube Channel verification for Live Stream Quiz claims: inspects your public channel handle in memory without saving OAuth tokens.',
      'Transparent UPI contribution workflow with UTR audit references and Admin verification queue.',
    ],
    workflows: [
      {
        title: '1. Browse Competitions & Verified Toppers',
        detail: 'Filter Academic and Sports categories by state, district, school code, and season to inspect live fixtures and official merit lists.',
      },
      {
        title: '2. Claim Livestream Quiz Standings Safely',
        detail: 'Open /winners during an active livestream, verify your public @handle in memory with zero persistent token storage, and record your round score.',
      },
      {
        title: '3. Sponsor Student Prizes Transparently',
        detail: 'Launch a standard UPI intent in your preferred banking app and submit the UTR reference for verified supporter acknowledgment.',
      },
    ],
    privacyAndTrust: 'Pratiyogita never collects bank passwords or credit card numbers and never writes YouTube OAuth tokens to disk or database during quiz verification.',
    relatedGuideSlug: 'grassroots-competitions-pratiyogita-zero-log-quiz',
    relatedToolSlug: 'api-latency-capacity-planner',
    faqs: [
      {
        question: 'How does Zero-Log YouTube verification protect viewers?',
        answer: 'Sign-in checks only your public channel display handle in request memory to stop impersonation on prize claims and immediately revokes/discards session tokens.',
      },
      {
        question: 'Are schools verified before appearing on public leaderboards?',
        answer: 'Yes. Newly submitted campuses stay in Pending review until assigned a canonical State-District-School code by an administrator.',
      },
    ],
  },
  {
    slug: 'social-analytics',
    key: 'social',
    name: 'SocialPulse Analytics',
    badge: 'Creator Telemetry & RPM Diagnostics',
    category: 'Creator & Media',
    url: 'https://social.keshavsingh.in',
    ctaLabel: 'Open SocialPulse Analytics',
    shortTagline: 'Multi-platform growth benchmarking, Views-per-Subscriber outlier tracking, RPM calculator & hook retention diagnostics.',
    summary:
      'SocialPulse Analytics helps independent creators isolate why specific videos break out organically instead of relying on guesswork. By benchmarking Views-per-Subscriber outlier multiples, modeling blended Long-Form vs Shorts RPM across geographies, and auditing opening-hook swipe retention, creators turn raw upload history into repeatable editorial playbooks.',
    whoItIsFor: 'YouTube, Shorts, and multi-format creators analyzing outlier formats, retention drop-offs, and sustainable channel unit economics.',
    architectureStack: ['.NET 10 Analytics API', 'Angular 22 Signals Dashboards', 'Time-Bucketed MongoDB Telemetry', 'Central SSO (id.keshavsingh.in)'],
    systemArchitectureNotes: [
      'Computes rolling median baseline views per channel so breakout uploads (3x–10x baseline Views-per-Subscriber) surface immediately regardless of channel size.',
      'Models watch-page 55% net creator share separately from Shorts 45% pooled share across India, Mixed Bilingual, and Tier-1 international geographies.',
    ],
    dataAndSecurityModel: [
      'Public Visitor Mode runs cohort and RPM simulations anonymously in the browser without requiring channel OAuth connection.',
      'Authenticated workspace telemetry is strictly partitioned by Central SSO sub claim.',
    ],
    capabilities: [
      'Views-per-Subscriber outlier benchmarking to isolate video formats that outperform subscriber baselines.',
      'Blended revenue simulator comparing 16:9 long-form, 9:16 Shorts, and direct sponsorship mixes.',
      'Title CTR, 3-second hook pacing, and IST/UTC publish-window diagnostics for Indian and global audiences.',
      'Privacy-safe funnel attribution measuring reader journeys from video descriptions to web calculators.',
    ],
    workflows: [
      {
        title: '1. Isolate High-Multiplier Video Archetypes',
        detail: 'Rank recent uploads by views-to-subscribers multiple to spot comedic structures, katha themes, or architecture topics with organic breakout velocity.',
      },
      {
        title: '2. Stress-Test Regional RPM & YPP Goals',
        detail: 'Simulate revenue sensitivity across audience geographies and track 4,000-hour / 10M-Shorts YPP milestones.',
      },
    ],
    privacyAndTrust: 'Public calculators run anonymously on first load while personal channel workspaces authenticate strictly via Central SSO.',
    relatedGuideSlug: 'youtube-shorts-retention-vs-adsense-compliance',
    relatedToolSlug: 'youtube-earnings-estimator',
    faqs: [
      {
        question: 'Do I need to connect a YouTube channel before testing benchmarks?',
        answer: 'No. Public Visitor Mode lets any creator run growth and RPM projections immediately without creating an account.',
      },
      {
        question: 'How does Views-per-Subscriber outlier scoring identify repeatable topics?',
        answer: 'By dividing each upload’s 7-day and 30-day views by the channel’s rolling median baseline rather than raw subscriber count alone, small channels with breakout formats surface clearly alongside established creators.',
      },
      {
        question: 'Why model 16:9 watch-page ads separately from 9:16 Shorts feed revenue?',
        answer: 'Long-form videos pass 55% of individual watch-page ad auctions directly to the creator, whereas Shorts enter a pooled revenue allocation (~45% creator share after music licensing), creating a 15x–45x difference in per-view yield.',
      },
    ],
  },
  {
    slug: 'content-blog',
    key: 'blog',
    name: 'Engineering Content Blog',
    badge: 'Enterprise .NET & Cloud Knowledge Base',
    category: 'Engineering & Career',
    url: 'https://blog.keshavsingh.in',
    ctaLabel: 'Open Tech Blog',
    shortTagline: 'Hands-on software engineering notes on C#/.NET, Azure, AWS, Docker, Kubernetes, SQL & GoF design patterns.',
    summary:
      'The Engineering Content Blog is a structured technical reference library authored from real enterprise backend delivery experience. Rather than shallow news recaps, its markdown chapters dissect CLR garbage-collection internals, AWS KMS envelope encryption, Azure DevOps YAML pipelines, SQL execution-plan tuning, Kubernetes probes, and GoF design patterns—complete with a dedicated print-optimized study stylesheet.',
    whoItIsFor: 'Backend engineers, cloud architects, and computer science students preparing for senior .NET and distributed-systems design reviews.',
    architectureStack: ['Angular 22 Markdown Engine', '.NET 10 Moderated Comment API', 'GitHub-Synced Markdown Corpus', 'Print-Optimized CSS Stylesheet'],
    systemArchitectureNotes: [
      'Indexes structured topic trees (C#, Azure, AWS, Containers, SQL, Design Patterns, Networking) with instant client-side tag filtering and automatic heading TOC extraction.',
      'Ships dedicated @media print rules that strip navigation chrome, switch to crisp black-on-white typography, and wrap wide code blocks cleanly for PDF export.',
    ],
    dataAndSecurityModel: [
      'Sanitizes rendered markdown HTML strictly and gates community code-discussion comments behind verified Central SSO accounts with human moderation.',
    ],
    capabilities: [
      'Topic-organized engineering chapters covering C#/.NET, Azure, AWS, Docker, Kubernetes, SQL Server, and GoF Design Patterns.',
      'Instant full-text topic search, case-insensitive tag index, section outline rail, and reading-time badges.',
      'One-click Print / Save-as-PDF mode tailored for offline interview preparation and architecture study.',
      'Spam-free moderated developer comment threads authenticated via Central SSO.',
    ],
    workflows: [
      {
        title: '1. Deep-Dive by Stack or Pattern',
        detail: 'Navigate straight into C# internals, cloud security, or SQL indexing chapters and toggle between dark screen mode and printable study sheets.',
      },
      {
        title: '2. Discuss Production Edge Cases',
        detail: 'Sign in once via Central SSO to share benchmarks, trade-off notes, and follow-up questions below any chapter.',
      },
    ],
    privacyAndTrust: 'Zero third-party ad trackers inside code snippets; reader comments are human-approved to keep threads spam-free and constructive.',
    relatedGuideSlug: 'responsive-ssg-web-vitals-adsense-ux',
    relatedToolSlug: 'json-ld-seo-schema-generator',
    faqs: [
      {
        question: 'Can I print chapters cleanly for offline interview prep?',
        answer: 'Yes. Every chapter includes a Print button that switches automatically to a high-contrast white stylesheet and wraps code blocks without clipping.',
      },
      {
        question: 'How do chapters on blog.keshavsingh.in differ from guides on keshavsingh.in/guides?',
        answer: 'keshavsingh.in/guides publishes cross-disciplinary architecture, FFmpeg, and Vedic astronomy playbooks paired with interactive browser calculators, while blog.keshavsingh.in organizes curriculum-style reference folders for C#, SQL, Azure, AWS, and GoF design patterns.',
      },
      {
        question: 'Why are community comments moderated via Central SSO?',
        answer: 'Requiring a verified ecosystem token and initial human moderation eliminates automated backlink spam while keeping technical Q&A constructive.',
      },
    ],
  },
  {
    slug: 'ghar-ledger',
    key: 'ghar-ledger',
    name: 'Ghar Ledger',
    badge: 'Private Household Vendor & Expense Book',
    category: 'Community & Family',
    url: 'https://ghar.keshavsingh.in',
    ctaLabel: 'Open Ghar Ledger',
    shortTagline: 'Track daily household vendors—milk, newspaper, house help, tuition & groceries—and reconcile monthly totals effortlessly.',
    summary:
      'Most personal finance apps target stock portfolios while ignoring the recurring daily vendor settlements every Indian household reconciles at month-end. Ghar Ledger provides a calm, zero-ad shared household book built around monthly bucketed calendars—recording daily milk liters, skipped newspaper days, extra water cans, maid attendance, and historical unit-rate changes without rewriting past months.',
    whoItIsFor: 'Families and shared households replacing paper kitchen diaries and scattered WhatsApp messages for monthly vendor settlements.',
    architectureStack: ['.NET 10 Web API', 'Angular 22 Signals Calendar', 'MongoDB Monthly Bucket Schema', 'Central SSO Household ACLs'],
    systemArchitectureNotes: [
      'Models vendor attendance using bounded monthly bucket documents ({ householdId, vendorId, yearMonth }) so a full 31-day grid loads in a single O(1) point read and never hits BSON growth limits.',
      'Versions unit-price changes with effective-from dates so raising milk rate per liter on the 15th preserves accurate historical totals for days 1–14.',
    ],
    dataAndSecurityModel: [
      'Enforces strict household-scoped ACL checks on every query keyed to verified Central SSO sub IDs.',
      'Operates 100% ad-free with zero third-party analytics or ad-network scripts near private family records.',
    ],
    capabilities: [
      'Dedicated vendor profiles for milk delivery, newspaper, domestic help, tuition, water cans, tiffin, and local grocers.',
      'Single-tap calendar day grid recording exact quantities, holiday skips, extra deliveries, and advance adjustments.',
      'Shared household sync so spouses and family members see the exact same live month-end payable summary.',
    ],
    workflows: [
      {
        title: '1. Configure Household Vendors Once',
        detail: 'Set unit pricing (per liter, per day, or monthly retainer) and invite family members under your Central SSO household.',
      },
      {
        title: '2. Log Exceptions in Five Seconds',
        detail: 'Tap any calendar date to mark a skipped delivery or extra quantity and settle verified totals cleanly at month-end.',
      },
    ],
    privacyAndTrust: 'Access is strictly scoped to approved SSO members belonging to your specific household record—never monetized via third-party ads.',
    relatedGuideSlug: 'mongodb-indexing-multi-tenant-dotnet-microservices',
    relatedToolSlug: 'cron-jwt-epoch-developer-toolkit',
    faqs: [
      {
        question: 'Does Ghar Ledger link to bank accounts or read SMS messages?',
        answer: 'No. Ghar Ledger is a private manual household tally book with zero bank scraping, zero SMS reading, and zero credential collection.',
      },
      {
        question: 'What happens if our milk or tiffin vendor changes their per-unit rate mid-month?',
        answer: 'Rate updates carry an effective-from calendar date, so historical entries from the 1st through the 14th retain their original price while days from the 15th onward calculate at the updated rate.',
      },
      {
        question: 'Can two family members update daily attendance from separate phones?',
        answer: 'Yes. Household ACLs tied to Central SSO let approved family members view and log daily quantities against the same synchronized monthly bucket.',
      },
    ],
  },
  {
    slug: 'famsphere',
    key: 'famsphere',
    name: 'FamSphere Mobile App',
    badge: 'Android & iOS Private Family Companion',
    category: 'Community & Family',
    url: '/apps/famsphere',
    ctaLabel: 'Read Architecture & Privacy',
    shortTagline: 'Expo React Native mobile app uniting family QR onboarding, step tracking, Image-to-PDF tools & private circle safety.',
    summary:
      'FamSphere (package ID in.keshavsingh.famsphere) extends the keshavsingh.in ecosystem to Android and iOS devices using React Native and Expo. Engineered around strict Google Play Data Safety transparency, FamSphere combines on-device pedometer step insights, offline camera Image-to-PDF conversion, signed QR family device pairing, and biometric local unlock inside a completely ad-free mobile companion.',
    whoItIsFor: 'Families using the private keshavsingh.in ecosystem across Android and iOS smartphones.',
    architectureStack: ['React Native / Expo', 'Android & iOS Hardware Sensors', 'OS Keystore / Biometric Auth', 'Encrypted Family Circle Sync'],
    systemArchitectureNotes: [
      'Executes Image-to-PDF document rendering and daily step-counter aggregation directly on-device so personal media files never require cloud round-trips.',
      'Pairs family smartphones via short-lived cryptographically signed QR challenges tied to your Central SSO household.',
    ],
    dataAndSecurityModel: [
      'Requests OS hardware permissions (Activity Recognition, Camera, optional Contacts/Location) strictly just-in-time with plain-language disclosures.',
      'Zero advertising SDKs, zero cross-app tracking identifiers, and full self-service data deletion documented at keshavsingh.in/data-deletion.',
    ],
    capabilities: [
      'Signed QR-based family device onboarding with OS Keystore token storage and biometric unlock.',
      'On-device physical-activity step counter, distance, and calorie estimates with optional private family circle sync.',
      'Offline camera scanner and multi-page Image-to-PDF receipt/homework converter.',
      'Permission-transparent emergency circle check-ins.',
    ],
    workflows: [
      {
        title: '1. Just-in-Time Permission Transparency',
        detail: 'Every hardware sensor explains its exact local purpose before invoking Android or iOS permission dialogs.',
      },
      {
        title: '2. Scan, Convert & Sync Privately',
        detail: 'Generate clean PDFs offline or pair family devices via signed QR codes under your own household boundary.',
      },
    ],
    privacyAndTrust: 'Detailed disclosures for Health & Fitness data, Files & Media, Contacts, and Location are published verbatim at https://keshavsingh.in/privacy-policy.',
    relatedGuideSlug: 'micro-app-monetization-ethics-user-trust',
    relatedToolSlug: 'cron-jwt-epoch-developer-toolkit',
    faqs: [
      {
        question: 'Where is FamSphere’s official Google Play privacy policy hosted?',
        answer: 'Directly at https://keshavsingh.in/privacy-policy alongside dedicated deletion instructions at https://keshavsingh.in/data-deletion.',
      },
      {
        question: 'Does Image-to-PDF upload my personal documents to an external server?',
        answer: 'No. Camera capture cropping and multi-page PDF assembly run locally on your Android or iOS handset so personal receipts and school forms remain on-device unless you explicitly share them.',
      },
      {
        question: 'Does FamSphere include third-party mobile advertising SDKs?',
        answer: 'Zero. FamSphere ships without mobile ad networks or cross-app tracking SDKs to keep family circles completely private.',
      },
    ],
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
      'To keep keshavsingh.in dedicated 100% to public browser calculators, creator studios, and long-form engineering documentation, Keshav Singh’s personal hiring portfolio is isolated cleanly on portfolio.keshavsingh.in. Engineering managers and technical recruiters can review enterprise system deliveries across Publicis Sapient, R Systems, Marlabs, and Unthinkable Solutions, inspect GitHub repositories, and generate a formatted PDF resume client-side.',
    whoItIsFor: 'Technical recruiters, engineering directors, and enterprise teams reviewing senior .NET, Azure, AWS, and Angular architecture experience.',
    architectureStack: ['Angular 22 Standalone UI', 'pdfmake Client PDF Engine', 'GitHub REST Repository Feed', 'Zero-Ad Distraction-Free Shell'],
    systemArchitectureNotes: [
      'Compiles structured JSON career history into downloadable vector PDF resumes directly inside the browser using pdfmake—eliminating stale static PDF attachments.',
      'Integrates live public repository metadata from GitHub while remaining completely free of third-party display ad scripts.',
    ],
    dataAndSecurityModel: [
      'Static HTTPS delivery with strict Referrer-Policy and zero advertising cookies so hiring teams browse with instant load speed.',
    ],
    capabilities: [
      'Interactive role timeline covering enterprise deliveries across .NET Core/.NET 10, Angular, Azure AD B2C, gRPC, Kubernetes, and AWS.',
      'One-click client-side vector PDF CV builder alongside print-formatted web resume view.',
      'Curated open-source GitHub project index and direct architecture inquiry channel.',
    ],
    workflows: [
      {
        title: '1. Inspect Enterprise Architecture Outcomes',
        detail: 'Filter experience across Publicis Sapient, R Systems, Marlabs, and Unthinkable Solutions by cloud, identity, and performance outcomes.',
      },
      {
        title: '2. Export Vector PDF CV Instantly',
        detail: 'Download an always-current PDF resume directly in the browser or reach out via the encrypted Contact Hub.',
      },
    ],
    privacyAndTrust: 'Hosted on a dedicated zero-ad subdomain (portfolio.keshavsingh.in) specifically for technical hiring and peer review.',
    relatedGuideSlug: 'federated-sso-dotnet-angular-architecture',
    relatedToolSlug: 'cron-jwt-epoch-developer-toolkit',
    faqs: [
      {
        question: 'Why was the developer portfolio separated onto portfolio.keshavsingh.in?',
        answer: 'Isolating hiring CVs onto portfolio.keshavsingh.in gives recruiters a fast, zero-ad experience while dedicating keshavsingh.in to free public calculators and 16+ deep engineering guides.',
      },
      {
        question: 'How is the downloadable PDF resume generated?',
        answer: 'Instead of serving a static PDF file that drifts out of date, portfolio.keshavsingh.in compiles structured career JSON into a crisp vector PDF directly inside the visitor’s browser via pdfmake.',
      },
      {
        question: 'Where can I read technical deep-dives behind the projects listed on the CV?',
        answer: 'Right here under keshavsingh.in/guides, where full C#/.NET 10, Angular 22, MongoDB, WebAuthn, and FFmpeg architectural decisions are documented.',
      },
    ],
  },
];
