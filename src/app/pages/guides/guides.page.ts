import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ENGINEERING_GUIDES, EngineeringGuide } from '../../data/guides.catalog';
import { GUIDE_CATEGORY_VISUALS, VisualIdentity, gradientOf, visualOf } from '../../data/visuals';
import { I18nHubService } from '../../services/i18n-hub.service';
import { IconComponent } from '../../ui/icon.component';

type GuideCatFilter = 'All' | EngineeringGuide['category'];

@Component({
  selector: 'app-guides-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>{{ i18n.t('nav.guides') }}</span></div>
        <span class="eyebrow">{{ i18n.t('sections.guidesEyebrow') }}</span>
        <h1>{{ i18n.t('pages.guidesTitle') }}</h1>
        <p class="lead">{{ i18n.t('pages.guidesLead') }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="pill-bar filter-row">
          @for (cat of categories; track cat) {
            <button type="button" class="pill-btn" [class.active]="selectedCategory() === cat" (click)="selectedCategory.set(cat)">
              {{ cat }}
            </button>
          }
        </div>

        <div class="grid-2 guides-grid">
          @for (g of filteredGuides(); track g.slug) {
            <a [routerLink]="['/guides', g.slug]" class="card card-interactive tile guide-card">
              <div class="meta-top">
                <span class="icon-chip sm" [style.background]="gradient(visual(g.category))"><app-icon [name]="visual(g.category).icon" [size]="17" /></span>
                <span class="badge badge-accent">{{ g.category }}</span>
                <span class="muted tiny"><app-icon name="clock" [size]="13" /> {{ g.readMinutes }} {{ i18n.t('common.minRead') }}</span>
              </div>
              <h2>{{ g.title }}</h2>
              <p class="clamp-2">{{ g.summary }}</p>
              <span class="tile-go">{{ i18n.t('common.readArticle') }}</span>
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .filter-row { margin-bottom: 1.5rem; }
    .meta-top { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
    .muted { color: var(--text-muted); }
    .tiny { font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.25rem; margin-left: auto; }
    .guide-card h2 { margin: 0; font-size: 1.15rem; line-height: 1.35; }
  `,
})
export class GuidesPageComponent {
  readonly i18n = inject(I18nHubService);
  readonly gradient = gradientOf;
  visual(category: string): VisualIdentity {
    return visualOf(GUIDE_CATEGORY_VISUALS, category);
  }
  readonly categories: GuideCatFilter[] = [
    'All',
    'Architecture',
    'Creator & Media',
    'Vedic Astronomy',
    'Policy & Monetization',
  ];

  readonly selectedCategory = signal<GuideCatFilter>('All');

  readonly filteredGuides = computed(() => {
    const cat = this.selectedCategory();
    return cat === 'All'
      ? ENGINEERING_GUIDES
      : ENGINEERING_GUIDES.filter((g) => g.category === cat);
  });
}
