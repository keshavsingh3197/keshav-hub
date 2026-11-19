import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ECOSYSTEM_APPS } from './data/apps.catalog';
import { CREATOR_CHANNELS, HUB_TOOLS } from './data/creators-plans.catalog';
import { ENGINEERING_GUIDES } from './data/guides.catalog';
import { EcosystemApiService } from './services/ecosystem-api.service';
import { I18nHubService } from './services/i18n-hub.service';
import { SeoHubService } from './services/seo-hub.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  host: { '(document:keydown.escape)': 'closeModals()' },
  template: `
    <div class="app-shell">
      <header class="site-header">
        <div class="container header-inner">
          <a routerLink="/" class="brand" aria-label="keshavsingh.in Ecosystem Hub Home">
            <span class="brand-mark">K</span>
            <span class="brand-text">
              <strong>keshavsingh.in</strong>
              <small>{{ i18n.t('nav.brandSub') }}</small>
            </span>
          </a>

          <nav class="main-nav" [class.open]="mobileMenuOpen()" aria-label="Primary Navigation">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeNav()">{{ i18n.t('nav.home') }}</a>
            <a routerLink="/apps" routerLinkActive="active" (click)="closeNav()">{{ i18n.t('nav.apps') }}</a>
            <a routerLink="/tools" routerLinkActive="active" (click)="closeNav()">{{ i18n.t('nav.tools') }}</a>
            <a routerLink="/creators" routerLinkActive="active" (click)="closeNav()">{{ i18n.t('nav.creators') }}</a>
            <a routerLink="/guides" routerLinkActive="active" (click)="closeNav()">{{ i18n.t('nav.guides') }}</a>
            <a routerLink="/plans" routerLinkActive="active" (click)="closeNav()">{{ i18n.t('nav.plans') }}</a>
            <a routerLink="/about" routerLinkActive="active" (click)="closeNav()">{{ i18n.t('nav.about') }}</a>
            <a routerLink="/contact" routerLinkActive="active" (click)="closeNav()">{{ i18n.t('nav.contact') }}</a>
          </nav>

          <div class="header-actions">
            <button type="button" class="lang-switch" (click)="i18n.toggleLocale()" [attr.aria-label]="i18n.locale() === 'en' ? 'Switch language to Hindi' : 'Switch language to English'">
              <span [class.on]="i18n.locale() === 'en'">EN</span>
              <span class="sep">/</span>
              <span [class.on]="i18n.locale() === 'hi'">हिन्दी</span>
            </button>
            <button type="button" class="icon-btn" (click)="openSearch()" [attr.aria-label]="i18n.t('nav.searchBtn')" title="Search Hub">
              🔍
            </button>
            <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm portfolio-pill">
              {{ i18n.t('nav.portfolio') }}
            </a>
            <button type="button" class="icon-btn" (click)="toggleTheme()" [attr.aria-label]="theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'">
              {{ theme() === 'dark' ? '☀️' : '🌙' }}
            </button>
            <button type="button" class="icon-btn mobile-toggle" (click)="mobileMenuOpen.set(!mobileMenuOpen())" [attr.aria-expanded]="mobileMenuOpen()" aria-label="Toggle Menu">
              ☰
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" class="main-wrap">
        <router-outlet></router-outlet>
      </main>

      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <p class="footer-brand">keshavsingh.in</p>
            <p class="footer-desc">{{ i18n.t('footer.desc') }}</p>
            <p class="footer-desc">
              Contact: <a href="mailto:keshavsingh4522@gmail.com">keshavsingh4522&#64;gmail.com</a>
            </p>
          </div>

          <nav aria-label="Explore Hub">
            <h3>{{ i18n.t('footer.explore') }}</h3>
            <ul>
              <li><a routerLink="/tools">{{ i18n.t('nav.tools') }}</a></li>
              <li><a routerLink="/apps">{{ i18n.t('nav.apps') }}</a></li>
              <li><a routerLink="/creators">{{ i18n.t('nav.creators') }}</a></li>
              <li><a routerLink="/guides">{{ i18n.t('nav.guides') }}</a></li>
              <li><a routerLink="/plans">{{ i18n.t('nav.plans') }}</a></li>
              <li><a routerLink="/roadmap">Roadmap 2026–2027</a></li>
            </ul>
          </nav>

          <nav aria-label="Connected Subdomains">
            <h3>{{ i18n.t('footer.websites') }}</h3>
            <ul>
              <li><a href="https://studio.keshavsingh.in" target="_blank" rel="noopener noreferrer">AnimStudio AI &#8599;</a></li>
              <li><a href="https://panchang.keshavsingh.in" target="_blank" rel="noopener noreferrer">Hindu Panchang &#8599;</a></li>
              <li><a href="https://pratiyogita.keshavsingh.in" target="_blank" rel="noopener noreferrer">Pratiyogita &#8599;</a></li>
              <li><a href="https://social.keshavsingh.in" target="_blank" rel="noopener noreferrer">SocialPulse Analytics &#8599;</a></li>
              <li><a href="https://blog.keshavsingh.in" target="_blank" rel="noopener noreferrer">Engineering Blog &#8599;</a></li>
              <li><a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer">Developer Portfolio &#8599;</a></li>
            </ul>
          </nav>

          <nav aria-label="Trust &amp; Legal">
            <h3>{{ i18n.t('footer.trust') }}</h3>
            <ul>
              <li><a routerLink="/about">{{ i18n.t('nav.about') }}</a></li>
              <li><a routerLink="/contact">{{ i18n.t('nav.contact') }}</a></li>
              <li><a routerLink="/privacy-policy">Privacy Policy</a></li>
              <li><a routerLink="/terms">Terms &amp; Conditions</a></li>
              <li><a routerLink="/cookie-policy">Cookie Policy</a></li>
              <li><a routerLink="/disclaimer">Disclaimer</a></li>
              <li><a routerLink="/data-deletion">Data Deletion</a></li>
              <li><a routerLink="/sitemap">Sitemap</a></li>
            </ul>
          </nav>
        </div>

        <div class="container footer-bottom">
          <span>&copy; {{ currentYear }} Keshav Singh Ecosystem &middot; keshavsingh.in</span>
          <span>{{ i18n.t('footer.portfolioNote') }} <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer">portfolio.keshavsingh.in</a></span>
        </div>
      </footer>

      @if (searchOpen()) {
        <div class="modal-backdrop" (click)="searchOpen.set(false)" role="dialog" aria-modal="true" aria-label="Search Hub">
          <div class="card search-modal" (click)="$event.stopPropagation()">
            <div class="search-head">
              <input type="search" class="input" autofocus [placeholder]="i18n.t('nav.searchPlaceholder')"
                [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" />
              <button type="button" class="btn btn-outline btn-sm" (click)="searchOpen.set(false)">Close</button>
            </div>
            <div class="search-results">
              @for (item of searchResults(); track item.route) {
                <a [routerLink]="item.route" (click)="searchOpen.set(false)" class="search-row">
                  <span class="badge">{{ item.kind }}</span>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <p class="muted">{{ item.desc }}</p>
                  </div>
                </a>
              } @empty {
                <p class="muted">No matching tools, apps, or guides found.</p>
              }
            </div>
          </div>
        </div>
      }

      @if (showConsentBanner()) {
        <aside class="consent-bar" aria-label="Cookie Consent">
          <div class="container consent-inner">
            <p>
              keshavsingh.in uses minimal cookies/local preferences for theme, language (EN/HI), analytics, and Google AdSense ads. Read <a routerLink="/privacy-policy">Privacy</a> &amp; <a routerLink="/cookie-policy">Cookies</a>.
            </p>
            <div class="pill-bar">
              <button type="button" class="btn btn-primary btn-sm" (click)="acceptConsent('accepted')">Accept</button>
              <button type="button" class="btn btn-outline btn-sm" (click)="acceptConsent('essential')">Essential Only</button>
            </div>
          </div>
        </aside>
      }
    </div>
  `,
  styles: `
    .app-shell { min-height: 100vh; display: flex; flex-direction: column; }
    .site-header { position: sticky; top: 0; z-index: 50; background: var(--header-bg); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-soft); }
    .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; height: 68px; }
    .brand { display: inline-flex; align-items: center; gap: 0.65rem; color: var(--text); text-decoration: none !important; flex-shrink: 0; }
    .brand-mark { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 1.1rem; }
    .brand-text { display: flex; flex-direction: column; line-height: 1.15; }
    .brand-text small { font-size: 0.72rem; color: var(--text-subtle); font-weight: 500; }
    .main-nav { display: flex; align-items: center; gap: 0.15rem; }
    .main-nav a { padding: 0.42rem 0.62rem; border-radius: 8px; color: var(--text-muted); font-size: 0.88rem; font-weight: 600; text-decoration: none !important; transition: background-color 140ms ease, color 140ms ease; white-space: nowrap; }
    .main-nav a:hover, .main-nav a.active { background: var(--primary-soft); color: var(--primary); }
    .header-actions { display: flex; align-items: center; gap: 0.45rem; flex-shrink: 0; }
    .lang-switch { height: 38px; padding: 0 0.65rem; border-radius: 9px; border: 1px solid var(--border); background: var(--surface); color: var(--text-subtle); font: inherit; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.25rem; cursor: pointer; }
    .lang-switch span.on { color: var(--primary); }
    .icon-btn { width: 38px; height: 38px; border-radius: 9px; border: 1px solid var(--border); background: var(--surface); color: var(--text); cursor: pointer; display: grid; place-items: center; font-size: 0.95rem; }
    .mobile-toggle { display: none; }
    .main-wrap { flex: 1; }
    .site-footer { border-top: 1px solid var(--border-soft); background: var(--surface); padding-top: 3rem; margin-top: 2rem; }
    .footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 1.5rem; padding-bottom: 2.25rem; }
    .footer-brand { font-size: 1.15rem; font-weight: 800; margin: 0 0 0.5rem; }
    .footer-desc { color: var(--text-muted); font-size: 0.9rem; margin: 0 0 0.6rem; }
    .footer-grid h3 { margin: 0 0 0.75rem; font-size: 0.95rem; }
    .footer-grid ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.45rem; font-size: 0.88rem; }
    .footer-bottom { border-top: 1px solid var(--border-soft); padding-block: 1.1rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; font-size: 0.84rem; color: var(--text-subtle); }
    .modal-backdrop { position: fixed; inset: 0; z-index: 80; background: rgba(15, 23, 42, 0.55); display: grid; place-items: start center; padding: 5rem 1rem 1rem; }
    .search-modal { width: min(680px, 100%); max-height: 75vh; overflow: hidden; display: grid; gap: 1rem; }
    .search-head { display: flex; gap: 0.6rem; align-items: center; }
    .search-results { overflow-y: auto; max-height: 55vh; display: grid; gap: 0.55rem; }
    .search-row { display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.65rem; border-radius: 10px; border: 1px solid var(--border-soft); color: var(--text); text-decoration: none !important; }
    .search-row:hover { border-color: var(--primary); background: var(--primary-soft); }
    .search-row p { margin: 0.2rem 0 0; font-size: 0.84rem; color: var(--text-muted); }
    .consent-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 60; background: var(--surface); border-top: 1px solid var(--border); box-shadow: var(--shadow-md); padding-block: 0.9rem; }
    .consent-inner { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .consent-inner p { margin: 0; font-size: 0.88rem; color: var(--text-muted); max-width: 72ch; }
    @media (max-width: 1060px) {
      .mobile-toggle { display: grid; }
      .portfolio-pill { display: none; }
      .main-nav { display: none; position: absolute; top: 68px; left: 0; right: 0; background: var(--surface); border-bottom: 1px solid var(--border); padding: 1rem; flex-direction: column; align-items: stretch; }
      .main-nav.open { display: flex; }
      .footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 600px) {
      .footer-grid { grid-template-columns: 1fr; }
      .brand-text small { display: none; }
    }
  `,
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly seo = inject(SeoHubService);
  private readonly api = inject(EcosystemApiService);
  readonly i18n = inject(I18nHubService);
  private readonly isBrowser: boolean;

  readonly currentYear = new Date().getFullYear();
  readonly theme = signal<'light' | 'dark'>('light');
  readonly mobileMenuOpen = signal(false);
  readonly showConsentBanner = signal(false);
  readonly searchOpen = signal(false);
  readonly searchQuery = signal('');

  readonly searchResults = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const entries: { kind: string; title: string; desc: string; route: string }[] = [
      ...HUB_TOOLS.map((t) => ({
        kind: 'Tool',
        title: this.i18n.t(`items.tools.${t.slug}.title`, t.title),
        desc: this.i18n.t(`items.tools.${t.slug}.shortDesc`, t.shortDesc),
        route: `/tools/${t.slug}`,
      })),
      ...ECOSYSTEM_APPS.map((a) => ({
        kind: 'App',
        title: this.i18n.t(`items.apps.${a.slug}.name`, a.name),
        desc: this.i18n.t(`items.apps.${a.slug}.shortTagline`, a.shortTagline),
        route: `/apps/${a.slug}`,
      })),
      ...ENGINEERING_GUIDES.map((g) => ({
        kind: 'Guide',
        title: g.title,
        desc: g.summary,
        route: `/guides/${g.slug}`,
      })),
      ...CREATOR_CHANNELS.map((c) => ({
        kind: 'Creator',
        title: `${c.name} (${c.handle})`,
        desc: c.tagline,
        route: '/creators',
      })),
    ];
    if (!q) return entries.slice(0, 8);
    return entries
      .filter((e) => `${e.kind} ${e.title} ${e.desc}`.toLowerCase().includes(q))
      .slice(0, 12);
  });

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('ks_hub_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        this.theme.set(savedTheme);
      }
      if (!localStorage.getItem('ks_hub_consent')) {
        this.showConsentBanner.set(true);
      }
      this.api.trackVisit(this.router.url);
    }

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((ev) => ({ ev, route: this.activatedRoute })),
        map(({ ev, route }) => {
          let r = route;
          while (r.firstChild) r = r.firstChild;
          return { url: ev.urlAfterRedirects, route: r };
        }),
        mergeMap(({ url, route }) => route.data.pipe(map((data) => ({ url, data })))),
      )
      .subscribe(({ url, data }) => {
        if (data['title'] && data['description']) {
          this.seo.update({
            title: data['title'] as string,
            description: data['description'] as string,
            path: url.split('?')[0],
            canonicalPath: data['canonicalPath'] as string | undefined,
          });
        }
        if (this.isBrowser) {
          this.api.trackVisit(url.split('?')[0]);
        }
      });
  }

  toggleTheme(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    if (this.isBrowser) {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ks_hub_theme', next);
    }
  }

  openSearch(): void {
    this.searchQuery.set('');
    this.searchOpen.set(true);
  }

  closeModals(): void {
    this.searchOpen.set(false);
    this.mobileMenuOpen.set(false);
  }

  closeNav(): void {
    this.mobileMenuOpen.set(false);
  }

  acceptConsent(choice: 'accepted' | 'essential'): void {
    if (this.isBrowser) {
      localStorage.setItem('ks_hub_consent', choice);
    }
    this.showConsentBanner.set(false);
  }
}
