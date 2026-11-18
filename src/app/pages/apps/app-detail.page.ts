import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ECOSYSTEM_APPS } from '../../data/apps.catalog';
import { SeoHubService } from '../../services/seo-hub.service';

@Component({
  selector: 'app-app-detail-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (app(); as item) {
      <section class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a routerLink="/">Home</a> / <a routerLink="/apps">Apps</a> / <span>{{ item.name }}</span>
          </div>
          <span class="eyebrow">{{ item.category }} &middot; {{ item.badge }}</span>
          <h1>{{ item.name }}</h1>
          <p class="lead">{{ item.shortTagline }}</p>
          <div class="header-actions">
            @if (item.url.startsWith('http')) {
              <a [href]="item.url" target="_blank" rel="noopener noreferrer" class="btn btn-primary">{{ item.ctaLabel }} &#8599;</a>
            }
            <a routerLink="/apps" class="btn btn-outline">Browse All Ecosystem Apps</a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container prose">
          <h2>Overview &amp; Purpose</h2>
          <p>{{ item.summary }}</p>
          <p><strong>Designed For:</strong> {{ item.whoItIsFor }}</p>

          <h2>What You Can Do Inside {{ item.name }}</h2>
          <ul>
            @for (cap of item.capabilities; track cap) {
              <li>{{ cap }}</li>
            }
          </ul>

          <h2>Step-by-Step Visitor &amp; Creator Workflows</h2>
          <div class="grid-3">
            @for (wf of item.workflows; track wf.title) {
              <article class="card">
                <h3>{{ wf.title }}</h3>
                <p>{{ wf.detail }}</p>
              </article>
            }
          </div>

          <h2>Architecture &amp; Technical Stack</h2>
          <div class="pill-bar">
            @for (tech of item.architectureStack; track tech) {
              <span class="badge badge-accent">{{ tech }}</span>
            }
          </div>

          <h2>Privacy, Safety &amp; Policy Guarantees</h2>
          <div class="callout">{{ item.privacyAndTrust }}</div>

          <h2>Frequently Asked Questions</h2>
          @for (faq of item.faqs; track faq.question) {
            <div class="card faq-card">
              <h3>{{ faq.question }}</h3>
              <p>{{ faq.answer }}</p>
            </div>
          }

          <div class="next-links">
            <a routerLink="/tools" class="btn btn-outline btn-sm">Explore Interactive Tools</a>
            <a routerLink="/guides" class="btn btn-outline btn-sm">Read Technical Guides</a>
            <a routerLink="/contact" class="btn btn-outline btn-sm">Send Feedback</a>
          </div>
        </div>
      </section>
    } @else {
      <section class="section">
        <div class="container card">
          <h1>Platform Guide Not Found</h1>
          <p>The requested application overview does not exist. Explore all live websites and utilities in our directory.</p>
          <a routerLink="/apps" class="btn btn-primary">View All Apps</a>
        </div>
      </section>
    }
  `,
  styles: `
    .header-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.25rem; }
    .faq-card { margin-bottom: 0.85rem; }
    .faq-card h3 { margin-top: 0; }
    .next-links { display: flex; flex-wrap: wrap; gap: 0.65rem; margin-top: 2rem; }
  `,
})
export class AppDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoHubService);

  readonly app = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    return ECOSYSTEM_APPS.find((a) => a.slug === slug) ?? null;
  });

  ngOnInit(): void {
    const item = this.app();
    if (item) {
      this.seo.update({
        title: `${item.name} — Features, Workflows & Guide | keshavsingh.in`,
        description: item.shortTagline,
        path: `/apps/${item.slug}`,
      });
    }
  }
}
