import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HUB_TOOLS } from '../../data/creators-plans.catalog';
import { I18nHubService } from '../../services/i18n-hub.service';
import { SeoHubService } from '../../services/seo-hub.service';
import { toolSchema } from '../../services/structured-data';
import {
  GeoTier,
  MotionProfile,
  NicheTier,
  SchemaTemplateKind,
  ShortBeatInput,
  VideoCodecChoice,
  VideoPresetRes,
  analyzeCronAndTokenSchedule,
  analyzeShortPacing,
  buildSeoAuditAndSchema,
  calculateApiCapacity,
  calculateFfmpegBitrate,
  calculatePanchangWindows,
  calculateVedicLunarLimbs,
  calculateYouTubeEarnings,
  todayIsoDate,
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
            <a routerLink="/">{{ i18n.t('nav.home') }}</a> / <a routerLink="/tools">{{ i18n.t('nav.tools') }}</a> /
            <span>{{ i18n.t('items.tools.' + item.slug + '.title', item.title) }}</span>
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
                    <button type="button" class="btn btn-primary btn-sm" (click)="copyText(exportedStoryJson())">
                      {{ copiedFlag() ? 'Copied!' : 'Copy JSON for AnimStudio' }}
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
              <div class="tool-top-bar">
                <h2>Interactive Samvat &amp; Sunrise-Anchored Kaal Window Calculator</h2>
                <div class="pill-bar">
                  <button type="button" class="pill-btn" (click)="setCitySun('06:51', '17:25')">New Delhi</button>
                  <button type="button" class="pill-btn" (click)="setCitySun('06:28', '17:09')">Varanasi</button>
                  <button type="button" class="pill-btn" (click)="setCitySun('06:52', '17:59')">Mumbai</button>
                  <button type="button" class="pill-btn" (click)="setCitySun('06:23', '17:50')">Bengaluru</button>
                </div>
              </div>
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
                    Full lunar Tithi, Nakshatra, Yoga, Karana &amp; city tables are calculated live on
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

          <!-- Tool 5: FFmpeg Video Bitrate, CRF & Cloud Storage Estimator -->
          @if (item.slug === 'ffmpeg-video-bitrate-storage-calculator') {
            <div class="card tool-widget">
              <h2>Interactive FFmpeg Bitrate, CRF &amp; MP4 Storage Simulator</h2>
              <div class="grid-2">
                <div class="form-grid">
                  <div class="field">
                    <label for="ff-res">Canvas Resolution Preset</label>
                    <select id="ff-res" class="select" [ngModel]="ffRes()" (ngModelChange)="ffRes.set($event)">
                      <option value="shorts-1080p">Vertical Shorts / Reels (1080 &times; 1920)</option>
                      <option value="fhd-1080p">Full HD Widescreen (1920 &times; 1080)</option>
                      <option value="qhd-1440p">2K QHD Master (2560 &times; 1440)</option>
                      <option value="uhd-4k">4K UHD Cinema (3840 &times; 2160)</option>
                    </select>
                  </div>
                  <div class="grid-2">
                    <div class="field">
                      <label for="ff-fps">Frame Rate (FPS)</label>
                      <select id="ff-fps" class="select" [ngModel]="ffFps()" (ngModelChange)="ffFps.set(+$event)">
                        <option [ngValue]="24">24 fps (Cinematic)</option>
                        <option [ngValue]="30">30 fps (Standard Social)</option>
                        <option [ngValue]="60">60 fps (High Motion)</option>
                      </select>
                    </div>
                    <div class="field">
                      <label for="ff-codec">Video Encoder</label>
                      <select id="ff-codec" class="select" [ngModel]="ffCodec()" (ngModelChange)="ffCodec.set($event)">
                        <option value="h264">H.264 (libx264 — Universal)</option>
                        <option value="h265">H.265 / HEVC (libx265)</option>
                        <option value="av1">AV1 (libsvtav1 — Web CDN)</option>
                      </select>
                    </div>
                  </div>
                  <div class="grid-2">
                    <div class="field">
                      <label for="ff-motion">Scene Motion Profile</label>
                      <select id="ff-motion" class="select" [ngModel]="ffMotion()" (ngModelChange)="ffMotion.set($event)">
                        <option value="low">Low (Slides / Talking Head)</option>
                        <option value="medium">Medium (3D Story / Katha)</option>
                        <option value="high">High (Fast Comedy / Particles)</option>
                      </select>
                    </div>
                    <div class="field">
                      <label for="ff-audio">AAC Audio Bitrate (kbps)</label>
                      <select id="ff-audio" class="select" [ngModel]="ffAudioKbps()" (ngModelChange)="ffAudioKbps.set(+$event)">
                        <option [ngValue]="128">128 kbps</option>
                        <option [ngValue]="192">192 kbps (Recommended)</option>
                        <option [ngValue]="320">320 kbps (Studio Master)</option>
                      </select>
                    </div>
                  </div>
                  <div class="grid-2">
                    <div class="field">
                      <label for="ff-dur">Clip Duration (Seconds)</label>
                      <input id="ff-dur" type="number" min="1" step="15" class="input" [ngModel]="ffDurationSec()" (ngModelChange)="ffDurationSec.set(+$event || 1)" />
                    </div>
                    <div class="field">
                      <label for="ff-views">Monthly Self-Hosted Streams</label>
                      <input id="ff-views" type="number" min="0" step="500" class="input" [ngModel]="ffMonthlyStreams()" (ngModelChange)="ffMonthlyStreams.set(+$event || 0)" />
                    </div>
                  </div>
                </div>

                <div class="results-panel">
                  <h3>Recommended Encoding &amp; Storage Budget</h3>
                  <div class="kpi-grid">
                    <div class="kpi"><span>Target Stream Rate</span><strong>{{ ffResult().totalMbps }} Mbps</strong><small>{{ ffResult().videoKbps }} kbps video + CRF {{ ffResult().recommendedCrf }}</small></div>
                    <div class="kpi"><span>Est. MP4 File Size</span><strong>{{ ffResult().fileSizeMb }} MB</strong><small>{{ ffResult().hourlyStorageGb }} GB per render hour</small></div>
                    <div class="kpi"><span>Canvas Geometry</span><strong>{{ ffResult().width }}&times;{{ ffResult().height }}</strong><small>yuv420p progressive</small></div>
                    <div class="kpi"><span>Monthly CDN Egress</span><strong>{{ ffResult().monthlyCdnGb }} GB</strong><small>Direct self-hosted transfer</small></div>
                  </div>
                  <div class="field" style="margin-top: 1rem;">
                    <label for="ff-cmd">Production FFmpeg CLI Command</label>
                    <textarea id="ff-cmd" rows="4" readonly class="textarea mono" [value]="ffResult().ffmpegCommand"></textarea>
                  </div>
                  <div class="cta-row">
                    <button type="button" class="btn btn-primary btn-sm" (click)="copyText(ffResult().ffmpegCommand)">
                      {{ copiedFlag() ? 'Copied Command!' : 'Copy FFmpeg Command' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Tool 6: Lunar Tithi, Paksha & Nakshatra Angle Explorer -->
          @if (item.slug === 'tithi-nakshatra-lunar-phase-calculator') {
            <div class="card tool-widget">
              <div class="tool-top-bar">
                <h2>Interactive Nirayana Sun–Moon Panchang Limb Calculator</h2>
                <div class="pill-bar">
                  <button type="button" class="pill-btn" (click)="setLunarPreset(208.4, 334.4)">Shukla Ekadashi</button>
                  <button type="button" class="pill-btn" (click)="setLunarPreset(212.0, 26.0)">Kartik Purnima</button>
                  <button type="button" class="pill-btn" (click)="setLunarPreset(198.5, 196.2)">Amavasya (Diwali)</button>
                  <button type="button" class="pill-btn" (click)="setLunarPreset(312.0, 293.0)">Krishna Chaturdashi</button>
                </div>
              </div>
              <div class="grid-2">
                <div class="form-grid">
                  <div class="field">
                    <label for="ved-sun">Nirayana Solar Longitude (&lambda;<sub>Sun</sub>: 0&deg;–360&deg;)</label>
                    <input id="ved-sun" type="number" min="0" max="360" step="0.5" class="input" [ngModel]="sunLon()" (ngModelChange)="sunLon.set(+$event || 0)" />
                  </div>
                  <div class="field">
                    <label for="ved-moon">Nirayana Lunar Longitude (&lambda;<sub>Moon</sub>: 0&deg;–360&deg;)</label>
                    <input id="ved-moon" type="number" min="0" max="360" step="0.5" class="input" [ngModel]="moonLon()" (ngModelChange)="moonLon.set(+$event || 0)" />
                  </div>
                  <div class="callout">
                    <strong>Formula check:</strong> Tithi = &lfloor;(&lambda;<sub>Moon</sub> &minus; &lambda;<sub>Sun</sub>) / 12&deg;&rfloor; + 1 &middot;
                    Nakshatra = &lfloor;&lambda;<sub>Moon</sub> / 13&deg;20&prime;&rfloor; + 1.
                  </div>
                </div>

                <div class="results-panel">
                  <h3>Computed 5-Limb Astronomical State</h3>
                  <div class="kpi-grid">
                    <div class="kpi"><span>Active Tithi (#{{ lunarResult().tithiNumber }}/30)</span><strong>{{ lunarResult().tithiName }}</strong><small>{{ lunarResult().paksha }}</small></div>
                    <div class="kpi"><span>Synodic Elongation</span><strong>{{ lunarResult().elongationDeg }}&deg;</strong><small>{{ lunarResult().tithiElapsedPct }}% elapsed ({{ lunarResult().degreesToNextTithi }}&deg; left)</small></div>
                    <div class="kpi"><span>Lunar Nakshatra (#{{ lunarResult().nakshatraNumber }}/27)</span><strong>{{ lunarResult().nakshatraName }}</strong><small>Pada {{ lunarResult().nakshatraPada }} of 4</small></div>
                    <div class="kpi"><span>Yoga &amp; Karana</span><strong>{{ lunarResult().yogaName }}</strong><small>Karana: {{ lunarResult().karanaName }}</small></div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Tool 7: JSON-LD Structured Data & OpenGraph Validator -->
          @if (item.slug === 'json-ld-seo-schema-generator') {
            <div class="card tool-widget">
              <h2>Interactive Schema.org JSON-LD &amp; OpenGraph Head Builder</h2>
              <div class="grid-2">
                <div class="form-grid">
                  <div class="field">
                    <label for="seo-kind">Schema.org Entity Type</label>
                    <select id="seo-kind" class="select" [ngModel]="seoKind()" (ngModelChange)="seoKind.set($event)">
                      <option value="TechArticle">TechArticle (Engineering / Creator Guide)</option>
                      <option value="SoftwareApplication">WebApplication (Interactive Browser Tool)</option>
                      <option value="FAQPage">FAQPage (Structured Q&amp;A Rich Result)</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="seo-title">Page Title ({{ seoResult().titleLength }} chars — {{ seoResult().titleStatus }})</label>
                    <input id="seo-title" class="input" [ngModel]="seoTitle()" (ngModelChange)="seoTitle.set($event)" />
                  </div>
                  <div class="field">
                    <label for="seo-desc">Meta Description ({{ seoResult().descLength }} chars — {{ seoResult().descStatus }})</label>
                    <textarea id="seo-desc" rows="2" class="textarea" [ngModel]="seoDesc()" (ngModelChange)="seoDesc.set($event)"></textarea>
                  </div>
                  <div class="grid-2">
                    <div class="field">
                      <label for="seo-url">HTTPS Canonical URL</label>
                      <input id="seo-url" class="input" [ngModel]="seoUrl()" (ngModelChange)="seoUrl.set($event)" />
                    </div>
                    <div class="field">
                      <label for="seo-author">Author Name</label>
                      <input id="seo-author" class="input" [ngModel]="seoAuthor()" (ngModelChange)="seoAuthor.set($event)" />
                    </div>
                  </div>
                  @if (seoKind() === 'FAQPage') {
                    <div class="field">
                      <label for="seo-q">FAQ Question</label>
                      <input id="seo-q" class="input" [ngModel]="seoFaqQ()" (ngModelChange)="seoFaqQ.set($event)" />
                    </div>
                    <div class="field">
                      <label for="seo-a">FAQ Accepted Answer</label>
                      <textarea id="seo-a" rows="2" class="textarea" [ngModel]="seoFaqA()" (ngModelChange)="seoFaqA.set($event)"></textarea>
                    </div>
                  }
                </div>

                <div class="results-panel">
                  <h3>SERP Hygiene &amp; Escaped HTML Head Output</h3>
                  <div class="kpi-grid">
                    <div class="kpi"><span>Title Check</span><strong>{{ seoResult().titleLength }} ch</strong><small>{{ seoResult().titleStatus }}</small></div>
                    <div class="kpi"><span>Canonical HTTPS</span><strong>{{ seoResult().canonicalValid ? 'Valid HTTPS' : 'Fix Origin/Query' }}</strong><small>{{ seoResult().descStatus }}</small></div>
                  </div>
                  <div class="field" style="margin-top: 1rem;">
                    <label for="seo-out">XSS-Safe HTML + JSON-LD Snippet</label>
                    <textarea id="seo-out" rows="11" readonly class="textarea mono" [value]="seoResult().htmlHeadSnippet"></textarea>
                  </div>
                  <div class="cta-row">
                    <button type="button" class="btn btn-primary btn-sm" (click)="copyText(seoResult().htmlHeadSnippet)">
                      {{ copiedFlag() ? 'Copied Snippet!' : 'Copy Head & JSON-LD Snippet' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Tool 8: Cron Schedule, IST Epoch & JWT Rotation Planner -->
          @if (item.slug === 'cron-jwt-epoch-developer-toolkit') {
            <div class="card tool-widget">
              <div class="tool-top-bar">
                <h2>UTC-to-IST Cron Translator, Epoch Decoder &amp; JWT TTL Planner</h2>
                <div class="pill-bar">
                  <button type="button" class="pill-btn" (click)="cronExpr.set('15 0 * * *')">05:45 AM IST Job</button>
                  <button type="button" class="pill-btn" (click)="cronExpr.set('30 12 * * 1-5')">06:00 PM IST Weekdays</button>
                  <button type="button" class="pill-btn" (click)="cronExpr.set('*/15 * * * *')">Every 15m Sync</button>
                  <button type="button" class="pill-btn" (click)="setNowEpoch()">Current Epoch</button>
                </div>
              </div>
              <div class="grid-2">
                <div class="form-grid">
                  <div class="field">
                    <label for="cr-exp">5-Field UTC Cron Expression (min hour dom month dow)</label>
                    <input id="cr-exp" class="input mono" [ngModel]="cronExpr()" (ngModelChange)="cronExpr.set($event)" />
                  </div>
                  <div class="field">
                    <label for="cr-ep">Unix Epoch Timestamp (Seconds)</label>
                    <input id="cr-ep" type="number" class="input mono" [ngModel]="epochSec()" (ngModelChange)="epochSec.set(+$event || 0)" />
                  </div>
                  <div class="grid-2">
                    <div class="field">
                      <label for="jwt-acc">JWT Access Token TTL (Minutes)</label>
                      <input id="jwt-acc" type="number" min="1" max="1440" class="input" [ngModel]="jwtAccessMin()" (ngModelChange)="jwtAccessMin.set(+$event || 15)" />
                    </div>
                    <div class="field">
                      <label for="jwt-ref">HttpOnly Refresh Cookie TTL (Days)</label>
                      <input id="jwt-ref" type="number" min="1" max="90" class="input" [ngModel]="jwtRefreshDays()" (ngModelChange)="jwtRefreshDays.set(+$event || 14)" />
                    </div>
                  </div>
                </div>

                <div class="results-panel">
                  <h3>Schedule Translation &amp; Session Security Audit</h3>
                  <ul class="kaal-list" style="margin-top: 0; margin-bottom: 0.85rem;">
                    <li><strong>UTC Cron Cadence:</strong> <span>{{ cronResult().cronSummaryUtc }}</span></li>
                    <li><strong>India (IST +05:30):</strong> <span>{{ cronResult().cronSummaryIst }}</span></li>
                    <li><strong>Decoded Epoch (UTC):</strong> <span class="mono">{{ cronResult().utcIso }}</span></li>
                    <li><strong>Decoded Epoch (IST):</strong> <span class="mono">{{ cronResult().istFormatted }}</span></li>
                  </ul>
                  <div class="kpi-grid">
                    <div class="kpi"><span>Token Security Posture</span><strong>{{ cronResult().tokenPosture }}</strong><small>Stateless bearer window</small></div>
                    <div class="kpi"><span>Max Rotations / Session</span><strong>{{ cronResult().rotationsPerSession }}&times;</strong><small>Across refresh cookie lifetime</small></div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Editorial Context, Instructions, Worked Example, Methodology & FAQs -->
          <div class="prose tool-editorial">
            <h2>Why Engineers &amp; Creators Use This Calculator</h2>
            <p>{{ item.whyUseful }}</p>

            <h2>Step-by-Step Instructions</h2>
            <ol>
              @for (step of item.howToUse; track step) {
                <li>{{ step }}</li>
              }
            </ol>

            <h2>Calculation Methodology &amp; Formulas</h2>
            <ul>
              @for (note of item.methodology; track note) {
                <li>{{ note }}</li>
              }
            </ul>

            <h2>Worked Production Example: {{ item.workedExample.title }}</h2>
            <div class="card faq-card">
              <p><strong>Scenario:</strong> {{ item.workedExample.scenario }}</p>
              <ol>
                @for (s of item.workedExample.steps; track s) {
                  <li>{{ s }}</li>
                }
              </ol>
              <p style="margin-bottom: 0;"><strong>Key Takeaway:</strong> {{ item.workedExample.takeaway }}</p>
            </div>

            <h2>Frequently Asked Questions</h2>
            @for (faq of item.faqs; track faq.question) {
              <div class="card faq-card">
                <h3>{{ faq.question }}</h3>
                <p>{{ faq.answer }}</p>
              </div>
            }

            <div class="cta-row">
              <a [routerLink]="['/guides', item.relatedGuideSlug]" class="btn btn-primary btn-sm">Read Companion Engineering Guide</a>
              <a [routerLink]="['/apps', item.relatedAppSlug]" class="btn btn-outline btn-sm">Inspect Connected Platform</a>
              <a routerLink="/tools" class="btn btn-outline btn-sm">Browse All 8 Tools</a>
            </div>
          </div>
        </div>
      </section>
    } @else {
      <section class="section">
        <div class="container card">
          <h1>Tool Not Found</h1>
          <p>Explore all eight free interactive calculators and developer utilities from the tools hub.</p>
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
    .kpi strong { font-size: 1.15rem; color: var(--primary); word-break: break-word; }
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
    .kaal-list li { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; padding: 0.55rem 0.75rem; background: var(--surface); border-radius: 8px; border: 1px solid var(--border-soft); font-size: 0.88rem; }
    .cta-row { display: flex; flex-wrap: wrap; gap: 0.65rem; margin-top: 1rem; }
    .faq-card { margin-bottom: 0.85rem; }
    .faq-card h3 { margin-top: 0; }
    @media (max-width: 520px) { .kpi-grid { grid-template-columns: minmax(0, 1fr); } }
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

  readonly copiedFlag = signal(false);

  // Tool 1 signals
  readonly ytLongViews = signal(45000);
  readonly ytShortsViews = signal(350000);
  readonly ytGeo = signal<GeoTier>('mixed');
  readonly ytNiche = signal<NicheTier>('tech-dev');
  readonly ytSponsors = signal(150);
  readonly ytWatchHours = signal(2200);
  readonly ytShorts90d = signal(2400000);

  readonly ytResult = computed(() =>
    calculateYouTubeEarnings({
      monthlyLongViews: this.ytLongViews(),
      monthlyShortsViews: this.ytShortsViews(),
      geoTier: this.ytGeo(),
      nicheTier: this.ytNiche(),
      monthlySponsorsUsd: this.ytSponsors(),
      currentWatchHours: this.ytWatchHours(),
      currentShorts90dViews: this.ytShorts90d(),
    }),
  );

  // Tool 2 signals
  readonly shortTitle = signal('Funny Level 1 to 3: Wifi Band When Exam Result Drops');
  readonly shortWpm = signal(145);
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

  // Tool 3 signals (dynamically initialized to today's date)
  readonly panDate = signal(todayIsoDate());
  readonly panSunrise = signal('06:51');
  readonly panSunset = signal('17:25');
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

  // Tool 5 signals (FFmpeg Bitrate & Storage)
  readonly ffRes = signal<VideoPresetRes>('shorts-1080p');
  readonly ffFps = signal(30);
  readonly ffCodec = signal<VideoCodecChoice>('h264');
  readonly ffMotion = signal<MotionProfile>('medium');
  readonly ffAudioKbps = signal(192);
  readonly ffDurationSec = signal(55);
  readonly ffMonthlyStreams = signal(5000);
  readonly ffResult = computed(() =>
    calculateFfmpegBitrate({
      resolution: this.ffRes(),
      fps: this.ffFps(),
      codec: this.ffCodec(),
      motion: this.ffMotion(),
      audioKbps: this.ffAudioKbps(),
      durationSeconds: this.ffDurationSec(),
      monthlyDeliveries: this.ffMonthlyStreams(),
    }),
  );

  // Tool 6 signals (Vedic Lunar Limbs)
  readonly sunLon = signal(208.4);
  readonly moonLon = signal(334.4);
  readonly lunarResult = computed(() => calculateVedicLunarLimbs(this.sunLon(), this.moonLon()));

  // Tool 7 signals (JSON-LD & OpenGraph)
  readonly seoKind = signal<SchemaTemplateKind>('TechArticle');
  readonly seoTitle = signal('Federated OAuth2 & Passkey SSO Across .NET 10 Apps');
  readonly seoDesc = signal(
    'How to architect single sign-on across multiple subdomains with FIDO2 passkeys, dynamic CORS origin validation, and HttpOnly refresh token rotation.',
  );
  readonly seoUrl = signal('https://keshavsingh.in/guides/federated-sso-dotnet-angular-architecture');
  readonly seoAuthor = signal('Keshav Singh');
  readonly seoDate = signal(todayIsoDate());
  readonly seoFaqQ = signal('Why bind WebAuthn RelyingPartyId to the apex domain?');
  readonly seoFaqA = signal('Pinning rpId to keshavsingh.in lets one hardware passkey authenticate cleanly across approved sibling subdomains.');
  readonly seoResult = computed(() =>
    buildSeoAuditAndSchema({
      kind: this.seoKind(),
      title: this.seoTitle(),
      description: this.seoDesc(),
      canonicalUrl: this.seoUrl(),
      authorName: this.seoAuthor(),
      publishedIso: this.seoDate(),
      faqQuestion: this.seoFaqQ(),
      faqAnswer: this.seoFaqA(),
    }),
  );

  // Tool 8 signals (Cron, Epoch & JWT)
  readonly cronExpr = signal('15 0 * * *');
  readonly epochSec = signal(Math.floor(Date.now() / 1000));
  readonly jwtAccessMin = signal(15);
  readonly jwtRefreshDays = signal(14);
  readonly cronResult = computed(() =>
    analyzeCronAndTokenSchedule({
      cronExpression: this.cronExpr(),
      epochSeconds: this.epochSec(),
      accessTtlMinutes: this.jwtAccessMin(),
      refreshTtlDays: this.jwtRefreshDays(),
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

  setCitySun(rise: string, set: string): void {
    this.panSunrise.set(rise);
    this.panSunset.set(set);
  }

  setLunarPreset(sun: number, moon: number): void {
    this.sunLon.set(sun);
    this.moonLon.set(moon);
  }

  setNowEpoch(): void {
    this.epochSec.set(Math.floor(Date.now() / 1000));
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
    this.beats.update((list) => list.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  }

  copyText(payload: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(payload);
      this.copiedFlag.set(true);
      setTimeout(() => this.copiedFlag.set(false), 2000);
    }
  }
}
