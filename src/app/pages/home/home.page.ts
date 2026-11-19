import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ECOSYSTEM_APPS } from '../../data/apps.catalog';
import { CREATOR_CHANNELS, HUB_TOOLS, MEMBERSHIP_PLANS, ROADMAP_MILESTONES } from '../../data/creators-plans.catalog';
import { ENGINEERING_GUIDES } from '../../data/guides.catalog';
import { I18nHubService } from '../../services/i18n-hub.service';

interface QuickGoalOption {
  id: string;
  labelEn: string;
  labelHi: string;
  summaryEn: string;
  summaryHi: string;
  primaryRoute: string;
  primaryLabelEn: string;
  primaryLabelHi: string;
  externalUrl?: string;
  externalLabelEn?: string;
  externalLabelHi?: string;
}

const GOAL_OPTIONS: QuickGoalOption[] = [
  {
    id: 'video',
    labelEn: '🎬 Make 3D Comedy / Story Videos',
    labelHi: '🎬 ३डी कॉमेडी या कथा वीडियो बनाएँ',
    summaryEn: 'Estimate Short pacing or launch AnimStudio AI to build automated 3D scenes, voiceovers, backgrounds & YouTube schedules.',
    summaryHi: 'शॉर्ट वीडियो की गति जांचें या AnimStudio AI में ३डी दृश्य, आवाज़, बैकग्राउंड और यूट्यूब प्रकाशन शुरू करें।',
    primaryRoute: '/tools/short-hook-pacing-planner',
    primaryLabelEn: 'Open Short Pacing Planner',
    primaryLabelHi: 'शॉर्ट पेसिंग प्लानर खोलें',
    externalUrl: 'https://studio.keshavsingh.in/comedy',
    externalLabelEn: 'Launch Comedy 3D Studio ↗',
    externalLabelHi: 'कॉमेडी ३डी स्टूडियो खोलें ↗',
  },
  {
    id: 'panchang',
    labelEn: '🕉️ Check Panchang & Muhurat',
    labelHi: '🕉️ पंचांग व शुभ मुहूर्त देखें',
    summaryEn: 'Convert Vikram/Shaka Samvat & Rahu Kaal intervals directly here or check full sunrise ephemeris on panchang.keshavsingh.in.',
    summaryHi: 'यहीं विक्रम संवत् और राहुकाल निकालें या panchang.keshavsingh.in पर पूर्ण सूर्योदय पंचांग देखें।',
    primaryRoute: '/tools/panchang-samvat-converter',
    primaryLabelEn: 'Open Samvat & Kaal Calculator',
    primaryLabelHi: 'संवत् व काल कैलकुलेटर खोलें',
    externalUrl: 'https://panchang.keshavsingh.in',
    externalLabelEn: 'Open Hindu Panchang ↗',
    externalLabelHi: 'हिन्दू पंचांग खोलें ↗',
  },
  {
    id: 'engineering',
    labelEn: '⚙️ Architecture & Cloud Docs',
    labelHi: '⚙️ आर्किटेक्चर व क्लाउड गाइड्स',
    summaryEn: 'Model API latency & Redis cache capacity or read production guides covering .NET 10, SSO, Azure & Kubernetes.',
    summaryHi: 'API लेटेंसी व कैश क्षमता नापें अथवा .NET 10, SSO और Azure पर विस्तृत लेख पढ़ें।',
    primaryRoute: '/tools/api-latency-capacity-planner',
    primaryLabelEn: 'Open API Capacity Planner',
    primaryLabelHi: 'API क्षमता प्लानर खोलें',
    externalUrl: 'https://blog.keshavsingh.in',
    externalLabelEn: 'Open Tech Blog ↗',
    externalLabelHi: 'टेक ब्लॉग खोलें ↗',
  },
  {
    id: 'hiring',
    labelEn: '💼 Hiring / Engineering Resume',
    labelHi: '💼 रिज़्यूमे व पोर्टफ़ोलियो',
    summaryEn: 'Review full software engineering roles, .NET/Cloud credentials, GitHub repos, and downloadable PDF resume on the portfolio subdomain.',
    summaryHi: 'सॉफ़्टवेयर कार्य-अनुभव, GitHub प्रोजेक्ट और PDF रिज़्यूमे के लिए अलग पोर्टफ़ोलियो सबडोमेन देखें।',
    primaryRoute: '/apps/portfolio',
    primaryLabelEn: 'Read Portfolio Summary',
    primaryLabelHi: 'पोर्टफ़ोलियो विवरण पढ़ें',
    externalUrl: 'https://portfolio.keshavsingh.in',
    externalLabelEn: 'Visit portfolio.keshavsingh.in ↗',
    externalLabelHi: 'portfolio.keshavsingh.in खोलें ↗',
  },
];

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero-wrap">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">{{ i18n.t('hero.eyebrow') }}</span>
          <h1>{{ i18n.t('hero.title') }}</h1>
          <p class="lead">{{ i18n.t('hero.lead') }}</p>
          <div class="cta-row">
            <a routerLink="/tools" class="btn btn-primary">{{ i18n.t('hero.ctaTools') }}</a>
            <a routerLink="/apps" class="btn btn-outline">{{ i18n.t('hero.ctaApps') }}</a>
            <a routerLink="/creators" class="btn btn-outline">{{ i18n.t('hero.ctaCreators') }}</a>
          </div>
          <p class="sub-note">
            {{ i18n.t('hero.portfolioNote') }}
            <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer">{{ i18n.t('hero.portfolioLink') }}</a>.
          </p>
        </div>

        <aside class="card metrics-panel" aria-label="Ecosystem Snapshot">
          <h2>{{ i18n.t('hero.snapshotTitle') }}</h2>
          <ul class="stat-list">
            <li>
              <strong>8 Connected Platforms</strong>
              <span>AnimStudio AI, Hindu Panchang, Pratiyogita, SocialPulse, Content Blog, Ghar Ledger, FamSphere &amp; Portfolio.</span>
            </li>
            <li>
              <strong>4 Native Calculators</strong>
              <span>YouTube RPM &amp; YPP Estimator, 3D Short Pacing JSON Planner, Vedic Samvat Kaal Calculator &amp; API Capacity Sizing.</span>
            </li>
            <li>
              <strong>3 Creator Channels &amp; Dual Localization (EN / HI)</strong>
              <span>&#64;keshavsinghworld (Tech), &#64;OmkarShivBhakti (Katha/Culture) &amp; &#64;KESHAV-ANIM-FF (3D Comedy).</span>
            </li>
            <li>
              <strong>Single Identity SSO &amp; Verified Trust Pages</strong>
              <span>FIDO2 Passkeys on <a href="https://admin.keshavsingh.in" target="_blank" rel="noopener noreferrer">admin.keshavsingh.in</a> plus AdSense &amp; Play Store compliance.</span>
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="section-tight finder-band">
      <div class="container card">
        <div class="finder-head">
          <div>
            <span class="eyebrow">{{ i18n.t('finder.eyebrow') }}</span>
            <h2>{{ i18n.t('finder.title') }}</h2>
            <p class="muted">{{ i18n.t('finder.subtitle') }}</p>
          </div>
          <div class="pill-bar" role="tablist" aria-label="Select goal">
            @for (g of goalOptions; track g.id) {
              <button type="button" class="pill-btn" [class.active]="activeGoal().id === g.id" (click)="selectedGoalId.set(g.id)">
                {{ i18n.isHindi() ? g.labelHi : g.labelEn }}
              </button>
            }
          </div>
        </div>
        @if (activeGoal(); as g) {
          <div class="finder-result">
            <p>{{ i18n.isHindi() ? g.summaryHi : g.summaryEn }}</p>
            <div class="cta-row-sm">
              <a [routerLink]="g.primaryRoute" class="btn btn-primary btn-sm">
                {{ i18n.isHindi() ? g.primaryLabelHi : g.primaryLabelEn }}
              </a>
              @if (g.externalUrl) {
                <a [href]="g.externalUrl" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                  {{ i18n.isHindi() ? g.externalLabelHi : g.externalLabelEn }}
                </a>
              }
            </div>
          </div>
        }
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('sections.toolsEyebrow') }}</span>
            <h2>{{ i18n.t('sections.toolsTitle') }}</h2>
            <p class="muted">{{ i18n.t('sections.toolsSub') }}</p>
          </div>
          <a routerLink="/tools" class="btn btn-outline btn-sm">{{ i18n.t('sections.openAllTools') }}</a>
        </div>

        <div class="grid-2">
          @for (tool of tools; track tool.slug) {
            <article class="card card-interactive tool-card">
              <span class="badge badge-accent">{{ i18n.t('items.tools.' + tool.slug + '.badge', tool.badge) }}</span>
              <h3><a [routerLink]="['/tools', tool.slug]">{{ i18n.t('items.tools.' + tool.slug + '.title', tool.title) }}</a></h3>
              <p class="muted">{{ i18n.t('items.tools.' + tool.slug + '.shortDesc', tool.shortDesc) }}</p>
              <a [routerLink]="['/tools', tool.slug]" class="card-link">{{ i18n.t('common.launchCalculator') }}</a>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section alt-band">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('sections.appsEyebrow') }}</span>
            <h2>{{ i18n.t('sections.appsTitle') }}</h2>
            <p class="muted">{{ i18n.t('sections.appsSub') }}</p>
          </div>
          <a routerLink="/apps" class="btn btn-outline btn-sm">{{ i18n.t('sections.compareApps') }}</a>
        </div>

        <div class="grid-4">
          @for (app of apps; track app.slug) {
            <article class="card card-interactive app-mini">
              <span class="badge">{{ i18n.t('items.apps.' + app.slug + '.badge', app.badge) }}</span>
              <h3><a [routerLink]="['/apps', app.slug]">{{ i18n.t('items.apps.' + app.slug + '.name', app.name) }}</a></h3>
              <p class="muted small-copy">{{ i18n.t('items.apps.' + app.slug + '.shortTagline', app.shortTagline) }}</p>
              <div class="mini-actions">
                <a [routerLink]="['/apps', app.slug]">{{ i18n.t('common.readGuide') }}</a>
                @if (app.url.startsWith('http')) {
                  <a [href]="app.url" target="_blank" rel="noopener noreferrer">{{ i18n.t('common.openApp') }}</a>
                }
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('sections.creatorsEyebrow') }}</span>
            <h2>{{ i18n.t('sections.creatorsTitle') }}</h2>
            <p class="muted">{{ i18n.t('sections.creatorsSub') }}</p>
          </div>
          <a routerLink="/creators" class="btn btn-outline btn-sm">{{ i18n.t('sections.openCreatorHub') }}</a>
        </div>

        <div class="grid-3">
          @for (ch of channels; track ch.key) {
            <article class="card">
              <span class="badge badge-success">{{ ch.handle }}</span>
              <h3>{{ ch.name }}</h3>
              <p class="muted">{{ ch.tagline }}</p>
              <ul class="compact-list">
                @for (item of ch.seriesList; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
              <a [href]="ch.url" target="_blank" rel="noopener noreferrer" class="card-link">{{ i18n.t('common.visitChannel') }}</a>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section alt-band">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('sections.guidesEyebrow') }}</span>
            <h2>{{ i18n.t('sections.guidesTitle') }}</h2>
            <p class="muted">{{ i18n.t('sections.guidesSub') }}</p>
          </div>
          <a routerLink="/guides" class="btn btn-outline btn-sm">{{ i18n.t('sections.browseAllGuides') }} ({{ guides.length }})</a>
        </div>

        <div class="grid-2">
          @for (guide of guides; track guide.slug) {
            <article class="card card-interactive">
              <div class="guide-meta-top">
                <span class="badge">{{ guide.category }}</span>
                <span class="muted tiny">{{ guide.readMinutes }} min read &middot; {{ guide.updatedDate }}</span>
              </div>
              <h3><a [routerLink]="['/guides', guide.slug]">{{ guide.title }}</a></h3>
              <p class="muted small-copy">{{ guide.summary }}</p>
              <a [routerLink]="['/guides', guide.slug]" class="card-link">{{ i18n.t('common.readArticle') }}</a>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('sections.plansEyebrow') }}</span>
            <h2>{{ i18n.t('sections.plansTitle') }}</h2>
            <p class="muted">{{ i18n.t('sections.plansSub') }}</p>
          </div>
          <div class="cta-row-sm">
            <a routerLink="/plans" class="btn btn-primary btn-sm">{{ i18n.t('sections.viewPlans') }}</a>
            <a routerLink="/roadmap" class="btn btn-outline btn-sm">{{ i18n.t('sections.viewRoadmap') }}</a>
          </div>
        </div>

        <div class="grid-3">
          @for (plan of plans; track plan.id) {
            <article class="card" [class.plan-highlight]="plan.highlighted">
              <span class="badge">{{ plan.badge }}</span>
              <h3>{{ plan.name }}</h3>
              <p class="price-text">{{ plan.priceLabel }}</p>
              <p class="muted small-copy">{{ plan.description }}</p>
              <a [routerLink]="plan.ctaTarget" class="card-link">{{ plan.ctaLabel }} &rarr;</a>
            </article>
          }
        </div>

        <div class="callout roadmap-strip">
          <div>
            <strong>Upcoming Focus ({{ roadmap[2].quarter }}):</strong>
            {{ roadmap[2].title }} &mdash; {{ roadmap[2].details }}
          </div>
          <a routerLink="/interact" class="btn btn-outline btn-sm">{{ i18n.t('sections.howToInteract') }}</a>
        </div>

        <p class="disclosure-note">{{ i18n.t('common.editorialDisclosure') }}</p>
      </div>
    </section>
  `,
  styles: `
    .hero-wrap { padding-block: 3.25rem; background: radial-gradient(circle at top right, var(--primary-soft), transparent 45%), var(--surface); border-bottom: 1px solid var(--border-soft); }
    .hero-grid { display: grid; grid-template-columns: 1.35fr 1fr; gap: 2rem; align-items: start; }
    .hero-copy h1 { margin: 0.75rem 0 0.85rem; font-size: clamp(1.85rem, 3.6vw, 2.75rem); line-height: 1.15; letter-spacing: -0.025em; }
    .cta-row { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.4rem; }
    .cta-row-sm { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .sub-note { margin-top: 1rem; font-size: 0.9rem; color: var(--text-subtle); }
    .finder-band { background: var(--bg); }
    .finder-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    .finder-head h2 { margin: 0.45rem 0 0.25rem; font-size: 1.35rem; }
    .finder-result { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding-top: 0.9rem; border-top: 1px solid var(--border-soft); }
    .finder-result p { margin: 0; max-width: 66ch; color: var(--text-muted); }
    .metrics-panel h2 { margin-top: 0; font-size: 1.15rem; margin-bottom: 0.85rem; }
    .stat-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.85rem; }
    .stat-list li { display: flex; flex-direction: column; gap: 0.18rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-soft); }
    .stat-list li:last-child { border-bottom: 0; padding-bottom: 0; }
    .stat-list span { font-size: 0.87rem; color: var(--text-muted); }
    .alt-band { background: var(--surface-alt); border-block: 1px solid var(--border-soft); }
    .section-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .section-head h2 { margin: 0.5rem 0 0.25rem; font-size: 1.6rem; }
    .muted { color: var(--text-muted); margin: 0; }
    .small-copy { font-size: 0.9rem; }
    .tiny { font-size: 0.78rem; }
    .tool-card h3, .app-mini h3 { margin: 0.65rem 0 0.45rem; font-size: 1.08rem; }
    .card-link { display: inline-block; margin-top: 0.85rem; font-weight: 600; font-size: 0.9rem; }
    .mini-actions { display: flex; justify-content: space-between; margin-top: 0.85rem; font-size: 0.85rem; font-weight: 600; }
    .compact-list { padding-left: 1.1rem; margin: 0.75rem 0 0; font-size: 0.88rem; color: var(--text-muted); }
    .guide-meta-top { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.45rem; }
    .price-text { font-weight: 700; color: var(--primary); margin: 0.35rem 0; }
    .plan-highlight { border-color: var(--primary); }
    .roadmap-strip { margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .disclosure-note { margin-top: 1.25rem; font-size: 0.82rem; color: var(--text-subtle); }
    @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; } }
  `,
})
export class HomePageComponent {
  readonly i18n = inject(I18nHubService);
  readonly apps = ECOSYSTEM_APPS;
  readonly tools = HUB_TOOLS;
  readonly channels = CREATOR_CHANNELS;
  readonly guides = ENGINEERING_GUIDES;
  readonly plans = MEMBERSHIP_PLANS;
  readonly roadmap = ROADMAP_MILESTONES;

  readonly goalOptions = GOAL_OPTIONS;
  readonly selectedGoalId = signal<string>(GOAL_OPTIONS[0].id);
  activeGoal(): QuickGoalOption {
    return GOAL_OPTIONS.find((g) => g.id === this.selectedGoalId()) ?? GOAL_OPTIONS[0];
  }
}
