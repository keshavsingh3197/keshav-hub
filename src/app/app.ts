import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, OnInit, PLATFORM_ID, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ECOSYSTEM_APPS } from './data/apps.catalog';
import { CREATOR_CHANNELS, HUB_TOOLS } from './data/creators-plans.catalog';
import { ENGINEERING_GUIDES } from './data/guides.catalog';
import { APP_VISUALS, CHANNEL_VISUALS, GUIDE_CATEGORY_VISUALS, TOOL_VISUALS, VisualIdentity, gradientOf, visualOf } from './data/visuals';
import { ConsentChoice, ConsentService } from './services/consent.service';
import { EcosystemApiService } from './services/ecosystem-api.service';
import { I18nHubService } from './services/i18n-hub.service';
import { SeoHubService } from './services/seo-hub.service';
import { IconComponent, IconName } from './ui/icon.component';

interface SearchEntry {
  kind: string;
  title: string;
  desc: string;
  route: string;
  visual: VisualIdentity;
}

const THEME_KEY = 'ks_hub_theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, IconComponent],
  host: {
    '(document:keydown.escape)': 'closeModals()',
    '(document:keydown)': 'onGlobalKey($event)',
  },
  template: `
    <a class="skip-link" href="#main-content">{{ i18n.t('nav.skip') }}</a>
    <div class="app-shell">
      <header class="site-header">
        <div class="container header-inner">
          <a routerLink="/" class="brand" aria-label="keshavsingh.in home" (click)="closeNav()">
            <img src="assets/k.png" width="36" height="36" alt="" class="brand-mark" />
            <span class="brand-text">
              <strong>keshavsingh<span class="tld">.in</span></strong>
              <small>{{ i18n.t('nav.brandSub') }}</small>
            </span>
          </a>

          <nav id="primary-nav" class="main-nav" [class.open]="mobileMenuOpen()" aria-label="Primary">
            @for (link of navLinks; track link.route) {
              <a [routerLink]="link.route" routerLinkActive="active" (click)="closeNav()">
                <app-icon [name]="link.icon" [size]="17" class="nav-ico" />
                {{ i18n.t(link.key) }}
              </a>
            }
            <a routerLink="/contact" routerLinkActive="active" class="mobile-only" (click)="closeNav()">
              <app-icon name="mail" [size]="17" class="nav-ico" />
              {{ i18n.t('nav.contact') }}
            </a>
          </nav>

          <div class="header-actions">
            <button type="button" class="search-trigger" (click)="openSearch()" [attr.aria-label]="i18n.t('nav.searchBtn')">
              <app-icon name="search" [size]="17" />
              <span class="search-label">{{ i18n.t('nav.searchBtn') }}</span>
              <kbd>Ctrl K</kbd>
            </button>
            <button type="button" class="lang-switch" (click)="i18n.toggleLocale()"
              [attr.aria-label]="i18n.locale() === 'en' ? 'Switch language to Hindi' : 'Switch language to English'">
              {{ i18n.locale() === 'en' ? 'हि' : 'EN' }}
            </button>
            <button type="button" class="icon-btn" (click)="toggleTheme()"
              [attr.aria-label]="theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'">
              <app-icon [name]="theme() === 'dark' ? 'sun' : 'moon'" [size]="18" />
            </button>
            <a routerLink="/contact" class="btn btn-primary btn-sm contact-cta">{{ i18n.t('nav.contact') }}</a>
            <button type="button" class="icon-btn mobile-toggle" (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              [attr.aria-expanded]="mobileMenuOpen()" aria-controls="primary-nav" [attr.aria-label]="i18n.t('nav.menu')">
              <app-icon [name]="mobileMenuOpen() ? 'close' : 'menu'" [size]="19" />
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" class="main-wrap" tabindex="-1">
        <router-outlet></router-outlet>
      </main>

      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-about">
            <a routerLink="/" class="brand" aria-label="keshavsingh.in home">
              <img src="assets/k.png" width="32" height="32" alt="" class="brand-mark" loading="lazy" />
              <strong>keshavsingh<span class="tld">.in</span></strong>
            </a>
            <p>{{ i18n.t('footer.desc') }}</p>
            <div class="socials">
              @for (s of socials; track s.url) {
                <a [href]="s.url" target="_blank" rel="noopener noreferrer" class="icon-btn" [attr.aria-label]="s.label">
                  <app-icon [name]="s.icon" [size]="18" />
                </a>
              }
            </div>
          </div>

          <nav aria-label="Explore">
            <h3>{{ i18n.t('footer.explore') }}</h3>
            <ul>
              <li><a routerLink="/apps">{{ i18n.t('nav.apps') }}</a></li>
              <li><a routerLink="/tools">{{ i18n.t('nav.tools') }}</a></li>
              <li><a routerLink="/creators">{{ i18n.t('nav.creators') }}</a></li>
              <li><a routerLink="/guides">{{ i18n.t('nav.guides') }}</a></li>
              <li><a routerLink="/plans">{{ i18n.t('nav.plans') }}</a></li>
              <li><a routerLink="/roadmap">{{ i18n.t('nav.roadmap') }}</a></li>
            </ul>
          </nav>

          <nav aria-label="Ecosystem websites">
            <h3>{{ i18n.t('footer.websites') }}</h3>
            <ul>
              @for (site of footerSites; track site.url) {
                <li><a [href]="site.url" target="_blank" rel="noopener noreferrer">{{ site.name }}</a></li>
              }
            </ul>
          </nav>

          <nav aria-label="Trust and legal">
            <h3>{{ i18n.t('footer.trust') }}</h3>
            <ul>
              <li><a routerLink="/about">{{ i18n.t('nav.about') }}</a></li>
              <li><a routerLink="/contact">{{ i18n.t('nav.contact') }}</a></li>
              <li><a routerLink="/security">{{ i18n.t('nav.security') }}</a></li>
              <li><a routerLink="/privacy-policy">{{ i18n.t('footer.privacy') }}</a></li>
              <li><a routerLink="/terms">{{ i18n.t('footer.terms') }}</a></li>
              <li><a routerLink="/cookie-policy">{{ i18n.t('footer.cookies') }}</a></li>
              <li><a routerLink="/disclaimer">{{ i18n.t('footer.disclaimer') }}</a></li>
              <li><a routerLink="/data-deletion">{{ i18n.t('footer.dataDeletion') }}</a></li>
            </ul>
          </nav>
        </div>

        <div class="container footer-bottom">
          <span>&copy; {{ currentYear }} Keshav Singh &middot; {{ i18n.t('footer.madeIn') }}</span>
          <span class="footer-links">
            <a routerLink="/sitemap">{{ i18n.t('footer.sitemap') }}</a>
            <button type="button" class="link-btn" (click)="consent.reopen()">{{ i18n.t('footer.cookieSettings') }}</button>
            <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer">{{ i18n.t('footer.portfolio') }}</a>
          </span>
        </div>
      </footer>

      @if (searchOpen()) {
        <div class="modal-backdrop" (click)="searchOpen.set(false)">
          <div class="search-modal" role="dialog" aria-modal="true" [attr.aria-label]="i18n.t('nav.searchBtn')" (click)="$event.stopPropagation()">
            <div class="search-head">
              <app-icon name="search" [size]="20" />
              <input #searchInput type="search" class="search-input" [placeholder]="i18n.t('nav.searchPlaceholder')"
                [attr.aria-label]="i18n.t('nav.searchPlaceholder')" maxlength="80"
                [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" (keydown.enter)="goFirstResult()" />
              <kbd>Esc</kbd>
            </div>
            <div class="search-results">
              @for (item of searchResults(); track item.route + item.title) {
                <a [routerLink]="item.route" (click)="searchOpen.set(false)" class="search-row">
                  <span class="icon-chip sm" [style.background]="gradient(item.visual)"><app-icon [name]="item.visual.icon" [size]="17" /></span>
                  <span class="search-text">
                    <strong>{{ item.title }}</strong>
                    <small class="clamp-2">{{ item.desc }}</small>
                  </span>
                  <span class="badge">{{ item.kind }}</span>
                </a>
              } @empty {
                <p class="muted empty">{{ i18n.t('nav.searchEmpty') }}</p>
              }
            </div>
          </div>
        </div>
      }

      @if (consent.bannerOpen()) {
        <aside class="consent-bar" [attr.aria-label]="i18n.t('consent.label')">
          <app-icon name="cookie" [size]="22" class="consent-ico" />
          <p>
            {{ i18n.t('consent.text') }}
            <a routerLink="/cookie-policy">{{ i18n.t('consent.learnMore') }}</a>
          </p>
          <div class="consent-actions">
            <button type="button" class="btn btn-outline btn-sm" (click)="choose('essential')">{{ i18n.t('consent.essential') }}</button>
            <button type="button" class="btn btn-primary btn-sm" (click)="choose('accepted')">{{ i18n.t('consent.accept') }}</button>
          </div>
        </aside>
      }
    </div>
  `,
  styles: `
    .app-shell { min-height: 100vh; display: flex; flex-direction: column; }
    .site-header { position: sticky; top: 0; z-index: 50; background: var(--header-bg); backdrop-filter: saturate(1.6) blur(14px); border-bottom: 1px solid var(--border-soft); }
    .header-inner { display: flex; align-items: center; gap: 1rem; height: 68px; }
    .brand { display: inline-flex; align-items: center; gap: 0.6rem; color: var(--text); text-decoration: none !important; flex-shrink: 0; }
    .brand-mark { width: 36px; height: 36px; border-radius: 10px; }
    .brand-text { display: flex; flex-direction: column; line-height: 1.1; }
    .brand strong { font-size: 1.02rem; letter-spacing: -0.01em; }
    .tld { color: var(--primary); }
    .brand-text small { font-size: 0.7rem; color: var(--text-subtle); font-weight: 500; }
    .main-nav { display: flex; align-items: center; gap: 0.1rem; margin-inline: auto; }
    .main-nav a { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.7rem; border-radius: 9px; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; text-decoration: none !important; white-space: nowrap; }
    .main-nav a:hover, .main-nav a.active { background: var(--primary-soft); color: var(--primary); }
    .nav-ico { display: none; }
    .mobile-only { display: none !important; }
    .header-actions { display: flex; align-items: center; gap: 0.45rem; flex-shrink: 0; }
    .search-trigger { height: 40px; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0 0.6rem 0 0.75rem; border-radius: 11px; border: 1px solid var(--border-soft); background: var(--surface-alt); color: var(--text-subtle); font: inherit; font-size: 0.86rem; cursor: pointer; min-width: 170px; }
    .search-trigger:hover { border-color: var(--primary); color: var(--primary); }
    .search-label { flex: 1; text-align: left; }
    kbd { font-family: inherit; font-size: 0.68rem; font-weight: 600; padding: 0.12rem 0.38rem; border-radius: 6px; border: 1px solid var(--border); color: var(--text-subtle); background: var(--surface); }
    .lang-switch { height: 40px; min-width: 40px; padding: 0 0.6rem; border-radius: 11px; border: 1px solid var(--border-soft); background: var(--surface); color: var(--text-muted); font: inherit; font-size: 0.85rem; font-weight: 700; cursor: pointer; }
    .lang-switch:hover { color: var(--primary); border-color: var(--primary); }
    .mobile-toggle { display: none; }
    .main-wrap { flex: 1; outline: none; }
    .site-footer { border-top: 1px solid var(--border-soft); background: var(--surface); padding-top: clamp(2rem, 5vw, 3rem); margin-top: 2rem; }
    .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: 1.75rem; padding-bottom: 2rem; }
    .footer-about { grid-column: span 2; max-width: 380px; }
    .footer-about p { color: var(--text-muted); font-size: 0.9rem; margin: 0.85rem 0 1rem; }
    .socials { display: flex; gap: 0.45rem; }
    .footer-grid h3 { margin: 0 0 0.8rem; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-subtle); }
    .footer-grid ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem; font-size: 0.9rem; }
    .footer-grid ul a { color: var(--text-muted); }
    .footer-grid ul a:hover { color: var(--primary); }
    .footer-bottom { border-top: 1px solid var(--border-soft); padding-block: 1.1rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; font-size: 0.84rem; color: var(--text-subtle); }
    .footer-links { display: inline-flex; flex-wrap: wrap; gap: 1rem; }
    .link-btn { background: none; border: 0; padding: 0; font: inherit; color: var(--primary); cursor: pointer; }
    .link-btn:hover { text-decoration: underline; }
    .modal-backdrop { position: fixed; inset: 0; z-index: 80; background: rgba(2, 6, 23, 0.55); backdrop-filter: blur(4px); display: grid; place-items: start center; padding: 10vh 1rem 1rem; }
    .search-modal { width: min(640px, 100%); background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden; }
    .search-head { display: flex; gap: 0.7rem; align-items: center; padding: 0.9rem 1.1rem; border-bottom: 1px solid var(--border-soft); color: var(--text-subtle); }
    .search-input { flex: 1; border: 0; background: transparent; color: var(--text); font: inherit; font-size: 1.05rem; outline: none; min-width: 0; }
    .search-results { overflow-y: auto; max-height: min(60vh, 520px); padding: 0.5rem; display: grid; gap: 0.2rem; }
    .search-row { display: flex; gap: 0.8rem; align-items: center; padding: 0.6rem 0.7rem; border-radius: 12px; color: var(--text); text-decoration: none !important; }
    .search-row:hover, .search-row:focus-visible { background: var(--primary-soft); }
    .search-text { flex: 1; min-width: 0; display: grid; }
    .search-text strong { font-size: 0.93rem; }
    .search-text small { color: var(--text-muted); font-size: 0.8rem; }
    .empty { padding: 1.25rem; text-align: center; margin: 0; }
    .consent-bar { position: fixed; z-index: 60; left: 50%; bottom: 1rem; transform: translateX(-50%); width: min(760px, calc(100% - 2rem)); display: flex; align-items: center; gap: 0.9rem; padding: 0.85rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); }
    .consent-bar p { margin: 0; flex: 1; font-size: 0.86rem; color: var(--text-muted); }
    .consent-ico { color: var(--warn); }
    .consent-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
    @media (max-width: 1020px) {
      .search-trigger { min-width: 0; }
      .search-label, .search-trigger kbd { display: none; }
      .mobile-toggle { display: grid; }
      .contact-cta { display: none; }
      .main-nav { display: none; position: absolute; top: 68px; left: 0; right: 0; background: var(--surface); border-bottom: 1px solid var(--border); box-shadow: var(--shadow-md); padding: 0.75rem var(--gutter) 1rem; flex-direction: column; align-items: stretch; gap: 0.2rem; }
      .main-nav.open { display: flex; }
      .main-nav a { padding: 0.75rem 0.85rem; font-size: 1rem; }
      .nav-ico, .mobile-only { display: inline-flex !important; }
      .header-inner { justify-content: space-between; }
    }
    @media (max-width: 560px) {
      .brand-text small { display: none; }
      .header-inner { gap: 0.5rem; }
      .header-actions { gap: 0.3rem; }
      .header-actions .icon-btn, .search-trigger, .lang-switch { width: 36px; min-width: 36px; height: 36px; padding: 0; justify-content: center; }
      .footer-about { grid-column: auto; }
      .consent-bar { flex-wrap: wrap; }
      .consent-actions { width: 100%; }
      .consent-actions .btn { flex: 1; }
      .consent-ico { display: none; }
    }
    @media (max-width: 370px) {
      .header-inner .brand-text { display: none; }
    }
  `,
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly seo = inject(SeoHubService);
  private readonly api = inject(EcosystemApiService);
  private readonly doc = inject(DOCUMENT);
  readonly consent = inject(ConsentService);
  readonly i18n = inject(I18nHubService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly currentYear = new Date().getFullYear();
  readonly theme = signal<'light' | 'dark'>('light');
  readonly mobileMenuOpen = signal(false);
  readonly searchOpen = signal(false);
  readonly searchQuery = signal('');
  readonly gradient = gradientOf;

  readonly navLinks: { route: string; key: string; icon: IconName }[] = [
    { route: '/apps', key: 'nav.apps', icon: 'sparkles' },
    { route: '/tools', key: 'nav.tools', icon: 'calculator' },
    { route: '/creators', key: 'nav.creators', icon: 'play' },
    { route: '/guides', key: 'nav.guides', icon: 'book' },
    { route: '/about', key: 'nav.about', icon: 'user' },
  ];

  readonly socials: { url: string; label: string; icon: IconName }[] = [
    { url: 'https://www.youtube.com/@keshavsinghworld', label: 'YouTube', icon: 'youtube' },
    { url: 'https://github.com/keshavsingh3197', label: 'GitHub', icon: 'github' },
    { url: 'https://www.linkedin.com/in/keshavsingh3197/', label: 'LinkedIn', icon: 'linkedin' },
    { url: 'mailto:keshavsingh4522@gmail.com', label: 'Email', icon: 'mail' },
  ];

  readonly footerSites = ECOSYSTEM_APPS.filter((a) => a.url.startsWith('http')).map((a) => ({ name: a.name, url: a.url }));

  private readonly searchIndex = computed<SearchEntry[]>(() => [
    ...HUB_TOOLS.map((t) => ({
      kind: this.i18n.t('nav.tools'),
      title: this.i18n.t(`items.tools.${t.slug}.title`, t.title),
      desc: this.i18n.t(`items.tools.${t.slug}.shortDesc`, t.shortDesc),
      route: `/tools/${t.slug}`,
      visual: visualOf(TOOL_VISUALS, t.slug),
    })),
    ...ECOSYSTEM_APPS.map((a) => ({
      kind: this.i18n.t('nav.apps'),
      title: this.i18n.t(`items.apps.${a.slug}.name`, a.name),
      desc: this.i18n.t(`items.apps.${a.slug}.shortTagline`, a.shortTagline),
      route: `/apps/${a.slug}`,
      visual: visualOf(APP_VISUALS, a.slug),
    })),
    ...ENGINEERING_GUIDES.map((g) => ({
      kind: this.i18n.t('nav.guides'),
      title: g.title,
      desc: g.summary,
      route: `/guides/${g.slug}`,
      visual: visualOf(GUIDE_CATEGORY_VISUALS, g.category),
    })),
    ...CREATOR_CHANNELS.map((c) => ({
      kind: this.i18n.t('nav.creators'),
      title: `${c.name} (${c.handle})`,
      desc: c.tagline,
      route: '/creators',
      visual: visualOf(CHANNEL_VISUALS, c.key),
    })),
  ]);

  readonly searchResults = computed(() => {
    const terms = this.searchQuery().trim().toLowerCase().split(/\s+/).filter(Boolean);
    const entries = this.searchIndex();
    if (!terms.length) return entries.slice(0, 8);
    return entries
      .filter((e) => {
        const hay = `${e.kind} ${e.title} ${e.desc}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
      .slice(0, 12);
  });

  ngOnInit(): void {
    if (this.isBrowser) {
      const current = this.doc.documentElement.getAttribute('data-theme');
      this.theme.set(current === 'dark' ? 'dark' : 'light');
    }

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((ev) => {
          let r = this.activatedRoute;
          while (r.firstChild) r = r.firstChild;
          return { url: ev.urlAfterRedirects, route: r };
        }),
        mergeMap(({ url, route }) => route.data.pipe(map((data) => ({ url, data })))),
      )
      .subscribe(({ url, data }) => {
        const path = url.split(/[?#]/)[0];
        if (data['title'] && data['description']) {
          this.seo.update({
            title: data['title'] as string,
            description: data['description'] as string,
            path,
            canonicalPath: data['canonicalPath'] as string | undefined,
            noindex: data['noindex'] === true,
          });
        }
        this.mobileMenuOpen.set(false);
        if (this.isBrowser && this.consent.analyticsAllowed()) {
          this.api.trackVisit(path);
        }
      });
  }

  onGlobalKey(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (this.searchOpen()) this.searchOpen.set(false);
      else this.openSearch();
    }
  }

  toggleTheme(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    if (this.isBrowser) {
      this.doc.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // Storage unavailable (private mode): the theme still applies for this visit.
      }
    }
  }

  openSearch(): void {
    this.searchQuery.set('');
    this.searchOpen.set(true);
    if (this.isBrowser) {
      setTimeout(() => this.searchInput()?.nativeElement.focus());
    }
  }

  goFirstResult(): void {
    const first = this.searchResults()[0];
    if (!first) return;
    this.searchOpen.set(false);
    void this.router.navigateByUrl(first.route);
  }

  closeModals(): void {
    this.searchOpen.set(false);
    this.mobileMenuOpen.set(false);
  }

  closeNav(): void {
    this.mobileMenuOpen.set(false);
  }

  choose(choice: ConsentChoice): void {
    this.consent.choose(choice);
    if (choice === 'accepted' && this.isBrowser) {
      this.api.trackVisit(this.router.url.split(/[?#]/)[0]);
    }
  }
}
