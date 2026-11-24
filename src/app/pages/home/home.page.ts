import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ECOSYSTEM_APPS } from '../../data/apps.catalog';
import { CREATOR_CHANNELS, HUB_TOOLS } from '../../data/creators-plans.catalog';
import { GUIDE_CARDS } from '../../data/guides-cards.catalog';
import { APP_VISUALS, CHANNEL_VISUALS, GUIDE_CATEGORY_VISUALS, TOOL_VISUALS, VisualIdentity, gradientOf, visualOf } from '../../data/visuals';
import { I18nHubService } from '../../services/i18n-hub.service';
import { IconComponent, IconName } from '../../ui/icon.component';

interface GoalCard {
  id: 'video' | 'panchang' | 'engineering' | 'hiring';
  visual: VisualIdentity;
  route: string;
  guideRoute: string;
  guideLabel: string;
}

const GOALS: GoalCard[] = [
  {
    id: 'video',
    visual: { icon: 'film', from: '#7c3aed', to: '#db2777' },
    route: '/tools/ffmpeg-video-bitrate-storage-calculator',
    guideRoute: '/guides/ffmpeg-xfade-loudnorm-subtitle-burnin-pipeline',
    guideLabel: 'FFmpeg xfade & Loudnorm Guide',
  },
  {
    id: 'panchang',
    visual: { icon: 'calendar', from: '#ea580c', to: '#f59e0b' },
    route: '/tools/tithi-nakshatra-lunar-phase-calculator',
    guideRoute: '/guides/surya-siddhanta-lahiri-ayanamsa-tithi-math',
    guideLabel: 'Nirayana Tithi & Ayanamsa Math',
  },
  {
    id: 'engineering',
    visual: { icon: 'server', from: '#2563eb', to: '#0891b2' },
    route: '/tools/api-latency-capacity-planner',
    guideRoute: '/guides/federated-sso-dotnet-angular-architecture',
    guideLabel: '.NET 10 Passkey SSO Architecture',
  },
  {
    id: 'hiring',
    visual: { icon: 'user', from: '#334155', to: '#0f766e' },
    route: '/about',
    guideRoute: '/guides/technical-seo-angular-ssg-cwv-publisher-checklist',
    guideLabel: 'Angular SSG & CWV Playbook',
  },
];

const TRUST_ITEMS: { key: string; icon: IconName; route: string }[] = [
  { key: 'noSell', icon: 'shield', route: '/privacy-policy' },
  { key: 'passkey', icon: 'lock', route: '/security' },
  { key: 'cookies', icon: 'cookie', route: '/cookie-policy' },
  { key: 'human', icon: 'mail', route: '/about' },
];

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow"><app-icon name="sparkles" [size]="14" /> {{ i18n.t('home.hero.badge') }}</span>
          <h1>
            {{ i18n.t('home.hero.title') }}
            <span class="gradient-text">{{ i18n.t('home.hero.titleAccent') }}</span>
          </h1>
          <p class="lead">{{ i18n.t('home.hero.lead') }}</p>
          <div class="cta-row">
            <a routerLink="/guides" class="btn btn-primary"><app-icon name="book" [size]="17" /> {{ i18n.t('home.hero.ctaApps') }}</a>
            <a routerLink="/tools" class="btn btn-outline"><app-icon name="calculator" [size]="17" /> {{ i18n.t('home.hero.ctaTools') }}</a>
          </div>
          <ul class="ticks">
            @for (tick of ['tick1', 'tick2', 'tick3']; track tick) {
              <li><app-icon name="check" [size]="15" [stroke]="2.4" /> {{ i18n.t('home.hero.' + tick) }}</li>
            }
          </ul>
        </div>

        <nav class="orbit" aria-label="Featured calculators and platforms">
          @for (tool of orbitTools; track tool.slug; let i = $index) {
            <a [routerLink]="['/tools', tool.slug]" class="orbit-tile" [style.--i]="i" [attr.aria-label]="tool.title" [title]="tool.title">
              <span class="icon-chip lg" [style.background]="gradient(toolVisual(tool.slug))">
                <app-icon [name]="toolVisual(tool.slug).icon" [size]="26" />
              </span>
              <span class="orbit-name">{{ i18n.t('items.tools.' + tool.slug + '.badge', tool.badge) }}</span>
            </a>
            @if (i === 3) {
              <a routerLink="/about" class="orbit-core" aria-label="About Keshav Singh">
                <img src="assets/k.png" width="72" height="72" alt="" />
              </a>
            }
          }
        </nav>
      </div>
    </section>

    <!-- Live counts -->
    <section class="container stats" aria-label="Publication metrics">
      @for (s of stats; track s.key) {
        <a [routerLink]="s.route" class="stat">
          <span class="stat-ico"><app-icon [name]="s.icon" [size]="20" /></span>
          <strong>{{ s.value }}</strong>
          <span>{{ i18n.t('home.stats.' + s.key) }}</span>
        </a>
      }
    </section>

    <!-- Featured Deep-Dive Technical & Creator Guides (Lead Publisher Content) -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('sections.guidesEyebrow') }}</span>
            <h2>{{ i18n.t('home.guides.title') }}</h2>
            <p>{{ i18n.t('home.guides.sub') }}</p>
          </div>
          <a routerLink="/guides" class="btn btn-primary btn-sm">{{ i18n.t('sections.browseAllGuides') }} <app-icon name="arrow" [size]="15" /></a>
        </div>
        <div class="grid-2 guides-grid">
          @for (g of featuredGuides; track g.slug) {
            <a [routerLink]="['/guides', g.slug]" class="card card-interactive tile guide-feature">
              <div class="guide-meta">
                <span class="icon-chip sm" [style.background]="gradient(guideVisual(g.category))"><app-icon [name]="guideVisual(g.category).icon" [size]="17" /></span>
                <span class="badge badge-accent">{{ g.category }}</span>
                <small class="muted">{{ g.readMinutes }} {{ i18n.t('common.minRead') }} &middot; {{ g.updatedDate }}</small>
              </div>
              <h3>{{ g.title }}</h3>
              <p>{{ g.summary }}</p>
              <span class="tile-go">{{ i18n.t('common.readArticle') }}</span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- 8 Free Standalone Browser Calculators & Generators -->
    <section class="section alt-band">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('sections.toolsEyebrow') }}</span>
            <h2>{{ i18n.t('home.tools.title') }}</h2>
            <p>{{ i18n.t('home.tools.sub') }}</p>
          </div>
          <a routerLink="/tools" class="btn btn-outline btn-sm">{{ i18n.t('sections.openAllTools') }} <app-icon name="arrow" [size]="15" /></a>
        </div>
        <div class="grid-4">
          @for (tool of tools; track tool.slug) {
            <a [routerLink]="['/tools', tool.slug]" class="card card-interactive tile tool-tile">
              <span class="tool-banner" [style.background]="gradient(toolVisual(tool.slug))">
                <app-icon [name]="toolVisual(tool.slug).icon" [size]="34" [stroke]="1.5" />
              </span>
              <h3>{{ i18n.t('items.tools.' + tool.slug + '.title', tool.title) }}</h3>
              <p class="clamp-2 tool-desc">{{ i18n.t('items.tools.' + tool.slug + '.shortDesc', tool.shortDesc) }}</p>
              <span class="tile-go">{{ i18n.t('common.open') }} <app-icon name="arrow" [size]="15" /></span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Quick Engineering Tracks -->
    <section class="section-tight">
      <div class="container">
        <h2 class="center-title">{{ i18n.t('home.goals.title') }}</h2>
        <div class="grid-auto goals-grid">
          @for (g of goals; track g.id) {
            <article class="card card-interactive goal">
              <a [routerLink]="g.route" class="tile">
                <span class="icon-chip" [style.background]="gradient(g.visual)"><app-icon [name]="g.visual.icon" [size]="22" /></span>
                <h3>{{ i18n.t('home.goals.' + g.id + '.label') }}</h3>
                <p>{{ i18n.t('home.goals.' + g.id + '.desc') }}</p>
              </a>
              <a [routerLink]="g.guideRoute" class="goal-ext">
                {{ g.guideLabel }} <app-icon name="arrow" [size]="14" />
              </a>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- Editorial Depth & Engineering Standards (Substantive E-E-A-T Context) -->
    <section class="section alt-band">
      <div class="container prose">
        <span class="eyebrow">First-Hand Engineering &amp; Research</span>
        <h2>Why keshavsingh.in Exists as an Open Technical &amp; Creator Resource</h2>
        <p>
          Modern developers, independent animators, and Vedic calendar researchers regularly run into thin web calculators that hide their equations or AI-generated blog posts that omit working code. <strong>keshavsingh.in</strong> is authored and maintained by <a routerLink="/about">Keshav Singh</a> (Software Architect, B.Tech CS) as a public engineering handbook and interactive calculation suite drawn directly from building eight production systems on <code>.NET 10</code>, <code>Angular 22</code>, <code>MongoDB</code>, <code>Three.js WebGL</code>, and <code>FFmpeg</code>.
        </p>
        <ul>
          <li><strong>Verified Equations &amp; Zero-Log Browser Tools:</strong> Every calculator—from H.264/AV1 constrained-CRF video bitrate modeling and Redis/gRPC tail-latency sizing to Nirayana Sun–Moon Tithi/Nakshatra geometry and sunrise-anchored Rahu Kaal—executes locally in TypeScript with open methodology notes and worked scenarios.</li>
          <li><strong>Production-Grounded Code &amp; Post-Mortems:</strong> Our sixteen technical playbooks document real production patterns: WebAuthn passkey ceremonies across subdomains, AES-256-GCM multi-key LLM failover pools, cumulative <code>xfade</code> audio-sync math, and HarfBuzz Devanagari subtitle shaping.</li>
          <li><strong>Clear Domain Separation:</strong> Career hiring materials live distraction-free at <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer">portfolio.keshavsingh.in</a>, private family ledgers run ad-free, and this root publication focuses 100% on open tools and technical education.</li>
        </ul>
      </div>
    </section>

    <!-- Ecosystem Architecture Case Studies -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('sections.appsEyebrow') }}</span>
            <h2>{{ i18n.t('home.apps.title') }}</h2>
            <p>{{ i18n.t('home.apps.sub') }}</p>
          </div>
          <a routerLink="/apps" class="btn btn-outline btn-sm">{{ i18n.t('sections.compareApps') }} <app-icon name="arrow" [size]="15" /></a>
        </div>
        <div class="grid-4">
          @for (app of apps; track app.slug) {
            <a [routerLink]="['/apps', app.slug]" class="card card-interactive tile">
              <span class="icon-chip" [style.background]="gradient(appVisual(app.slug))"><app-icon [name]="appVisual(app.slug).icon" [size]="22" /></span>
              <h3>{{ i18n.t('items.apps.' + app.slug + '.name', app.name) }}</h3>
              <p class="clamp-2">{{ i18n.t('items.apps.' + app.slug + '.shortTagline', app.shortTagline) }}</p>
              <span class="tile-go">{{ i18n.t('common.learnMore') }} <app-icon name="arrow" [size]="15" /></span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Creators -->
    <section class="section alt-band">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('nav.creators') }}</span>
            <h2>{{ i18n.t('home.creators.title') }}</h2>
            <p>{{ i18n.t('home.creators.sub') }}</p>
          </div>
          <a routerLink="/creators" class="btn btn-outline btn-sm">{{ i18n.t('common.viewAll') }} <app-icon name="arrow" [size]="15" /></a>
        </div>
        <div class="grid-3">
          @for (ch of channels; track ch.key) {
            <article class="card channel">
              <span class="icon-chip lg" [style.background]="gradient(channelVisual(ch.key))"><app-icon [name]="channelVisual(ch.key).icon" [size]="26" /></span>
              <div class="channel-body">
                <h3>{{ ch.name }}</h3>
                <p class="muted">{{ ch.handle }} &middot; {{ ch.niche }}</p>
              </div>
              <a [href]="ch.url" target="_blank" rel="noopener noreferrer" class="btn btn-sm yt-btn">
                <app-icon name="youtube" [size]="16" /> {{ i18n.t('common.subscribe') }}
              </a>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- Trust -->
    <section class="section-tight">
      <div class="container">
        <h2 class="center-title">{{ i18n.t('home.trust.title') }}</h2>
        <div class="grid-4">
          @for (t of trust; track t.key) {
            <a [routerLink]="t.route" class="trust-item">
              <span class="trust-ico"><app-icon [name]="t.icon" [size]="22" /></span>
              <strong>{{ i18n.t('home.trust.' + t.key + '.t') }}</strong>
              <span>{{ i18n.t('home.trust.' + t.key + '.d') }}</span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div>
            <h2>{{ i18n.t('home.cta.title') }}</h2>
            <p>{{ i18n.t('home.cta.sub') }}</p>
          </div>
          <div class="cta-row">
            <a routerLink="/contact" class="btn cta-primary"><app-icon name="mail" [size]="17" /> {{ i18n.t('home.cta.button') }}</a>
            <a routerLink="/about" class="btn cta-ghost">{{ i18n.t('nav.about') }} <app-icon name="arrow" [size]="15" /></a>
          </div>
        </div>
        <p class="disclosure-note">{{ i18n.t('common.editorialDisclosure') }}</p>
      </div>
    </section>
  `,
  styles: `
    .hero { position: relative; overflow: hidden; padding-block: clamp(2.5rem, 7vw, 4.75rem) clamp(2rem, 5vw, 3.25rem);
      background: radial-gradient(50rem 28rem at 90% -10%, var(--hero-glow-1), transparent 60%), radial-gradient(40rem 24rem at -10% 110%, var(--hero-glow-2), transparent 60%), var(--surface); border-bottom: 1px solid var(--border-soft); }
    .hero-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: clamp(2rem, 5vw, 3.5rem); align-items: center; }
    .hero h1 { font-size: var(--fs-display); margin: 1rem 0 0.9rem; letter-spacing: -0.035em; line-height: 1.06; }
    .hero h1 .gradient-text { display: block; }
    .hero .cta-row { margin-top: 1.6rem; }
    .ticks { list-style: none; padding: 0; margin: 1.4rem 0 0; display: flex; flex-wrap: wrap; gap: 0.5rem 1.2rem; font-size: 0.88rem; color: var(--text-muted); font-weight: 500; }
    .ticks li { display: inline-flex; align-items: center; gap: 0.35rem; }
    .ticks app-icon { color: var(--success); }
    .guides-grid { grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); }
    .guide-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
    .guide-meta small { margin-left: auto; font-size: 0.78rem; }
    .orbit { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(0.6rem, 1.6vw, 1rem); max-width: 460px; justify-self: center; width: 100%; }
    .orbit-tile, .orbit-core { min-width: 0; aspect-ratio: 1; border-radius: 22px; background: var(--surface); border: 1px solid var(--border-soft); box-shadow: var(--shadow-md); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.5rem; color: var(--text); text-decoration: none !important; transition: transform 160ms ease, border-color 160ms ease; }
    .orbit-tile:hover { border-color: var(--primary); transform: translateY(-4px); }
    .orbit-name { font-size: 0.72rem; font-weight: 600; color: var(--text-muted); text-align: center; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .orbit-core { background: linear-gradient(135deg, var(--primary), var(--accent)); border: 0; box-shadow: var(--shadow-lg); }
    .orbit-core img { width: 62%; height: auto; border-radius: 16px; background: #fff; padding: 6px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); gap: 0.75rem; margin-top: clamp(-2rem, -3vw, -1.25rem); position: relative; z-index: 1; }
    .stat { display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; column-gap: 0.75rem; align-items: center; padding: 0.95rem 1.1rem; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--radius); box-shadow: var(--shadow-md); color: var(--text); text-decoration: none !important; }
    .stat:hover { border-color: var(--primary); }
    .stat-ico { grid-row: span 2; width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; background: var(--primary-soft); color: var(--primary); }
    .stat strong { font-size: 1.5rem; line-height: 1; letter-spacing: -0.02em; }
    .stat span:last-child { font-size: 0.8rem; color: var(--text-muted); }
    .center-title { text-align: center; font-size: var(--fs-h2); margin: clamp(1rem, 3vw, 1.75rem) 0 clamp(1.1rem, 3vw, 1.6rem); }
    .goals-grid { grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr)); }
    .goal { display: flex; flex-direction: column; gap: 0.75rem; min-width: 0; }
    .goal-ext { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: var(--primary); padding-top: 0.7rem; border-top: 1px dashed var(--border-soft); }
    .tool-tile { padding: 0; overflow: hidden; }
    .tool-tile h3, .tool-tile .tool-desc, .tool-tile .tile-go { padding-inline: 1.1rem; }
    .tool-tile .tile-go { padding-bottom: 1.1rem; }
    .tool-banner { height: 88px; display: grid; place-items: center; color: #fff; }
    .channel { display: flex; align-items: center; gap: 0.9rem; flex-wrap: wrap; }
    .channel-body { flex: 1; min-width: 140px; }
    .channel h3 { margin: 0; font-size: 1.02rem; }
    .channel p { margin: 0.15rem 0 0; font-size: 0.84rem; }
    .yt-btn { background: #dc2626; color: #fff; }
    .yt-btn:hover { background: #b91c1c; }
    .trust-item { display: grid; justify-items: center; text-align: center; gap: 0.35rem; padding: 1.2rem 1rem; border-radius: var(--radius); color: var(--text); text-decoration: none !important; }
    .trust-item:hover { background: var(--surface); box-shadow: var(--shadow-sm); }
    .trust-ico { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; background: var(--success-soft); color: var(--success); margin-bottom: 0.25rem; }
    .trust-item span:last-child { font-size: 0.86rem; color: var(--text-muted); }
    .cta-band { display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; flex-wrap: wrap; padding: clamp(1.5rem, 4vw, 2.5rem); border-radius: var(--radius-lg); color: #fff; background: radial-gradient(30rem 14rem at 100% 0%, rgba(255, 255, 255, 0.18), transparent 60%), linear-gradient(120deg, #1d4ed8, #6d28d9 60%, #db2777); box-shadow: var(--shadow-lg); }
    .cta-band h2 { margin: 0 0 0.35rem; font-size: var(--fs-h2); }
    .cta-band p { margin: 0; opacity: 0.88; }
    .cta-primary { background: #fff; color: #1e1b4b; }
    .cta-ghost { color: #fff; border-color: rgba(255, 255, 255, 0.45); background: transparent; }
    .disclosure-note { margin: 1.25rem 0 0; font-size: 0.78rem; color: var(--text-subtle); text-align: center; }
  `,
})
export class HomePageComponent {
  readonly i18n = inject(I18nHubService);
  readonly apps = ECOSYSTEM_APPS;
  readonly tools = HUB_TOOLS;
  readonly orbitTools = HUB_TOOLS.slice(0, 8);
  readonly channels = CREATOR_CHANNELS;
  readonly featuredGuides = GUIDE_CARDS.slice(0, 6);
  readonly goals = GOALS;
  readonly trust = TRUST_ITEMS;
  readonly gradient = gradientOf;

  readonly stats: { key: string; value: number; icon: IconName; route: string }[] = [
    { key: 'guides', value: GUIDE_CARDS.length, icon: 'book', route: '/guides' },
    { key: 'tools', value: HUB_TOOLS.length, icon: 'calculator', route: '/tools' },
    { key: 'apps', value: ECOSYSTEM_APPS.length, icon: 'sparkles', route: '/apps' },
    { key: 'channels', value: CREATOR_CHANNELS.length, icon: 'youtube', route: '/creators' },
  ];

  appVisual(slug: string): VisualIdentity {
    return visualOf(APP_VISUALS, slug);
  }

  toolVisual(slug: string): VisualIdentity {
    return visualOf(TOOL_VISUALS, slug);
  }

  channelVisual(key: string): VisualIdentity {
    return visualOf(CHANNEL_VISUALS, key);
  }

  guideVisual(category: string): VisualIdentity {
    return visualOf(GUIDE_CATEGORY_VISUALS, category);
  }
}
