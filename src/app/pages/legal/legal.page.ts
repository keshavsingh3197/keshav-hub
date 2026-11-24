import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ECOSYSTEM_APPS } from '../../data/apps.catalog';
import { GUIDE_CARDS } from '../../data/guides-cards.catalog';
import { HUB_TOOLS } from '../../data/creators-plans.catalog';
import { ConsentChoice, ConsentService } from '../../services/consent.service';
import { I18nHubService } from '../../services/i18n-hub.service';
import { IconComponent, IconName } from '../../ui/icon.component';

interface GlanceItem {
  icon: IconName;
  title: string;
  text: string;
}

const PRIVACY_GLANCE: GlanceItem[] = [
  { icon: 'shield', title: 'Never sold', text: 'Your personal data is never sold or rented.' },
  { icon: 'cookie', title: 'Opt-in analytics', text: 'Visits are counted only after you accept.' },
  { icon: 'lock', title: 'Encrypted', text: 'HTTPS in transit, encrypted at rest.' },
  { icon: 'file', title: 'Delete anytime', text: 'Ask once and we erase it.' },
];

const SECURITY_GLANCE: GlanceItem[] = [
  { icon: 'lock', title: 'TLS everywhere', text: 'HTTPS only, TLS 1.2+ on every subdomain.' },
  { icon: 'user', title: 'Passkeys & SSO', text: 'FIDO2 passkeys, one central identity server.' },
  { icon: 'shield', title: 'HttpOnly sessions', text: 'Refresh tokens never reachable by scripts.' },
  { icon: 'server', title: 'Least data', text: 'Encrypted at rest, minimal retention.' },
];

@Component({
  selector: 'app-glance',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="glance">
      @for (g of items(); track g.title) {
        <div class="glance-item">
          <span class="icon-chip sm glance-chip"><app-icon [name]="g.icon" [size]="18" /></span>
          <div><strong>{{ g.title }}</strong><span>{{ g.text }}</span></div>
        </div>
      }
    </div>
  `,
  styles: `.glance-chip { background: linear-gradient(135deg, #059669, #0d9488); }`,
})
export class GlanceComponent {
  readonly items = input<GlanceItem[]>([]);
}

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [RouterLink, GlanceComponent],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>Privacy Policy</span></div>
        <span class="eyebrow">Legal &amp; Compliance</span>
        <h1>{{ i18n.t('pages.privacyTitle') }}</h1>
        <p class="lead">Last updated: 21 November 2026 &middot; Applies to keshavsingh.in and connected ecosystem services.</p>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
        <app-glance [items]="glance" />
        <h2>0. Your Choices at a Glance</h2>
        <p>
          Visit telemetry is sent only after you choose <strong>Accept all</strong> in the cookie banner. Choosing <strong>Essential only</strong> stops visit counting and asks Google AdSense for non-personalised ads. You can change this anytime from <em>Cookie settings</em> in the footer or on the <a routerLink="/cookie-policy">Cookie Policy</a> page.
        </p>
        <h2>1. Overview &amp; Scope</h2>
        <p>
          Your privacy matters. This website (<code>https://keshavsingh.in</code>) collects only the minimum data necessary to operate interactive calculators, deliver requested pages reliably, measure aggregated page traffic, and answer messages submitted voluntarily via the Contact page.
        </p>

        <h2>2. Information Collected</h2>
        <ul>
          <li><strong>Usage &amp; Telemetry Data:</strong> Non-invasive aggregated page view paths, browser locale, and referrer headers used strictly to keep ecosystem services healthy.</li>
          <li><strong>Voluntary Contact Submissions:</strong> Name, email address, topic selection, and message text when you submit the Contact form, encrypted at rest inside Admin storage.</li>
          <li><strong>Central SSO Accounts (Optional):</strong> Only visitors who opt into authenticated creator workspaces via <code>admin.keshavsingh.in</code> hold session tokens scoped to <code>.keshavsingh.in</code>.</li>
        </ul>

        <h2>3. Google AdSense &amp; Third-Party Advertising Cookies</h2>
        <p>
          Google, as a third-party vendor, uses cookies to serve ads on <code>keshavsingh.in</code>. Google’s use of advertising cookies enables it and its partners to serve ads to visitors based on their visits to this site and/or other websites across the Internet.
        </p>
        <ul>
          <li>Visitors may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
          <li>Alternatively, visitors can opt out of third-party vendor personalized advertising cookies by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a> or managing local preferences on our <a routerLink="/cookie-policy">Cookie Policy</a> page.</li>
        </ul>

        <h2>4. Mobile Applications (FamSphere — in.keshavsingh.famsphere)</h2>
        <p>If you use our mobile applications, such as <strong>FamSphere</strong>, we may request access to the following data only with your explicit OS permission:</p>
        <ul>
          <li><strong>Health &amp; Fitness Data:</strong> Physical activity sensors (such as pedometer / step counter) for local fitness tracking, distance calculation, and calorie estimates kept on-device or synced securely to your family circle.</li>
          <li><strong>Files &amp; Media:</strong> Selected images or documents for utilities such as Image-to-PDF conversion or profile photos.</li>
          <li><strong>Contacts &amp; Location:</strong> Optional family directory convenience and private family circle whereabouts sharing when explicitly toggled on by the user.</li>
        </ul>

        <h2>5. Data Retention, Deletion &amp; Contact</h2>
        <p>
          You may request deletion of any message submitted via our forms or review your consent settings at any time by writing to
          <a href="mailto:keshavsingh4522@gmail.com">keshavsingh4522&#64;gmail.com</a> or visiting the <a routerLink="/contact">Contact page</a>.
        </p>
      </div>
    </section>
  `,
})
export class PrivacyPolicyPageComponent {
  readonly i18n = inject(I18nHubService);
  readonly glance = PRIVACY_GLANCE;
}

@Component({
  selector: 'app-security-page',
  standalone: true,
  imports: [RouterLink, GlanceComponent],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>{{ i18n.t('nav.security') }}</span></div>
        <span class="eyebrow">Trust &amp; Safety</span>
        <h1>{{ i18n.t('pages.securityTitle') }}</h1>
        <p class="lead">How keshavsingh.in protects your account and data — and how to report a vulnerability.</p>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
        <app-glance [items]="glance" />

        <h2>How We Protect You</h2>
        <ul>
          <li><strong>One identity server.</strong> Sign-in for every app happens only at <code>id.keshavsingh.in</code> using OAuth2 JWTs and FIDO2 passkeys. Apps never see your password.</li>
          <li><strong>Short-lived tokens.</strong> Access tokens live in memory only; the rotating refresh token is an <code>HttpOnly</code>, <code>Secure</code> cookie that page scripts cannot read.</li>
          <li><strong>Encryption.</strong> All traffic uses HTTPS (TLS 1.2+). Contact messages and account records are encrypted at rest.</li>
          <li><strong>Least data.</strong> This hub needs no account. Calculators run entirely in your browser.</li>
        </ul>

        <h2>Report a Vulnerability</h2>
        <p>
          Found a security issue in any <code>*.keshavsingh.in</code> site or app? Please email
          <a href="mailto:keshavsingh4522@gmail.com?subject=Security%20report">keshavsingh4522&#64;gmail.com</a>
          with the subject <em>“Security report”</em>, steps to reproduce, and the affected URL. Machine-readable details are in
          <a href="/.well-known/security.txt">/.well-known/security.txt</a>.
        </p>
        <h3>Our Promise</h3>
        <ul>
          <li>We acknowledge reports and keep you updated until the issue is fixed.</li>
          <li>We will not pursue action against good-faith research that follows this policy.</li>
          <li>With your permission, we credit you once the fix ships.</li>
        </ul>
        <h3>Please Don’t</h3>
        <ul>
          <li>Access, change or delete other people’s data — use your own test accounts.</li>
          <li>Run denial-of-service, spam or social-engineering tests.</li>
          <li>Disclose the issue publicly before it is fixed.</li>
        </ul>

        <div class="callout">
          Privacy request instead? See the <a routerLink="/privacy-policy">Privacy Policy</a> or <a routerLink="/data-deletion">delete your data</a>.
        </div>
      </div>
    </section>
  `,
})
export class SecurityPageComponent {
  readonly i18n = inject(I18nHubService);
  readonly glance = SECURITY_GLANCE;
}

@Component({
  selector: 'app-terms-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>Terms &amp; Conditions</span></div>
        <span class="eyebrow">Legal &amp; Compliance</span>
        <h1>{{ i18n.t('pages.termsTitle') }}</h1>
        <p class="lead">Guidelines governing fair use of keshavsingh.in tools, guides, and connected web applications.</p>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
        <h2>1. Acceptable Use</h2>
        <p>Interactive calculators, documentation articles, and creator showcases on keshavsingh.in are provided for informational, educational, and productivity use. Automated scraping, abusive traffic bursts, or probing authenticated SSO endpoints is prohibited.</p>
        <h2>2. Intellectual Property</h2>
        <p>Original guides, editorial layouts, custom 3D animation series, and platform source branding belong to Keshav Singh unless explicitly licensed under an open-source repository license such as MIT on GitHub.</p>
        <h2>3. External Subdomains &amp; Third-Party Links</h2>
        <p>Links pointing to sibling platforms (e.g. studio, panchang, pratiyogita, portfolio) remain governed by shared ecosystem security rules; external third-party platforms (such as YouTube or GitHub) follow their respective terms of service.</p>
        <h2>4. No Warranty</h2>
        <p>All calculators and reference guides are supplied "as is" without express or implied guarantees of specific revenue, exam outcomes, or uptime.</p>
        <p><a routerLink="/contact">Contact us</a> with questions regarding permissions or licensing.</p>
      </div>
    </section>
  `,
})
export class TermsPageComponent {
  readonly i18n = inject(I18nHubService);
}

@Component({
  selector: 'app-cookie-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>Cookie Policy</span></div>
        <span class="eyebrow">Legal &amp; Compliance</span>
        <h1>{{ i18n.t('pages.cookiesTitle') }}</h1>
        <p class="lead">Transparent explanation of strictly functional preferences, analytics, and Google AdSense cookies.</p>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
        <h2>Categories Used</h2>
        <ul>
          <li><strong>Essential Preferences:</strong> Stores light/dark theme choice (<code>ks_hub_theme</code>) and your cookie consent choice (<code>ks_hub_consent</code>) locally in browser storage.</li>
          <li><strong>Analytics Telemetry (opt-in):</strong> Lightweight visit counters (page path and referrer, no identifiers) sent only after you choose <em>Accept all</em>.</li>
          <li><strong>Advertising (Google AdSense):</strong> Cookies used by Google to serve contextual or personalized ads safely when consent applies.</li>
        </ul>

        <div class="card">
          <h3>Manage Local Preference</h3>
          <p>Current stored consent status: <strong>{{ currentConsent() }}</strong></p>
          <div class="pill-bar">
            <button type="button" class="btn btn-primary btn-sm" (click)="setConsent('accepted')">Accept All</button>
            <button type="button" class="btn btn-outline btn-sm" (click)="setConsent('essential')">Essential Only</button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CookiePolicyPageComponent {
  readonly i18n = inject(I18nHubService);
  private readonly consent = inject(ConsentService);
  readonly currentConsent = computed(() => {
    const c = this.consent.choice();
    return c === 'accepted' ? 'Accepted (analytics + personalised ads)' : c === 'essential' ? 'Essential only' : 'Not set yet';
  });

  setConsent(val: ConsentChoice): void {
    this.consent.choose(val);
  }
}

@Component({
  selector: 'app-disclaimer-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">Home</a> / <span>Disclaimer</span></div>
        <span class="eyebrow">Legal &amp; Compliance</span>
        <h1>General &amp; Calculator Disclaimer</h1>
        <p class="lead">Important scope disclosures for financial estimators, calendar calculations, and technical tutorials.</p>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
        <h2>Creator Revenue &amp; Capacity Estimates</h2>
        <p>Outputs from the YouTube RPM Estimator and Microservices Capacity Planner are mathematical simulations for planning only. Real-world ad payouts and cloud infrastructure bills fluctuate based on geography, seasonal budgets, network hops, and vendor pricing.</p>
        <h2>Vedic Calendar &amp; Astronomical Notice</h2>
        <p>Vedic Muhurat and Kaal windows depend closely on exact geographic coordinates and observational traditions. Consult local planetary longitude views on <a href="https://panchang.keshavsingh.in" target="_blank" rel="noopener noreferrer">panchang.keshavsingh.in</a> and regional priests for religious ceremonies.</p>
        <h2>External Links Policy Compliance</h2>
        <p>Every outbound link shared inside keshavsingh.in and our companion YouTube descriptions is reviewed to ensure no malware, deceptive redirects, or unauthorized copyright distribution exist.</p>
      </div>
    </section>
  `,
})
export class DisclaimerPageComponent {
  readonly i18n = inject(I18nHubService);
}

@Component({
  selector: 'app-sitemap-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>Sitemap</span></div>
        <span class="eyebrow">Directory</span>
        <h1>{{ i18n.t('pages.sitemapTitle') }}</h1>
        <p class="lead">Every public tool, ecosystem application guide, article, and policy route hosted on keshavsingh.in.</p>
      </div>
    </section>

    <section class="section">
      <div class="container grid-2">
        <div class="card">
          <h2>Primary Hub Sections</h2>
          <ul>
            <li><a routerLink="/">Home Overview</a></li>
            <li><a routerLink="/apps">All 8 Ecosystem Platforms &amp; Apps</a></li>
            <li><a routerLink="/tools">Interactive Tools Hub</a></li>
            <li><a routerLink="/creators">Creator Channels &amp; Video Series</a></li>
            <li><a routerLink="/guides">Original Engineering &amp; Creator Guides</a></li>
            <li><a routerLink="/plans">Plans &amp; Membership Tiers</a></li>
            <li><a routerLink="/roadmap">2026–2027 Public Roadmap</a></li>
            <li><a routerLink="/interact">How to Interact</a></li>
            <li><a routerLink="/about">About &amp; Editorial Standards</a></li>
            <li><a routerLink="/contact">Contact Support</a></li>
          </ul>

          <h2>Legal &amp; Compliance</h2>
          <ul>
            <li><a routerLink="/privacy-policy">Privacy Policy (AdSense + FamSphere)</a></li>
            <li><a routerLink="/terms">Terms &amp; Conditions</a></li>
            <li><a routerLink="/cookie-policy">Cookie Policy</a></li>
            <li><a routerLink="/disclaimer">Disclaimer</a></li>
            <li><a routerLink="/security">Security &amp; Responsible Disclosure</a></li>
            <li><a routerLink="/data-deletion">Account &amp; Data Deletion</a></li>
          </ul>
        </div>

        <div class="card">
          <h2>Interactive Calculators</h2>
          <ul>
            @for (t of tools; track t.slug) {
              <li><a [routerLink]="['/tools', t.slug]">{{ t.title }}</a></li>
            }
          </ul>

          <h2>Platform Guides</h2>
          <ul>
            @for (a of apps; track a.slug) {
              <li><a [routerLink]="['/apps', a.slug]">{{ a.name }}</a></li>
            }
          </ul>

          <h2>Technical &amp; Creator Articles</h2>
          <ul>
            @for (g of guides; track g.slug) {
              <li><a [routerLink]="['/guides', g.slug]">{{ g.title }}</a></li>
            }
          </ul>
          <h2>Legacy &amp; Convenience Shortcuts</h2>
          <ul>
            <li><a routerLink="/privacy">/privacy</a> (FamSphere Google Play URL &rarr; Privacy Policy)</li>
            <li><a routerLink="/resume">/resume</a> (Portfolio CV bridge &rarr; portfolio.keshavsingh.in)</li>
            <li><a routerLink="/data-deletion">/data-deletion</a> (Account &amp; Data Deletion Guide)</li>
            <li><a routerLink="/robots">/robots</a> (Crawler Directives Overview)</li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class SitemapPageComponent {
  readonly i18n = inject(I18nHubService);
  readonly tools = HUB_TOOLS;
  readonly apps = ECOSYSTEM_APPS;
  readonly guides = GUIDE_CARDS;
}

@Component({
  selector: 'app-robots-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>Robots Directives</span></div>
        <span class="eyebrow">Crawler Access</span>
        <h1>Robots.txt Directives</h1>
        <p class="lead">Human-readable overview of crawler permissions matching /robots.txt for keshavsingh.in.</p>
      </div>
    </section>
    <section class="section">
      <div class="container prose card">
        <pre class="mono">User-agent: *
Allow: /

Sitemap: https://keshavsingh.in/sitemap.xml</pre>
        <p>All public calculators, guides, ecosystem walkthroughs, and policy documents are open to search indexing. See the full <a routerLink="/sitemap">HTML Sitemap</a> or raw <a href="/sitemap.xml">sitemap.xml</a>.</p>
      </div>
    </section>
  `,
})
export class RobotsPageComponent {
  readonly i18n = inject(I18nHubService);
}

@Component({
  selector: 'app-data-deletion-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <a routerLink="/privacy-policy">Privacy</a> / <span>Data Deletion</span></div>
        <span class="eyebrow">Privacy Rights</span>
        <h1>Account &amp; Data Deletion Instructions</h1>
        <p class="lead">How to delete Central SSO profile records, FamSphere mobile data, or submitted Contact messages.</p>
      </div>
    </section>
    <section class="section">
      <div class="container prose">
        <h2>1. Ecosystem Accounts (id.keshavsingh.in / admin.keshavsingh.in)</h2>
        <p>Authenticated users can review connected sessions, revoke passkeys, disconnect YouTube OAuth tokens inside AnimStudio Settings, or submit an account deletion ticket directly in the central Admin dashboard.</p>
        <h2>2. FamSphere Mobile App &amp; Contact Messages</h2>
        <p>Uninstalling FamSphere removes local on-device caches immediately. To purge any stored family circle records or contact form inquiries encrypted on our server, write to <a href="mailto:keshavsingh4522@gmail.com">keshavsingh4522&#64;gmail.com</a> or use our <a routerLink="/contact">Contact Form</a> selecting "Privacy / Data Deletion Request".</p>
      </div>
    </section>
  `,
})
export class DataDeletionPageComponent {
  readonly i18n = inject(I18nHubService);
}

@Component({
  selector: 'app-resume-bridge-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>Engineering Resume</span></div>
        <span class="eyebrow">Dedicated Portfolio Subdomain</span>
        <h1>{{ i18n.t('pages.resumeTitle') }}</h1>
        <p class="lead">Keshav’s personal software career timeline, .NET / Azure / AWS skills, GitHub repositories, and printable PDF CV now live cleanly on portfolio.keshavsingh.in.</p>
      </div>
    </section>
    <section class="section">
      <div class="container prose card">
        <h2>Why This Moved to portfolio.keshavsingh.in</h2>
        <p>We separated Keshav Singh’s personal hiring CV from the main keshavsingh.in domain so recruiters enjoy a focused distraction-free experience while keshavsingh.in hosts interactive browser calculators, creator studios, and original engineering guides.</p>
        <div class="pill-bar" style="margin-top: 1rem;">
          <a href="https://portfolio.keshavsingh.in/resume" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Open Full Resume &amp; PDF CV &#8599;</a>
          <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Open portfolio.keshavsingh.in &#8599;</a>
          <a routerLink="/" class="btn btn-outline">Explore Ecosystem Hub</a>
        </div>
      </div>
    </section>
  `,
})
export class ResumeBridgePageComponent {
  readonly i18n = inject(I18nHubService);
}

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <section class="section">
      <div class="container nf">
        <span class="nf-code gradient-text">404</span>
        <h1>This page wandered off</h1>
        <p class="lead">Try one of these instead — or press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search.</p>
        <div class="cta-row nf-actions">
          <a routerLink="/" class="btn btn-primary"><app-icon name="arrow" [size]="16" /> Home</a>
          <a routerLink="/apps" class="btn btn-outline"><app-icon name="sparkles" [size]="16" /> Apps</a>
          <a routerLink="/tools" class="btn btn-outline"><app-icon name="calculator" [size]="16" /> Tools</a>
          <a routerLink="/sitemap" class="btn btn-outline"><app-icon name="globe" [size]="16" /> Sitemap</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .nf { text-align: center; display: grid; justify-items: center; gap: 0.5rem; padding-block: clamp(1rem, 6vw, 3rem); }
    .nf-code { font-size: clamp(4.5rem, 16vw, 8rem); font-weight: 800; line-height: 1; letter-spacing: -0.05em; }
    .nf h1 { margin: 0; font-size: var(--fs-h1); }
    .nf-actions { justify-content: center; margin-top: 1rem; }
    kbd { font-family: inherit; font-size: 0.8em; padding: 0.1rem 0.4rem; border: 1px solid var(--border); border-radius: 6px; }
  `,
})
export class NotFoundPageComponent {}
