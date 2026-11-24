import type { GuideFaq, GuideSection } from './guides-cards.catalog';

export const GUIDE_BODIES_PART3: Record<string, { sections: GuideSection[]; faqs: GuideFaq[] }> = {
  'multi-key-llm-failover-circuit-breaker-dotnet': {
    sections: [
      {
        heading: '1. Why Single-Key LLM Configurations Break Automated Creator Pipelines',
        paragraphs: [
          'When prototyping an AI story or voiceover feature on localhost, binding a single `GEMINI_API_KEY` or `OPENAI_API_KEY` from `appsettings.json` works fine for five manual clicks. The moment you promote that application into a daily multi-channel production studio—generating scripts, scene visual prompts, translations, and metadata across six scheduled festival and comedy videos in parallel—single-key setups fail routinely.',
          'Cloud AI providers enforce multi-dimensional quotas simultaneously: Requests Per Minute (RPM), Tokens Per Minute (TPM), Requests Per Day (RPD), and project-level monthly spend caps. Worse, HTTP `429 Too Many Requests` can indicate two completely different operational realities: a 12-second sliding-window RPM burst that clears momentarily, or a hard daily RPD / billing quota exhaustion that will reject every call for the next 18 hours.',
          'Inside AnimStudio AI’s .NET 10 backend, we replaced static single-key configuration with an encrypted, priority-ordered Multi-Key API Pool (`/admin/api-keys`) featuring per-key circuit breakers, automatic cooldown classification, and graceful fallback to environment keys so batch renders never abort mid-scene.',
        ],
      },
      {
        heading: '2. Envelope Encryption at Rest with AES-256-GCM and Masked UI Fingerprints',
        paragraphs: [
          'Storing raw provider API keys in plaintext database fields turns any read-only database backup leak or MongoDB query log into a credential breach. Equally important, administrators managing a pool of five Google AI Studio keys across separate GCP projects need enough visual context (such as `AIza...9xQ2`, project label, priority order, and last health status) to edit or retire a key without ever exposing the full secret back to the browser.',
          'Our `ApiKeyVaultService` derives a 256-bit master key via HKDF-SHA256 from host-level secret material and encrypts every credential with `AesGcm` using a unique 96-bit cryptographic nonce and 128-bit authentication tag per write:',
        ],
        codeBlock: {
          language: 'csharp',
          caption: 'AesGcmCredentialCipher.cs — Authenticated encryption at rest for .NET 10 provider key pools',
          code: `public sealed class AesGcmCredentialCipher(byte[] masterKey32Bytes)
{
    public string EncryptSecret(string plaintextApiKey)
    {
        Span<byte> nonce = stackalloc byte[12];
        RandomNumberGenerator.Fill(nonce);

        var plainBytes = Encoding.UTF8.GetBytes(plaintextApiKey);
        var cipherBytes = new byte[plainBytes.Length];
        Span<byte> tag = stackalloc byte[16];

        using var aes = new AesGcm(masterKey32Bytes, tagSizeInBytes: 16);
        aes.Encrypt(nonce, plainBytes, cipherBytes, tag);

        // Pack [12B nonce | 16B auth tag | ciphertext] as URL-safe Base64
        var packed = new byte[12 + 16 + cipherBytes.Length];
        nonce.CopyTo(packed.AsSpan(0, 12));
        tag.CopyTo(packed.AsSpan(12, 16));
        cipherBytes.CopyTo(packed.AsSpan(28));
        return Convert.ToBase64String(packed);
    }

    public static string BuildMaskedHint(string apiKey) =>
        apiKey.Length <= 8 ? "****" : $"{apiKey[..4]}••••{apiKey[^4..]}";
}`,
        },
      },
      {
        heading: '3. Classifying HTTP 429 RPM Throttles vs Hard Daily Quota Exhaustion',
        paragraphs: [
          'A naive round-robin pool that treats every error identically wastes latency retrying dead keys. By inspecting HTTP status codes alongside response error bodies (`RESOURCE_EXHAUSTED`, `PerDay`, `billing_not_active`, `API_KEY_INVALID`) and `Retry-After` headers, our `PooledLlmExecutionStrategy` assigns precise cooldown windows in memory and persists health telemetry asynchronously:',
        ],
        codeOrTable: {
          caption: 'Provider Failure Classification & Cooldown Transitions in AnimStudio Key Pool',
          headers: ['Failure Signal', 'Root Cause', 'Assigned Key Cooldown', 'Immediate Pool Action'],
          rows: [
            ['HTTP 429 + Retry-After <= 60s', 'Per-minute RPM / TPM burst', 'Retry-After (default 45s)', 'Switch immediately to next healthy key'],
            ['HTTP 429 + Quota PerDay / RPD', 'Daily free/tier project ceiling hit', '6 hours (or next UTC/PT reset)', 'Quarantine key & fail over cleanly'],
            ['HTTP 401 / 403 API_KEY_INVALID', 'Revoked or mis-scoped key', 'Mark Invalid until edited', 'Alert admin badge & skip permanently'],
            ['HTTP 503 / Socket Timeout', 'Upstream model overload', '20s transient backoff', 'Retry next key or fallback model tier'],
          ],
        },
      },
      {
        heading: '4. Zero-Failure Rollback to Environment Configuration',
        paragraphs: [
          'Whenever introducing database-backed key management into a live system, backwards compatibility is mandatory: if the pool collection is empty or all pooled keys enter temporary cooldown during a traffic spike, our resolver falls back transparently to legacy `appsettings` / environment credentials (`Gemini:ApiKey`) as the final safety net before raising a user-visible quota message.',
        ],
        bullets: [
          'Provide a live "Test Key" button in Admin that executes a minimal 4-token ping (`models.generateContent`) and records latency + quota health.',
          'Never return decrypted key strings in `GET /api/admin/api-keys` responses—accept new secrets only on `POST`/`PUT` writes.',
          'Scope pooled keys by provider (`google-gemini`, `openai`, `elevenlabs`) and optional project label so billing stays auditable.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does rotating across multiple API keys violate provider terms if projects are legitimate?',
        answer:
          'Organizations commonly isolate workloads across separate cloud projects (for example, Devotional Pipeline vs Comedy Studio vs Interactive Web Preview) for cost accounting and blast-radius isolation; always follow your provider’s acceptable-use policies.',
      },
      {
        question: 'Why use AES-256-GCM instead of AES-CBC for stored API secrets?',
        answer:
          'AES-GCM is an Authenticated Encryption with Associated Data (AEAD) cipher: its 128-bit authentication tag detects any bit-flipping or ciphertext tampering before decryption succeeds, eliminating padding-oracle risks.',
      },
      {
        question: 'What happens if an admin edits a key’s label without re-typing the secret?',
        answer:
          'Our update DTO treats an omitted/blank secret field as metadata-only update—updating priority, enabled flag, or project name while preserving the existing encrypted ciphertext untouched.',
      },
    ],
  },

  'ffmpeg-xfade-loudnorm-subtitle-burnin-pipeline': {
    sections: [
      {
        heading: '1. The Hidden Cumulative Offset Trap in Multi-Scene FFmpeg xfade Chains',
        paragraphs: [
          'When stitching two video clips with a 0.5-second cross-fade in FFmpeg, the math is trivial: if Scene 0 is 4.0 seconds long, `xfade=transition=smoothleft:duration=0.5:offset=3.5` begins blending 0.5 seconds before Scene 0 ends, producing a combined stream that is `4.0 + L1 - 0.5` seconds long. Notice that 0.5 seconds of timeline length disappeared into the overlap!',
          'Developers who chain six or ten scenes often make the fatal mistake of setting Scene `k`’s `xfade` offset to the unadjusted sum of scene durations (`sum(D_0 .. D_{k-1}) - trans`). By Scene 8, video leads narration audio by 3.5 full seconds—causing characters to lip-sync someone else’s punchline! The exact recurrence relation must subtract every prior transition duration:',
        ],
        codeBlock: {
          language: 'csharp',
          caption: 'Exact Cumulative xfade Offset Compiler preventing multi-scene A/V drift',
          code: `public static IReadOnlyList<string> BuildXfadeVideoChain(
    IReadOnlyList<(double DurationSec, string Transition, double TransSec)> scenes)
{
    var filters = new List<string>();
    double accumulatedTimelineSec = scenes[0].DurationSec;
    string prevLabel = "[v0]";

    for (int i = 1; i < scenes.Count; i++)
    {
        double trans = Math.Min(scenes[i - 1].TransSec, Math.Min(scenes[i - 1].DurationSec, scenes[i].DurationSec) * 0.4);
        double offset = Math.Round(accumulatedTimelineSec - trans, 4);
        string outLabel = i == scenes.Count - 1 ? "[vout]" : $"[vx{i}]";

        filters.Add($"{prevLabel}[v{i}]xfade=transition={scenes[i - 1].Transition}:duration={trans:F3}:offset={offset:F4}{outLabel}");

        // Total output timeline advances by (next scene duration MINUS overlap)
        accumulatedTimelineSec = offset + scenes[i].DurationSec;
        prevLabel = outLabel;
    }
    return filters;
}`,
        },
      },
      {
        heading: '2. Matching Dialogue Audio Timing With acrossfade or Pre-Padded Stems',
        paragraphs: [
          'To keep narration locked to millisecond accuracy alongside `xfade` video overlaps, you have two clean architectural choices: either apply matching `acrossfade=d=0.35:c1=tri:c2=tri` across adjacent scene dialogue stems, OR pad each scene’s rendered video tail by `+transSec` of animated idle hold (`tpad=stop_mode=clone:stop_duration=0.35`) so the visual cross-fade consumes exclusively the padded reaction tail while sequential concatenated dialogue never overlaps! In multi-speaker comedy, `tpad` hold-frames preserve crisp comedic timing without two voices talking over each other.',
        ],
      },
      {
        heading: '3. Sidechain Audio Ducking + EBU R128 (-14 LUFS) Mastering Filtergraph',
        paragraphs: [
          'Nothing screams "amateur automated video" louder than background devotional flutes or comedy music drowning out spoken dialogue—or volume jumping 8 dB between consecutive Shorts. In FFmpeg, combining `asplit` + `sidechaincompress` + `loudnorm` solves both in a single filtergraph pass:',
        ],
        codeBlock: {
          language: 'bash',
          caption: 'Production FFmpeg audio filtergraph: Sidechain music ducking + -14 LUFS YouTube loudness target',
          code: `ffmpeg -i video_master.mp4 -i dialogue_track.wav -i bgm_loop.mp3 -filter_complex "\
  [1:a]aresample=48000,highpass=f=85,asplit=2[voice_main][voice_sc]; \
  [2:a]aresample=48000,volume=0.28[bgm_bed]; \
  [bgm_bed][voice_sc]sidechaincompress=threshold=0.025:ratio=6:attack=18:release=320[bgm_ducked]; \
  [voice_main][bgm_ducked]amix=inputs=2:duration=first:dropout_transition=0, \
  loudnorm=I=-14:TP=-1.0:LRA=9[aout]" \
  -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -movflags +faststart final_publish.mp4`,
        },
      },
      {
        heading: '4. HarfBuzz Shaping for Burned-In Devanagari Hindi ASS Subtitles',
        paragraphs: [
          'Rendering Hindi (`हिन्दी`) or Sanskrit shlokas via naive `drawtext` without complex-script shaping detaches chhoti-i (`ि`) vowel signs and breaks conjunct half-consonants (`क्ष`, `त्र`, `ज्ञ`, `द्ध`). Compiling or running FFmpeg with `libass` linked against `HarfBuzz` + `FriBidi` and supplying an explicit `fontsdir` containing `Noto Sans Devanagari Bold` guarantees razor-sharp glyph ligatures across Linux Docker containers and Windows render nodes alike.',
        ],
        codeOrTable: {
          caption: 'Recommended Loudness & Audio Dynamics Settings for YouTube & Shorts',
          headers: ['Parameter', 'Recommended Value', 'Engineering Reason'],
          rows: [
            ['Integrated Loudness (I)', '-14.0 LUFS', 'Matches YouTube normalization ceiling without aggressive platform gain turn-down'],
            ['True Peak (TP)', '-1.0 dBTP', 'Prevents inter-sample AAC clipping distortion on mobile phone speakers'],
            ['Sidechain Attack / Release', '18 ms / 320 ms', 'Ducks BGM instantaneously on first consonant without pumping between words'],
            ['Voice High-Pass Filter', '85 Hz', 'Removes synthetic rumble and frees low-end headroom for foley/percussion'],
          ],
        },
      },
    ],
    faqs: [
      {
        question: 'Why does FFmpeg xfade fail with "First input link main timebase do not match" on mixed clips?',
        answer:
          'Every input feeding `xfade` must share identical resolution, pixel format (`format=yuv420p`), frame rate (`fps=30`), and timebase (`settb=AVTB`). Normalize each input branch with `fps=30,settb=AVTB,format=yuv420p` right before `xfade`.',
      },
      {
        question: 'Is single-pass loudnorm safe for short 30-second videos?',
        answer:
          'On clips shorter than 3 seconds single-pass `loudnorm` can pump initial gain; for 20–60s Shorts with steady narration it performs well, and two-pass `loudnorm` (`print_format=json` followed by `measured_I=...`) delivers broadcast-exact dynamic linear scaling.',
      },
      {
        question: 'How do I estimate final MP4 size before launching a batch render?',
        answer:
          'Use our interactive FFmpeg Video Bitrate & Storage Calculator at /tools/ffmpeg-video-bitrate-storage-calculator to compute exact MB per clip and copy constrained CRF commands.',
      },
    ],
  },

  'surya-siddhanta-lahiri-ayanamsa-tithi-math': {
    sections: [
      {
        heading: '1. Tropical (Sayana) vs Sidereal (Nirayana) Ecliptic Coordinates',
        paragraphs: [
          'Modern planetary ephemerides such as NASA JPL DE440 or VSOP87 compute celestial longitudes in the Tropical (Sayana) reference frame, where `0°` Aries is defined by the vernal equinox—the intersection of Earth’s equator and ecliptic plane. Because Earth’s rotational axis precesses like a spinning gyroscope over a ~25,772-year cycle (Luni-Solar Precession, ~50.29 arcseconds per year), the Tropical equinox drifts backward against the background constellations.',
          'Classical Indian Panchang calculations anchor zodiac Rasis and all 27 Nakshatras to fixed sidereal stars (Nirayana). Subtracting the accumulated precession angle—known as Ayanamsa—from Tropical longitude yields Nirayana longitude:',
        ],
        codeBlock: {
          language: 'typescript',
          caption: 'Lahiri Chitrapaksha Mean Ayanamsa Approximation & Nirayana Conversion',
          code: `/**
 * Computes Lahiri (Chitrapaksha) Ayanamsa in degrees for a given Julian Ephemeris Day (JDE).
 * Reference epoch J2000.0 (JDE 2451545.0 => 2000-01-01 12:00 TT): ~23.853056 deg.
 */
export function computeLahiriAyanamsaDeg(jde: number): number {
  const T = (jde - 2451545.0) / 36525.0; // Julian centuries from J2000.0
  const baseArcSec = 85871.0; // 23° 51' 11" at J2000
  const precessionArcSec = 5028.796195 * T + 1.1054348 * T * T;
  return (baseArcSec + precessionArcSec) / 3600.0;
}

export function toNirayanaLongitude(tropicalDeg: number, jde: number): number {
  const raw = (tropicalDeg - computeLahiriAyanamsaDeg(jde)) % 360;
  return raw < 0 ? raw + 360 : raw;
}`,
        },
      },
      {
        heading: '2. Why Tithi Cancels Ayanamsa While Nakshatra & Yoga Depend on It',
        paragraphs: [
          'A fascinating mathematical property surprises many developers implementing their first Panchang engine: Tithi and Karana are 100% invariant to Ayanamsa choice! Why? Because Tithi measures synodic angular separation between Moon and Sun: `(λ_Moon_Nirayana - λ_Sun_Nirayana) = (λ_Moon_Tropical - A) - (λ_Sun_Tropical - A) = λ_Moon_Tropical - λ_Sun_Tropical`. The Ayanamsa `A` cancels out algebraically!',
          'By contrast, Lunar Nakshatra (`floor(λ_Moon_Nirayana / 13.3333°)`), Solar Sankranti (Rasi ingress), and Nitya Yoga (`floor((λ_Moon_Nirayana + λ_Sun_Nirayana) / 13.3333°)`—where `-2A` adds up!) shift directly if an incorrect Ayanamsa formula is used.',
        ],
        codeOrTable: {
          caption: 'Mathematical Definitions of the Five Classical Panchang Limbs (Pancha-Anga)',
          headers: ['Limb (Anga)', 'Angular Span', 'Governing Formula (Degrees)', 'Ayanamsa Dependent?'],
          rows: [
            ['1. Vaara (Weekday)', 'Sunrise to Sunrise', 'Savana solar civil day (0..6)', 'No (Local Sunrise)'],
            ['2. Tithi (Lunar Day)', '12° synodic', 'floor(((λ_Moon - λ_Sun) mod 360) / 12) + 1', 'No (Cancels out)'],
            ['3. Nakshatra (Mansion)', '13° 20′ (13.333°)', 'floor(λ_Moon_Nirayana / (360 / 27)) + 1', 'Yes (-1 × Ayanamsa)'],
            ['4. Nitya Yoga', '13° 20′ (13.333°)', 'floor(((λ_Moon_Nir + λ_Sun_Nir) mod 360) / 13.333) + 1', 'Yes (-2 × Ayanamsa)'],
            ['5. Karana (Half-Tithi)', '6° synodic', 'floor(((λ_Moon - λ_Sun) mod 360) / 6) + 1', 'No (Cancels out)'],
          ],
        },
      },
      {
        heading: '3. Solving Exact Tithi End Timestamps with Secant / Newton-Raphson Iteration',
        paragraphs: [
          'Because the Moon travels along an elliptical orbit perturbed by solar gravity (Evection, Variation, and Annual Inequality), its angular speed relative to the Sun varies between ~11.0°/day and ~14.5°/day. You cannot divide remaining degrees by a constant `12.19°/day` if you want minute-accurate Tithi ending times (`Samapti Kaal`).',
          'Instead, finding the exact Julian instant `t*` when `(λ_Moon(t) - λ_Sun(t)) mod 360` crosses target boundary `12° × k` is a smooth monotonic root-finding problem. Starting from linear velocity estimate `t_0`, three Newton-Raphson or Secant steps converge within `< 0.2 seconds` of time precision!',
        ],
        codeBlock: {
          language: 'typescript',
          caption: 'Wrapped-Angle Newton-Raphson Solver for Exact Tithi Transition Instant',
          code: `export function solveTithiBoundaryJd(
  startJd: number,
  targetElongationDeg: number, // e.g., 120.0 for Dashami -> Ekadashi
  elongationAtJd: (jd: number) => number,
): number {
  let jd = startJd;
  for (let iter = 0; iter < 5; iter++) {
    const current = elongationAtJd(jd);
    // Shortest signed angular distance in (-180, +180]
    const errDeg = ((current - targetElongationDeg + 540) % 360) - 180;
    if (Math.abs(errDeg) < 1e-5) break;

    // Finite-difference synodic speed (deg/day), ~12.19 deg/day average
    const dt = 0.01;
    const next = elongationAtJd(jd + dt);
    const speedDegPerDay = (((next - current + 540) % 360) - 180) / dt;
    jd -= errDeg / speedDegPerDay;
  }
  return jd;
}`,
        },
      },
      {
        heading: '4. Understanding Kshaya Tithi (Skipped) and Adhika Tithi (Repeated)',
        paragraphs: [
          'Near lunar perigee, a 12° Tithi can complete in ~19.5 hours. If Dashami ends 25 minutes after Monday’s 06:30 AM sunrise (at 06:55 AM), Ekadashi runs for 19.8 hours and ends at 02:43 AM before Tuesday’s 06:31 AM sunrise—so Monday sunrise has Dashami and Tuesday sunrise has Dwadashi! That phenomenon is a Kshaya Tithi, governed by specialized Smarta and Vaishnava Ekadashi Viddha rules.',
          'Conversely, near lunar apogee, a Tithi stretching to 26.5 hours can span two consecutive sunrises (starting 05:50 AM Monday before 06:10 AM sunrise and ending 08:20 AM Tuesday after 06:11 AM sunrise), producing an Adhika / Vriddhi Tithi.',
        ],
        bullets: [
          'Always compute wrapping differences modulo 360° using `((a - b + 540) % 360) - 180` so `359.8° -> 0.2°` Amavasya-to-Pratipada transitions never diverge.',
          'Account for ΔT (`TT - UTC ≈ 69.2 seconds` in 2026) when converting Ephemeris Time into IST civil timestamps.',
          'Experiment interactively with longitudes right now in our Lunar Tithi & Nakshatra Explorer at /tools/tithi-nakshatra-lunar-phase-calculator.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much error does ignoring ΔT (Terrestrial Time minus UTC) introduce?',
        answer:
          'In 2026, ΔT is roughly 69 seconds, so ignoring ΔT shifts lunar Tithi transition timestamps by just over 1 minute—small for casual checks, but decisive when a Tithi ends within 60 seconds of local sunrise!',
      },
      {
        question: 'Why are there 27 Nakshatras of 13°20′ instead of 12 signs of 30°?',
        answer:
          'The Moon completes one sidereal orbit relative to fixed stars in ~27.32166 days, so ancient Vedic astronomers divided the ecliptic into 27 daily lunar mansions (13°20′ each), with 4 Padas × 27 = 108 total Padas matching the 12 Rasis × 9 Navamshas.',
      },
      {
        question: 'What is Vishti Karana (Bhadra)?',
        answer:
          'Among the 7 repeating movable Karanas (each spanning 6° of synodic elongation, or half a Tithi), the 7th movable Karana is Vishti—popularly known as Bhadra—traditionally checked before starting certain ceremonies.',
      },
    ],
  },

  'mongodb-indexing-multi-tenant-dotnet-microservices': {
    sections: [
      {
        heading: '1. Designing Multi-App MongoDB Collections Without Cross-Tenant Leaks',
        paragraphs: [
          'Across our .NET 10 ecosystem, MongoDB backs workloads with sharply different read/write profiles: high-frequency OAuth token rotation in `id.keshavsingh.in`, hierarchical storyboard documents in `AnimStudio AI`, date-indexed household vendor ledgers in `Ghar Ledger`, and burst-read competition leaderboards in `Pratiyogita`.',
          'Whether isolating apps by dedicated database (`IdentityDb`, `AnimStudioDb`, `GharLedgerDb`, `PratiyogitaDb`) on a shared Atlas/replica cluster or scoping documents by `householdId` / `workspaceId`, every repository query enforces tenant partition keys as the leading predicate so no endpoint can ever scan across unrelated user workspaces.',
        ],
      },
      {
        heading: '2. Mastering the ESR (Equality -> Sort -> Range) Compound Index Rule',
        paragraphs: [
          'The most common performance bug in MongoDB applications is creating compound indexes in the order fields appear in a C# method signature rather than following the **ESR Rule (Equality, Sort, Range)**. Suppose Pratiyogita queries active topper scores for a specific exam, sorted by highest score descending, filtered to submissions within a time window:',
          'If you index `{ examId: 1, submittedAt: 1, score: -1 }` (Equality -> Range -> Sort), MongoDB must scan every matching range entry and perform an in-memory blocking sort (`SORT` stage in `explain("executionStats")`), risking the 100 MB RAM sort limit under load. Reordering the index strictly to `{ examId: 1, score: -1, submittedAt: 1 }` (Equality -> Sort -> Range) lets WiredTiger walk B-tree leaves already in descending score order with zero in-memory sort!',
        ],
        codeBlock: {
          language: 'csharp',
          caption: 'Idempotent Startup Index Provisioning in .NET 10 MongoDB.Driver (ESR + TTL)',
          code: `public static async Task EnsureEcosystemIndexesAsync(IMongoDatabase db, CancellationToken ct)
{
    // 1. ESR Compound Index: Equality (ExamId, Status) -> Sort (Score DESC) -> Range (SubmittedAt)
    var scores = db.GetCollection<ExamScoreDoc>("exam_scores");
    var esrKeys = Builders<ExamScoreDoc>.IndexKeys
        .Ascending(x => x.ExamId)
        .Ascending(x => x.Status)
        .Descending(x => x.Score)
        .Ascending(x => x.SubmittedAtUtc);

    await scores.Indexes.CreateOneAsync(
        new CreateIndexModel<ExamScoreDoc>(esrKeys, new CreateIndexOptions { Name = "ix_exam_status_score_submitted" }),
        cancellationToken: ct);

    // 2. Self-Purging TTL Index for Ephemeral OTP & Refresh Families
    var otps = db.GetCollection<OtpChallengeDoc>("otp_challenges");
    await otps.Indexes.CreateOneAsync(
        new CreateIndexModel<OtpChallengeDoc>(
            Builders<OtpChallengeDoc>.IndexKeys.Ascending(x => x.ExpiresAtUtc),
            new CreateIndexOptions { ExpireAfter = TimeSpan.Zero, Name = "ttl_expires_at" }),
        cancellationToken: ct);
}`,
        },
      },
      {
        heading: '3. Atomic Compare-And-Swap Token Rotation via FindOneAndUpdateAsync',
        paragraphs: [
          'Never implement single-use token consumption, seat reservation, or UTR claim locking with a `FindAsync` followed by `ReplaceOneAsync` in C#. Between those two round-trips, two concurrent requests both observe `ConsumedAt == null` and both succeed! Using a single atomic `FindOneAndUpdateAsync` filter containing `{ tokenHash, consumedAt: null }` guarantees WiredTiger document-level atomicity:',
        ],
        codeOrTable: {
          caption: 'MongoDB Anti-Patterns vs Production Patterns Across .NET 10 Services',
          headers: ['Scenario', 'Fragile Anti-Pattern', 'Hardened Production Pattern'],
          rows: [
            ['Daily Ledger Entries', 'Unbounded array inside 1 Household doc', 'Monthly bucket doc `{ householdId, yearMonth: "2026-11", days: [...] }`'],
            ['Token / Seat Claim', 'Read-in-C# then UpdateOne (TOCTOU race)', 'Single atomic `FindOneAndUpdate` with state guard in filter'],
            ['Expired Session Cleanup', 'Nightly C# delete cron locking primary', 'Native MongoDB TTL index (`ExpireAfter = TimeSpan.Zero`)'],
            ['List Pagination', '`.Skip(50000).Limit(20)` deep offset scan', 'Keyset cursor pagination (`_id < lastSeenId`) in O(log N)'],
          ],
        },
      },
      {
        heading: '4. Monthly Bucketing in Ghar Ledger for Predictable 16 MB Document Headroom',
        paragraphs: [
          'In Ghar Ledger, a family tracks 5 to 10 daily vendors (milk, newspaper, tiffin, maid) every day for years. Embedding an unbounded `Entries[]` array inside one `Household` document causes continuous document reallocation on disk, index bloat, and eventual proximity to BSON’s 16 MB limit. Partitioning documents into deterministic monthly buckets (`_id = "{householdId}:{vendorId}:2026-11"`) caps every document cleanly at <= 31 daily slots—allowing an entire month’s calendar UI to load in one single-kilobyte point read!',
        ],
        bullets: [
          'Project only required fields (`.Project(...)`) on high-RPS list endpoints so network egress stays lean.',
          'Register `CamelCaseElementNameConvention` and `IgnoreExtraElementsConvention` globally at startup so schema evolution never throws deserialization exceptions during rolling deploys.',
          'Model your read/cache ratios in our Microservices Capacity Planner at /tools/api-latency-capacity-planner.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does MongoDB’s background TTL monitor delete expired documents at the exact millisecond?',
        answer:
          'MongoDB’s TTL background thread runs once every 60 seconds, so always include `&& x.ExpiresAtUtc > DateTime.UtcNow` in your read filter for security-critical tokens while letting TTL handle storage reclamation automatically.',
      },
      {
        question: 'When do I need multi-document ACID transactions in MongoDB?',
        answer:
          'Whenever an invariant spans two separate collections (such as crediting a tournament tally while archiving a ledger state); however, modeling atomic aggregates (like monthly ledger buckets) avoids 90% of multi-document lock overhead.',
      },
      {
        question: 'Why does Skip(N) degrade linearly at high page numbers?',
        answer:
          'Even with an index, `Skip(50000)` forces MongoDB to walk and discard 50,000 index entries before returning 20 rows, whereas range cursor pagination (`CreatedAt < cursor`) jumps straight to the target B-tree leaf.',
      },
    ],
  },
};
