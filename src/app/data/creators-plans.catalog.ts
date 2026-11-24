export interface WorkedToolExample {
  title: string;
  scenario: string;
  steps: string[];
  takeaway: string;
}

export interface HubToolMeta {
  slug: string;
  title: string;
  badge: string;
  shortDesc: string;
  whyUseful: string;
  howToUse: string[];
  methodology: string[];
  workedExample: WorkedToolExample;
  faqs: { question: string; answer: string }[];
  relatedAppSlug: string;
  relatedGuideSlug: string;
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
  status: 'Shipped' | 'In Progress';
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
      'Estimate monthly YouTube Partner Program (AdSense for YouTube) earnings across standard 16:9 videos, vertical 9:16 Shorts, India vs Tier-1 audience mixes, and direct brand sponsorships.',
    whyUseful:
      'Generic social revenue calculators apply a single global CPM across every view, producing wildly inaccurate projections for hybrid channels that publish both 16:9 tutorials and 9:16 vertical Shorts. In practice, long-form watch-page auctions pay 15x to 45x more per thousand views than the Shorts feed pool, and advertiser auction density varies sharply between regional Indian entertainment and Tier-1 B2B software audiences. Modeling both tracks side-by-side lets creators plan sustainable production budgets before hiring editors or paying for cloud GPU renders.',
    howToUse: [
      'Enter your expected monthly 16:9 Long-Form Views and monthly 9:16 Shorts Views separately so each format uses its true auction pool math.',
      'Choose your Primary Audience Geography (India-Focused Regional, Mixed Bilingual India + Global, or Tier-1 US/UK/CA/AU) based on YouTube Studio -> Audience -> Top Geographies.',
      'Select your Channel Content Niche to apply advertiser CPC weighting between broad comedy/devotional feeds and high-intent software or finance topics.',
      'Add optional recurring monthly sponsorship income and enter your trailing 365-day Watch Hours or 90-day Shorts Views to audit YouTube Partner Program (YPP) eligibility.',
    ],
    methodology: [
      'Net creator ad revenue is calculated as (Long-Form Views / 1,000) * Calibrated Long RPM + (Shorts Views / 1,000) * Calibrated Shorts RPM, reflecting creator net share after YouTube platform splits.',
      'Long-form YouTube Partner Program watch-page ads pass 55% of net auction revenue to the creator, whereas Shorts feed revenue enters a shared creator pool where ~45% is distributed post music-licensing deductions.',
      'Blended RPM divides combined AdSense payout by total combined views * 1,000 so you can see why a viral Short spike lowers channel-wide average RPM even while total monthly dollars increase.',
      'INR equivalents use a reference USD/INR conversion benchmark (85 INR/USD) before applicable domestic GST or wire-transfer spreads.',
    ],
    workedExample: {
      title: 'Bilingual Developer & Animation Channel Hybrid Month',
      scenario:
        'A channel publishes four 12-minute .NET/AI engineering walkthroughs generating 45,000 long-form views and twenty vertical Shorts generating 350,000 Shorts views across a Mixed Bilingual audience, plus one $150 tool sponsorship.',
      steps: [
        '45,000 long-form views at a calibrated $4.99 Tech Mixed RPM generate ~$224.55 in watch-page AdSense revenue.',
        '350,000 Shorts views at a calibrated ~$0.10 Shorts RPM add ~$35.00 from the Shorts feed pool.',
        'Adding the $150 direct sponsor brings total monthly channel revenue to ~$409.55 (~₹34,812 INR), proving that 45k long-form views outperform 350k Shorts views by more than 6x in direct ad yield.',
      ],
      takeaway:
        'Use vertical Shorts primarily as top-of-funnel discovery and subscriber velocity, while anchoring channel unit economics on 8+ minute long-form episodes and direct sponsorships.',
    },
    faqs: [
      {
        question: 'Do I need an AdSense-approved website to monetize YouTube channels?',
        answer:
          'No. AdSense for YouTube (YPP) is initiated directly inside YouTube Studio -> Earn once your channel crosses 1,000 subscribers plus either 4,000 valid public watch hours (365 days) or 10 million valid public Shorts views (90 days). Website AdSense under Sites is a separate review track for web publishers.',
      },
      {
        question: 'Why does international English traffic shift RPM so dramatically?',
        answer:
          'Advertiser bid density in US, UK, Canadian, Australian, and German auctions for cloud, SaaS, developer tooling, and financial products routinely clears 4x to 7x higher CPMs than general consumer entertainment inventory.',
      },
      {
        question: 'Why is my YouTube Studio CPM higher than the RPM shown here?',
        answer:
          'CPM measures what advertisers pay per 1,000 monetized playbacks before YouTube’s 45% cut, whereas RPM measures what you actually take home per 1,000 total views (including unmonetized views and ad-blocked sessions).',
      },
    ],
    relatedAppSlug: 'social-analytics',
    relatedGuideSlug: 'youtube-shorts-retention-vs-adsense-compliance',
  },
  {
    slug: 'short-hook-pacing-planner',
    title: 'Comedy & 3D Short Scene Pacing Planner',
    badge: 'AnimStudio Storyboard Tool',
    shortDesc:
      'Design high-retention 15s–60s Shorts with 3-second hook budget checks, spoken WPM timing, character emotion cues, and one-click Story Agent JSON export.',
    whyUseful:
      'Vertical Shorts live or die in the opening 3.5 seconds: if your first line wastes six seconds on polite introductions or throat-clearing exposition, 45%+ of swipe-feed viewers scroll away before the premise lands. Pre-timing spoken dialogue against realistic Hindi, Hinglish, or English voiceover cadence lets writers trim bloated sentences before burning TTS tokens or 3D GPU render minutes.',
    howToUse: [
      'Load either the 3D Hinglish Comedy Skit preset or the Devotional Pauranik Katha preset to inspect a proven multi-beat vertical structure.',
      'Set your voiceover speaking rate in Words Per Minute (135–155 WPM for expressive comedy banter; 115–130 WPM for calm devotional narration).',
      'Edit each beat’s speaker name, facial/vocal emotion tag, spoken dialogue, and 3D camera/stage visual prompt, adding beats as needed.',
      'Verify that Opening Hook Pace stays green (< 3.5s) and Total Runtime stays under 58 seconds, then copy the generated Story Agent JSON.',
    ],
    methodology: [
      'Each beat’s runtime combines spoken word duration (words / (WPM / 60)) with a 0.45-second inter-cut reaction and audio-ducking buffer so FFmpeg xfade transitions never clip the final syllable.',
      'Opening Hook Status classifies Beat 1 into Tight (< 3.5s), Moderate (3.5s–6s), or Slow (> 6s) based on retention telemetry from vertical comedy and katha uploads.',
      'The exported JSON schema matches AnimStudio AI’s deterministic scene contract (sceneNumber, speaker, emotion, narration, visualPrompt, targetSeconds).',
    ],
    workedExample: {
      title: 'Tightening a Sluggish 30-Second Hinglish Comedy Opening',
      scenario:
        'An initial draft opens with a 19-word greeting ("Hello dosto aaj hum dekhenge ki jab ghar mein exam ka result aata hai toh papa kya bolte hain"), taking 8.3 seconds before any conflict begins.',
      steps: [
        'Paste the 19-word opening into Scene 1 at 145 WPM: the planner flags Opening Hook Pace as 8.31s — Slow (> 6s).',
        'Rewrite Scene 1 into an immediate in-media-res accusation: "Beta result link khul gaya, WiFi router kyun chhupa raha hai?" (11 words).',
        'Scene 1 drops to 5.0s (or 3.3s at 8 words), locking viewer curiosity immediately while freeing 5 seconds for a sharper twist punchline in Scene 3.',
      ],
      takeaway:
        'Start vertical stories in the middle of the conflict—never waste Beat 1 explaining what the video is about to show.',
    },
    faqs: [
      {
        question: 'Can I paste this JSON directly into AnimStudio AI without an LLM API key?',
        answer:
          'Yes. Open Story Agent -> Manual JSON Import on studio.keshavsingh.in and paste the exported payload to populate scenes, emotions, and camera prompts with zero external LLM cost.',
      },
      {
        question: 'Why does the calculator add 0.45 seconds per scene beat?',
        answer:
          'Without a 400–500ms breath and visual reaction pad between cuts, rapid multi-speaker TTS tracks sound robotic and FFmpeg cross-fades step on the end of punchlines.',
      },
      {
        question: 'What WPM works best for Devanagari Hindi vs English?',
        answer:
          'Spoken Hindi/Hinglish with comic reaction pauses sounds natural around 140–150 WPM, whereas solemn Sanskrit-inflected Katha storytelling breathes best around 118–128 WPM.',
      },
    ],
    relatedAppSlug: 'animstudio',
    relatedGuideSlug: 'two-channel-comedy-strategy-local-vs-international',
  },
  {
    slug: 'panchang-samvat-converter',
    title: 'Vikram Samvat & Sunrise-Anchored Kaal Calculator',
    badge: 'Vedic Calendar Utility',
    shortDesc:
      'Convert any Gregorian date into Vikram Samvat and Shaka Samvat eras and compute exact 8-slice daytime Rahu Kaal, Yamaganda, Gulika Kaal, and Abhijit Muhurat from local Sunrise and Sunset.',
    whyUseful:
      'Static wall calendars and generic websites print fixed 90-minute Rahu Kaal tables (such as 07:30–09:00 AM every Monday) that assume sunrise happens at exactly 06:00 AM and sunset at 06:00 PM all year round. In real Indian geography, summer daylight in northern cities exceeds 13 hours 55 minutes while December daylight shrinks near 10 hours 20 minutes—shifting real planetary kaal boundaries by up to 38 minutes.',
    howToUse: [
      'Pick any Gregorian date (defaults automatically to today’s date) or click a city sunrise/sunset preset such as New Delhi, Varanasi, Mumbai, Ujjain, or Bengaluru.',
      'Enter your exact local Sunrise and Sunset in 24-hour HH:MM format for precise geographic calibration.',
      'Inspect Vikram Samvat (VS) and Shaka Samvat (SE) era years alongside exact daylight length and single-slice duration in minutes.',
      'Read exact local clock windows for Rahu Kaal, Yamaganda Kaal, Gulika Kaal, and midday Abhijit Muhurat.',
    ],
    methodology: [
      'Daytime duration Dinamana = Sunset - Sunrise is divided into 8 equal planetary segments (Ashtama Bhaga). Each weekday maps Rahu, Yamaganda, and Gulika to classical Vedic slice indices.',
      'Rahu Kaal weekday slice sequence (Sun..Sat) follows [8, 2, 7, 5, 6, 4, 3]—the source behind the traditional mnemonic "Mother Saw Father WearingThe Turban Suddenly".',
      'Abhijit Muhurat spans the 8th of 15 daytime Muhurtas (Dinamana / 15), centered symmetrically on local真 solar noon (Madhyahna), with traditional Wednesday avoidance noted explicitly.',
      'Vikram Samvat offsets Gregorian years by +57 post-Chaitra Shukla Pratipada (+56 earlier in Jan–March); Shaka Samvat offsets by -78 (-79 pre-Chaitra).',
    ],
    workedExample: {
      title: 'Winter Solstice vs Summer Solstice Monday Rahu Kaal in Delhi',
      scenario:
        'Comparing a December Monday in New Delhi (Sunrise 07:09, Sunset 17:28 -> 619 min daylight) against a June Monday (Sunrise 05:23, Sunset 19:21 -> 838 min daylight).',
      steps: [
        'In December, each 1/8th slice lasts 77.38 minutes, placing Monday Rahu Kaal (Slice 2) from 08:26 AM to 09:44 AM—nearly 44 minutes later than a naive 07:30–09:00 table!',
        'In June, each 1/8th slice stretches to 104.75 minutes, placing Monday Rahu Kaal from 07:08 AM to 08:53 AM.',
        'Solar noon Abhijit Muhurat likewise shifts cleanly with true midpoint rather than sticking to 12:00 PM IST.',
      ],
      takeaway:
        'Always anchor Rahu Kaal, Choghadiya, and Muhurat windows to local Sunrise and Sunset rather than memorized clock constants.',
    },
    faqs: [
      {
        question: 'Why does changing the city at the same IST timezone change Rahu Kaal?',
        answer:
          'All of India shares one civil clock (IST = UTC+05:30, anchored at 82.5°E near Mirzapur), but physical sunrise in Guwahati occurs nearly 65 minutes earlier than sunrise in Dwarka, Gujarat.',
      },
      {
        question: 'Why is Abhijit Muhurat marked differently on Wednesdays?',
        answer:
          'Classical Muhurta treatises (such as Muhurta Chintamani) advise avoiding Abhijit Muhurat on Wednesdays for new auspicious travel or ceremonies despite its solar-noon strength on other weekdays.',
      },
      {
        question: 'How do I check exact lunar Tithi and Nakshatra end times?',
        answer:
          'Use our companion Lunar Tithi & Nakshatra Angle Calculator on /tools/tithi-nakshatra-lunar-phase-calculator or view live city ephemeris tables on panchang.keshavsingh.in.',
      },
    ],
    relatedAppSlug: 'panchang',
    relatedGuideSlug: 'astronomical-vedic-panchang-calculations',
  },
  {
    slug: 'api-latency-capacity-planner',
    title: 'Microservices Latency & Scaling Capacity Planner',
    badge: 'Backend Architecture Calculator',
    shortDesc:
      'Model origin database RPS offload via Redis caching, internal gRPC vs JSON REST hop overhead, egress bandwidth, p50/p95 tail latency, and Kubernetes replica sizing.',
    whyUseful:
      'Distributed backends rarely fail at average load; they fail when a viral video or tournament deadline spikes concurrent requests while cache hit ratios dip, multiplying downstream database queries across chained microservice hops. Modeling effective DB RPS, serialization framing cost, and burst-buffered pod counts upfront prevents both cloud overspend and p95 latency meltdowns.',
    howToUse: [
      'Set your expected Peak Requests Per Second (RPS) at the API gateway and average serialized payload size in KB.',
      'Adjust your Redis / distributed Cache Hit Ratio (%) and cold MongoDB/SQL query execution time (ms).',
      'Select the number of synchronous internal service hops and toggle between gRPC (HTTP/2 + Protobuf) and JSON REST.',
      'Review Effective DB RPS, Egress Bandwidth (Mbps), p50/p95 response budgets, and burst-safe container replica count.',
    ],
    methodology: [
      'Effective Origin DB RPS = Peak Gateway RPS * (1 - CacheHitRatio). Raising cache hit rate from 60% to 92% cuts database read pressure by 5x.',
      'Protobuf binary framing over HTTP/2 multiplexed streams models ~38% smaller wire payloads and ~2.7ms lower per-hop serialization + framing overhead compared to verbose UTF-8 JSON REST.',
      'Recommended Kubernetes / container replicas include a 35% burst headroom factor above baseline .NET 10 Kestrel pod concurrency targets with a minimum 2-replica HA floor.',
    ],
    workedExample: {
      title: 'Sizing a Live Quiz Leaderboard Spike on Pratiyogita',
      scenario:
        'During a YouTube livestream quiz finale, 1,200 concurrent viewers refresh leaderboard and question states generating 600 Peak RPS with 24 KB payloads across 3 internal hops and an 18ms MongoDB query.',
      steps: [
        'Without caching (0% hit rate) over JSON REST, all 600 RPS hit MongoDB directly, pushing estimated p95 past 66ms and risking connection-pool contention.',
        'Adding a 5-second Redis TTL cache yielding an 88% hit ratio drops Effective DB RPS from 600 down to 72 RPS.',
        'Switching internal service-to-service hops to gRPC cuts egress bandwidth from 115.2 Mbps to 71.4 Mbps and trims p95 tail latency down to ~35ms across 3 HA pods.',
      ],
      takeaway:
        'Even a 3-to-5 second micro-cache on read-heavy endpoints eliminates 85%+ of origin database load during livestream traffic bursts.',
    },
    faqs: [
      {
        question: 'When should I keep JSON REST at the edge and gRPC internally?',
        answer:
          'Browser clients consume standard HTTPS JSON REST effortlessly without proxy translation, while internal service-to-service calls behind your ingress gain the biggest win from gRPC HTTP/2 connection reuse and strict .proto contracts.',
      },
      {
        question: 'Why enforce a minimum of 2 replicas even at 20 RPS?',
        answer:
          'A single container replica creates a zero-downtime deployment gap during rolling restarts, node drains, or unscheduled OOM kills.',
      },
    ],
    relatedAppSlug: 'content-blog',
    relatedGuideSlug: 'mongodb-indexing-multi-tenant-dotnet-microservices',
  },
  {
    slug: 'ffmpeg-video-bitrate-storage-calculator',
    title: 'FFmpeg Video Bitrate, CRF & Cloud Storage Estimator',
    badge: 'Video Encoding Calculator',
    shortDesc:
      'Calculate optimal H.264, H.265/HEVC, and AV1 video bitrates, recommended CRF values, MP4 file sizes, hourly studio disk budgets, CDN egress, and ready-to-run FFmpeg CLI commands.',
    whyUseful:
      'Exporting 3D animated Shorts or 4K tutorials with arbitrary bitrates either bloats 60-second MP4s past 180 MB—stalling mobile uploads and racking up S3/R2 egress bills—or starves high-motion scenes of bits, causing ugly macroblocking around subtitles and particle effects. Calculating bits-per-pixel-per-frame (BPP) across codecs gives you crisp visual quality and a copy-pasteable production FFmpeg command.',
    howToUse: [
      'Choose your target canvas preset: Vertical Shorts (1080x1920), Full HD (1920x1080), QHD (2560x1440), or 4K UHD (3840x2160).',
      'Select frame rate (24, 30, or 60 fps), video encoder (H.264 libx264, H.265 libx265, or AV1 libsvtav1), and scene motion complexity.',
      'Enter audio bitrate, clip duration in seconds, and expected monthly direct downloads/streams if self-hosting video assets.',
      'Inspect target Mbps, recommended CRF, single-file MB, hourly archive GB, and copy the generated FFmpeg command with VBV maxrate/bufsize and +faststart flags.',
    ],
    methodology: [
      'Target video bitrate scales pixel area * effective frame rate * motion BPP (0.065 low, 0.105 medium, 0.155 high) multiplied by codec compression efficiency (H.264 = 1.0x, H.265 = 0.64x, AV1 = 0.48x).',
      'Frame rates above 30 fps use a 0.65x temporal-redundancy slope because consecutive 60 fps frames exhibit smaller inter-frame motion vectors.',
      'Generated FFmpeg commands pair Constant Rate Factor (-crf) quality targeting with VBV Constrained Encoding (-maxrate 1.25x, -bufsize 2.5x) and -movflags +faststart so web players begin playback before downloading the full file.',
    ],
    workedExample: {
      title: 'Encoding a 55-Second 1080x1920 3D Animated Short at 30 FPS',
      scenario:
        'Preparing a medium-motion 55-second vertical 3D animated episode with 192 kbps AAC stereo audio for studio preview hosting and YouTube upload.',
      steps: [
        'At 1080x1920 @ 30 fps Medium motion in H.264 (libx264), target bitrate lands around 6.53 Mbps (CRF 20), producing a crisp ~46 MB MP4.',
        'Switching archival/self-hosted delivery to H.265 (libx265 -tag:v hvc1, CRF 24) drops bitrate to ~4.18 Mbps and shrinks file size to ~29.6 MB with equivalent perceptual sharpness.',
        'Adding -pix_fmt yuv420p and -movflags +faststart guarantees compatibility across Safari, Chrome, Android WebViews, and YouTube ingestion.',
      ],
      takeaway:
        'Always pair -crf with -maxrate/-bufsize and -movflags +faststart in automated creator pipelines so complex particle bursts never spike stream bandwidth.',
    },
    faqs: [
      {
        question: 'Why is -pix_fmt yuv420p mandatory in the generated FFmpeg command?',
        answer:
          'When rendering from PNG frame sequences or RGB WebGL canvases, FFmpeg defaults to yuv444p, which fails to play on Apple QuickTime, iOS Safari, and several hardware decoders unless yuv420p is specified explicitly.',
      },
      {
        question: 'What does -movflags +faststart do for web video?',
        answer:
          'It relocates the MP4 moov atom index from the end of the file to the front header after encoding, allowing HTML5 <video> tags to start playing on the first HTTP range request.',
      },
      {
        question: 'Should I upload H.264 or AV1 to YouTube?',
        answer:
          'For YouTube uploads, high-bitrate H.264 (CRF 18–20) encodes 5x faster on CPU/NVENC and YouTube transcodes every upload into its own VP9/AV1 ladders anyway; use AV1 or H.265 when paying for your own CDN storage and egress.',
      },
    ],
    relatedAppSlug: 'animstudio',
    relatedGuideSlug: 'ffmpeg-xfade-loudnorm-subtitle-burnin-pipeline',
  },
  {
    slug: 'tithi-nakshatra-lunar-phase-calculator',
    title: 'Lunar Tithi, Paksha & Nakshatra Angle Explorer',
    badge: 'Vedic Astronomy Tool',
    shortDesc:
      'Compute exact Shukla/Krishna Paksha, Tithi (1–30), % elapsed, degrees remaining, Nakshatra (1–27) with Pada (1–4), Nitya Yoga, and Karana from Nirayana Sun and Moon longitudes.',
    whyUseful:
      'Every limb of the classical 5-part Hindu Panchang derives geometrically from two numbers: Nirayana (sidereal) Solar Longitude and Nirayana Lunar Longitude on the ecliptic circle (0°–360°). Developers building calendar software and students of Jyotisha/astronomy often struggle to visualize how 12° synodic Tithis, 13°20\' sidereal Nakshatras, and 6° Karanas interlock. This explorer makes the exact spherical-ecliptic math interactive.',
    howToUse: [
      'Click an astronomical festival preset (such as Kartik Amavasya / Diwali, Purnima, Shukla Ekadashi, or Maha Shivaratri) or enter any Nirayana Sun and Moon longitude in degrees (0°–360°).',
      'Read the computed Moon–Sun synodic elongation angle (Δλ), active Paksha, Tithi number (1–30), and classical Sanskrit Tithi name.',
      'Check Percentage of Tithi Elapsed and Degrees Remaining until the next Tithi boundary (12° per Tithi).',
      'Inspect the Moon’s sidereal Nakshatra (1–27), Nakshatra Pada (1–4), combined Lunisolar Nitya Yoga (1–27), and half-tithi Karana.',
    ],
    methodology: [
      'Tithi measures synodic lunar phase: Δλ = (λ_Moon - λ_Sun + 360) mod 360. Dividing Δλ by 12° yields Tithi 1..15 (Shukla Paksha waxing) and 16..30 (Krishna Paksha waning, ending in Amavasya at 348°–360°).',
      'Nakshatra divides the 360° sidereal zodiac into 27 equal lunar mansions of 13°20\' (13.3333°), each subdivided into 4 Padas of 3°20\' (3.3333°) matching Navamsha quarters.',
      'Nitya Yoga sums sidereal longitudes: ((λ_Moon + λ_Sun) mod 360) / 13.3333°, indexing the 27 classical Yogas from Vishkumbha to Vaidhriti.',
      'Karana splits each 12° Tithi into two 6° halves (60 Karanas per lunar month: 4 fixed Karanas around Amavasya/Pratipada and 7 repeating movable Karanas, where Vishti corresponds to Bhadra).',
    ],
    workedExample: {
      title: 'Verifying Dev Uthani (Prabodhini) Shukla Ekadashi Geometry',
      scenario:
        'Suppose Nirayana Sun stands in Tula/Vrischika at 208.40° and Nirayana Moon reaches Kumbha at 334.40° at local sunrise.',
      steps: [
        'Moon minus Sun elongation Δλ = (334.40° - 208.40°) = 126.00°.',
        'Dividing 126.00° by 12° equals 10.50 -> Tithi index floor(10.5) + 1 = 11 (Shukla Ekadashi), exactly 50% elapsed with 6.00° remaining.',
        'Moon at 334.40° / 13.3333° = 25.08 -> 26th Nakshatra (Uttara Bhadrapada, Pada 1), while Karana index floor(126 / 6) = 21 -> Vishti/Vanija boundary.',
      ],
      takeaway:
        'Because the Moon’s elliptical orbit varies between ~11.8°/day (apogee) and ~15.4°/day (perigee), 6.0° remaining translates to ~9.3–12.2 hours depending on instantaneous lunar velocity.',
    },
    faqs: [
      {
        question: 'What is the difference between Tropical (Sayana) and Sidereal (Nirayana) longitude?',
        answer:
          'Western ephemerides report Tropical longitudes measured from the precessing vernal equinox, whereas Indian Panchangs subtract Lahiri Chitrapaksha Ayanamsa (~24.2° in 2026) to anchor 0° Mesha to fixed star Spica (Chitra). Note that Tithi (λ_Moon - λ_Sun) is identical in both systems because Ayanamsa cancels out in subtraction, while Nakshatra and Yoga require Nirayana longitudes!',
      },
      {
        question: 'Why can a Tithi be skipped (Kshaya) or repeated (Adhika) on civil calendars?',
        answer:
          'A Tithi spans 12° of Moon–Sun separation, taking anywhere from ~19.5 hours (near lunar perigee) to ~26.8 hours (near apogee). If a short 20-hour Tithi begins after today’s sunrise and ends before tomorrow’s sunrise, no sunrise sees it as Udaya Tithi (Kshaya Tithi).',
      },
    ],
    relatedAppSlug: 'panchang',
    relatedGuideSlug: 'surya-siddhanta-lahiri-ayanamsa-tithi-math',
  },
  {
    slug: 'json-ld-seo-schema-generator',
    title: 'JSON-LD Structured Data & OpenGraph Validator',
    badge: 'Technical SEO Utility',
    shortDesc:
      'Generate XSS-safe Schema.org JSON-LD (TechArticle, WebApplication, FAQPage), canonical links, and OpenGraph <head> tags with live SERP character-length diagnostics.',
    whyUseful:
      'Hand-writing <script type="application/ld+json"> blocks across static pages or SPAs frequently introduces two silent bugs: unescaped "</script>" or HTML characters inside article descriptions break DOM parsing, and mismatched <link rel="canonical"> vs og:url tags split search indexing signals. This generator validates title/description SERP length budgets and emits clean, escaped HTML + JSON-LD.',
    howToUse: [
      'Select your primary Schema.org entity type: TechArticle (guides/blogs), SoftwareApplication (browser tools/apps), or FAQPage.',
      'Enter your Page Title, Meta Description, HTTPS Canonical URL, Author Name, and ISO Publication Date (or FAQ pair).',
      'Check the live Title Length (target 45–65 chars) and Meta Description Length (target 110–160 chars) badges plus HTTPS Canonical check.',
      'Copy the complete <head> snippet with unicode-escaped JSON-LD and OpenGraph properties straight into your template or SEO service.',
    ],
    methodology: [
      'Google desktop and mobile SERPs typically truncate <title> elements beyond ~60–65 characters (~600px) and meta descriptions beyond ~155–160 characters.',
      'Inline JSON-LD serialization escapes <, >, and & into \\u003c, \\u003e, and \\u0026—the exact hardening pattern used in keshavsingh.in’s SeoHubService—preventing script-tag breakout vulnerabilities.',
      'Canonical URL validation enforces explicit https:// origins without query strings (?utm=...) or URL fragments (#section) so search crawlers consolidate link equity cleanly.',
    ],
    workedExample: {
      title: 'Auditing a Prerendered Angular Guide Route Before Deployment',
      scenario:
        'Publishing a new architecture article at https://keshavsingh.in/guides/federated-sso-dotnet-angular-architecture and verifying rich-result eligibility.',
      steps: [
        'Select TechArticle, paste the 58-character headline and 148-character summary: both Title and Description badges report Optimal.',
        'Confirm the canonical URL uses https:// without trailing query parameters and matches og:url 1-to-1.',
        'Copy the unicode-escaped JSON-LD block and verify zero syntax warnings in Schema Markup Validator.',
      ],
      takeaway:
        'Every indexable route should self-canonicalize cleanly in static HTML before client JavaScript executes.',
    },
    faqs: [
      {
        question: 'Why escape "<" as "\\u003c" inside application/ld+json scripts?',
        answer:
          'HTML parsers scan strictly for the literal character sequence "</script>" inside script blocks without understanding JSON string quotes. Unicode escaping keeps valid JSON intact while making premature tag closure impossible.',
      },
      {
        question: 'Should alias or 404 routes include Schema.org structured data?',
        answer:
          'No. Routes marked noindex (such as /404 or legacy redirect aliases) should omit rich-result JSON-LD graphs so crawlers never receive conflicting indexing signals.',
      },
    ],
    relatedAppSlug: 'content-blog',
    relatedGuideSlug: 'technical-seo-angular-ssg-cwv-publisher-checklist',
  },
  {
    slug: 'cron-jwt-epoch-developer-toolkit',
    title: 'Cron Schedule, IST Epoch & JWT Rotation Planner',
    badge: 'DevOps & Auth Utility',
    shortDesc:
      'Translate UTC 5-field Cron expressions into IST (UTC+05:30) wall-clock schedules, convert Unix Epoch timestamps, and audit OAuth2/JWT access-to-refresh rotation posture.',
    whyUseful:
      'Cloud schedulers (GitHub Actions, Kubernetes CronJobs, Hangfire, AWS EventBridge) evaluate cron expressions in UTC, causing frequent off-by-5.5-hour mistakes when scheduling 06:00 AM IST Panchang or YouTube morning releases (which actually require 30 0 * * * UTC!). Pairing UTC-to-IST cron translation with Unix Epoch decoding and JWT rotation math saves backend engineers daily context-switching.',
    howToUse: [
      'Enter a standard 5-field UTC Cron expression (min hour day-of-month month day-of-week) or load a common DevOps/Creator preset.',
      'Compare the exact UTC execution schedule against its Asia/Kolkata IST (+05:30) wall-clock equivalent (including +1 day midnight rollovers).',
      'Enter any Unix Epoch timestamp in seconds (or click Current Timestamp) to inspect exact UTC ISO-8601 and IST formatted dates.',
      'Adjust JWT Access Token TTL (minutes) and Refresh Token TTL (days) to inspect session rotation frequency and security posture.',
    ],
    methodology: [
      'Asia/Kolkata (IST) observes a fixed +330-minute (+05:30) offset from UTC year-round with zero Daylight Saving Time transitions.',
      'Any UTC cron firing at or after 18:30 UTC rolls forward into the next calendar date in IST (e.g., 30 18 * * * UTC = 12:00 AM midnight IST next day).',
      'JWT security posture classifies stateless bearer access lifetimes <= 15 minutes as Hardened when paired with HttpOnly replay-detected refresh token rotation.',
    ],
    workedExample: {
      title: 'Scheduling a 05:45 AM IST Daily Panchang Short Render in GitHub Actions / .NET',
      scenario:
        'You want a background worker running on a UTC Linux container to render and publish the morning Panchang briefing at 05:45 AM IST every day.',
      steps: [
        'Subtract 5 hours 30 minutes from 05:45 IST -> 00:15 UTC on the same calendar day.',
        'Enter 15 0 * * * into the Cron field: the planner confirms "Runs at 00:15 UTC every day" and "Runs at 05:45 AM IST every day".',
        'Verify your worker’s internal OAuth access token uses a 15-minute TTL with serialized refresh rotation so overnight jobs never hold long-lived bearer secrets.',
      ],
      takeaway:
        'Always verify half-hour minute carryovers (00 vs 30) when converting IST schedules into UTC cron expressions!',
    },
    faqs: [
      {
        question: 'Why do half-hour timezones like IST (+05:30) break hourly "0 * * * *" expectations?',
        answer:
          'A cron set to "0 * * * *" fires on the top of every UTC hour (00:00, 01:00 UTC), which corresponds to :30 past every hour in IST (05:30, 06:30 IST). To fire on the top of every IST hour, use "30 * * * *".',
      },
      {
        question: 'Why keep JWT access tokens at 10–15 minutes instead of 24 hours?',
        answer:
          'Stateless JWTs cannot be revoked mid-flight without adding server-side blocklists. Keeping access tokens to 10–15 minutes bounds blast radius while HttpOnly refresh rotation seamlessly renews active sessions.',
      },
    ],
    relatedAppSlug: 'portfolio',
    relatedGuideSlug: 'federated-sso-dotnet-angular-architecture',
  },
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
      'Practical Cloud, API Performance & Policy Engineering Guides',
    ],
    scheduleCadence: 'Weekly deep-dives & release walkthroughs',
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
      'Sacred Mantras, Temple Darshan & Vrat Guides',
    ],
    scheduleCadence: 'Daily Shorts + evening Katha features',
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
      'Motion-Copy Character & Backdrop Transformations',
    ],
    scheduleCadence: 'High-frequency Shorts & weekend compilations',
  },
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
    url: 'https://www.youtube.com/@OmkarShivBhakti',
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
    url: 'https://www.youtube.com/@OmkarShivBhakti',
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
    url: 'https://www.youtube.com/@KESHAV-ANIM-FF',
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
    url: 'https://www.youtube.com/@keshavsinghworld',
  },
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'community-free',
    name: 'Ecosystem Explorer',
    badge: 'Open Community Access',
    priceLabel: 'Free Forever ($0)',
    targetAudience: 'Readers, students, devotees & independent creators',
    description:
      'Unrestricted access to all eight interactive Hub calculators, all sixteen long-form engineering guides, daily Hindu Panchang, Content Blog tutorials, and public Pratiyogita results.',
    features: [
      'Full access to all 8 interactive calculators & generators on keshavsingh.in',
      'Read & print all 16+ long-form guides here and notes on blog.keshavsingh.in',
      'Daily Vedic Panchang, Festivals & Aaj Ka Itihaas without login',
      'Participate in verified zero-log YouTube live stream quizzes on Pratiyogita',
      'Browser-based story script drafting in AnimStudio AI without an API key',
    ],
    ctaLabel: 'Launch Interactive Tools',
    ctaType: 'internal-route',
    ctaTarget: '/tools',
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
      'Priority collaboration & early testing access for 3D Motion Copy workflows',
    ],
    ctaLabel: 'Request Creator Membership',
    ctaType: 'internal-route',
    ctaTarget: '/contact',
    highlighted: true,
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
      'Listed supporter recognition without intrusive popups or third-party tracker bloat',
    ],
    ctaLabel: 'Discuss Sponsorship or Collaboration',
    ctaType: 'internal-route',
    ctaTarget: '/contact',
  },
];

export const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    quarter: 'Release v1.0 · Q3 2026',
    status: 'Shipped',
    title: 'Central Identity (SSO), Dynamic CORS Registry & Bilingual i18n',
    area: 'Core Infrastructure',
    details:
      'Shipped id.keshavsingh.in .NET 10 authentication server with FIDO2 WebAuthn passkeys, MongoDB-backed origin allowlists, replay-safe refresh rotation, and EN/HI localization.',
  },
  {
    quarter: 'Release v1.4 · Oct 2026',
    status: 'Shipped',
    title: 'Sunrise-Anchored Ephemeris Engine & Zero-Log Live Quiz Verification',
    area: 'Panchang + Pratiyogita',
    details:
      'Launched location-aware 5-limb Vedic Panchang calculations on panchang.keshavsingh.in and ephemeral in-memory YouTube handle verification on pratiyogita.keshavsingh.in.',
  },
  {
    quarter: 'Release v2.0 · Nov 2026',
    status: 'Shipped',
    title: 'Static SSG Publisher Hub, 8 Browser Calculators & 16 Deep-Dive Guides',
    area: 'keshavsingh.in + AnimStudio AI',
    details:
      'Separated career CV onto portfolio.keshavsingh.in, deployed static pre-rendered keshavsingh.in publication with 8 standalone engineering/creator/astronomy calculators, multi-key AES-256-GCM LLM failover pools, and 3D Motion Copy pipelines.',
  },
  {
    quarter: 'Active Track · Late 2026',
    status: 'In Progress',
    title: 'Bilingual Voice Synthesis & District School Olympiad Scoreboards',
    area: 'Creator & Community',
    details:
      'Expanding multi-speaker Hindi/English neural prosody controls inside AnimStudio AI alongside multi-district academic leaderboard exports in Pratiyogita.',
  },
];
