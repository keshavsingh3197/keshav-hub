export interface HubToolMeta {
  slug: string;
  title: string;
  badge: string;
  shortDesc: string;
  whyUseful: string;
  howToUse: string[];
  methodology: string[];
  faqs: { question: string; answer: string }[];
  relatedAppSlug: string;
}

export interface CreatorChannelShowcase {
  key: string;
  name: string;
  handle: string;
  platform: 'YouTube' | 'GitHub';
  url: string;
  niche: string;
  audience: string;
  tagline: string;
  seriesList: string[];
  scheduleCadence: string;
}

export interface CuratedVideoHighlight {
  id: string;
  title: string;
  channelHandle: string;
  channelName: string;
  format: 'Short' | 'Video';
  language: 'English' | 'Hindi / Hinglish';
  niche: string;
  summary: string;
  url: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  badge: string;
  priceLabel: string;
  targetAudience: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaType: 'internal-route' | 'external';
  ctaTarget: string;
  highlighted?: boolean;
}

export interface RoadmapMilestone {
  quarter: string;
  status: 'Shipped' | 'In Progress' | 'Planned';
  title: string;
  area: string;
  details: string;
}

export const HUB_TOOLS: HubToolMeta[] = [
  {
    slug: 'youtube-earnings-estimator',
    title: 'YouTube Long-Form & Shorts RPM Estimator',
    badge: 'Creator Finance Calculator',
    shortDesc:
      'Estimate monthly YouTube Partner Program (AdSense for YouTube) earnings across standard long-form videos, vertical Shorts, India vs Tier-1 audience mixes, and sponsor add-ons.',
    whyUseful:
      'Most public calculators treat all YouTube views identically even though 16:9 long-form RPMs and 9:16 Shorts RPMs differ dramatically by geography and watch session value. Understanding realistic income ranges and YPP eligibility thresholds helps creators plan channel calendars without falling for inflated clickbait expectations.',
    howToUse: [
      'Adjust monthly 16:9 Long-Form Views and monthly 9:16 Shorts Views using the sliders or numeric boxes.',
      'Select your primary audience region mix (India-Focused, Mixed Bilingual, or International Tier-1) to calibrate realistic net creator RPM multipliers.',
      'Enter your optional Niche Factor (e.g. Comedy/Devotional baseline vs Software/Finance high-CPC niche) and average monthly sponsor deals.',
      'Track your channel progress against official YouTube Partner Program monetization thresholds (1,000 subscribers + 4,000 watch hours or 10M Shorts views).'
    ],
    methodology: [
      'Net creator ad revenue equals (Long Views / 1,000) x Calibrated Long RPM + (Shorts Views / 1,000) x Calibrated Shorts RPM plus explicit direct sponsorship income.',
      'Shorts creator pool shares approximately 45% after music licensing deductions, yielding noticeably lower per-thousand-view payouts than skippable/mid-roll long-form videos.',
      'This calculator models illustrative planning ranges only and does not guarantee exact Google AdSense payouts, which vary dynamically by advertiser auction demand and seasonality.'
    ],
    faqs: [
      {
        question: 'Do I need an AdSense-approved website to monetize YouTube channels?',
        answer: 'No. AdSense for YouTube is triggered directly through YouTube Studio once your channel meets Partner Program thresholds, independent of Website AdSense.'
      },
      {
        question: 'Why does international English traffic shift RPM significantly?',
        answer: 'Advertiser bid density (CPM) for software, creator tools, and B2B categories in US, UK, Canada, and Australia auctions is typically several multiples higher than broad regional entertainment traffic.'
      }
    ],
    relatedAppSlug: 'social-analytics'
  },
  {
    slug: 'short-hook-pacing-planner',
    title: 'Comedy & 3D Short Scene Pacing Planner',
    badge: 'AnimStudio Storyboard Tool',
    shortDesc:
      'Design high-retention 15s–60s Shorts with hook budget checks, spoken word-rate timing, multi-character emotion tags, and instant JSON export for AnimStudio AI.',
    whyUseful:
      'Great animated comedy and explainer Shorts fail when the setup drags past second 5 or when dialogue runs too long for a crisp visual punchline. Pre-timing spoken words against target speaking WPM keeps vertical pacing tight before rendering audio or 3D frames.',
    howToUse: [
      'Pick a preset template (30s Hinglish 3D Comedy Skit, 60s Multi-Situation Compilation, or 45s Explainer Short).',
      'Edit speaker names, spoken lines, and emotional cues across scenes or append new comedy escalation beats.',
      'Inspect live estimated duration per scene and watch the 3-second hook gauge to confirm your opening line hits quickly.',
      'Download or copy the structured Story Agent JSON payload to import directly into AnimStudio AI at studio.keshavsingh.in.'
    ],
    methodology: [
      'Conversational Hindi/Hinglish comedy voiceovers average 135–155 words per minute (roughly 2.4 words per second), including comedic pauses and reaction beats.',
      'Story Agent JSON uses explicit speaker, emotion, visualPrompt, and durationSeconds fields so scene re-edits stay deterministic across TTS and FFmpeg passes.'
    ],
    faqs: [
      {
        question: 'Can I paste this JSON directly into AnimStudio AI?',
        answer: 'Yes. Open Story Agent -> Comedy Workspace on studio.keshavsingh.in and paste or upload the exported JSON file to populate voice tracks and visual prompts immediately.'
      }
    ],
    relatedAppSlug: 'animstudio'
  },
  {
    slug: 'panchang-samvat-converter',
    title: 'Vikram Samvat & Sunrise-Anchored Kaal Calculator',
    badge: 'Vedic Calendar Utility',
    shortDesc:
      'Convert any Gregorian date into Vikram Samvat and Shaka Samvat eras and compute exact 8-slice daytime Rahu Kaal, Yamaganda, Gulika Kaal, and Abhijit windows from Sunrise and Sunset.',
    whyUseful:
      'Printed calendars routinely copy rigid 90-minute tables (like 07:30–09:00 Monday Rahu Kaal) that drift off by 15 to 35 minutes whenever local sunrise shifts earlier in June or later in December. Calculating the true 1/8th division of your day restores accuracy.',
    howToUse: [
      'Choose a Gregorian date and confirm the day of the week.',
      'Adjust local Sunrise and Sunset times (e.g. from your city forecast or panchang.keshavsingh.in).',
      'Read exact local start/end intervals for Rahu Kaal, Yamaganda, Gulika Kaal, and Solar Noon Abhijit Muhurat.'
    ],
    methodology: [
      'Vikram Samvat leads Gregorian years by 57 after Chaitra Shukla Pratipada (generally late March/April) and 56 earlier in the year; Shaka Samvat trails by 78 (or 79 pre-Chaitra).',
      'Daytime duration (Sunset minus Sunrise) splits into eight uniform Muhurta planetary blocks indexed strictly per weekday according to classical Panchang rules.',
      'For planetary longitude-sensitive Tithi end times, Nakshatra, Yoga, Karana, and Choghadiya transitions, launch panchang.keshavsingh.in.'
    ],
    faqs: [
      {
        question: 'Does this replace full lunar ephemeris Panchang calculations?',
        answer: 'This tool calculates exact Solar Era conversions and Sunrise/Sunset daytime fractions instantly offline; use panchang.keshavsingh.in for full astronomical lunar Tithi and Nakshatra longitudes.'
      }
    ],
    relatedAppSlug: 'panchang'
  },
  {
    slug: 'api-latency-capacity-planner',
    title: 'Microservices Latency & Scaling Capacity Planner',
    badge: 'Backend Architecture Calculator',
    shortDesc:
      'Model origin throughput, Redis cache-offload impact, network serialization overhead (gRPC vs JSON REST), and estimated p95 response budgets before provisioning cloud replicas.',
    whyUseful:
      'Sizing Kubernetes pods or cloud instances blindly leads either to overprovisioned monthly bills or cascading tail-latency spikes when cache hit ratios drop under peak creator traffic.',
    howToUse: [
      'Set expected peak Requests Per Second (RPS) and average response payload size in KB.',
      'Slide your Redis Cache Hit Ratio (%) and database query latency (ms) to measure real origin load amplification.',
      'Toggle between HTTP JSON REST and internal gRPC binary framing to compare serialization overhead and pod headroom.'
    ],
    methodology: [
      'Effective DB RPS equals Peak RPS x (1 - Cache Hit Ratio). Raising cache hit ratio from 60% to 90% slashes database query demand by 4x.',
      'Estimated p95 latency aggregates gateway TLS handoff, cache lookup vs DB cold path weighting, downstream fan-out hops, and serialization framing.'
    ],
    faqs: [
      {
        question: 'When does switching internal microservice hops to gRPC actually pay off?',
        answer: 'High-fanout internal calls carrying structured payloads benefit noticeably from HTTP/2 multiplexing and Protobuf serialization, echoing the 40% latency wins we recorded in production .NET services.'
      }
    ],
    relatedAppSlug: 'content-blog'
  }
];

export const CREATOR_CHANNELS: CreatorChannelShowcase[] = [
  {
    key: 'keshavsinghworld',
    name: 'Keshav Singh World',
    handle: '@keshavsinghworld',
    platform: 'YouTube',
    url: 'https://www.youtube.com/@keshavsinghworld',
    niche: 'Tech, Engineering, AI Pipelines & Product Updates',
    audience: 'International & Indian Developers / Creators',
    tagline: 'Software architecture breakdowns, ecosystem product launches, automation workflows & behind-the-scenes builds.',
    seriesList: [
      'Ecosystem Platform Walkthroughs (.NET 10 + Angular 22 + SSO)',
      'Automated Video Studio & Creator Tooling Experiments',
      'Practical Cloud, API Performance & Policy Engineering Guides'
    ],
    scheduleCadence: 'Weekly deep-dives & release walkthroughs'
  },
  {
    key: 'omkarshivbhakti',
    name: 'Omkar Shiv Bhakti',
    handle: '@OmkarShivBhakti',
    platform: 'YouTube',
    url: 'https://www.youtube.com/@OmkarShivBhakti',
    niche: 'Devotional 3D Animations, Pauranik Kathas & Panchang Briefings',
    audience: 'Hindi & Global Cultural Families',
    tagline: 'Source-checked Pauranik kathas, daily Hindu Panchang explainers, Aaj Ka Itihaas, and 3D devotional storytelling.',
    seriesList: [
      'Daily Vedic Katha & Moral Teachings (3D Animated)',
      'Today in History (Aaj Ka Itihaas) & Festival Significance',
      'Sacred Mantras, Temple Darshan & Vrat Guides'
    ],
    scheduleCadence: 'Daily Shorts + evening Katha features'
  },
  {
    key: 'keshav-anim-ff',
    name: 'KESHAV-ANIM-FF',
    handle: '@KESHAV-ANIM-FF',
    platform: 'YouTube',
    url: 'https://www.youtube.com/@KESHAV-ANIM-FF',
    niche: '3D Comedy Shorts, Character Reaction Skits & Multi-Joke Reels',
    audience: 'Hinglish & Visual Comedy Viewers Worldwide',
    tagline: 'Original 3D animated character comedy, situational misunderstandings, exaggerated double-takes & kinetic Shorts.',
    seriesList: [
      'Funny Situations & Escalation Compilations',
      '3D Expressive Character Reaction Skits',
      'Motion-Copy Character & Backdrop Transformations'
    ],
    scheduleCadence: 'High-frequency Shorts & weekend compilations'
  }
];

export const CURATED_VIDEOS: CuratedVideoHighlight[] = [
  {
    id: 'harishchandra-katha',
    title: 'Satya Ki Vijay: Raja Harishchandra & Maharshi Vishwamitra',
    channelHandle: '@OmkarShivBhakti',
    channelName: 'Omkar Shiv Bhakti',
    format: 'Video',
    language: 'Hindi / Hinglish',
    niche: '3D Vedic Katha',
    summary: 'Multi-character dialogue dramatization produced via AnimStudio AI Story Agent with sunrise temple lighting and verified scripture citations.',
    url: 'https://www.youtube.com/@OmkarShivBhakti'
  },
  {
    id: 'panchang-daily-reel',
    title: 'Daily Panchang Brief: Tithi, Nakshatra & Rahu Kaal Alerts',
    channelHandle: '@OmkarShivBhakti',
    channelName: 'Omkar Shiv Bhakti',
    format: 'Short',
    language: 'Hindi / Hinglish',
    niche: 'Panchang & Culture',
    summary: 'Automated sunrise-checked daily cultural update linking viewers safely to full multi-city tables on panchang.keshavsingh.in.',
    url: 'https://www.youtube.com/@OmkarShivBhakti'
  },
  {
    id: 'comedy-escalation-3d',
    title: 'Funny Level 1 to Level 5: Exam Result at Home (3D Comedy)',
    channelHandle: '@KESHAV-ANIM-FF',
    channelName: 'KESHAV-ANIM-FF',
    format: 'Short',
    language: 'Hindi / Hinglish',
    niche: '3D Comedy Shorts',
    summary: 'Fast-paced 3D cartoon skit featuring jaw-drop double-take reaction physics, custom comedic SFX, and Motion Copy stage animation.',
    url: 'https://www.youtube.com/@KESHAV-ANIM-FF'
  },
  {
    id: 'sso-architecture-walkthrough',
    title: 'Single Sign-On Across 8 Web Apps Using .NET 10 & Angular 22',
    channelHandle: '@keshavsinghworld',
    channelName: 'Keshav Singh World',
    format: 'Video',
    language: 'English',
    niche: 'Software Architecture',
    summary: 'Complete system design walkthrough covering WebAuthn passkeys, refresh token rotation locks, and dynamic ecosystem configuration.',
    url: 'https://www.youtube.com/@keshavsinghworld'
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'community-free',
    name: 'Ecosystem Explorer',
    badge: 'Open Community Access',
    priceLabel: 'Free Forever ($0)',
    targetAudience: 'Readers, students, devotees & casual creators',
    description:
      'Unrestricted access to all interactive Hub calculators, long-form engineering guides, daily Hindu Panchang, Content Blog tutorials, and public Pratiyogita results.',
    features: [
      'Full access to all 4 interactive calculators on keshavsingh.in',
      'Read & print all engineering notes on blog.keshavsingh.in',
      'Daily Vedic Panchang, Festivals & Aaj Ka Itihaas without login',
      'Participate in verified zero-log YouTube live stream quizzes on Pratiyogita',
      'Browser-based story script drafting in AnimStudio AI without an API key'
    ],
    ctaLabel: 'Launch Interactive Tools',
    ctaType: 'internal-route',
    ctaTarget: '/tools'
  },
  {
    id: 'creator-member',
    name: 'Creator Studio & SSO Member',
    badge: 'Most Active Creators',
    priceLabel: 'Approved Ecosystem Account',
    targetAudience: 'Video creators, editors, educators & school coordinators',
    description:
      'One verified Central SSO membership across keshavsingh.in apps—unlocking saved AnimStudio workspaces, channel analytics tracking, moderated blog comments, and school tournament dashboards.',
    features: [
      'Single Sign-On & FIDO2 Passkey account managed via admin.keshavsingh.in',
      'Saved AnimStudio AI timelines, custom effects libraries, and channel scheduling',
      'Ghar Ledger shared household bookkeeping across family SSO members',
      'Verified comment posting on blog.keshavsingh.in & school coordination on Pratiyogita',
      'Priority collaboration & early testing access for upcoming 3D Motion Copy tools'
    ],
    ctaLabel: 'Request Creator Membership',
    ctaType: 'internal-route',
    ctaTarget: '/contact',
    highlighted: true
  },
  {
    id: 'sponsor-partner',
    name: 'Community Patron & Partner',
    badge: 'Grassroots & Tech Sponsorship',
    priceLabel: 'Custom / UPI Verified Support',
    targetAudience: 'Local tournament sponsors, brands & engineering collaborators',
    description:
      'Support open-source education tools, sponsor verified school exams and sports tournaments on Pratiyogita, or partner on technical product engineering and creator series.',
    features: [
      'Transparent UPI contribution flow with verified public acknowledgment on Pratiyogita',
      'Sponsored olympiad categories or student prize pools at city and district tiers',
      'Dedicated technical consultation or co-produced creator explainers via Contact Hub',
      'Listed supporter recognition without intrusive popups or third-party tracker bloat'
    ],
    ctaLabel: 'Discuss Sponsorship or Collaboration',
    ctaType: 'internal-route',
    ctaTarget: '/interact'
  }
];

export const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    quarter: 'Q3 2026',
    status: 'Shipped',
    title: 'Central Identity, Ecosystem Registry & Localization',
    area: 'Core Infrastructure',
    details: 'Unified .keshavsingh.in SSO authentication, dynamic CORS boundary enforcement, bilingual EN/HI seeds, and FamSphere privacy compliance.'
  },
  {
    quarter: 'Q4 2026',
    status: 'Shipped',
    title: 'Apex Ecosystem Hub Split & 3D Comedy / Motion Copy',
    area: 'keshavsingh.in + AnimStudio AI',
    details: 'Moved personal resume cleanly to portfolio.keshavsingh.in, launched static SSG keshavsingh.in Hub with 4 interactive calculators, and added 3D comedy archetypes & Motion Copy replacement.'
  },
  {
    quarter: 'Q1 2027',
    status: 'In Progress',
    title: 'International Animation Brand Expansion & Bilingual Voices',
    area: 'Creator Channels',
    details: 'Scaling both international 3D cartoon comedy playlists and dedicated Indian storytelling schedules with automated thumbnail & metadata pre-flight audits.'
  },
  {
    quarter: 'Q2 2027',
    status: 'Planned',
    title: 'Pratiyogita District Season & Unified Creator Workspace Analytics',
    area: 'Community & Telemetry',
    details: 'Rolling out multi-district school olympiad leaderboards alongside deeper cross-app traffic attribution inside SocialPulse Analytics.'
  }
];
