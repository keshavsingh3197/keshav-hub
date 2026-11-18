import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HUB_TOOLS } from '../../data/creators-plans.catalog';

@Component({
  selector: 'app-tools-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">Home</a> / <span>Interactive Tools</span></div>
        <span class="eyebrow">Browser Utilities &amp; Calculators</span>
        <h1>Free Creator, Vedic Calendar &amp; Architecture Tools</h1>
        <p class="lead">
          Every calculator runs deterministically in your browser with zero login barriers—accompanied by full mathematical formulas, edge-case documentation, and ecosystem links.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid-2">
          @for (tool of tools; track tool.slug) {
            <article class="card card-interactive tool-item">
              <span class="badge badge-accent">{{ tool.badge }}</span>
              <h2><a [routerLink]="['/tools', tool.slug]">{{ tool.title }}</a></h2>
              <p class="muted">{{ tool.shortDesc }}</p>
              <h3>Why Use This Tool</h3>
              <p class="small-copy muted">{{ tool.whyUseful }}</p>
              <a [routerLink]="['/tools', tool.slug]" class="btn btn-primary btn-sm">Open Calculator &amp; Guide &rarr;</a>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .tool-item h2 { margin: 0.65rem 0 0.45rem; font-size: 1.3rem; }
    .tool-item h3 { margin: 1rem 0 0.35rem; font-size: 0.95rem; }
    .muted { color: var(--text-muted); margin: 0 0 0.75rem; }
    .small-copy { font-size: 0.92rem; }
  `,
})
export class ToolsPageComponent {
  readonly tools = HUB_TOOLS;
}
