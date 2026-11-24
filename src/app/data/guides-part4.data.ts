import type { GuideFaq, GuideSection } from './guides-cards.catalog';

export const GUIDE_BODIES_PART4: Record<string, { sections: GuideSection[]; faqs: GuideFaq[] }> = {
  'procedural-threejs-webgl-character-rigging-shorts': {
    sections: [
      {
        heading: '1. Why Procedural Spring Physics Beat Heavy Mocap Files for Browser Studios',
        paragraphs: [
          'Shipping 40 MB FBX/GLB motion-capture libraries over cellular connections makes browser-based 3D video editors sluggish to boot and rigid to edit: if a creator changes a line of dialogue from 2.4 seconds to 3.9 seconds, pre-baked keyframe clips either cut off mid-gesture or stretch into unnatural slow motion.',
          'In AnimStudio AI’s Three.js character engine, stylized cartoon and devotional characters are driven procedurally from lightweight parametric rigs. Breathing torso expansion, saccadic eye darts, natural blink intervals, head tilts, and exaggerated comedy jaw-drops are evaluated continuously using damped harmonic oscillator (spring-damper) math—adapting smoothly to any arbitrary line duration!',
        ],
        codeBlock: {
          language: 'typescript',
          caption: 'Semi-Implicit Euler Spring-Damper Bone Evaluator for Expressive Cartoon Overshoot',
          code: `export interface SpringState {
  position: number;
  velocity: number;
}

/**
 * Evaluates a damped spring: x'' = -stiffness * (x - target) - damping * x'
 * Slight under-damping (zeta ~ 0.55) creates classic Pixar/cartoon double-take bounce!
 */
export function stepCartoonSpring(
  state: SpringState,
  target: number,
  stiffness: number, // e.g., 180 for snappy head turn
  damping: number,   // e.g., 15 for lively overshoot, 26 for calm katha nod
  dtSec: number,
): SpringState {
  const force = -stiffness * (state.position - target) - damping * state.velocity;
  const nextVel = state.velocity + force * dtSec;
  const nextPos = state.position + nextVel * dtSec;
  return { position: nextPos, velocity: nextVel };
}`,
        },
      },
      {
        heading: '2. Audio Envelope & Viseme Mapping for Crisp Hindi and English Lip-Sync',
        paragraphs: [
          'Viewers forgive stylized 3D proportions immediately—think classic television animation—provided mouth openings (`jawOpen`, `lipRound`, `lipSpread`) lock tightly to syllable energy and vowel formants. Before rendering a scene, our audio analyzer computes 30fps RMS amplitude windows alongside low-band (`250–900 Hz` open vowels like `आ / a`) vs high-band (`2,200–4,500 Hz` sibilants like `स / sh`) spectral energy ratios from the synthesized TTS WAV buffer.',
          'Mapping silence (`RMS < 0.015`) strictly to closed-lip rest targets prevents "flapping puppet mouth" during dramatic pauses, while boosting peak onset attack by 35ms ahead of audio playback compensates for human visual-auditory perception latency.',
        ],
        codeOrTable: {
          caption: 'Procedural Character Emotion Presets & Spring Tuning in AnimStudio AI',
          headers: ['Emotion Tag', 'Spring Stiffness / Damping', 'Brow & Eye Morph Target', 'Camera Framing Action'],
          rows: [
            ['calm (Katha)', 'k = 95 · c = 22 (critically damped)', 'Soft gaze, slow 4.2s blink cycle', 'Slow 4% dolly push-in'],
            ['excited', 'k = 190 · c = 16 (bouncy)', 'Raised brows (+0.65), wide eyes', 'Dynamic medium two-shot'],
            ['surprised (Double-Take)', 'k = 260 · c = 12 (high overshoot)', 'Wide sclera pop + jaw drop (0.85)', 'Fast 14% punch-zoom on beat'],
            ['sarcastic', 'k = 130 · c = 19', 'Asymmetric left-brow arch + half-lid', 'Subtle Dutch-angle close-up'],
          ],
        },
      },
      {
        heading: '3. Fixed-Timestep Headless Capture vs Real-Time requestAnimationFrame',
        paragraphs: [
          'A classic mistake in WebGL video exporters is recording `canvas.captureStream(30)` in real time while `requestAnimationFrame` drives animations via `performance.now()`. Whenever garbage collection pauses the tab for 45 milliseconds or GPU load spikes, frames duplicate or skip—producing micro-stutters in the exported MP4.',
          'For master exports, always decouple simulation time from wall-clock time: advance `simTime = frameIndex * (1 / 30)` deterministically, step springs and viseme curves by exact `dt = 0.033333s`, call `renderer.render(scene, camera)`, read pixels (`gl.readPixels` / offscreen encode), and pipe raw RGBA/PNG frames sequentially into FFmpeg. Every render of Frame 412 is bit-for-bit reproducible on a slow CI VM or a desktop workstation!',
        ],
        bullets: [
          'Use Three-Point Lighting (warm Key light, cool Fill light, and bright Rim/Backlight) so 3D silhouettes pop cleanly on dim phone screens.',
          'Clamp `dtSec` to `<= 0.05s` during live interactive tab scrubbing so switching back from a backgrounded browser tab never explodes Euler spring velocities.',
          'Dispose geometries, textures, and render targets explicitly (`geometry.dispose()`, `texture.dispose()`) between batch scenes to prevent WebGL context loss.',
        ],
      },
      {
        heading: '4. Three-Point Stage Lighting & Vertical 9:16 Camera Framing Rules',
        paragraphs: [
          'Even the smoothest procedural character rig looks flat and synthetic if lit exclusively by a uniform `THREE.AmbientLight`. On a 6-inch OLED phone screen viewed outdoors, dark hair and shoulders merge into dark temple or living-room backdrops unless silhouettes are carved cleanly with Rim lighting.',
          'Every AnimStudio 3D stage spawns a calibrated Three-Point Lighting rig: a warm 5400K `DirectionalLight` Key positioned 35 degrees off-camera with soft PCF shadows (`shadow.mapSize = 2048`), a cool sky-tinted hemisphere Fill at 35% intensity lifting eye-socket shadows, and a crisp high-angle Rim/Backlight behind the character’s shoulders creating a 2-pixel specular edge outline. Combined with a 38mm–45mm vertical portrait field-of-view that avoids wide-angle nose distortion on close-ups, characters read with broadcast clarity at a glance.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why does my WebGL canvas export washed-out colors when piped into FFmpeg?',
        answer:
          'Ensure `renderer.outputColorSpace = THREE.SRGBColorSpace` in Three.js and tag FFmpeg’s color metadata (`-colorspace bt709 -color_primaries bt709 -color_trc iec61966-2-1 -pix_fmt yuv420p`) so players do not misinterpret sRGB gamma.',
      },
      {
        question: 'How many polygons should a web-ready 3D comedy character rig target?',
        answer:
          'Between 8,000 and 22,000 triangles per character with clean PBR roughness/albedo textures renders effortlessly at 60fps even on integrated laptop GPUs while looking crisp at 1080x1920.',
      },
      {
        question: 'Can procedural springs combine with glTF skeletal animations?',
        answer:
          'Yes! Apply base skeletal idle/walk clips via `THREE.AnimationMixer` first, then add procedural head-look, blink, and lip-sync bone/morph offsets in `onBeforeRender` each frame.',
      },
    ],
  },

  'choghadiya-hora-muhurta-planetary-timekeeping': {
    sections: [
      {
        heading: '1. Asymmetric Day (Dinamana) and Night (Ratrimana) Octets in Choghadiya',
        paragraphs: [
          'Across North and Western India (especially Rajasthan, Gujarat, and Maharashtra), families and merchants consult **Choghadiya** (*Chau-ghadiya*, meaning four *Ghatis* = 4 × 24 = 96 minutes at equinox) before starting travel, vehicle deliveries, or business openings. Just like Rahu Kaal, Choghadiya splits daytime (`Sunrise -> Sunset`) into 8 equal parts—and crucially splits nighttime (`Today’s Sunset -> Tomorrow’s Sunrise`) into 8 equal nocturnal parts!',
          'Notice a critical edge case that trips up naive calendar scripts: Night Choghadiya does NOT end at `24:00` midnight, nor does it use today’s morning sunrise! Ratrimana equals `Sunrise(D + 1) - Sunset(D)`. In summer, daytime Choghadiya slices stretch to ~104 minutes while nighttime Choghadiya slices compress to ~76 minutes; in winter, the exact opposite occurs.',
        ],
      },
      {
        heading: '2. Algorithmic Generation of Day & Night Choghadiya From Chaldean Order',
        paragraphs: [
          'Instead of hardcoding 112 lookup strings (7 weekdays × 16 day/night slots), you can generate every Choghadiya table in twelve lines of code from the classical planetary sequence (`Sun -> Venus -> Mercury -> Moon -> Saturn -> Jupiter -> Mars`, descending orbital period / Chaldean reverse step):',
        ],
        codeBlock: {
          language: 'typescript',
          caption: 'Pure Algorithmic Day & Night Choghadiya Generator (Zero 112-cell Lookup Table)',
          code: `const DAY_ORDER = ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'] as const;
// Sun(0)->Udveg(0), Mon(1)->Amrit(3), Tue(2)->Rog(6), Wed(3)->Labh(2), Thu(4)->Shubh(5), Fri(5)->Char(1), Sat(6)->Kaal(4)
const DAY_START_IDX = [0, 3, 6, 2, 5, 1, 4];

const NIGHT_ORDER = ['Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg'] as const;
const NIGHT_START_IDX = [0, 2, 4, 6, 1, 3, 5];

export function getChoghadiyaSequence(weekday0SunTo6Sat: number) {
  const d0 = DAY_START_IDX[weekday0SunTo6Sat];
  const n0 = NIGHT_START_IDX[weekday0SunTo6Sat];
  return {
    day8: Array.from({ length: 8 }, (_, i) => DAY_ORDER[(d0 + i) % 7]),
    night8: Array.from({ length: 8 }, (_, i) => NIGHT_ORDER[(n0 + i) % 7]),
  };
}`,
        },
      },
      {
        heading: '3. How the 24 Planetary Horas Prove the Universal Order of Weekdays',
        paragraphs: [
          'Have you ever wondered why Sunday is followed by Monday, Tuesday, Wednesday, Thursday, Friday, and Saturday across both Sanskrit (`Ravi, Soma, Mangala, Budha, Guru, Shukra, Shani`) and Greco-Roman calendars, even though their astronomical distance/period order from slowest to fastest is `Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon`?',
          'In Surya Siddhanta (and classical Hora Sastra), each Savana day from sunrise to next sunrise is divided into **24 Planetary Horas**. The 1st Hora at sunrise is ruled by the day’s lord. Stepping through that 7-planet slow-to-fast sequence 24 times (`24 mod 7 = 3` steps forward!): starting at `Sun` (index 3), advancing `+3` lands on `Moon` (Hora 25 = next day’s 1st Hora -> Monday!); advancing `+3` from Moon lands on `Mars` (Tuesday); `+3` -> `Mercury` (Wednesday); `+3` -> `Jupiter` (Thursday); `+3` -> `Venus` (Friday); `+3` -> `Saturn` (Saturday)!',
        ],
        codeOrTable: {
          caption: 'Choghadiya Nature, Ruling Graha & Traditional Suitability Reference',
          headers: ['Choghadiya Name', 'Ruling Graha', 'Traditional Nature', 'Common Practical Observance'],
          rows: [
            ['Amrit (अमृत)', 'Chandra (Moon)', 'Most Auspicious', 'All शुभ works, ceremonies, learning & new beginnings'],
            ['Shubh (शुभ)', 'Guru (Jupiter)', 'Auspicious', 'Religious rites, education, auspicious family milestones'],
            ['Labh (लाभ)', 'Budha (Mercury)', 'Beneficial', 'Business launches, accounting, skill & software launches'],
            ['Char (चर)', 'Shukra (Venus)', 'Favorable / Mobile', 'Travel, journeys, vehicle dispatch & logistics'],
            ['Udveg / Kaal / Rog', 'Sun / Saturn / Mars', 'Inauspicious for starts', 'Routine maintenance, exercise, or inner contemplation'],
          ],
        },
      },
      {
        heading: '4. Brahma Muhurta & Why True Solar Noon Drifts ±16 Minutes (Equation of Time)',
        paragraphs: [
          'Two final subtleties distinguish rigorous Vedic timekeeping software from rough approximations. First, **Brahma Muhurta** spans the 14th of 15 nocturnal Muhurtas—starting `2 Muhurtas` before local sunrise (`Sunrise - 2 × (Ratrimana / 15)`, roughly 96 minutes before sunrise at equinox) and ending `1 Muhurta` (`~48 minutes`) before sunrise.',
          'Second, local solar noon (`Madhyahna`, midpoint of Abhijit Muhurat) drifts back and forth by up to `-14.2` to `+16.4` minutes across the calendar year due to Earth’s axial tilt (`23.44°`) and elliptical orbit—the **Equation of Time**! That is why earliest sunset in India happens in early December while latest sunrise continues creeping forward until early January.',
        ],
        bullets: [
          'Compute `Ratrimana` using tomorrow’s actual sunrise (`Sunrise[d+1] - Sunset[d]`) rather than `1440 - Dinamana[d]`.',
          'Highlight overlapping auspicious windows (e.g., when Shubh/Amrit Choghadiya does NOT overlap Rahu Kaal) so users never see contradictory guidance.',
          'Test real Sunrise/Sunset slice math anytime on /tools/panchang-samvat-converter.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What happens when Amrit or Shubh Choghadiya overlaps with Rahu Kaal?',
        answer:
          'On certain weekdays (such as Thursday Slice 6 or Monday Slice 2), a traditionally positive Choghadiya coincides with Rahu Kaal; classical practice prioritizes avoiding Rahu Kaal or selecting an un-overlapped Amrit/Shubh/Abhijit window.',
      },
      {
        question: 'How long is one Vedic Ghati (Nadika) vs one Muhurta?',
        answer:
          'One 24-hour solar day contains 60 Ghatis (so 1 Ghati = 24 minutes) and 30 Muhurtas (so 1 Muhurta = 2 Ghatis = 48 minutes at equinox).',
      },
      {
        question: 'Does India’s single IST timezone affect Choghadiya accuracy?',
        answer:
          'Only if you use fixed clock tables! When Choghadiya is anchored to your city’s true local Sunrise and Sunset (expressed in IST), geographic longitude offset and Equation of Time are automatically accounted for.',
      },
    ],
  },

  'technical-seo-angular-ssg-cwv-publisher-checklist': {
    sections: [
      {
        heading: '1. Why DevTools Elements Tab Lies About What Search & Ad Crawlers See',
        paragraphs: [
          'When auditing an Angular or React site, opening Chrome DevTools and inspecting `<head>` in the live Elements panel shows the DOM *after* client-side Router `NavigationEnd` hooks have executed. If your server/prerender pipeline failed to run `SeoHubService.update()` before serializing HTML—or if a route forgot to register `getPrerenderParams()`—raw HTTP responses served to crawlers may all share the homepage’s `<link rel="canonical" href="https://yourdomain/">`!',
          'Whenever 30 URLs emit `<link rel="canonical" href="https://yourdomain/">` in raw static HTML, Google Search Console collapses all 30 pages as "Duplicate, Google chose different canonical than user"—making a 25,000-word publication look like a 1-page website! Always inspect the raw build files (`dist/**/index.html`) directly before shipping.',
        ],
        codeBlock: {
          language: 'powershell',
          caption: 'Automated CI / PowerShell Static Prerender Audit verifying unique Canonicals & Word Counts',
          code: `$pages = Get-ChildItem "dist/keshav-hub/browser" -Recurse -Filter "index.html"
foreach ($p in $pages) {
  $html = Get-Content $p.FullName -Raw
  $canon = if ($html -match '<link rel="canonical" href="([^"]+)"') { $Matches[1] } else { "MISSING" }
  $robots = if ($html -match '<meta name="robots" content="([^"]+)"') { $Matches[1] } else { "MISSING" }
  if ($canon -eq "MISSING") { throw "Missing canonical in $($p.FullName)" }
}`,
        },
      },
      {
        heading: '2. Sitemap Hygiene: Why Submitting Thin Utility & Redirect Pages Hurts Domain Quality',
        paragraphs: [
          'A `sitemap.xml` file is not a dump of every Angular route path in `app.routes.ts`; it is your explicit editorial endorsement telling Googlebot: *"These are my highest-value, canonical landing pages worthy of search indexing."* Including `/404`, `/robots`, `/sitemap` (HTML directory), `/resume` (off-site bridge), `/data-deletion`, or duplicate aliases (`/privacy` alongside `/privacy-policy`) drags down average page quality across the entire property.',
        ],
        codeOrTable: {
          caption: 'Route Classification Matrix for robots Meta, sitemap.xml & Ad Script Eligibility',
          headers: ['Route Category', 'Example Paths', 'Meta Robots', 'In sitemap.xml?', 'AdSense Script?'],
          rows: [
            ['Primary Editorial & Tools', '/, /guides/*, /tools/*, /creators', 'index, follow', 'Yes (0.9–1.0)', 'Yes (Consent-aware)'],
            ['Platform Case Studies & About', '/apps, /apps/*, /about', 'index, follow', 'Yes (0.8)', 'Yes (Consent-aware)'],
            ['Canonical Trust Disclosures', '/privacy-policy, /terms, /contact', 'index, follow', 'Optional / Low', 'No (Utility screen)'],
            ['Aliases, Bridges & Utilities', '/privacy, /cookies, /resume, /sitemap, /data-deletion', 'noindex, follow', 'Never', 'Never'],
            ['Error Fallbacks', '/404, 404.html', 'noindex, follow', 'Never', 'Never'],
          ],
        },
      },
      {
        heading: '3. Preventing XSS & Broken Head Parsing Inside Inline JSON-LD Scripts',
        paragraphs: [
          'Injecting structured data (`TechArticle`, `WebApplication`, `FAQPage`, `BreadcrumbList`) dynamically into `<script type="application/ld+json">` carries a subtle HTML5 parser gotcha: `JSON.stringify({ text: "Use </script> carefully" })` produces valid JSON, yet the HTML parser closes the `<script>` tag right in the middle of the string! Escaping `<`, `>`, and `&` to `\\u003c`, `\\u003e`, and `\\u0026` preserves 100% identical parsed JSON values while making tag breakout impossible.',
        ],
      },
      {
        heading: '4. Internal Linking Topology: Eliminating Orphan Pages & Shallow Click Depth',
        paragraphs: [
          'Search engines weight page authority strongly by internal link graph centrality. Every guide on `keshavsingh.in` cross-links directly to its companion interactive calculator (`/tools/:slug`), its connected platform architecture study (`/apps/:slug`), and three related deep-dive articles in the same or adjacent engineering track—keeping every page within `<= 2` clicks of `/` and giving human readers natural next steps.',
        ],
        bullets: [
          'Stamp `<lastmod>` in `sitemap.xml` from each guide’s real `updatedDate` rather than regenerating fake daily dates on unchanged files.',
          'Ensure `404/index.html` is copied to `404.html` on GitHub Pages so unknown URLs serve a clean `noindex` 404 screen with zero ad scripts.',
          'Validate your own `<head>` tags and Schema.org payloads in our free JSON-LD & OpenGraph Validator at /tools/json-ld-seo-schema-generator.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should legal pages like Privacy Policy be blocked in robots.txt?',
        answer:
          'Never block `/privacy-policy`, `/cookie-policy`, `/terms`, or `/ads.txt` in `robots.txt`! AdSense policy crawlers and Google Play reviewers must be able to fetch and read those URLs freely.',
      },
      {
        question: 'Does FAQPage JSON-LD still help technical sites?',
        answer:
          'While Google restricts visual SERP FAQ accordions primarily to authoritative government/health domains, clean `FAQPage` + `TechArticle` structured data still clarifies entity relationships for search indexing, AI Overviews, and semantic retrieval.',
      },
      {
        question: 'Why avoid hash-based routing (`/#/guides/...`) in Angular?',
        answer:
          'Crawlers ignore everything after `#` when indexing URLs, collapsing an entire hash-routed SPA into a single root URL! Always use HTML5 PathLocationStrategy with static route prerendering.',
      },
    ],
  },

  'oauth2-pkce-webauthn-passkeys-token-security': {
    sections: [
      {
        heading: '1. Why OAuth 2.0 Implicit Flow Is Dead and PKCE Is Mandatory Everywhere',
        paragraphs: [
          'Legacy Single Page Applications used OAuth 2.0 `response_type=token` (Implicit Grant), returning raw bearer access tokens directly inside URL `#access_token=...` fragments—leaking credentials into browser history, referrer headers, and analytics scripts. OAuth 2.1 retires Implicit Flow completely in favor of **Authorization Code Flow with PKCE (Proof Key for Code Exchange, RFC 7636)** using `S256` SHA-256 code challenges.',
          'With PKCE, the browser generates a cryptographic 43–128 character random `code_verifier`, hashes it as `BASE64URL(SHA256(verifier))` for the initial `/authorize` redirect, and proves possession of the original `code_verifier` over a back-channel TLS POST when exchanging the single-use `code`. Even if a malicious browser extension or OS handler intercepts the authorization code, it cannot redeem it without the ephemeral verifier.',
        ],
      },
      {
        heading: '2. Refresh Token Family Tracking: Detecting Stolen Cookie Replay Immediately',
        paragraphs: [
          'Rotating a refresh token on every `/refresh` call raises a classic defensive question: *if an attacker steals Refresh Token `R_1` before the legitimate user refreshes, and the attacker uses `R_1` first (receiving `R_2`), what happens ten minutes later when the legitimate user’s browser presents `R_1`?*',
          'If your server simply returns `401 Invalid Token` for `R_1`, the attacker keeps cruising indefinitely with `R_2`! **Refresh Token Family Tracking** solves this decisively: every login creates an immutable `FamilyId`. When an already-consumed token `R_1` is presented a second time (outside a tiny 2-second network idempotency grace window), the server recognizes active compromise and **revokes every active descendant (`R_2`, `R_3`...) sharing that `FamilyId` immediately**, forcing fresh FIDO2/2FA re-authentication.',
        ],
        codeBlock: {
          language: 'csharp',
          caption: 'Refresh Token Reuse Detection & Entire Lineage Revocation in .NET 10',
          code: `public async Task<TokenPairResult> RotateRefreshTokenAsync(string rawToken, CancellationToken ct)
{
    var tokenHash = Sha256Hex(rawToken);
    var record = await refreshRepo.FindByHashAsync(tokenHash, ct);
    if (record is null)
        return TokenPairResult.Unauthorized("Unknown token");

    if (record.ConsumedAtUtc is not null)
    {
        // Stolen predecessor token replayed! Revoke the ENTIRE token family immediately.
        await refreshRepo.RevokeEntireFamilyAsync(record.FamilyId, reason: "ReplayReuseDetected", ct);
        securityAudit.LogCritical("Refresh token replay detected for User={UserId} Family={FamilyId}",
            record.UserId, record.FamilyId);
        return TokenPairResult.CompromisedFamilyRevoked();
    }

    if (record.ExpiresAtUtc <= DateTime.UtcNow || record.RevokedAtUtc is not null)
        return TokenPairResult.Unauthorized("Expired or revoked");

    return await IssueRotatedSuccessorAtomicallyAsync(record, ct);
}`,
        },
      },
      {
        heading: '3. FIDO2 WebAuthn Passkey Ceremonies: Phishing-Resistant Cryptography',
        paragraphs: [
          'Unlike TOTP 6-digit codes—which users routinely type into real-time adversary-in-the-middle phishing proxies—WebAuthn Passkeys are mathematically immune to phishing. During assertion (`navigator.credentials.get`), the operating system authenticator signs `clientDataJSON` containing the exact browser-verified `origin` (for example, `https://id.keshavsingh.in`) plus a single-use server `challenge` with a hardware/enclave-bound ECDSA P-256 or Ed25519 private key. A lookalike domain (`keshav-singh-login.com`) cannot even trigger the credential!',
        ],
        codeOrTable: {
          caption: 'Browser Token Storage & Security Header Defense-in-Depth Comparison',
          headers: ['Defense Layer', 'Vulnerable Default', 'Hardened Production Posture'],
          rows: [
            ['Access Token Storage', 'localStorage.setItem("jwt", ...)', 'JavaScript closure / Angular signal memory only (<= 15m TTL)'],
            ['Refresh Credential', 'Readable JS cookie or long JWT', 'HttpOnly; Secure; Path=/api/auth/refresh; Family-rotated'],
            ['Second Factor', 'SMS OTP / Phishable 6-digit TOTP', 'FIDO2 WebAuthn Passkey (Origin-bound P-256 / Ed25519)'],
            ['XSS Mitigation', 'Permissive script execution', 'Strict CSP + Angular DOM contextual escaping + Trusted Types'],
          ],
        },
      },
      {
        heading: '4. Content Security Policy (CSP) & Referrer-Policy Checklist',
        paragraphs: [
          'Even clean token architecture benefits massively from browser-enforced HTTP response headers. Pairing `Referrer-Policy: strict-origin-when-cross-origin` (so full URL paths never leak to external links), `X-Content-Type-Options: nosniff`, `Permissions-Policy` disabling unused microphone/geolocation APIs, and a well-scoped `Content-Security-Policy` turns accidental XSS sinks into non-exploitable no-ops.',
        ],
        bullets: [
          'Never pass bearer tokens or session IDs in URL query strings (`?token=...`), which leak into CDN logs and `Referer` headers.',
          'Validate JWT `iss` (Issuer), `aud` (Audience), `exp` (Expiration with `ClockSkew <= 30s`), and explicit `alg` allowlists on every resource API.',
          'Audit your own JWT access/refresh rotation cadence in our Developer Security Planner at /tools/cron-jwt-epoch-developer-toolkit.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why set ClockSkew = TimeSpan.FromSeconds(30) in Microsoft.AspNetCore.Authentication.JwtBearer?',
        answer:
          'ASP.NET Core defaults `TokenValidationParameters.ClockSkew` to 5 full minutes! Tightening `ClockSkew` to 15–30 seconds ensures a 15-minute access token actually expires at 15m30s instead of living silently for 20 minutes.',
      },
      {
        question: 'What happens if a user loses their laptop—are passkeys locked to one device?',
        answer:
          'Modern passkeys sync encrypted end-to-end across a user’s Apple iCloud Keychain, Google Password Manager, or 1Password vault, and we let users register multiple independent passkeys plus backup recovery verification.',
      },
      {
        question: 'Why scope the HttpOnly refresh cookie Path to /api/auth/refresh instead of Path=/ ?',
        answer:
          'Restricting `Path=/api/auth/refresh` prevents the browser from transmitting the high-value refresh cookie on every ordinary API call or image request—reducing both header overhead and accidental endpoint exposure.',
      },
    ],
  },
};
