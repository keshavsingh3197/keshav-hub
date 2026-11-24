import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GUIDE_CARDS, GuideCardMeta } from '../../data/guides-cards.catalog';
import { GUIDE_CATEGORY_VISUALS, VisualIdentity, gradientOf, visualOf } from '../../data/visuals';
import { I18nHubService } from '../../services/i18n-hub.service';
import { IconComponent } from '../../ui/icon.component';

type GuideCatFilter = 'All' | GuideCardMeta['category'];

@Component({
  selector: 'app-guides-page',
  standalone: true,
  imports: [RouterLink, FormsModule, IconComponent],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>{{ i18n.t('nav.guides') }}</span></div>
        <span class="eyebrow">{{ i18n.t('sections.guidesEyebrow') }} &middot; {{ totalGuides }} Original Technical Playbooks</span>
        <h1>{{ i18n.t('pages.guidesTitle') }}</h1>
        <p class="lead">{{ i18n.t('pages.guidesLead') }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="controls-bar card">
          <div class="pill-bar">
            @for (cat of categories; track cat) {
              <button type="button" class="pill-btn" [class.active]="selectedCategory() === cat" (click)="selectedCategory.set(cat)">
                {{ cat }}
              </button>
            }
          </div>
          <div class="search-box">
            <label for="guide-q" class="visually-hidden">Search technical guides</label>
            <input id="guide-q" type="search" class="input" placeholder="Filter by .NET 10, FFmpeg, Passkeys, Tithi, MongoDB..."
              [ngModel]="query()" (ngModelChange)="query.set($event)" />
          </div>
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
              <p>{{ g.summary }}</p>
              <span class="tile-go">{{ i18n.t('common.readArticle') }}</span>
            </a>
          }
        </div>

        <div class="prose guides-editorial">
          <h2>Four Engineering &amp; Creator Tracks Documented From Live Systems</h2>
          <p>
            Unlike aggregator blogs that rewrite generic documentation, every article in the <code>keshavsingh.in/guides</code> library documents architecture decisions, production code patterns, mathematical derivations, and post-mortem lessons drawn directly from operating eight connected web and mobile applications:
          </p>
          <ul>
            <li><strong>Distributed Architecture (.NET 10, MongoDB &amp; Security):</strong> Federated OAuth 2.1 + FIDO2 Passkey SSO across sibling subdomains, AES-256-GCM multi-key LLM failover pools, ESR compound indexing, and Angular 22 static pre-rendering.</li>
            <li><strong>Creator &amp; Media Engineering (FFmpeg &amp; Three.js WebGL):</strong> Deterministic Story Agent JSON schemas, cumulative <code>xfade</code> offset compilers, EBU R128 sidechain audio ducking, HarfBuzz Devanagari subtitle shaping, and spring-damper 3D character rigging.</li>
            <li><strong>Vedic Astronomy &amp; Ephemeris Mathematics:</strong> Geographic sunrise hour-angle equations, Lahiri Chitrapaksha Ayanamsa precession, Newton-Raphson Tithi boundary solvers, 8-slice Dinamana/Ratrimana Choghadiya, and 24-Hora weekday rulership proofs.</li>
            <li><strong>Publisher Policy, Technical SEO &amp; Privacy Governance:</strong> Separating YouTube Partner Program (YPP) from Website AdSense, eliminating non-content screen ad violations, escaping inline Schema.org JSON-LD, and enforcing fail-closed user consent.</li>
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: `
    .controls-bar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .search-box { min-width: 250px; flex: 0 1 340px; }
    .guides-grid { margin-bottom: 2.5rem; }
    .meta-top { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
    .muted { color: var(--text-muted); }
    .tiny { font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.25rem; margin-left: auto; }
    .guide-card h2 { margin: 0; font-size: 1.15rem; line-height: 1.35; }
  `,
})
export class GuidesPageComponent {
  readonly i18n = inject(I18nHubService);
  readonly gradient = gradientOf;
  readonly totalGuides = GUIDE_CARDS.length;

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
  readonly query = signal('');

  readonly filteredGuides = computed(() => {
    const cat = this.selectedCategory();
    const q = this.query().trim().toLowerCase();
    return GUIDE_CARDS.filter((g) => {
      if (cat !== 'All' && g.category !== cat) return false;
      if (!q) return true;
      return `${g.title} ${g.summary} ${g.category} ${g.takeaways.join(' ')}`.toLowerCase().includes(q);
    });
  });
}
