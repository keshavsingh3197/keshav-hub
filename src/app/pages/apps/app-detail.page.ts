import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ECOSYSTEM_APPS } from '../../data/apps.catalog';
import { I18nHubService } from '../../services/i18n-hub.service';
import { SeoHubService } from '../../services/seo-hub.service';
import { appSchema } from '../../services/structured-data';

@Component({
  selector: 'app-app-detail-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (app(); as item) {
      <section class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a routerLink="/">{{ i18n.t('nav.home') }}</a> / <a routerLink="/apps">{{ i18n.t('nav.apps') }}</a> /
            <span>{{ i18n.t('items.apps.' + item.slug + '.name', item.name) }}</span>
          </div>
          <span class="eyebrow">{{ item.category }} &middot; Architecture Case Study</span>
          <h1>{{ i18n.t('items.apps.' + item.slug + '.name', item.name) }} — System Architecture &amp; Product Guide</h1>
          <p class="lead">{{ i18n.t('items.apps.' + item.slug + '.shortTagline', item.shortTagline) }}</p>
          <div class="header-actions">
            <a [routerLink]="['/guides', item.relatedGuideSlug]" class="btn btn-primary">Read Engineering Deep-Dive</a>
            <a [routerLink]="['/tools', item.relatedToolSlug]" class="btn btn-outline">Try Companion Calculator</a>
            @if (item.url.startsWith('http')) {
              <a [href]="item.url" target="_blank" rel="noopener noreferrer" class="btn btn-outline">{{ item.ctaLabel }} &#8599;</a>
            }
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container prose">
          <h2>1. Problem Statement &amp; Product Purpose</h2>
          <p>{{ item.summary }}</p>
          <p><strong>Primary Audience:</strong> {{ item.whoItIsFor }}</p>

          <h2>2. System Architecture &amp; Engineering Design</h2>
          <div class="pill-bar" style="margin-bottom: 1rem;">
            @for (tech of item.architectureStack; track tech) {
              <span class="badge badge-accent">{{ tech }}</span>
            }
          </div>
          <ul>
            @for (note of item.systemArchitectureNotes; track note) {
              <li>{{ note }}</li>
            }
          </ul>

          <h2>3. Core Capabilities &amp; Functional Modules</h2>
          <ul>
            @for (cap of item.capabilities; track cap) {
              <li>{{ cap }}</li>
            }
          </ul>

          <h2>4. End-to-End User &amp; Creator Workflows</h2>
          <div class="grid-3">
            @for (wf of item.workflows; track wf.title) {
              <article class="card">
                <h3>{{ wf.title }}</h3>
                <p>{{ wf.detail }}</p>
              </article>
            }
          </div>

          <h2>5. Data Governance, Security &amp; Privacy Boundaries</h2>
          <ul>
            @for (sec of item.dataAndSecurityModel; track sec) {
              <li>{{ sec }}</li>
            }
          </ul>
          <div class="callout">{{ item.privacyAndTrust }}</div>

          <h2>6. Frequently Asked Questions</h2>
          @for (faq of item.faqs; track faq.question) {
            <div class="card faq-card">
              <h3>{{ faq.question }}</h3>
              <p>{{ faq.answer }}</p>
            </div>
          }

          <div class="next-links">
            <a [routerLink]="['/guides', item.relatedGuideSlug]" class="btn btn-primary btn-sm">Read Full Technical Guide</a>
            <a [routerLink]="['/tools', item.relatedToolSlug]" class="btn btn-outline btn-sm">Open Companion Calculator</a>
            <a routerLink="/apps" class="btn btn-outline btn-sm">All 8 Case Studies</a>
          </div>
        </div>
      </section>
    } @else {
      <section class="section">
        <div class="container card">
          <h1>Platform Case Study Not Found</h1>
          <p>The requested application overview does not exist. Explore all eight ecosystem case studies in our directory.</p>
          <a routerLink="/apps" class="btn btn-primary">View All Case Studies</a>
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
  readonly i18n = inject(I18nHubService);
  readonly currentSlug = signal('');

  readonly app = computed(() => {
    const slug = this.currentSlug();
    return ECOSYSTEM_APPS.find((a) => a.slug === slug) ?? null;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentSlug.set(params.get('slug') ?? '');
      const item = this.app();
      if (item) {
        this.seo.update({
          title: `${item.name} — Architecture Case Study & Guide | keshavsingh.in`,
          description: item.shortTagline,
          path: `/apps/${item.slug}`,
          crumbName: item.name,
          schema: appSchema(item),
        });
      }
    });
  }
}
