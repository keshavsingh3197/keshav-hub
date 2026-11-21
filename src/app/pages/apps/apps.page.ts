import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ECOSYSTEM_APPS, EcosystemAppDetail } from '../../data/apps.catalog';
import { APP_VISUALS, VisualIdentity, gradientOf, visualOf } from '../../data/visuals';
import { I18nHubService } from '../../services/i18n-hub.service';
import { IconComponent } from '../../ui/icon.component';

type CategoryFilter = 'All' | EcosystemAppDetail['category'];

@Component({
  selector: 'app-apps-page',
  standalone: true,
  imports: [RouterLink, FormsModule, IconComponent],
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
            <article class="card card-interactive app-card">
              <div class="app-top">
                <span class="icon-chip" [style.background]="gradient(visual(app.slug))"><app-icon [name]="visual(app.slug).icon" [size]="22" /></span>
                <div>
                  <h2><a [routerLink]="['/apps', app.slug]">{{ i18n.t('items.apps.' + app.slug + '.name', app.name) }}</a></h2>
                  <span class="badge badge-accent">{{ app.category }}</span>
                </div>
              </div>
              <p class="muted clamp-2">{{ i18n.t('items.apps.' + app.slug + '.shortTagline', app.shortTagline) }}</p>
              <div class="stack-row">
                @for (tech of app.architectureStack.slice(0, 3); track tech) {
                  <span class="badge">{{ tech }}</span>
                }
              </div>
              <div class="app-actions">
                <a [routerLink]="['/apps', app.slug]" class="btn btn-primary btn-sm">{{ i18n.t('common.learnMore') }}</a>
                @if (app.url.startsWith('http')) {
                  <a [href]="app.url" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">{{ i18n.t('common.open') }} <app-icon name="external" [size]="14" /></a>
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
    .app-card { display: flex; flex-direction: column; gap: 0.85rem; }
    .app-card h2 { margin: 0 0 0.3rem; font-size: 1.15rem; }
    .app-card h2 a { color: var(--text); }
    .app-top { display: flex; gap: 0.85rem; align-items: center; }
    .muted { color: var(--text-muted); margin: 0; }
    .stack-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: auto; }
    .app-actions { display: flex; flex-wrap: wrap; gap: 0.6rem; }
  `,
})
export class AppsPageComponent {
  readonly i18n = inject(I18nHubService);
  readonly gradient = gradientOf;
  visual(slug: string): VisualIdentity {
    return visualOf(APP_VISUALS, slug);
  }
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
