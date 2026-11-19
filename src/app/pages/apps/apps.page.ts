import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ECOSYSTEM_APPS, EcosystemAppDetail } from '../../data/apps.catalog';
import { I18nHubService } from '../../services/i18n-hub.service';

type CategoryFilter = 'All' | EcosystemAppDetail['category'];

@Component({
  selector: 'app-apps-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home', 'Home') }}</a> / <span>{{ i18n.t('nav.apps', 'Apps') }}</span></div>
        <span class="eyebrow">{{ i18n.t('sections.appsEyebrow') }}</span>
        <h1>{{ i18n.t('pages.appsTitle') }}</h1>
        <p class="lead">{{ i18n.t('pages.appsLead') }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="controls-bar card">
          <div class="pill-bar" role="group" aria-label="Filter apps by category">
            @for (cat of categories; track cat) {
              <button type="button" class="pill-btn" [class.active]="selectedCategory() === cat" (click)="selectedCategory.set(cat)">
                {{ cat }}
              </button>
            }
          </div>
          <div class="search-box">
            <label for="app-filter-q" class="visually-hidden">Search platforms</label>
            <input
              id="app-filter-q"
              type="search"
              class="input"
              placeholder="Search capabilities, .NET, Panchang, video, quiz..."
              [ngModel]="query()"
              (ngModelChange)="query.set($event)" />
          </div>
        </div>

        <div class="grid-2 apps-list">
          @for (app of filteredApps(); track app.slug) {
            <article class="card app-card">
              <div class="app-top">
                <span class="badge badge-accent">{{ app.category }}</span>
                <span class="badge">{{ app.badge }}</span>
              </div>
              <h2><a [routerLink]="['/apps', app.slug]">{{ app.name }}</a></h2>
              <p class="muted">{{ app.summary }}</p>
              <h3>Key Capabilities</h3>
              <ul class="cap-list">
                @for (cap of app.capabilities.slice(0, 3); track cap) {
                  <li>{{ cap }}</li>
                }
              </ul>
              <div class="stack-row">
                @for (tech of app.architectureStack.slice(0, 3); track tech) {
                  <span class="badge">{{ tech }}</span>
                }
              </div>
              <div class="app-actions">
                <a [routerLink]="['/apps', app.slug]" class="btn btn-primary btn-sm">Full Walkthrough &amp; FAQ</a>
                @if (app.url.startsWith('http')) {
                  <a [href]="app.url" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">{{ app.ctaLabel }} &#8599;</a>
                }
              </div>
            </article>
          } @empty {
            <div class="card">
              <h3>No matching applications</h3>
              <p>Try resetting filters to browse all eight ecosystem platforms.</p>
              <button type="button" class="btn btn-outline btn-sm" (click)="selectedCategory.set('All'); query.set('')">Reset Filters</button>
            </div>
          }
        </div>

        <div class="section-tight prose">
          <h2>How the Ecosystem Shares Configuration Safely</h2>
          <p>
            Rather than copying static menu arrays across eight separate frontends, every sibling subdomain fetches public branding, active destinations, and localization strings from a central registry API hosted at
            <code>id.keshavsingh.in</code>. Administrative edits in the SSO console propagate cleanly across AnimStudio AI, Hindu Panchang, Pratiyogita, SocialPulse Analytics, Content Blog, and Portfolio without requiring emergency rebuilds.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .controls-bar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .search-box { min-width: 260px; flex: 0 1 340px; }
    .apps-list { margin-bottom: 2rem; }
    .app-card h2 { margin: 0.65rem 0 0.45rem; font-size: 1.3rem; }
    .app-card h3 { font-size: 0.95rem; margin: 1rem 0 0.45rem; }
    .app-top { display: flex; flex-wrap: wrap; gap: 0.45rem; }
    .muted { color: var(--text-muted); margin: 0; }
    .cap-list { margin: 0 0 1rem; padding-left: 1.2rem; color: var(--text-muted); font-size: 0.92rem; }
    .stack-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
    .app-actions { display: flex; flex-wrap: wrap; gap: 0.6rem; }
  `,
})
export class AppsPageComponent {
  readonly i18n = inject(I18nHubService);
  readonly categories: CategoryFilter[] = [
    'All',
    'Creator & Media',
    'Culture & Knowledge',
    'Community & Family',
    'Engineering & Career',
  ];

  readonly selectedCategory = signal<CategoryFilter>('All');
  readonly query = signal('');

  readonly filteredApps = computed(() => {
    const cat = this.selectedCategory();
    const q = this.query().trim().toLowerCase();
    return ECOSYSTEM_APPS.filter((app) => {
      if (cat !== 'All' && app.category !== cat) return false;
      if (!q) return true;
      const hay = `${app.name} ${app.shortTagline} ${app.summary} ${app.capabilities.join(' ')} ${app.architectureStack.join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  });
}
