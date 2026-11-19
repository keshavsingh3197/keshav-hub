import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HUB_TOOLS } from '../../data/creators-plans.catalog';
import { I18nHubService } from '../../services/i18n-hub.service';

@Component({
  selector: 'app-tools-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home', 'Home') }}</a> / <span>{{ i18n.t('nav.tools', 'Tools') }}</span></div>
        <span class="eyebrow">{{ i18n.t('sections.toolsEyebrow') }}</span>
        <h1>{{ i18n.t('pages.toolsTitle') }}</h1>
        <p class="lead">{{ i18n.t('pages.toolsLead') }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid-2">
          @for (tool of tools; track tool.slug) {
            <article class="card card-interactive tool-item">
              <span class="badge badge-accent">{{ i18n.t('items.tools.' + tool.slug + '.badge', tool.badge) }}</span>
              <h2><a [routerLink]="['/tools', tool.slug]">{{ i18n.t('items.tools.' + tool.slug + '.title', tool.title) }}</a></h2>
              <p class="muted">{{ i18n.t('items.tools.' + tool.slug + '.shortDesc', tool.shortDesc) }}</p>
              <h3>Why Use This Tool</h3>
              <p class="small-copy muted">{{ tool.whyUseful }}</p>
              <a [routerLink]="['/tools', tool.slug]" class="btn btn-primary btn-sm">{{ i18n.t('common.launchCalculator') }}</a>
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
  readonly i18n = inject(I18nHubService);
  readonly tools = HUB_TOOLS;
}
