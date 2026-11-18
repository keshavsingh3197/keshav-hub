import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ENGINEERING_GUIDES, EngineeringGuide } from '../../data/guides.catalog';

type GuideCatFilter = 'All' | EngineeringGuide['category'];

@Component({
  selector: 'app-guides-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">Home</a> / <span>Guides &amp; Playbooks</span></div>
        <span class="eyebrow">Original Editorial Articles</span>
        <h1>Engineering Architecture, Creator Media &amp; Compliance Guides</h1>
        <p class="lead">
          First-hand technical writeups drawn from building eight interconnected web applications, FFmpeg/3D animation tools, Panchang ephemeris math, and Google AdSense / YouTube compliant hubs.
        </p>
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
            <article class="card card-interactive guide-card">
              <div class="meta-top">
                <span class="badge badge-accent">{{ g.category }}</span>
                <span class="muted tiny">Updated {{ g.updatedDate }} &middot; {{ g.readMinutes }} min read</span>
              </div>
              <h2><a [routerLink]="['/guides', g.slug]">{{ g.title }}</a></h2>
              <p class="muted">{{ g.summary }}</p>
              <h3>Key Takeaways</h3>
              <ul>
                @for (t of g.takeaways; track t) {
                  <li>{{ t }}</li>
                }
              </ul>
              <a [routerLink]="['/guides', g.slug]" class="btn btn-primary btn-sm">Read Full Article &rarr;</a>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .filter-row { margin-bottom: 1.5rem; }
    .meta-top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; }
    .muted { color: var(--text-muted); }
    .tiny { font-size: 0.8rem; }
    .guide-card h2 { margin: 0.35rem 0 0.55rem; font-size: 1.25rem; }
    .guide-card h3 { margin: 0.85rem 0 0.35rem; font-size: 0.92rem; }
    .guide-card ul { padding-left: 1.2rem; margin-bottom: 1.1rem; color: var(--text-muted); font-size: 0.9rem; }
  `,
})
export class GuidesPageComponent {
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
