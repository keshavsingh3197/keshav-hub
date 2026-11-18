import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ECOSYSTEM_APPS } from '../../data/apps.catalog';
import { CREATOR_CHANNELS, MEMBERSHIP_PLANS, ROADMAP_MILESTONES } from '../../data/creators-plans.catalog';
import { ENGINEERING_GUIDES } from '../../data/guides.catalog';
import { HUB_TOOLS } from '../../data/creators-plans.catalog';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero-wrap">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">keshavsingh.in &middot; Ecosystem &amp; Creator Hub</span>
          <h1>Interactive Web Tools, Creator Studios &amp; Original Engineering Guides</h1>
          <p class="lead">
            Welcome to the central hub for all digital platforms, animation series, Vedic utilities, and software guides
            built by Keshav Singh. Use browser calculators with zero sign-in, read deep technical playbooks, explore
            every connected web app, or connect on live creator events.
          </p>
          <div class="cta-row">
            <a routerLink="/tools" class="btn btn-primary">Try Interactive Tools</a>
            <a routerLink="/apps" class="btn btn-outline">Explore All 8 Apps</a>
            <a routerLink="/creators" class="btn btn-outline">Watch Creator Series</a>
          </div>
          <p class="sub-note">
            Looking specifically for my engineering CV and work history? Visit the dedicated
            <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer">portfolio.keshavsingh.in</a>.
          </p>
        </div>

        <aside class="card metrics-panel" aria-label="Ecosystem Snapshot">
          <h2>What Exists Across keshavsingh.in</h2>
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
              <strong>3 Creator Channels</strong>
              <span>&#64;keshavsinghworld (Tech), &#64;OmkarShivBhakti (Katha/Culture) &amp; &#64;KESHAV-ANIM-FF (3D Comedy).</span>
            </li>
            <li>
              <strong>Single Identity SSO</strong>
              <span>Passkey &amp; JWT login on <a href="https://admin.keshavsingh.in" target="_blank" rel="noopener noreferrer">admin.keshavsingh.in</a> powers approved workspaces.</span>
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">Original Web Utilities</span>
            <h2>Interactive Tools Built for Creators &amp; Engineers</h2>
            <p class="muted">Run instant client-side calculations alongside step-by-step formulas and policy notes.</p>
          </div>
          <a routerLink="/tools" class="btn btn-outline btn-sm">Open All Tools</a>
        </div>

        <div class="grid-2">
          @for (tool of tools; track tool.slug) {
            <article class="card card-interactive tool-card">
              <span class="badge badge-accent">{{ tool.badge }}</span>
              <h3><a [routerLink]="['/tools', tool.slug]">{{ tool.title }}</a></h3>
              <p class="muted">{{ tool.shortDesc }}</p>
              <a [routerLink]="['/tools', tool.slug]" class="card-link">Launch calculator &amp; guide &rarr;</a>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section alt-band">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">All Websites &amp; Mobile Apps</span>
            <h2>What Visitors Can Do Across Every Platform</h2>
            <p class="muted">Each product below runs independently on its specialized subdomain while sharing documentation and support here.</p>
          </div>
          <a routerLink="/apps" class="btn btn-outline btn-sm">Compare All Platforms</a>
        </div>

        <div class="grid-4">
          @for (app of apps; track app.slug) {
            <article class="card card-interactive app-mini">
              <span class="badge">{{ app.badge }}</span>
              <h3><a [routerLink]="['/apps', app.slug]">{{ app.name }}</a></h3>
              <p class="muted small-copy">{{ app.shortTagline }}</p>
              <div class="mini-actions">
                <a [routerLink]="['/apps', app.slug]">Read guide</a>
                @if (app.url.startsWith('http')) {
                  <a [href]="app.url" target="_blank" rel="noopener noreferrer">Open app &#8599;</a>
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
            <span class="eyebrow">Creator &amp; Storytelling Studios</span>
            <h2>Original Video Channels &amp; Animated Series</h2>
            <p class="muted">Weekly engineering walkthroughs, daily Panchang &amp; Katha features, and 3D cartoon comedy shorts.</p>
          </div>
          <a routerLink="/creators" class="btn btn-outline btn-sm">Explore Creator Hub</a>
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
              <a [href]="ch.url" target="_blank" rel="noopener noreferrer" class="card-link">Visit Channel on YouTube &#8599;</a>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section alt-band">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">Original Long-Form Library</span>
            <h2>Latest Architecture &amp; Creator Guides</h2>
            <p class="muted">Practical engineering deep dives written from production codebases and channel operations.</p>
          </div>
          <a routerLink="/guides" class="btn btn-outline btn-sm">Browse All {{ guides.length }} Guides</a>
        </div>

        <div class="grid-3">
          @for (guide of guides; track guide.slug) {
            <article class="card card-interactive">
              <div class="guide-meta-top">
                <span class="badge">{{ guide.category }}</span>
                <span class="muted tiny">{{ guide.readMinutes }} min read</span>
              </div>
              <h3><a [routerLink]="['/guides', guide.slug]">{{ guide.title }}</a></h3>
              <p class="muted small-copy">{{ guide.summary }}</p>
              <a [routerLink]="['/guides', guide.slug]" class="card-link">Read full guide &rarr;</a>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">Plans, Membership &amp; Collaboration</span>
            <h2>How to Participate, Subscribe &amp; Shape New Features</h2>
            <p class="muted">Free community access for every visitor, plus SSO member accounts and transparent sponsorship paths.</p>
          </div>
          <div class="cta-row-sm">
            <a routerLink="/plans" class="btn btn-primary btn-sm">View Plans</a>
            <a routerLink="/roadmap" class="btn btn-outline btn-sm">2026–2027 Roadmap</a>
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
          <a routerLink="/interact" class="btn btn-outline btn-sm">How to Interact</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero-wrap { padding-block: 3.25rem; background: var(--surface); border-bottom: 1px solid var(--border-soft); }
    .hero-grid { display: grid; grid-template-columns: 1.35fr 1fr; gap: 2rem; align-items: start; }
    .hero-copy h1 { margin: 0.75rem 0 0.85rem; font-size: clamp(1.9rem, 3.6vw, 2.75rem); line-height: 1.15; letter-spacing: -0.025em; }
    .cta-row { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.4rem; }
    .cta-row-sm { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .sub-note { margin-top: 1rem; font-size: 0.9rem; color: var(--text-subtle); }
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
    @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; } }
  `,
})
export class HomePageComponent {
  readonly apps = ECOSYSTEM_APPS;
  readonly tools = HUB_TOOLS;
  readonly channels = CREATOR_CHANNELS;
  readonly guides = ENGINEERING_GUIDES;
  readonly plans = MEMBERSHIP_PLANS;
  readonly roadmap = ROADMAP_MILESTONES;
}
