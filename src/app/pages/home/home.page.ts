import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ECOSYSTEM_APPS } from '../../data/apps.catalog';
import { CREATOR_CHANNELS, HUB_TOOLS } from '../../data/creators-plans.catalog';
import { ENGINEERING_GUIDES } from '../../data/guides.catalog';
import { APP_VISUALS, CHANNEL_VISUALS, GUIDE_CATEGORY_VISUALS, TOOL_VISUALS, VisualIdentity, gradientOf, visualOf } from '../../data/visuals';
import { I18nHubService } from '../../services/i18n-hub.service';
import { IconComponent, IconName } from '../../ui/icon.component';

interface GoalCard {
  id: 'video' | 'panchang' | 'engineering' | 'hiring';
  visual: VisualIdentity;
  route: string;
  externalUrl: string;
}

const GOALS: GoalCard[] = [
  {
    id: 'video',
    visual: { icon: 'film', from: '#7c3aed', to: '#db2777' },
    route: '/tools/short-hook-pacing-planner',
    externalUrl: 'https://studio.keshavsingh.in/comedy',
  },
  {
    id: 'panchang',
    visual: { icon: 'calendar', from: '#ea580c', to: '#f59e0b' },
    route: '/tools/panchang-samvat-converter',
    externalUrl: 'https://panchang.keshavsingh.in',
  },
  {
    id: 'engineering',
    visual: { icon: 'server', from: '#2563eb', to: '#0891b2' },
    route: '/tools/api-latency-capacity-planner',
    externalUrl: 'https://blog.keshavsingh.in',
  },
  {
    id: 'hiring',
    visual: { icon: 'user', from: '#334155', to: '#0f766e' },
    route: '/apps/portfolio',
    externalUrl: 'https://portfolio.keshavsingh.in',
  },
];

const TRUST_ITEMS: { key: string; icon: IconName; route: string }[] = [
  { key: 'noSell', icon: 'shield', route: '/privacy-policy' },
  { key: 'passkey', icon: 'lock', route: '/security' },
  { key: 'cookies', icon: 'cookie', route: '/cookie-policy' },
  { key: 'human', icon: 'mail', route: '/contact' },
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
            <a routerLink="/apps" class="btn btn-primary">{{ i18n.t('home.hero.ctaApps') }} <app-icon name="arrow" [size]="17" /></a>
            <a routerLink="/tools" class="btn btn-outline"><app-icon name="calculator" [size]="17" /> {{ i18n.t('home.hero.ctaTools') }}</a>
          </div>
          <ul class="ticks">
            @for (tick of ['tick1', 'tick2', 'tick3']; track tick) {
              <li><app-icon name="check" [size]="15" [stroke]="2.4" /> {{ i18n.t('home.hero.' + tick) }}</li>
            }
          </ul>
        </div>

        <nav class="orbit" aria-label="Ecosystem apps">
          @for (app of orbitApps; track app.slug; let i = $index) {
            <a [routerLink]="['/apps', app.slug]" class="orbit-tile" [style.--i]="i" [attr.aria-label]="app.name" [title]="app.name">
              <span class="icon-chip lg" [style.background]="gradient(appVisual(app.slug))">
                <app-icon [name]="appVisual(app.slug).icon" [size]="26" />
              </span>
              <span class="orbit-name">{{ i18n.t('items.apps.' + app.slug + '.name', app.name) }}</span>
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
    <section class="container stats" aria-label="At a glance">
      @for (s of stats; track s.key) {
        <a [routerLink]="s.route" class="stat">
          <span class="stat-ico"><app-icon [name]="s.icon" [size]="20" /></span>
          <strong>{{ s.value }}</strong>
          <span>{{ i18n.t('home.stats.' + s.key) }}</span>
        </a>
      }
    </section>

    <!-- Goals -->
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
              <a [href]="g.externalUrl" target="_blank" rel="noopener noreferrer" class="goal-ext" [attr.aria-label]="g.externalUrl">
                {{ host(g.externalUrl) }} <app-icon name="external" [size]="14" />
              </a>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- Apps -->
    <section class="section alt-band">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('nav.apps') }}</span>
            <h2>{{ i18n.t('home.apps.title') }}</h2>
            <p>{{ i18n.t('home.apps.sub') }}</p>
          </div>
          <a routerLink="/apps" class="btn btn-outline btn-sm">{{ i18n.t('common.viewAll') }} <app-icon name="arrow" [size]="15" /></a>
        </div>
        <div class="grid-4">
          @for (app of apps; track app.slug) {
            <a [routerLink]="['/apps', app.slug]" class="card card-interactive tile">
              <span class="icon-chip" [style.background]="gradient(appVisual(app.slug))"><app-icon [name]="appVisual(app.slug).icon" [size]="22" /></span>
              <h3>{{ i18n.t('items.apps.' + app.slug + '.name', app.name) }}</h3>
              <p class="clamp-2">{{ i18n.t('items.apps.' + app.slug + '.badge', app.badge) }}</p>
              <span class="tile-go">{{ i18n.t('common.open') }} <app-icon name="arrow" [size]="15" /></span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Tools -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('nav.tools') }}</span>
            <h2>{{ i18n.t('home.tools.title') }}</h2>
            <p>{{ i18n.t('home.tools.sub') }}</p>
          </div>
          <a routerLink="/tools" class="btn btn-outline btn-sm">{{ i18n.t('common.viewAll') }} <app-icon name="arrow" [size]="15" /></a>
        </div>
        <div class="grid-4">
          @for (tool of tools; track tool.slug) {
            <a [routerLink]="['/tools', tool.slug]" class="card card-interactive tile tool-tile">
              <span class="tool-banner" [style.background]="gradient(toolVisual(tool.slug))">
                <app-icon [name]="toolVisual(tool.slug).icon" [size]="34" [stroke]="1.5" />
              </span>
              <h3>{{ i18n.t('items.tools.' + tool.slug + '.title', tool.title) }}</h3>
              <span class="tile-go">{{ i18n.t('common.open') }} <app-icon name="arrow" [size]="15" /></span>
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
                <p class="muted">{{ ch.handle }} · {{ ch.niche }}</p>
              </div>
              <a [href]="ch.url" target="_blank" rel="noopener noreferrer" class="btn btn-sm yt-btn">
                <app-icon name="youtube" [size]="16" /> {{ i18n.t('common.subscribe') }}
              </a>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- Guides -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ i18n.t('nav.guides') }}</span>
            <h2>{{ i18n.t('home.guides.title') }}</h2>
            <p>{{ i18n.t('home.guides.sub') }}</p>
          </div>
          <a routerLink="/guides" class="btn btn-outline btn-sm">{{ i18n.t('common.viewAll') }} <app-icon name="arrow" [size]="15" /></a>
        </div>
        <div class="grid-2 guides-grid">
          @for (g of latestGuides; track g.slug) {
            <a [routerLink]="['/guides', g.slug]" class="card card-interactive guide-row">
              <span class="icon-chip" [style.background]="gradient(guideVisual(g.category))"><app-icon [name]="guideVisual(g.category).icon" [size]="22" /></span>
              <span class="guide-text">
                <small>{{ g.category }} · {{ g.readMinutes }} {{ i18n.t('common.minRead') }}</small>
                <strong class="clamp-2">{{ g.title }}</strong>
              </span>
              <app-icon name="arrow" [size]="18" class="guide-arrow" />
            </a>
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
            <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer" class="btn cta-ghost">{{ i18n.t('footer.portfolio') }} <app-icon name="external" [size]="15" /></a>
          </div>
        </div>
        <p class="disclosure-note">{{ i18n.t('common.editorialDisclosure') }}</p>
      </div>
    </section>
  `,
  styles: `
    .hero { position: relative; overflow: hidden; padding-block: clamp(2.5rem, 7vw, 5rem) clamp(2rem, 5vw, 3.5rem);
      background: radial-gradient(50rem 28rem at 90% -10%, var(--hero-glow-1), transparent 60%), radial-gradient(40rem 24rem at -10% 110%, var(--hero-glow-2), transparent 60%), var(--surface); border-bottom: 1px solid var(--border-soft); }
    .hero-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: clamp(2rem, 5vw, 3.5rem); align-items: center; }
    .hero h1 { font-size: var(--fs-display); margin: 1rem 0 0.9rem; letter-spacing: -0.035em; line-height: 1.05; }
    .hero h1 .gradient-text { display: block; }
    .hero .cta-row { margin-top: 1.6rem; }
    .ticks { list-style: none; padding: 0; margin: 1.4rem 0 0; display: flex; flex-wrap: wrap; gap: 0.5rem 1.2rem; font-size: 0.88rem; color: var(--text-muted); font-weight: 500; }
    .ticks li { display: inline-flex; align-items: center; gap: 0.35rem; }
    .ticks app-icon { color: var(--success); }
    .guides-grid { grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr)); }
    .orbit-tile { min-width: 0; }
    .orbit { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(0.6rem, 1.6vw, 1rem); max-width: 460px; justify-self: center; width: 100%; }
    .orbit-tile, .orbit-core { aspect-ratio: 1; border-radius: 22px; background: var(--surface); border: 1px solid var(--border-soft); box-shadow: var(--shadow-md); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.5rem; color: var(--text); text-decoration: none !important; animation: float 6s ease-in-out infinite; animation-delay: calc(var(--i, 0) * -0.7s); transition: transform 160ms ease, border-color 160ms ease; }
    .orbit-tile:hover { border-color: var(--primary); transform: translateY(-4px) scale(1.03); }
    .orbit-name { font-size: 0.72rem; font-weight: 600; color: var(--text-muted); text-align: center; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .orbit-core { background: linear-gradient(135deg, var(--primary), var(--accent)); border: 0; box-shadow: var(--shadow-lg); animation: none; }
    .orbit-core img { width: 62%; height: auto; border-radius: 16px; background: #fff; padding: 6px; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); gap: 0.75rem; margin-top: clamp(-2rem, -3vw, -1.25rem); position: relative; z-index: 1; }
    .stat { display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; column-gap: 0.75rem; align-items: center; padding: 0.95rem 1.1rem; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--radius); box-shadow: var(--shadow-md); color: var(--text); text-decoration: none !important; }
    .stat:hover { border-color: var(--primary); }
    .stat-ico { grid-row: span 2; width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; background: var(--primary-soft); color: var(--primary); }
    .stat strong { font-size: 1.5rem; line-height: 1; letter-spacing: -0.02em; }
    .stat span:last-child { font-size: 0.8rem; color: var(--text-muted); }
    .center-title { text-align: center; font-size: var(--fs-h2); margin: clamp(1rem, 3vw, 1.75rem) 0 clamp(1.1rem, 3vw, 1.6rem); }
    .goals-grid { grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); }
    .goal { display: flex; flex-direction: column; gap: 0.75rem; min-width: 0; }
    .goal-ext { overflow-wrap: anywhere; }
    .goal-ext { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: var(--text-subtle); padding-top: 0.7rem; border-top: 1px dashed var(--border-soft); }
    .goal-ext:hover { color: var(--primary); }
    .tool-tile { padding: 0; overflow: hidden; }
    .tool-tile h3, .tool-tile .tile-go { padding-inline: 1.15rem; }
    .tool-tile .tile-go { padding-bottom: 1.1rem; }
    .tool-banner { height: 96px; display: grid; place-items: center; color: #fff; }
    .channel { display: flex; align-items: center; gap: 0.9rem; flex-wrap: wrap; }
    .channel-body { flex: 1; min-width: 140px; }
    .channel h3 { margin: 0; font-size: 1.02rem; }
    .channel p { margin: 0.15rem 0 0; font-size: 0.84rem; }
    .yt-btn { background: #dc2626; color: #fff; }
    .yt-btn:hover { background: #b91c1c; }
    .guide-row { display: flex; align-items: center; gap: 0.9rem; color: var(--text); text-decoration: none !important; }
    .guide-text { flex: 1; min-width: 0; display: grid; gap: 0.2rem; }
    .guide-text small { font-size: 0.76rem; color: var(--text-subtle); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .guide-text strong { font-size: 0.98rem; line-height: 1.35; }
    .guide-arrow { color: var(--text-subtle); }
    .guide-row:hover .guide-arrow { color: var(--primary); }
    .trust-item { display: grid; justify-items: center; text-align: center; gap: 0.35rem; padding: 1.2rem 1rem; border-radius: var(--radius); color: var(--text); text-decoration: none !important; }
    .trust-item:hover { background: var(--surface); box-shadow: var(--shadow-sm); }
    .trust-ico { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; background: var(--success-soft); color: var(--success); margin-bottom: 0.25rem; }
    .trust-item span:last-child { font-size: 0.86rem; color: var(--text-muted); }
    .cta-band { display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; flex-wrap: wrap; padding: clamp(1.5rem, 4vw, 2.5rem); border-radius: var(--radius-lg); color: #fff; background: radial-gradient(30rem 14rem at 100% 0%, rgba(255, 255, 255, 0.18), transparent 60%), linear-gradient(120deg, #1d4ed8, #6d28d9 60%, #db2777); box-shadow: var(--shadow-lg); }
    .cta-band h2 { margin: 0 0 0.35rem; font-size: var(--fs-h2); }
    .cta-band p { margin: 0; opacity: 0.88; }
    .cta-primary { background: #fff; color: #1e1b4b; }
    .cta-primary:hover { background: #eef2ff; }
    .cta-ghost { color: #fff; border-color: rgba(255, 255, 255, 0.45); background: transparent; }
    .cta-ghost:hover { background: rgba(255, 255, 255, 0.12); }
    .disclosure-note { margin: 1.25rem 0 0; font-size: 0.78rem; color: var(--text-subtle); text-align: center; }
  `,
})
export class HomePageComponent {
  readonly i18n = inject(I18nHubService);
  readonly apps = ECOSYSTEM_APPS;
  readonly orbitApps = ECOSYSTEM_APPS.slice(0, 8);
  readonly tools = HUB_TOOLS;
  readonly channels = CREATOR_CHANNELS;
  readonly latestGuides = [...ENGINEERING_GUIDES].sort((a, b) => b.updatedDate.localeCompare(a.updatedDate)).slice(0, 4);
  readonly goals = GOALS;
  readonly trust = TRUST_ITEMS;
  readonly gradient = gradientOf;

  /** Counts come from the catalogs, so they stay correct as apps, tools and guides are added. */
  readonly stats: { key: string; value: number; icon: IconName; route: string }[] = [
    { key: 'apps', value: ECOSYSTEM_APPS.length, icon: 'sparkles', route: '/apps' },
    { key: 'tools', value: HUB_TOOLS.length, icon: 'calculator', route: '/tools' },
    { key: 'channels', value: CREATOR_CHANNELS.length, icon: 'youtube', route: '/creators' },
    { key: 'guides', value: ENGINEERING_GUIDES.length, icon: 'book', route: '/guides' },
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

  host(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
}
