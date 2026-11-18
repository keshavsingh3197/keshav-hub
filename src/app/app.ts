import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { EcosystemApiService } from './services/ecosystem-api.service';
import { SeoHubService } from './services/seo-hub.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="site-header">
        <div class="container header-inner">
          <a routerLink="/" class="brand" aria-label="keshavsingh.in Ecosystem Hub Home">
            <span class="brand-mark">K</span>
            <span class="brand-text">
              <strong>keshavsingh.in</strong>
              <small>Ecosystem &amp; Creator Hub</small>
            </span>
          </a>

          <nav class="main-nav" [class.open]="mobileMenuOpen()" aria-label="Primary Navigation">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeNav()">Home</a>
            <a routerLink="/apps" routerLinkActive="active" (click)="closeNav()">Apps</a>
            <a routerLink="/tools" routerLinkActive="active" (click)="closeNav()">Tools</a>
            <a routerLink="/creators" routerLinkActive="active" (click)="closeNav()">Creators</a>
            <a routerLink="/guides" routerLinkActive="active" (click)="closeNav()">Guides</a>
            <a routerLink="/plans" routerLinkActive="active" (click)="closeNav()">Plans</a>
            <a routerLink="/about" routerLinkActive="active" (click)="closeNav()">About</a>
            <a routerLink="/contact" routerLinkActive="active" (click)="closeNav()">Contact</a>
          </nav>

          <div class="header-actions">
            <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm portfolio-pill">
              Portfolio &#8599;
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
            <p class="footer-desc">
              Original interactive utilities, creator workbooks, multi-app platform guides, and engineering documentation across the Keshav Singh digital ecosystem.
            </p>
            <p class="footer-desc">
              Contact: <a href="mailto:keshavsingh4522@gmail.com">keshavsingh4522&#64;gmail.com</a>
            </p>
          </div>

          <nav aria-label="Explore Hub">
            <h3>Explore Hub</h3>
            <ul>
              <li><a routerLink="/tools">Interactive Tools</a></li>
              <li><a routerLink="/apps">Ecosystem Apps</a></li>
              <li><a routerLink="/creators">Creator Studios</a></li>
              <li><a routerLink="/guides">Engineering Guides</a></li>
              <li><a routerLink="/plans">Plans &amp; Membership</a></li>
              <li><a routerLink="/roadmap">Roadmap 2026–2027</a></li>
            </ul>
          </nav>

          <nav aria-label="Connected Subdomains">
            <h3>Ecosystem Websites</h3>
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
            <h3>Trust &amp; Compliance</h3>
            <ul>
              <li><a routerLink="/about">About &amp; Editorial Standards</a></li>
              <li><a routerLink="/contact">Contact Support</a></li>
              <li><a routerLink="/privacy-policy">Privacy Policy</a></li>
              <li><a routerLink="/terms">Terms &amp; Conditions</a></li>
              <li><a routerLink="/cookie-policy">Cookie Policy</a></li>
              <li><a routerLink="/disclaimer">Disclaimer</a></li>
              <li><a routerLink="/sitemap">Sitemap</a></li>
            </ul>
          </nav>
        </div>

        <div class="container footer-bottom">
          <span>&copy; {{ currentYear }} Keshav Singh Ecosystem &middot; keshavsingh.in</span>
          <span>Personal CV &amp; Engineering Resume hosted separately at <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer">portfolio.keshavsingh.in</a></span>
        </div>
      </footer>

      @if (showConsentBanner()) {
        <aside class="consent-bar" aria-label="Cookie Consent">
          <div class="container consent-inner">
            <p>
              keshavsingh.in uses minimal cookies/local preferences for theme persistence, aggregated telemetry, and Google AdSense measurement. Read our <a routerLink="/privacy-policy">Privacy Policy</a> &amp; <a routerLink="/cookie-policy">Cookie Policy</a>.
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
    .site-header { position: sticky; top: 0; z-index: 50; background: var(--header-bg); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border-soft); }
    .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; height: 68px; }
    .brand { display: inline-flex; align-items: center; gap: 0.65rem; color: var(--text); text-decoration: none !important; }
    .brand-mark { width: 36px; height: 36px; border-radius: 10px; background: var(--primary); color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 1.1rem; }
    html[data-theme='dark'] .brand-mark { color: #0b1120; }
    .brand-text { display: flex; flex-direction: column; line-height: 1.15; }
    .brand-text small { font-size: 0.72rem; color: var(--text-subtle); font-weight: 500; }
    .main-nav { display: flex; align-items: center; gap: 0.25rem; }
    .main-nav a { padding: 0.42rem 0.68rem; border-radius: 8px; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; text-decoration: none !important; }
    .main-nav a:hover, .main-nav a.active { background: var(--primary-soft); color: var(--primary); }
    .header-actions { display: flex; align-items: center; gap: 0.5rem; }
    .icon-btn { width: 38px; height: 38px; border-radius: 9px; border: 1px solid var(--border); background: var(--surface); color: var(--text); cursor: pointer; display: grid; place-items: center; font-size: 1rem; }
    .mobile-toggle { display: none; }
    .main-wrap { flex: 1; }
    .site-footer { border-top: 1px solid var(--border-soft); background: var(--surface); padding-top: 3rem; margin-top: 2rem; }
    .footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 1.5rem; padding-bottom: 2.25rem; }
    .footer-brand { font-size: 1.15rem; font-weight: 800; margin: 0 0 0.5rem; }
    .footer-desc { color: var(--text-muted); font-size: 0.9rem; margin: 0 0 0.6rem; }
    .footer-grid h3 { margin: 0 0 0.75rem; font-size: 0.95rem; }
    .footer-grid ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.45rem; font-size: 0.88rem; }
    .footer-bottom { border-top: 1px solid var(--border-soft); padding-block: 1.1rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; font-size: 0.84rem; color: var(--text-subtle); }
    .consent-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 60; background: var(--surface); border-top: 1px solid var(--border); box-shadow: var(--shadow-md); padding-block: 0.9rem; }
    .consent-inner { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .consent-inner p { margin: 0; font-size: 0.88rem; color: var(--text-muted); max-width: 72ch; }
    @media (max-width: 960px) {
      .mobile-toggle { display: grid; }
      .portfolio-pill { display: none; }
      .main-nav { display: none; position: absolute; top: 68px; left: 0; right: 0; background: var(--surface); border-bottom: 1px solid var(--border); padding: 1rem; flex-direction: column; align-items: stretch; }
      .main-nav.open { display: flex; }
      .footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 600px) {
      .footer-grid { grid-template-columns: 1fr; }
    }
  `,
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly seo = inject(SeoHubService);
  private readonly api = inject(EcosystemApiService);
  private readonly isBrowser: boolean;

  readonly currentYear = new Date().getFullYear();
  readonly theme = signal<'light' | 'dark'>('light');
  readonly mobileMenuOpen = signal(false);
  readonly showConsentBanner = signal(false);

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
