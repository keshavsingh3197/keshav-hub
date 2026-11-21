import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HUB_TOOLS } from '../../data/creators-plans.catalog';
import { I18nHubService } from '../../services/i18n-hub.service';
import { SeoHubService } from '../../services/seo-hub.service';
import { toolSchema } from '../../services/structured-data';
import {
  GeoTier,
  NicheTier,
  ShortBeatInput,
  analyzeShortPacing,
  calculateApiCapacity,
  calculatePanchangWindows,
  calculateYouTubeEarnings,
} from '../../utils/tools-math';

@Component({
  selector: 'app-tool-detail-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    @if (tool(); as item) {
      <section class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a routerLink="/">{{ i18n.t('nav.home') }}</a> / <a routerLink="/tools">{{ i18n.t('nav.tools') }}</a> / <span>{{ i18n.t('items.tools.' + item.slug + '.title', item.title) }}</span>
          </div>
          <span class="eyebrow">{{ i18n.t('items.tools.' + item.slug + '.badge', item.badge) }}</span>
          <h1>{{ i18n.t('items.tools.' + item.slug + '.title', item.title) }}</h1>
          <p class="lead">{{ i18n.t('items.tools.' + item.slug + '.shortDesc', item.shortDesc) }}</p>
        </div>
      </section>

      <section class="section">
        <div class="container tool-shell">
          <!-- Tool 1: YouTube Earnings & YPP Estimator -->
          @if (item.slug === 'youtube-earnings-estimator') {
            <div class="card tool-widget">
              <h2>Interactive YouTube &amp; Shorts Revenue Simulator</h2>
              <div class="grid-2">
                <div class="form-grid">
                  <div class="field">
                    <label for="yt-long">Monthly Long-Form Views (16:9)</label>
                    <input id="yt-long" type="number" min="0" step="1000" class="input"
                      [ngModel]="ytLongViews()" (ngModelChange)="ytLongViews.set(+$event || 0)" />
                  </div>
                  <div class="field">
                    <label for="yt-shorts">Monthly Shorts Views (9:16)</label>
                    <input id="yt-shorts" type="number" min="0" step="10000" class="input"
                      [ngModel]="ytShortsViews()" (ngModelChange)="ytShortsViews.set(+$event || 0)" />
                  </div>
                  <div class="field">
                    <label for="yt-geo">Primary Audience Geography</label>
                    <select id="yt-geo" class="select" [ngModel]="ytGeo()" (ngModelChange)="ytGeo.set($event)">
                      <option value="india">India-Focused Regional</option>
                      <option value="mixed">Mixed Bilingual (India + Global)</option>
                      <option value="international">Tier-1 International (US/UK/CA/AU)</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="yt-niche">Channel Content Niche</label>
                    <select id="yt-niche" class="select" [ngModel]="ytNiche()" (ngModelChange)="ytNiche.set($event)">
                      <option value="entertainment">Comedy / Stories / Shorts</option>
                      <option value="devotional">Devotional / Cultural / Panchang</option>
                      <option value="tech-dev">Software Engineering / AI Tutorials</option>
                      <option value="finance-edu">Career / Productivity / SaaS Reviews</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="yt-sponsors">Estimated Monthly Sponsors (USD)</label>
                    <input id="yt-sponsors" type="number" min="0" step="25" class="input"
                      [ngModel]="ytSponsors()" (ngModelChange)="ytSponsors.set(+$event || 0)" />
                  </div>
                  <div class="grid-2">
                    <div class="field">
                      <label for="yt-wh">365-Day Watch Hours (Target: 4,000)</label>
                      <input id="yt-wh" type="number" min="0" class="input"
                        [ngModel]="ytWatchHours()" (ngModelChange)="ytWatchHours.set(+$event || 0)" />
                    </div>
                    <div class="field">
                      <label for="yt-s90">90-Day Shorts Views (Target: 10M)</label>
                      <input id="yt-s90" type="number" min="0" step="50000" class="input"
                        [ngModel]="ytShorts90d()" (ngModelChange)="ytShorts90d.set(+$event || 0)" />
                    </div>
                  </div>
                </div>

                <div class="results-panel">
                  <h3>Projected Monthly Breakdown</h3>
                  <div class="kpi-grid">
                    <div class="kpi"><span>Est. Monthly Total</span><strong>\${{ ytResult().totalCombinedUsd }}</strong><small>~₹{{ ytResult().totalCombinedInr.toLocaleString('en-IN') }} INR</small></div>
                    <div class="kpi"><span>AdSense Subtotal</span><strong>\${{ ytResult().totalAdSenseUsd }}</strong><small>Blended RPM \${{ ytResult().blendedRpmUsd }}</small></div>
                    <div class="kpi"><span>Long-Form RPM</span><strong>\${{ ytResult().calibratedLongRpmUsd }}</strong><small>\${{ ytResult().longRevenueUsd }} earned</small></div>
                    <div class="kpi"><span>Shorts RPM</span><strong>\${{ ytResult().calibratedShortsRpmUsd }}</strong><small>\${{ ytResult().shortsRevenueUsd }} earned</small></div>
                  </div>
                  <div class="progress-block">
                    <div class="prog-row"><span>YPP Watch-Hour Goal (4,000h)</span><strong>{{ ytResult().yppLongProgressPct }}%</strong></div>
                    <div class="bar"><div class="fill" [style.width.%]="ytResult().yppLongProgressPct"></div></div>
                    <div class="prog-row"><span>YPP Shorts Goal (10M / 90d)</span><strong>{{ ytResult().yppShortsProgressPct }}%</strong></div>
                    <div class="bar"><div class="fill accent" [style.width.%]="ytResult().yppShortsProgressPct"></div></div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Tool 2: Short Hook & 3D Story Pacing Planner -->
          @if (item.slug === 'short-hook-pacing-planner') {
            <div class="card tool-widget">
              <div class="tool-top-bar">
                <h2>Interactive Short Script Timing &amp; Story Agent JSON Builder</h2>
                <div class="pill-bar">
                  <button type="button" class="pill-btn" (click)="loadShortPreset('comedy')">Load 3D Comedy Preset</button>
                  <button type="button" class="pill-btn" (click)="loadShortPreset('katha')">Load Katha Preset</button>
                  <button type="button" class="pill-btn" (click)="addBeat()">+ Add Scene Beat</button>
                </div>
              </div>

              <div class="grid-2">
                <div class="beats-editor">
                  <div class="field">
                    <label for="short-title">Project Title</label>
                    <input id="short-title" class="input" [ngModel]="shortTitle()" (ngModelChange)="shortTitle.set($event)" />
                  </div>
                  <div class="field">
                    <label for="short-wpm">Voiceover Speed (Words / Min: {{ shortWpm() }})</label>
                    <input id="short-wpm" type="range" min="100" max="190" [ngModel]="shortWpm()" (ngModelChange)="shortWpm.set(+$event)" />
                  </div>

                  @for (beat of beats(); track $index; let idx = $index) {
                    <div class="beat-row card">
                      <div class="beat-row-head">
                        <strong>Scene {{ idx + 1 }}</strong>
                        <span>~{{ pacingResult().beatTimings[idx]?.seconds }}s ({{ pacingResult().beatTimings[idx]?.words }} words)</span>
                      </div>
                      <div class="grid-2">
                        <input class="input" placeholder="Speaker" [ngModel]="beat.speaker" (ngModelChange)="updateBeat(idx, 'speaker', $event)" />
                        <select class="select" [ngModel]="beat.emotion" (ngModelChange)="updateBeat(idx, 'emotion', $event)">
                          <option value="excited">Excited</option>
                          <option value="funny">Funny</option>
                          <option value="surprised">Surprised</option>
                          <option value="calm">Calm</option>
                          <option value="sarcastic">Sarcastic</option>
                        </select>
                      </div>
                      <textarea rows="2" class="textarea" placeholder="Spoken line" [ngModel]="beat.dialogue" (ngModelChange)="updateBeat(idx, 'dialogue', $event)"></textarea>
                      <input class="input" placeholder="3D scene visual prompt" [ngModel]="beat.visualPrompt" (ngModelChange)="updateBeat(idx, 'visualPrompt', $event)" />
                    </div>
                  }
                </div>

                <div class="results-panel">
                  <h3>Retention &amp; Export Summary</h3>
                  <div class="kpi-grid">
                    <div class="kpi"><span>Estimated Runtime</span><strong>{{ pacingResult().estimatedSeconds }}s</strong><small>{{ pacingResult().estimatedSeconds <= 58 ? 'Fits YouTube Shorts (< 60s)' : 'Consider trimming for Shorts' }}</small></div>
                    <div class="kpi"><span>Opening Hook Pace</span><strong>{{ pacingResult().hookSeconds }}s</strong><small>{{ pacingResult().hookStatus }}</small></div>
                  </div>
                  <div class="field" style="margin-top: 1rem;">
                    <label for="story-json-out">AnimStudio AI Story Agent JSON</label>
                    <textarea id="story-json-out" rows="12" readonly class="textarea mono" [value]="exportedStoryJson()"></textarea>
                  </div>
                  <div class="cta-row">
                    <button type="button" class="btn btn-primary btn-sm" (click)="copyStoryJson()">
                      {{ copiedJson() ? 'Copied JSON!' : 'Copy JSON for AnimStudio' }}
                    </button>
                    <a href="https://studio.keshavsingh.in" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Open Studio &#8599;</a>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Tool 3: Vikram Samvat & Sunrise Kaal Calculator -->
          @if (item.slug === 'panchang-samvat-converter') {
            <div class="card tool-widget">
              <h2>Interactive Samvat &amp; Sunrise-Anchored Kaal Window Calculator</h2>
              <div class="grid-2">
                <div class="form-grid">
                  <div class="field">
                    <label for="pan-date">Gregorian Date</label>
                    <input id="pan-date" type="date" class="input" [ngModel]="panDate()" (ngModelChange)="panDate.set($event)" />
                  </div>
                  <div class="field">
                    <label for="pan-rise">Local Sunrise (HH:MM, 24h)</label>
                    <input id="pan-rise" type="time" class="input" [ngModel]="panSunrise()" (ngModelChange)="panSunrise.set($event)" />
                  </div>
                  <div class="field">
                    <label for="pan-set">Local Sunset (HH:MM, 24h)</label>
                    <input id="pan-set" type="time" class="input" [ngModel]="panSunset()" (ngModelChange)="panSunset.set($event)" />
                  </div>
                  <div class="callout">
                    Full Tithi, Nakshatra, Yoga, Karana &amp; city tables are calculated live on
                    <a href="https://panchang.keshavsingh.in" target="_blank" rel="noopener noreferrer">panchang.keshavsingh.in &#8599;</a>.
                  </div>
                </div>

                <div class="results-panel">
                  <h3>Computed Vedic Era &amp; Daytime Periods ({{ panResult().weekdayName }})</h3>
                  <div class="kpi-grid">
                    <div class="kpi"><span>Vikram Samvat</span><strong>VS {{ panResult().vikramSamvat }}</strong><small>Traditional Lunar Era</small></div>
                    <div class="kpi"><span>Shaka Samvat</span><strong>SE {{ panResult().shakaSamvat }}</strong><small>Official Indian Civil Epoch</small></div>
                    <div class="kpi"><span>Daylight Length</span><strong>{{ panResult().dayDurationMinutes }} min</strong><small>8 slices &times; {{ panResult().sliceMinutes }} min</small></div>
                    <div class="kpi"><span>Abhijit Muhurat</span><strong>{{ panResult().abhijitMuhurat }}</strong><small>Solar Noon Window</small></div>
                  </div>
                  <ul class="kaal-list">
                    <li><strong>Rahu Kaal (Avoid Starting Auspicious Tasks):</strong> <span>{{ panResult().rahuKaal }}</span></li>
                    <li><strong>Yamaganda Kaal:</strong> <span>{{ panResult().yamaganda }}</span></li>
                    <li><strong>Gulika Kaal:</strong> <span>{{ panResult().gulikaKaal }}</span></li>
                  </ul>
                </div>
              </div>
            </div>
          }

          <!-- Tool 4: API Latency & Capacity Planner -->
          @if (item.slug === 'api-latency-capacity-planner') {
            <div class="card tool-widget">
              <h2>Interactive Microservices Latency &amp; Pod Capacity Planner</h2>
              <div class="grid-2">
                <div class="form-grid">
                  <div class="field">
                    <label for="api-rps">Peak Requests Per Second (RPS)</label>
                    <input id="api-rps" type="number" min="1" step="50" class="input" [ngModel]="apiRps()" (ngModelChange)="apiRps.set(+$event || 1)" />
                  </div>
                  <div class="field">
                    <label for="api-payload">Avg Response Payload (KB)</label>
                    <input id="api-payload" type="number" min="1" class="input" [ngModel]="apiPayloadKb()" (ngModelChange)="apiPayloadKb.set(+$event || 1)" />
                  </div>
                  <div class="field">
                    <label for="api-cache">Redis Cache Hit Ratio ({{ apiCacheHit() }}%)</label>
                    <input id="api-cache" type="range" min="0" max="99" [ngModel]="apiCacheHit()" (ngModelChange)="apiCacheHit.set(+$event)" />
                  </div>
                  <div class="field">
                    <label for="api-db">Cold Database Query Time (ms)</label>
                    <input id="api-db" type="number" min="1" class="input" [ngModel]="apiDbMs()" (ngModelChange)="apiDbMs.set(+$event || 1)" />
                  </div>
                  <div class="field">
                    <label for="api-hops">Internal Service Hops ({{ apiHops() }})</label>
                    <input id="api-hops" type="range" min="1" max="8" [ngModel]="apiHops()" (ngModelChange)="apiHops.set(+$event)" />
                  </div>
                  <div class="field">
                    <label for="api-proto">Internal Transport Protocol</label>
                    <select id="api-proto" class="select" [ngModel]="apiProtocol()" (ngModelChange)="apiProtocol.set($event)">
                      <option value="grpc">gRPC + HTTP/2 Protobuf</option>
                      <option value="rest">JSON REST over HTTP/1.1–2</option>
                    </select>
                  </div>
                </div>

                <div class="results-panel">
                  <h3>Estimated Infrastructure &amp; Tail Latency</h3>
                  <div class="kpi-grid">
                    <div class="kpi"><span>Effective DB RPS</span><strong>{{ apiResult().effectiveDbRps }} rps</strong><small>Post-cache origin pressure</small></div>
                    <div class="kpi"><span>Recommended Replicas</span><strong>{{ apiResult().recommendedReplicas }} pods</strong><small>With 35% burst headroom</small></div>
                    <div class="kpi"><span>Est. p50 Latency</span><strong>{{ apiResult().estimatedP50Ms }} ms</strong><small>Typical warm response</small></div>
                    <div class="kpi"><span>Est. p95 Latency</span><strong>{{ apiResult().estimatedP95Ms }} ms</strong><small>Egress ~{{ apiResult().egressBandwidthMbps }} Mbps</small></div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Editorial Context, Instructions, Methodology & FAQs (Required for high-value utility content) -->
          <div class="prose tool-editorial">
            <h2>Why This Calculator Exists</h2>
            <p>{{ item.whyUseful }}</p>

            <h2>Step-by-Step Instructions</h2>
            <ol>
              @for (step of item.howToUse; track step) {
                <li>{{ step }}</li>
              }
            </ol>

            <h2>Calculation Methodology &amp; Assumptions</h2>
            <ul>
              @for (note of item.methodology; track note) {
                <li>{{ note }}</li>
              }
            </ul>

            <h2>Frequently Asked Questions</h2>
            @for (faq of item.faqs; track faq.question) {
              <div class="card faq-card">
                <h3>{{ faq.question }}</h3>
                <p>{{ faq.answer }}</p>
              </div>
            }

            <div class="cta-row">
              <a [routerLink]="['/apps', item.relatedAppSlug]" class="btn btn-primary btn-sm">Inspect Connected Ecosystem App</a>
              <a routerLink="/tools" class="btn btn-outline btn-sm">Back to All Tools</a>
            </div>
          </div>
        </div>
      </section>
    } @else {
      <section class="section">
        <div class="container card">
          <h1>Tool Not Found</h1>
          <p>Explore our four interactive tools from the tools hub.</p>
          <a routerLink="/tools" class="btn btn-primary">Open Tools Hub</a>
        </div>
      </section>
    }
  `,
  styles: `
    .tool-shell { display: grid; gap: 2.25rem; }
    .tool-widget h2 { margin-top: 0; font-size: 1.35rem; margin-bottom: 1.15rem; }
    .tool-top-bar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .results-panel { background: var(--surface-alt); border-radius: 12px; padding: 1.2rem; border: 1px solid var(--border-soft); }
    .results-panel h3 { margin-top: 0; font-size: 1.05rem; margin-bottom: 0.85rem; }
    .kpi-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
    .kpi { background: var(--surface); border: 1px solid var(--border-soft); border-radius: 10px; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.15rem; }
    .kpi span { font-size: 0.76rem; color: var(--text-subtle); font-weight: 600; text-transform: uppercase; }
    .kpi strong { font-size: 1.25rem; color: var(--primary); }
    .kpi small { font-size: 0.78rem; color: var(--text-muted); }
    .progress-block { margin-top: 1rem; display: grid; gap: 0.55rem; }
    .prog-row { display: flex; justify-content: space-between; font-size: 0.85rem; }
    .bar { height: 8px; border-radius: 999px; background: var(--surface-muted); overflow: hidden; }
    .fill { height: 100%; background: var(--primary); transition: width 180ms ease; }
    .fill.accent { background: var(--accent); }
    .beats-editor { display: grid; gap: 0.75rem; }
    .beat-row { display: grid; gap: 0.55rem; padding: 0.9rem; }
    .beat-row-head { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); }
    .kaal-list { list-style: none; padding: 0; margin: 1rem 0 0; display: grid; gap: 0.55rem; }
    .kaal-list li { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; padding: 0.55rem 0.75rem; background: var(--surface); border-radius: 8px; border: 1px solid var(--border-soft); font-size: 0.9rem; }
    .cta-row { display: flex; flex-wrap: wrap; gap: 0.65rem; margin-top: 1rem; }
    .faq-card { margin-bottom: 0.85rem; }
    .faq-card h3 { margin-top: 0; }
  `,
})
export class ToolDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoHubService);
  readonly i18n = inject(I18nHubService);

  readonly tool = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    return HUB_TOOLS.find((t) => t.slug === slug) ?? null;
  });

  // Tool 1 signals
  readonly ytLongViews = signal(45000);
  readonly ytShortsViews = signal(350000);
  readonly ytGeo = signal<'india' | 'mixed' | 'international'>('mixed');
  readonly ytNiche = signal<'entertainment' | 'devotional' | 'tech-dev' | 'finance-edu'>('tech-dev');
  readonly ytSponsors = signal(150);
  readonly ytWatchHours = signal(2200);
  readonly ytShorts90d = signal(2400000);

  readonly ytResult = computed(() =>
    calculateYouTubeEarnings({
      monthlyLongViews: this.ytLongViews(),
      monthlyShortsViews: this.ytShortsViews(),
      geoTier: this.ytGeo() as GeoTier,
      nicheTier: this.ytNiche() as NicheTier,
      monthlySponsorsUsd: this.ytSponsors(),
      currentWatchHours: this.ytWatchHours(),
      currentShorts90dViews: this.ytShorts90d(),
    }),
  );

  // Tool 2 signals
  readonly shortTitle = signal('Funny Level 1 to 3: Wifi Band When Exam Result Drops');
  readonly shortWpm = signal(145);
  readonly copiedJson = signal(false);
  readonly beats = signal<ShortBeatInput[]>([
    {
      speaker: 'Papa',
      emotion: 'excited',
      dialogue: 'Beta exam result link khul gaya, aaj ghar ka WiFi full speed chal raha hai!',
      visualPrompt: '3D animated cartoon dad excitedly holding a smartphone in colorful living room',
    },
    {
      speaker: 'Son',
      emotion: 'surprised',
      dialogue: 'Papa bas 48 percent hai, router abhi band kar do warna neighbour auntie dekh legi!',
      visualPrompt: '3D animated boy with jaw-drop exaggerated cartoon reaction eyeing the WiFi router',
    },
    {
      speaker: 'Dad',
      emotion: 'sarcastic',
      dialogue: 'Chalo beta kam se kam chappal ki speed toh aaj 5G se bhi tez hogi!',
      visualPrompt: 'Cartoon comic freeze frame with dramatic zoom on dad raising eyebrow humorously',
    },
  ]);

  readonly pacingResult = computed(() => analyzeShortPacing(this.beats(), this.shortWpm()));
  readonly exportedStoryJson = computed(() =>
    JSON.stringify(
      {
        title: this.shortTitle(),
        aspectRatio: '9:16',
        estimatedSeconds: this.pacingResult().estimatedSeconds,
        scenes: this.beats().map((b, i) => ({
          sceneNumber: i + 1,
          speaker: b.speaker,
          emotion: b.emotion,
          narration: b.dialogue,
          visualPrompt: b.visualPrompt,
          targetSeconds: this.pacingResult().beatTimings[i]?.seconds ?? 3,
        })),
      },
      null,
      2,
    ),
  );

  // Tool 3 signals
  readonly panDate = signal('2026-11-18');
  readonly panSunrise = signal('06:46');
  readonly panSunset = signal('17:27');
  readonly panResult = computed(() => calculatePanchangWindows(this.panDate(), this.panSunrise(), this.panSunset()));

  // Tool 4 signals
  readonly apiRps = signal(400);
  readonly apiPayloadKb = signal(18);
  readonly apiCacheHit = signal(82);
  readonly apiDbMs = signal(16);
  readonly apiHops = signal(3);
  readonly apiProtocol = signal<'grpc' | 'rest'>('grpc');
  readonly apiResult = computed(() =>
    calculateApiCapacity({
      peakRps: this.apiRps(),
      payloadKb: this.apiPayloadKb(),
      cacheHitPct: this.apiCacheHit(),
      dbQueryMs: this.apiDbMs(),
      internalHops: this.apiHops(),
      protocol: this.apiProtocol(),
    }),
  );

  ngOnInit(): void {
    const item = this.tool();
    if (item) {
      this.seo.update({
        title: `${item.title} | Free Interactive Tool — keshavsingh.in`,
        description: item.shortDesc,
        path: `/tools/${item.slug}`,
        crumbName: item.title,
        schema: toolSchema(item),
      });
    }
  }

  loadShortPreset(preset: 'comedy' | 'katha'): void {
    if (preset === 'katha') {
      this.shortTitle.set('Satya Ki Shakti: Raja Harishchandra 40s Reflection');
      this.beats.set([
        {
          speaker: 'Sutradhar',
          emotion: 'calm',
          dialogue: 'Jab sab kuch chhut jaaye tab bhi jo satya na chhode, wahi itihaas mein amar hota hai.',
          visualPrompt: 'Golden sunrise river ghats of ancient Kashi with serene temple bells in 3D animation',
        },
        {
          speaker: 'Vishwamitra',
          emotion: 'surprised',
          dialogue: 'Rajan, ghor kasht mein bhi aapne apna vachan nahi toda — aapki satyanishtha teeno lokon mein prashansaniya hai.',
          visualPrompt: 'Radiant sage blessing humble king bathed in warm celestial light and floating flower petals',
        },
      ]);
      return;
    }
    this.shortTitle.set('Funny Level 1 to 3: Wifi Band When Exam Result Drops');
    this.beats.set([
      {
        speaker: 'Papa',
        emotion: 'excited',
        dialogue: 'Beta exam result link khul gaya, aaj ghar ka WiFi full speed chal raha hai!',
        visualPrompt: '3D animated cartoon dad excitedly holding a smartphone in colorful living room',
      },
      {
        speaker: 'Son',
        emotion: 'surprised',
        dialogue: 'Papa bas 48 percent hai, router abhi band kar do warna neighbour auntie dekh legi!',
        visualPrompt: '3D animated boy with jaw-drop exaggerated cartoon reaction eyeing the WiFi router',
      },
    ]);
  }

  addBeat(): void {
    this.beats.update((list) => [
      ...list,
      {
        speaker: 'Character',
        emotion: 'funny',
        dialogue: 'New punchline scene beat.',
        visualPrompt: 'Expressive 3D cartoon close-up reaction frame',
      },
    ]);
  }

  updateBeat(index: number, field: keyof ShortBeatInput, value: string): void {
    this.beats.update((list) =>
      list.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)),
    );
  }

  copyStoryJson(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(this.exportedStoryJson());
      this.copiedJson.set(true);
      setTimeout(() => this.copiedJson.set(false), 2000);
    }
  }
}
