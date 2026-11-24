import type { GuideFaq, GuideSection } from './guides-cards.catalog';

export const GUIDE_BODIES_PART1: Record<string, { sections: GuideSection[]; faqs: GuideFaq[] }> = {
  'federated-sso-dotnet-angular-architecture': {
    sections: [
      {
        heading: '1. Why Multi-App Ecosystems Outgrow Local Login Tables',
        paragraphs: [
          'When an independent platform starts as one web application, storing password hashes, email verification flags, and refresh sessions inside that application’s primary database feels pleasantly simple. Trouble arrives the moment your second, fourth, and eighth sibling applications launch on neighboring subdomains. Within our ecosystem, visitors move naturally between AnimStudio AI (studio.keshavsingh.in), Hindu Panchang (panchang.keshavsingh.in), Pratiyogita (pratiyogita.keshavsingh.in), Ghar Ledger (ghar.keshavsingh.in), SocialPulse Analytics (social.keshavsingh.in), and the Engineering Content Blog (blog.keshavsingh.in).',
          'Duplicating identity tables across eight separate MongoDB databases creates four immediate operational hazards. First, password resets and two-factor enrollments fragment across apps, confusing users who expect one account to work everywhere. Second, security patches—such as upgrading Argon2id work factors or adding FIDO2 WebAuthn passkeys—must be redeployed eight times in lockstep. Third, revoking a compromised session requires fanning out across eight independent stores. Fourth, asking a reader on blog.keshavsingh.in to complete a fresh registration just to post a technical comment destroys participation.',
          'To solve this cleanly without paying enterprise per-MAU SaaS identity bills, we centralized every authentication ceremony inside a dedicated .NET 10 identity authority hosted at id.keshavsingh.in, paired with administrative role governance at admin.keshavsingh.in. Every sibling product runs strictly as a stateless resource server that validates signed JWT access tokens and never touches raw passwords or passkey private metadata.',
        ],
      },
      {
        heading: '2. Token Topology: In-Memory Access JWTs + Parent-Scoped HttpOnly Refresh Cookies',
        paragraphs: [
          'Browser-based Single Sign-On across sibling subdomains requires balancing seamless session continuity against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) threat models. Storing a 7-day JWT inside localStorage is unacceptable because a single XSS sink on any page lets injected script exfiltrate the bearer token silently.',
          'Instead, id.keshavsingh.in issues two distinct credentials during sign-in. First, a short-lived (15-minute) signed JWT access token returned in the JSON response body and held exclusively inside an Angular signal/service variable in JavaScript heap memory—never written to localStorage or sessionStorage. Second, a high-entropy 256-bit opaque refresh token stored inside an HttpOnly, Secure, SameSite=Lax/None cookie scoped specifically to the refresh endpoint path on id.keshavsingh.in.',
          'When a user opens ghar.keshavsingh.in in a new tab, the Angular bootstrap initializer performs a silent credentialed POST to https://id.keshavsingh.in/api/auth/refresh. If an active session cookie exists, the identity server rotates the refresh token atomically, sets the replacement HttpOnly cookie, and returns a fresh 15-minute access token carrying the user’s immutable sub identifier and granted app roles.',
        ],
        codeOrTable: {
          caption: 'Boundary Responsibilities Across Central Identity and Sibling Resource APIs',
          headers: ['Layer', 'Canonical Host', 'Primary Security Responsibility', 'Persisted Auth State'],
          rows: [
            ['Identity Authority', 'id.keshavsingh.in', 'Argon2id passwords, OTP, FIDO2 Passkeys, Refresh Rotation', 'users, passkeys, refresh_families'],
            ['Admin Console', 'admin.keshavsingh.in', 'RBAC grants, Website Origin Registry, i18n Catalogs', 'audit_logs, website_origins'],
            ['AnimStudio AI', 'studio.keshavsingh.in', 'Storyboards, FFmpeg renders, YouTube channel schedules', 'Stateless JWT validation (sub claim)'],
            ['Pratiyogita', 'pratiyogita.keshavsingh.in', 'School olympiads, sports fixtures, live quiz claims', 'Stateless JWT + ephemeral quiz RAM'],
            ['Ghar Ledger', 'ghar.keshavsingh.in', 'Household daily vendor quantities & monthly totals', 'Household ACL keyed by SSO sub'],
          ],
        },
      },
      {
        heading: '3. Eliminating Wildcard CORS Subdomain-Takeover Risks in .NET 10',
        paragraphs: [
          'Many tutorials suggest enabling SetIsOriginAllowed(origin => origin.EndsWith(".keshavsingh.in")) alongside AllowCredentials() so every current and future subdomain works automatically. In production security engineering, wildcard credentialed CORS across a parent domain is a textbook vulnerability: if a retired preview subdomain (for example, old-demo.keshavsingh.in) leaves a dangling CNAME pointing to an unclaimed cloud bucket or hosting provider, an attacker who claims that bucket immediately gains a trusted *.keshavsingh.in origin capable of invoking credentialed refresh endpoints.',
          'Our .NET 10 identity service replaces wildcard matching with a custom DynamicEcosystemCorsPolicyProvider backed by an in-memory cached snapshot of active, verified HTTPS origins stored in MongoDB’s website_registry collection. Onboarding a new app takes ten seconds in Admin without code changes, and retiring an app revokes its cross-origin authority across the cluster within 60 seconds.',
        ],
        codeBlock: {
          language: 'csharp',
          caption: 'DynamicEcosystemCorsPolicyProvider.cs — Exact HTTPS origin allowlist with zero wildcards',
          code: `public sealed class DynamicEcosystemCorsPolicyProvider(
    IOriginRegistryCache originCache,
    IHostEnvironment env) : ICorsPolicyProvider
{
    public async Task<CorsPolicy?> GetPolicyAsync(HttpContext context, string? policyName)
    {
        var origin = context.Request.Headers.Origin.ToString();
        if (string.IsNullOrWhiteSpace(origin) || !Uri.TryCreate(origin, UriKind.Absolute, out var uri))
            return null;

        // Enforce HTTPS strictly outside localhost development
        if (!env.IsDevelopment() && !string.Equals(uri.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase))
            return null;

        var normalized = $"{uri.Scheme.ToLowerInvariant()}://{uri.Authority.ToLowerInvariant()}";
        var allowedOrigins = await originCache.GetActiveOriginsAsync(context.RequestAborted);
        if (!allowedOrigins.Contains(normalized))
            return null;

        return new CorsPolicyBuilder()
            .WithOrigins(normalized)
            .AllowCredentials()
            .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .WithHeaders("Authorization", "Content-Type", "X-Requested-With", "X-Client-App")
            .SetPreflightMaxAge(TimeSpan.FromMinutes(10))
            .Build();
    }
}`,
        },
      },
      {
        heading: '4. FIDO2 / WebAuthn Passkeys Shared Cleanly Across Sibling Subdomains',
        paragraphs: [
          'WebAuthn hardware and synced passkeys (Windows Hello, Apple iCloud Keychain, Google Password Manager) bind cryptographic keypairs to a Relying Party ID (rpId). If a user registers a passkey with rpId set to studio.keshavsingh.in, the browser refuses to assert that credential on ghar.keshavsingh.in. However, the WebAuthn specification explicitly permits setting rpId to the registrable parent domain (keshavsingh.in) for any ceremony hosted on a subdomain of that parent.',
          'By pinning RelyingPartyId = "keshavsingh.in" on id.keshavsingh.in while validating the ceremony’s clientDataJSON.origin against our exact active origin set, users enroll one biometric passkey on their phone or laptop and sign in passwordlessly across every ecosystem platform.',
        ],
        bullets: [
          'Pin FIDO2 RelyingPartyId to keshavsingh.in so passkeys work seamlessly across id.keshavsingh.in and sibling login prompts.',
          'Verify UserVerificationRequirement.Preferred and persist signature counters (signCount) to flag cloned software authenticators.',
          'Always provide at least two recovery paths (secondary device passkey plus verified email OTP) before allowing passwordless-only mode.',
        ],
      },
      {
        heading: '5. Solving Multi-Tab Refresh Token Races with the Browser Web Locks API',
        paragraphs: [
          'Strict refresh token rotation—where every POST /api/auth/refresh invalidates the presented token and issues a successor—catches stolen cookies immediately if an attacker replays an older generation. Yet in real multi-tab workflows, a creator frequently keeps two AnimStudio tabs open simultaneously. When the 15-minute access token expires, both tabs fire HTTP requests at the same instant, notice a 401/expiry window, and race two concurrent refresh requests carrying the exact same cookie.',
          'Without coordination, Tab A rotates Generation 4 -> Generation 5, and 12 milliseconds later Tab B arrives presenting Generation 4—triggering false-positive replay detection and logging the creator out mid-edit! In Angular 22, we eliminated this race completely by serializing refresh calls across same-origin tabs via navigator.locks.request("ks_sso_refresh", ...) paired with a BroadcastChannel token handoff so Tab B immediately reuses Tab A’s freshly minted token without hitting the network twice.',
        ],
        codeBlock: {
          language: 'typescript',
          caption: 'sso-token-coordinator.ts — Cross-tab refresh serialization via Web Locks API',
          code: `export async function acquireFreshAccessToken(
  currentToken: () => TokenSnapshot | null,
  performNetworkRefresh: () => Promise<TokenSnapshot>,
): Promise<string> {
  const existing = currentToken();
  if (existing && existing.expiresAtEpochMs - Date.now() > 30_000) {
    return existing.accessToken;
  }

  const runSerialized = async (): Promise<string> => {
    // Re-check inside lock: another browser tab may have refreshed 10ms ago
    const rechecked = currentToken();
    if (rechecked && rechecked.expiresAtEpochMs - Date.now() > 30_000) {
      return rechecked.accessToken;
    }
    const fresh = await performNetworkRefresh();
    return fresh.accessToken;
  };

  if (typeof navigator !== 'undefined' && 'locks' in navigator) {
    return navigator.locks.request('ks_sso_refresh_lock', { mode: 'exclusive' }, runSerialized);
  }
  return runSerialized();
}`,
        },
      },
    ],
    faqs: [
      {
        question: 'Why use symmetric HS256 or EdDSA/RS256 JWKS for sibling resource servers?',
        answer:
          'Publishing an asymmetric RS256/EdDSA public key via /.well-known/jwks.json on id.keshavsingh.in is ideal because resource APIs verify token signatures using only the public key—even if a sibling service’s config is exposed, it can never mint forged tokens.',
      },
      {
        question: 'Does Safari Intelligent Tracking Prevention (ITP) block cookies across sibling subdomains?',
        answer:
          'No. Safari ITP partitions third-party cross-site cookies, whereas id.keshavsingh.in, studio.keshavsingh.in, and panchang.keshavsingh.in all share the exact same registrable eTLD+1 site (keshavsingh.in), so first-party SameSite=Lax cookies function reliably across every modern browser.',
      },
      {
        question: 'Why should HTTP retry interceptors skip /api/auth/refresh?',
        answer:
          'Because token rotation mutates server state on first arrival. If a network glitch drops the response after MongoDB already rotated the token, an automatic interceptor retry resends the consumed predecessor token and trips theft-detection revocation.',
      },
    ],
  },

  'ai-3d-animation-pipeline-ffmpeg-webgl': {
    sections: [
      {
        heading: '1. Escaping Black-Box AI Video Generators With Deterministic Storyboard Contracts',
        paragraphs: [
          'First-generation AI video tools treat creation as a slot machine: type a paragraph, wait four minutes, and discover that character outfits changed between shots, Hindi pronunciation mangled a proper noun, or caption text overlapped the bottom Shorts UI buttons. Fixing a single two-second beat forces regenerating the entire clip from scratch.',
          'When architecting AnimStudio AI (studio.keshavsingh.in) for high-frequency storytelling on @OmkarShivBhakti and 3D comedy skits on @KESHAV-ANIM-FF, we separated creative authoring into four explicit, inspectable stages: Storyboard Schema -> Voice & Viseme Synthesis -> Interactive WebGL Stage Preview -> Deterministic FFmpeg Filtergraph Composite. Every stage reads and writes a versioned JSON document so creators can re-voice Scene 3 or swap a camera angle in Scene 5 without touching approved assets in Scenes 1, 2, and 4.',
        ],
        codeBlock: {
          language: 'json',
          caption: 'Deterministic Scene Beat Contract consumed by both WebGL Preview and .NET FFmpeg Renderer',
          code: `{
  "projectId": "ep-042-wifi-exam-result",
  "aspectRatio": "9:16",
  "targetLufs": -14.0,
  "scenes": [
    {
      "sceneIndex": 0,
      "speakerId": "papa_rig_v2",
      "emotion": "excited",
      "cameraPreset": "medium_two_shot_push_in",
      "narration": "Beta exam result link khul gaya, aaj WiFi full speed chal raha hai!",
      "audioAsset": "renders/ep042/sc0_tts.wav",
      "durationMs": 3420,
      "transitionOut": { "kind": "xfade_smoothleft", "durationMs": 320 }
    }
  ]
}`,
        },
      },
      {
        heading: '2. Dual-Engine Rendering: 60fps Browser WebGL Scrubbing vs Server FFmpeg Master',
        paragraphs: [
          'Creators iterating on comedic timing need instant visual feedback when shaving 250 milliseconds off a reaction pause. Spawning a server-side FFmpeg process on every timeline drag destroys responsiveness. Instead, AnimStudio’s Angular workspace runs a lightweight Three.js + HTML5 Canvas compositor synced to Web Audio API buffers.',
          'As the playhead scrubs across the multi-track timeline, Three.js evaluates procedural bone rotations, blink curves, lip-sync mouth shapes, and CSS/shader cross-fades at 60 frames per second directly in the browser. Once the creator approves the cut and clicks Export Master, the .NET 10 backend takes over—capturing deterministic fixed-timestep frames, mixing multi-track WAV stems with sidechain audio ducking, burning safe-zone subtitles, and encoding a broadcast-compliant yuv420p MP4.',
        ],
        codeOrTable: {
          caption: 'Aspect Framing, Safe Zones & Loudness Targets Across Output Profiles',
          headers: ['Export Profile', 'Pixel Geometry', 'Safe Caption Margin (px)', 'Audio Target', 'Typical Bitrate (H.264)'],
          rows: [
            ['YouTube Shorts / Reels', '1080 × 1920 (9:16)', 'Top 220px · Bottom 420px · Sides 96px', '-14 LUFS / -1.0 dBTP', '6.2 – 7.5 Mbps (CRF 19)'],
            ['Cinema Long-Form', '1920 × 1080 (16:9)', 'Bottom 110px · Sides 120px', '-14 LUFS / -1.0 dBTP', '8.0 – 10.5 Mbps (CRF 18)'],
            ['Square Community Post', '1080 × 1080 (1:1)', 'Symmetric 90px inset', '-14 LUFS / -1.0 dBTP', '5.0 – 6.0 Mbps (CRF 20)'],
          ],
        },
      },
      {
        heading: '3. Protecting Vertical Captions From YouTube Shorts UI Overlays',
        paragraphs: [
          'One of the costliest mistakes in vertical video automation is centering subtitles near the bottom 15% of a 1080x1920 frame—the exact region where YouTube Shorts, Instagram Reels, and TikTok draw channel handles, video titles, music tickers, and remix buttons. Viewers watching on mute cannot read covered punchlines, tanking completion rate.',
          'Our subtitle layout engine enforces a strict vertical safe zone: on 9:16 exports, burned-in ASS captions anchor at PlayResY = 1920 with MarginV = 440, MarginL = 96, and MarginR = 130 (clearing right-rail Like/Comment/Share icons). Active spoken words highlight smoothly using karaoke \\kf tags so viewers lock onto rapid comedic banter effortlessly.',
        ],
      },
      {
        heading: '4. Motion Copy 3D & Procedural Archetypes for Original Visual Identity',
        paragraphs: [
          'YouTube’s monetization reviewers penalize channels that recycle static stock slideshows or unedited third-party footage under synthetic narration. Genuine viewer loyalty comes from expressive character acting: exaggerated comic double-takes, eyebrow raises, breathing idle cycles, and dynamic camera push-ins.',
          'AnimStudio AI combines procedural 3D character rigs with a Motion Copy workflow that extracts normalized pose trajectories and retargets them onto original stylized 3D characters standing inside custom lit 3D stages—stripping source backgrounds completely so every frame ships as original first-party animation.',
        ],
        bullets: [
          'Validate every scene’s audio duration from decoded PCM samples before computing FFmpeg xfade offsets.',
          'Enforce watch-time pacing checks so long-form episodes include structured narrative acts rather than padded filler loops.',
          'Run automated pre-publish verification against YouTube Data API v3 so scheduled videos never go live with missing thumbnails or truncated descriptions.',
        ],
      },
      {
        heading: '5. Pre-Publish Quality Gate & YouTube Scheduling Verification',
        paragraphs: [
          'Shipping daily devotional kathas and weekend comedy episodes reliably requires catching silent render defects before upload. Before any job transitions to ReadyToPublish, a post-render verifier runs ffprobe and frame-sampling checks: confirming non-silent integrated loudness (>-24 LUFS), verifying non-black keyframes at 10%, 50%, and 85% timestamps, checking video stream SAR/DAR aspect tags, and confirming thumbnail JPEG resolution under YouTube’s 2 MB ceiling.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can creators use AnimStudio AI without paying for external LLM APIs?',
        answer:
          'Yes. While integrated Gemini/OpenAI pools accelerate automated script drafting, creators can author or paste Story Agent JSON storyboards directly (including exports from our free Short Hook Pacing Planner on keshavsingh.in/tools) at zero token cost.',
      },
      {
        question: 'Why render final exports in FFmpeg instead of browser MediaRecorder?',
        answer:
          'Browser MediaRecorder relies on real-time tab performance and drops frames if the user switches tabs or CPU spikes, whereas server-side fixed-timestep frame rendering piped into libx264 guarantees 100% deterministic frame timing and EBU R128 loudness.',
      },
      {
        question: 'How are Devanagari Hindi and Hinglish scripts kept legible on small screens?',
        answer:
          'We pair bold high-x-height Devanagari-capable fonts (Noto Sans Devanagari / Poppins) with a 5px dark outline stroke and subtle drop shadow inside safe vertical margins.',
      },
    ],
  },

  'astronomical-vedic-panchang-calculations': {
    sections: [
      {
        heading: '1. Why Midnight-Rollover Databases Corrupt Indian Festival Dates',
        paragraphs: [
          'If you inspect dozens of hastily built calendar apps, you will notice they store Hindu Tithis as static YYYY-MM-DD strings keyed to 00:00 UTC or 00:00 IST midnight. That shortcut works for Gregorian civil holidays like January 26, yet fails catastrophically for Vedic observances such as Ekadashi, Pradosh Vrat, Purnima, Amavasya, and Ashtami.',
          'In classical Siddhantic and Drik Ganita astronomy, the civil Savana day begins at local apparent sunrise (Suryodaya) and runs until the next local sunrise. Under the Udaya Tithi principle, the Tithi active at the instant the Sun’s upper limb crosses the local eastern horizon governs the civil day’s primary identity—even if that Tithi ends forty minutes after sunrise, while evening-specific observances (such as Pradosh at sunset or Nishita Kaal on Maha Shivaratri) test lunar phase during twilight or local midnight!',
        ],
      },
      {
        heading: '2. Computing Geographic Sunrise & Sunset Across Latitudes and Longitudes',
        paragraphs: [
          'India spans nearly 30 degrees of longitude from Guhar Moti in Kutch (68.1°E) to Kibithu in Arunachal Pradesh (97.4°E), yet the entire nation shares one standard civil clock: IST (UTC+05:30, anchored to 82.5°E near Mirzapur). Because Earth rotates 1 degree every 4 minutes, local sunrise in Kolkata occurs roughly 62 minutes earlier on the clock than sunrise in Mumbai on the exact same morning.',
          'To compute accurate sunrise for any city on panchang.keshavsingh.in, we evaluate solar declination δ and the Equation of Time EOT at Julian Ephemeris Day, then solve the hour angle ω₀ accounting for standard atmospheric refraction plus solar semi-diameter (zenith distance z = 90.8333°):',
        ],
        codeBlock: {
          language: 'typescript',
          caption: 'Geographic Sunrise Hour-Angle Calculation (zenith = 90.8333° for atmospheric refraction)',
          code: `export function computeSolarHourAngleDeg(latitudeDeg: number, solarDeclinationDeg: number): number {
  const rad = Math.PI / 180;
  const zenithRad = 90.8333 * rad;
  const latRad = latitudeDeg * rad;
  const decRad = solarDeclinationDeg * rad;

  const cosOmega =
    (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad));

  // Clamp for polar latitudes where sun never rises/sets
  const clamped = Math.max(-1, Math.min(1, cosOmega));
  return Math.acos(clamped) / rad; // 15 degrees = 1 solar hour
}`,
        },
      },
      {
        heading: '3. Eight-Part Dinamana Slices: Exact Rahu Kaal, Yamaganda & Gulika Math',
        paragraphs: [
          'Once local Sunrise (t_rise) and local Sunset (t_set) are known to the minute, total daytime length Dinamana equals (t_set - t_rise). Classical Muhurta Sastra divides Dinamana into eight equal segments: SliceLen = Dinamana / 8. Only on the March and September equinoxes (when Dinamana ≈ 720 minutes) does a slice equal 90 minutes! In June in Jaipur, Dinamana reaches ~834 minutes (104.25 minutes per slice); in late December, it contracts to ~624 minutes (78 minutes per slice).',
        ],
        codeOrTable: {
          caption: 'Classical 1-Based Daytime Slice Indices (Out of 8) from Sunrise to Sunset',
          headers: ['Weekday', 'Ruling Planet', 'Rahu Kaal Slice', 'Yamaganda Slice', 'Gulika Kaal Slice', 'Equinox Clock (06:00–18:00)'],
          rows: [
            ['Sunday (Ravivara)', 'Surya (Sun)', 'Slice 8 of 8', 'Slice 5 of 8', 'Slice 7 of 8', 'Rahu: 16:30 – 18:00'],
            ['Monday (Somavara)', 'Chandra (Moon)', 'Slice 2 of 8', 'Slice 4 of 8', 'Slice 6 of 8', 'Rahu: 07:30 – 09:00'],
            ['Tuesday (Mangalavara)', 'Mangala (Mars)', 'Slice 7 of 8', 'Slice 3 of 8', 'Slice 5 of 8', 'Rahu: 15:00 – 16:30'],
            ['Wednesday (Budhavara)', 'Budha (Mercury)', 'Slice 5 of 8', 'Slice 2 of 8', 'Slice 4 of 8', 'Rahu: 12:00 – 13:30'],
            ['Thursday (Guruvara)', 'Brihaspati (Jupiter)', 'Slice 6 of 8', 'Slice 1 of 8', 'Slice 3 of 8', 'Rahu: 13:30 – 15:00'],
            ['Friday (Shukravara)', 'Shukra (Venus)', 'Slice 4 of 8', 'Slice 7 of 8', 'Slice 2 of 8', 'Rahu: 10:30 – 12:00'],
            ['Saturday (Shanivara)', 'Shani (Saturn)', 'Slice 3 of 8', 'Slice 6 of 8', 'Slice 1 of 8', 'Rahu: 09:00 – 10:30'],
          ],
        },
      },
      {
        heading: '4. Synchronizing Ephemeris Truth With Automated Devotional Video Schedules',
        paragraphs: [
          'Inside our ecosystem, panchang.keshavsingh.in and AnimStudio AI’s Daily Auto-Post Hub share the exact same Vedic astronomy rules. When scheduling an Evening-Before festival katha (for example, publishing a Kartik Purnima or Pradosh Vrat story at 06:30 PM IST the evening prior so devotees can prepare for next morning’s observance), our scheduler queries tomorrow’s sunrise-anchored festival list rather than trusting generic keyword calendars.',
        ],
        bullets: [
          'Test festival rules against true observances (Udaya Tithi for Snan/Daan, Pradosh Vyapini for Trayodashi evening, Nishita Vyapini for Shivaratri/Janmashtami).',
          'Display explicit city coordinates and timezone labels alongside every Muhurat table so diaspora readers in London, Toronto, or Sydney never misread IST clocks as local time.',
          'Cross-verify your local date right now in our free Vikram Samvat & Sunrise Kaal Calculator under /tools/panchang-samvat-converter.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why do two reputable Panchangs occasionally list a festival one day apart?',
        answer:
          'When a Tithi ends within a few minutes of local sunrise, eastern cities (like Varanasi or पटना) may witness that Tithi at sunrise (making today the Udaya Tithi), while western cities (like Mumbai or Ahmedabad, where sunrise happens 40 minutes later) see the next Tithi already active at sunrise.',
      },
      {
        question: 'What is Abhijit Muhurat and how is it calculated?',
        answer:
          'Daytime Dinamana is divided into 15 Muhurtas (each ~48 minutes at equinox). The 8th Muhurta—spanning 24 minutes before true local solar noon to 24 minutes after true local solar noon—is Abhijit Muhurat.',
      },
      {
        question: 'Which Ayanamsa does panchang.keshavsingh.in use?',
        answer:
          'We align with the official Indian Rashtriya Panchang / Lahiri Chitrapaksha Ayanamsa (~24°13\' in 2026), which anchors 180° sidereal longitude opposite the star Chitra (Spica).',
      },
    ],
  },

  'youtube-shorts-retention-vs-adsense-compliance': {
    sections: [
      {
        heading: '1. Two Separate Monetization Engines Under One Google AdSense Account',
        paragraphs: [
          'Independent creators who run both YouTube channels and companion websites routinely trip over an architectural misconception: assuming that YouTube Partner Program (YPP) approval and Website AdSense approval are interchangeable. While both pay out through the same Google AdSense Payments profile (pub-xxxxxxxxxxxxxxxx), Google operates two completely independent review pipelines with different crawlers, policy rubrics, and inventory rules.',
          'AdSense for YouTube is initiated exclusively inside YouTube Studio -> Earn after crossing 1,000 subscribers plus 4,000 valid public watch hours or 10M Shorts views. Reviewers inspect video transformation, spoken commentary, visual authorship, and advertiser-friendly guidelines. By contrast, adding a root domain inside AdSense -> Sites dispatches Mediapartners-Google and quality raters to evaluate standalone HTML text depth, original utility, site navigation honesty, and strict adherence to Google Publisher Policies.',
        ],
      },
      {
        heading: '2. Anatomy of a "Low Value Content" Rejection on Modern Web Apps',
        paragraphs: [
          'When Google AdSense returns "Needs attention — Low value content" citing support answers 10015918 (minimum content requirements), 9044175 (thin affiliate/doorway pages), and 11035931 (ads on screens without publisher-content), almost every rejected developer site exhibits one or more of four structural anti-patterns:',
          'Anti-pattern 1: Unconditional Auto-Ads on Non-Content & 404 Screens. Placing adsbygoogle.js globally in index.html without route hygiene means that 404 Not Found fallbacks, off-domain redirect bridges (/resume), thin cookie/deletion notices, and empty form screens execute ad requests—directly violating Publisher Policy 11035931.',
          'Anti-pattern 2: Portal / Link-Directory Framing. If the homepage and half of sitemap.xml consist of 250-word summary cards whose primary call-to-action sends visitors away to external subdomains or YouTube links, automated classifiers score the root domain as a navigation doorway rather than a destination.',
          'Anti-pattern 3: Sub-600-Word Articles Without Concrete Depth. Short three-paragraph overviews written in generic marketing prose fail to stand out against millions of indexed pages. Technical and creator guides must provide real code implementations, mathematical derivations, worked examples, and authentic production lessons.',
          'Anti-pattern 4: "Planned" / Under-Construction Signals in Sitemap. Submitting future roadmap promises, placeholder pricing tiers without live checkout, or duplicate legal URLs (/privacy vs /privacy-policy) inside sitemap.xml dilutes crawl quality across the entire host.',
        ],
        codeOrTable: {
          caption: 'AdSense Publisher Quality Audit: Rejected Thin SPA vs Hardened Static Publisher Hub',
          headers: ['Audit Dimension', 'Typical Rejected Developer Hub', 'Hardened Publisher Architecture (keshavsingh.in)'],
          rows: [
            ['Ad Script Scope', 'Global adsbygoogle.js firing on 404s & redirects', 'Strict content-only ad loading; zero ad script on 404/noindex/legal screens'],
            ['Editorial Depth', '6–8 short notes (~350–550 words, no code)', '16+ original deep-dive guides (1,300–1,700+ words, real code, tables, FAQs)'],
            ['Interactive Value', 'Outbound link tiles to external subdomains', '8 standalone client-side calculators & generators with worked examples'],
            ['Sitemap Hygiene', '38+ URLs bloated with /resume, /sitemap, legal stubs', 'Clean canonical content/tool/guide URLs with accurate per-page lastmod'],
            ['HTML Delivery', 'CSR shell or thin hydration templates', '100% build-time Angular SSG static HTML + self-referencing canonicals'],
          ],
        },
      },
      {
        heading: '3. Enforcing Non-Content Screen Hygiene in Static Prerendered Builds',
        paragraphs: [
          'On static hosts such as GitHub Pages, Cloudflare Pages, or Netlify, any unknown URL falls back to serving 404.html. If 404.html was copied from a shared index.html containing the AdSense Auto Ads <script>, then every broken link test performed by Google’s review crawler triggers an ad slot request on an error screen!',
          'The clean engineering solution combines build-time static post-processing with runtime route checks: keep <meta name="google-adsense-account" content="ca-pub-..."> for ownership verification, keep ads.txt authorized at the domain root, and strip or gate adsbygoogle.js so it never loads on 404.html, noindex utility routes, redirect bridges, or pure legal/contact screens.',
        ],
        codeBlock: {
          language: 'javascript',
          caption: 'Post-build static HTML guard ensuring 404 and noindex/utility routes never execute adsbygoogle.js',
          code: `const ADS_SCRIPT_RE = /<script[^>]+pagead2\\.googlesyndication\\.com\\/pagead\\/js\\/adsbygoogle\\.js[^>]*><\\/script>\\s*/gi;

export function sanitizePrerenderedPage(routePath, htmlContent) {
  const isNoindex = /<meta\\s+name=["']robots["']\\s+content=["'][^"']*noindex/i.test(htmlContent);
  const isUtilityScreen = /^\\/(404|resume|robots|sitemap|contact|privacy|terms|cookie|disclaimer|data-deletion|security|interact|plans)(\\/|$)/.test(routePath);

  if (isNoindex || isUtilityScreen) {
    return htmlContent.replace(ADS_SCRIPT_RE, '');
  }
  return htmlContent;
}`,
        },
      },
      {
        heading: '4. Pre-Review Verification Checklist Before Clicking "Request Review"',
        paragraphs: [
          'Never click "Request review" in AdSense while changes exist only on a feature branch or before CDN caches flush. Because repeated rapid rejections trigger multi-week cooldown timers, walk through every item below against live production HTTPS responses first:',
        ],
        bullets: [
          'Confirm https://yourdomain/ads.txt returns HTTP 200 text/plain with your exact DIRECT f08c47fec0942fa0 publisher record.',
          'Fetch raw HTML (without executing JS) on /, /guides/<slug>, and /tools/<slug> to verify 1,000+ words of semantic prose, unique <title>, and self-referencing <link rel="canonical">.',
          'Fetch a non-existent URL (e.g., /non-existent-test-404) and confirm it returns no adsbygoogle.js script and meta robots="noindex, follow".',
          'Ensure About, Contact, Privacy Policy (explicitly disclosing Google DoubleClick/AdSense cookies and opt-out links), Cookie settings, and Terms are reachable in one click from the global footer.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does removing adsbygoogle.js from /404 and /privacy-policy break AdSense site ownership verification?',
        answer:
          'No. Site ownership and account connection are verified via ads.txt, the <meta name="google-adsense-account"> tag, and the homepage + primary content routes—while keeping error and legal screens ad-free complies directly with Google Publisher Policy.',
      },
      {
        question: 'How long does a Google AdSense site re-review usually take?',
        answer:
          'Most site reviews complete between 2 days and 2 weeks onceMediapartners-Google re-crawls your updated sitemap and static HTML pages.',
      },
      {
        question: 'Can bilingual English + Hindi UI toggles hurt SEO or AdSense crawling?',
        answer:
          'Not when English prose is fully prerendered in static HTML with lang="en" and clean canonical URLs, while optional client-side Hindi localization enhances accessibility for Indian readers without creating thin duplicate URLs.',
      },
    ],
  },
};
