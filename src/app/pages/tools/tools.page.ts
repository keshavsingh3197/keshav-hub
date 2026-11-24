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
      <div class="container">
        <div class="grid-2 tools-grid">
          @for (tool of tools; track tool.slug) {
            <a [routerLink]="['/tools', tool.slug]" class="card card-interactive tile tool-item">
              <span class="tool-banner" [style.background]="gradient(visual(tool.slug))">
                <app-icon [name]="visual(tool.slug).icon" [size]="40" [stroke]="1.5" />
              </span>
              <div class="tool-body">
                <span class="badge badge-accent">{{ i18n.t('items.tools.' + tool.slug + '.badge', tool.badge) }}</span>
                <h2>{{ i18n.t('items.tools.' + tool.slug + '.title', tool.title) }}</h2>
                <p>{{ i18n.t('items.tools.' + tool.slug + '.shortDesc', tool.shortDesc) }}</p>
                <span class="tile-go">{{ i18n.t('common.launchCalculator') }}</span>
              </div>
            </a>
          }
        </div>

        <div class="prose tools-editorial">
          <h2>How Our Browser Utilities Are Engineered &amp; Verified</h2>
          <p>
            Every interactive utility hosted on <code>keshavsingh.in/tools</code> executes 100% locally inside your browser using deterministic TypeScript math functions—with zero mandatory account registration, zero server-side input logging, and instant reactivity on mobile and desktop viewports.
          </p>
          <ul>
            <li><strong>Creator &amp; Video Production Suite:</strong> Model blended YouTube Long-Form + Shorts RPM unit economics, pre-time 3-second vertical comedy/katha hooks with Story Agent JSON export, and generate constrained-CRF <code>ffmpeg</code> encoding commands with accurate MP4 and CDN egress budgets.</li>
            <li><strong>Vedic Astronomy &amp; Timekeeping Suite:</strong> Recompute sunrise-anchored Rahu Kaal, Yamaganda, Gulika, and Abhijit Muhurat windows for real geographic daylight lengths, and inspect exact 12&deg; lunar Tithi, 13&deg;20&prime; Nakshatra Pada, Nitya Yoga, and Karana geometry from Nirayana ecliptic longitudes.</li>
            <li><strong>Backend, DevOps &amp; Technical SEO Suite:</strong> Simulate Redis cache offload and gRPC vs JSON REST tail latency before sizing Kubernetes replicas, generate unicode-escaped Schema.org JSON-LD blocks, and translate UTC cron expressions into Asia/Kolkata IST (+05:30) wall-clock schedules alongside JWT rotation audits.</li>
          </ul>
          <p>
            Each calculator page documents its underlying equations, step-by-step instructions, a worked real-world production scenario, and links to its companion long-form engineering guide in our <a routerLink="/guides">Original Editorial Library</a>.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .tools-grid { margin-bottom: 2.5rem; }
    .tool-item { padding: 0; overflow: hidden; gap: 0; }
    .tool-banner { height: 112px; display: grid; place-items: center; color: #fff; }
    .tool-body { padding: 1.15rem 1.25rem 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; flex: 1; }
    .tool-body h2 { margin: 0; font-size: 1.18rem; }
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
