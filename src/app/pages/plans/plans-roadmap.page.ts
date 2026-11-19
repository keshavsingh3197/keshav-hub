import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MEMBERSHIP_PLANS, ROADMAP_MILESTONES } from '../../data/creators-plans.catalog';
import { I18nHubService } from '../../services/i18n-hub.service';

@Component({
  selector: 'app-plans-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>{{ i18n.t('nav.plans') }}</span></div>
        <span class="eyebrow">{{ i18n.t('sections.plansEyebrow') }}</span>
        <h1>{{ i18n.t('pages.plansTitle') }}</h1>
        <p class="lead">
          All public tools, guides, Vedic calendars, and open-source notes remain free forever. Verified SSO memberships unlock saved multi-app workspaces, creator collaboration, and transparent tournament patronage.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid-3 plans-grid">
          @for (plan of plans; track plan.id) {
            <article class="card plan-card" [class.featured]="plan.highlighted">
              <span class="badge badge-accent">{{ plan.badge }}</span>
              <h2>{{ plan.name }}</h2>
              <p class="price">{{ plan.priceLabel }}</p>
              <p class="small"><strong>Ideal for:</strong> {{ plan.targetAudience }}</p>
              <p class="muted">{{ plan.description }}</p>
              <ul class="feat-list">
                @for (f of plan.features; track f) {
                  <li>{{ f }}</li>
                }
              </ul>
              <a [routerLink]="plan.ctaTarget" class="btn btn-primary btn-sm">{{ plan.ctaLabel }}</a>
            </article>
          }
        </div>

        <div class="prose">
          <h2>How Membership &amp; Single Sign-On Work Together</h2>
          <p>
            Unlike closed platforms that force separate paid subscriptions inside every sub-tool, membership across
            <code>*.keshavsingh.in</code> centers on a single verified account managed via
            <a href="https://admin.keshavsingh.in" target="_blank" rel="noopener noreferrer">admin.keshavsingh.in</a>.
            Because every resource server verifies the same central identity token, once an account request is reviewed, you keep access across AnimStudio AI workspaces, Social Analytics benchmarks, Content Blog discussions, and Pratiyogita coordination.
          </p>
          <p>
            Ready to request an approved creator workspace, discuss a sponsored competition, or collaborate on video tools? Submit a direct request through our
            <a routerLink="/contact" [queryParams]="{ topic: 'membership' }">Contact &amp; Membership Inquiry</a> page or explore the
            <a routerLink="/roadmap">2026–2027 Product Roadmap</a>.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .plans-grid { margin-bottom: 2.5rem; align-items: stretch; }
    .plan-card { display: flex; flex-direction: column; }
    .plan-card.featured { border-color: var(--primary); border-width: 2px; }
    .plan-card h2 { margin: 0.65rem 0 0.25rem; font-size: 1.35rem; }
    .price { font-size: 1.25rem; font-weight: 800; color: var(--primary); margin: 0.25rem 0 0.65rem; }
    .small { font-size: 0.88rem; margin: 0 0 0.5rem; }
    .muted { color: var(--text-muted); font-size: 0.94rem; }
    .feat-list { padding-left: 1.2rem; color: var(--text-muted); font-size: 0.9rem; flex: 1; margin-bottom: 1.25rem; }
  `,
})
export class PlansPageComponent {
  readonly i18n = inject(I18nHubService);
  readonly plans = MEMBERSHIP_PLANS;
}

@Component({
  selector: 'app-roadmap-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <a routerLink="/plans">{{ i18n.t('nav.plans') }}</a> / <span>Roadmap</span></div>
        <span class="eyebrow">Public Product Roadmap</span>
        <h1>{{ i18n.t('pages.roadmapTitle') }}</h1>
        <p class="lead">
          Transparent engineering and creator schedule covering keshavsingh.in utilities, AnimStudio AI 3D pipelines, bilingual channel launches, and community tournaments.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid-2">
          @for (m of milestones; track m.quarter) {
            <article class="card">
              <div class="meta">
                <span class="badge">{{ m.quarter }}</span>
                <span class="badge"
                  [class.badge-success]="m.status === 'Shipped'"
                  [class.badge-accent]="m.status === 'In Progress'"
                  [class.badge-warn]="m.status === 'Planned'">
                  {{ m.status }}
                </span>
                <span class="badge">{{ m.area }}</span>
              </div>
              <h2>{{ m.title }}</h2>
              <p class="muted">{{ m.details }}</p>
            </article>
          }
        </div>
        <div class="callout suggest-box">
          <div>
            <strong>Have a feature request or bug report?</strong>
            Suggest new Panchang calculators, 3D comedy archetypes, or Pratiyogita school tools directly via our feedback channel.
          </div>
          <a routerLink="/contact" class="btn btn-primary btn-sm">Suggest a Feature</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .meta { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.65rem; }
    h2 { margin: 0 0 0.45rem; font-size: 1.2rem; }
    .muted { color: var(--text-muted); margin: 0; }
    .suggest-box { margin-top: 2rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
  `,
})
export class RoadmapPageComponent {
  readonly i18n = inject(I18nHubService);
  readonly milestones = ROADMAP_MILESTONES;
}

@Component({
  selector: 'app-interact-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>Interact</span></div>
        <span class="eyebrow">Community &amp; Collaboration</span>
        <h1>{{ i18n.t('pages.interactTitle') }}</h1>
        <p class="lead">
          Every way to engage with Keshav Singh and sibling platforms safely—from live quiz participation and commented technical notes to direct messages and open-source PRs.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid-3">
          <article class="card">
            <span class="badge badge-accent">Live Community</span>
            <h2>YouTube Livestream Quizzes</h2>
            <p class="muted">Join live events on &#64;keshavsinghworld, &#64;OmkarShivBhakti, or &#64;KESHAV-ANIM-FF and verify quiz claims safely on Pratiyogita without exposing private tokens.</p>
            <a href="https://pratiyogita.keshavsingh.in/winners" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Visit Quiz Winners &#8599;</a>
          </article>

          <article class="card">
            <span class="badge badge-accent">Technical Discussion</span>
            <h2>Blog Comments &amp; Code Reviews</h2>
            <p class="muted">Read C#/.NET, AWS, Azure, SQL, and Docker chapters on Content Blog and join moderated SSO comment threads with fellow backend developers.</p>
            <a href="https://blog.keshavsingh.in" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Open Tech Blog &#8599;</a>
          </article>

          <article class="card">
            <span class="badge badge-accent">Direct Inquiry</span>
            <h2>Creator Membership &amp; Collaborations</h2>
            <p class="muted">Send partnership inquiries, request approved SSO studio access, or share feedback directly to our central Admin inbox.</p>
            <a routerLink="/contact" class="btn btn-primary btn-sm">Message Directly &rarr;</a>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: `
    h2 { margin: 0.65rem 0 0.45rem; font-size: 1.2rem; }
    .muted { color: var(--text-muted); margin-bottom: 1.15rem; }
  `,
})
export class InteractPageComponent {
  readonly i18n = inject(I18nHubService);
}
