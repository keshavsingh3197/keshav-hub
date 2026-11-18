import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ECOSYSTEM_APPS } from '../../data/apps.catalog';
import { ENGINEERING_GUIDES } from '../../data/guides.catalog';
import { HUB_TOOLS } from '../../data/creators-plans.catalog';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">Home</a> / <span>Privacy Policy</span></div>
        <span class="eyebrow">Legal &amp; Compliance</span>
        <h1>Privacy Policy</h1>
        <p class="lead">Effective / Last Updated: 18 November 2026 &middot; Applies to keshavsingh.in and connected ecosystem services.</p>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
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
export class PrivacyPolicyPageComponent {}

@Component({
  selector: 'app-terms-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">Home</a> / <span>Terms &amp; Conditions</span></div>
        <span class="eyebrow">Legal &amp; Compliance</span>
        <h1>Terms &amp; Conditions</h1>
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
export class TermsPageComponent {}

@Component({
  selector: 'app-cookie-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">Home</a> / <span>Cookie Policy</span></div>
        <span class="eyebrow">Legal &amp; Compliance</span>
        <h1>Cookie Policy &amp; Preferences</h1>
        <p class="lead">Transparent explanation of strictly functional preferences, analytics, and Google AdSense cookies.</p>
      </div>
    </section>

    <section class="section">
      <div class="container prose">
        <h2>Categories Used</h2>
        <ul>
          <li><strong>Essential Preferences:</strong> Stores light/dark theme choice (<code>ks_hub_theme</code>) and your cookie consent choice (<code>ks_hub_consent</code>) locally in browser storage.</li>
          <li><strong>Analytics Telemetry:</strong> Lightweight visit counters measuring which ecosystem guides and tools help visitors most.</li>
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
  readonly currentConsent = signal(this.readConsent());

  private readConsent(): string {
    if (typeof localStorage === 'undefined') return 'Not set yet';
    return localStorage.getItem('ks_hub_consent') ?? 'Not set yet';
  }

  setConsent(val: 'accepted' | 'essential'): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ks_hub_consent', val);
      this.currentConsent.set(val);
    }
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
export class DisclaimerPageComponent {}

@Component({
  selector: 'app-sitemap-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">Home</a> / <span>Sitemap</span></div>
        <span class="eyebrow">Directory</span>
        <h1>Complete Site Index</h1>
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
        </div>
      </div>
    </section>
  `,
})
export class SitemapPageComponent {
  readonly tools = HUB_TOOLS;
  readonly apps = ECOSYSTEM_APPS;
  readonly guides = ENGINEERING_GUIDES;
}

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section">
      <div class="container card">
        <span class="eyebrow">404</span>
        <h1>Page Not Found</h1>
        <p>The requested URL does not match any active route on keshavsingh.in. Jump back into our tools or app directory below.</p>
        <div class="pill-bar">
          <a routerLink="/" class="btn btn-primary btn-sm">Go Home</a>
          <a routerLink="/tools" class="btn btn-outline btn-sm">Open Tools</a>
          <a routerLink="/apps" class="btn btn-outline btn-sm">Explore Apps</a>
          <a routerLink="/sitemap" class="btn btn-outline btn-sm">Full Sitemap</a>
        </div>
      </div>
    </section>
  `,
})
export class NotFoundPageComponent {}
