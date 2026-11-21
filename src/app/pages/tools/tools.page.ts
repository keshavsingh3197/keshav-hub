import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HUB_TOOLS } from '../../data/creators-plans.catalog';
import { TOOL_VISUALS, VisualIdentity, gradientOf, visualOf } from '../../data/visuals';
import { I18nHubService } from '../../services/i18n-hub.service';
import { IconComponent } from '../../ui/icon.component';

@Component({
  selector: 'app-tools-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
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
      <div class="container grid-2">
        @for (tool of tools; track tool.slug) {
          <a [routerLink]="['/tools', tool.slug]" class="card card-interactive tile tool-item">
            <span class="tool-banner" [style.background]="gradient(visual(tool.slug))">
              <app-icon [name]="visual(tool.slug).icon" [size]="40" [stroke]="1.5" />
            </span>
            <div class="tool-body">
              <span class="badge badge-accent">{{ i18n.t('items.tools.' + tool.slug + '.badge', tool.badge) }}</span>
              <h2>{{ i18n.t('items.tools.' + tool.slug + '.title', tool.title) }}</h2>
              <p class="clamp-2">{{ i18n.t('items.tools.' + tool.slug + '.shortDesc', tool.shortDesc) }}</p>
              <span class="tile-go">{{ i18n.t('common.launchCalculator') }}</span>
            </div>
          </a>
        }
      </div>
    </section>
  `,
  styles: `
    .tool-item { padding: 0; overflow: hidden; gap: 0; }
    .tool-banner { height: 120px; display: grid; place-items: center; color: #fff; }
    .tool-body { padding: 1.15rem 1.25rem 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; flex: 1; }
    .tool-body h2 { margin: 0; font-size: 1.2rem; }
  `,
})
export class ToolsPageComponent {
  readonly i18n = inject(I18nHubService);
  readonly tools = HUB_TOOLS;
  readonly gradient = gradientOf;
  visual(slug: string): VisualIdentity {
    return visualOf(TOOL_VISUALS, slug);
  }
}
