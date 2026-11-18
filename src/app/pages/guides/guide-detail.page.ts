import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ENGINEERING_GUIDES } from '../../data/guides.catalog';
import { SeoHubService } from '../../services/seo-hub.service';

@Component({
  selector: 'app-guide-detail-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (guide(); as g) {
      <section class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a routerLink="/">Home</a> / <a routerLink="/guides">Guides</a> / <span>{{ g.category }}</span>
          </div>
          <span class="eyebrow">{{ g.category }} &middot; {{ g.readMinutes }} min read</span>
          <h1>{{ g.title }}</h1>
          <p class="lead">{{ g.summary }}</p>
          <p class="byline">
            Written by <a routerLink="/about">Keshav Singh</a> &middot; Published {{ g.publishedDate }} &middot; Updated {{ g.updatedDate }}
          </p>
        </div>
      </section>

      <section class="section">
        <div class="container prose">
          <div class="callout">
            <strong>Article Takeaways</strong>
            <ul style="margin-bottom: 0; margin-top: 0.5rem;">
              @for (item of g.takeaways; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </div>

          @for (sec of g.sections; track sec.heading) {
            <h2>{{ sec.heading }}</h2>
            @for (p of sec.paragraphs; track p) {
              <p>{{ p }}</p>
            }
            @if (sec.bullets) {
              <ul>
                @for (b of sec.bullets; track b) {
                  <li>{{ b }}</li>
                }
              </ul>
            }
            @if (sec.codeOrTable; as tbl) {
              <table>
                <caption>{{ tbl.caption }}</caption>
                <thead>
                  <tr>
                    @for (h of tbl.headers; track h) {
                      <th>{{ h }}</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  @for (row of tbl.rows; track $index) {
                    <tr>
                      @for (cell of row; track $index) {
                        <td>{{ cell }}</td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            }
          }

          <div class="author-box card">
            <h3>About the Author</h3>
            <p>
              <strong>Keshav Singh</strong> builds distributed .NET / Angular platforms and interactive digital creator tools across the keshavsingh.in ecosystem. Explore his full engineering resume on
              <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer">portfolio.keshavsingh.in</a>.
            </p>
            <div class="cta-row">
              @if (g.relatedToolSlug) {
                <a [routerLink]="['/tools', g.relatedToolSlug]" class="btn btn-primary btn-sm">Launch Related Tool</a>
              }
              <a [routerLink]="['/apps', g.relatedAppSlug]" class="btn btn-outline btn-sm">Inspect Connected App</a>
              <a routerLink="/guides" class="btn btn-outline btn-sm">All Guides</a>
            </div>
          </div>
        </div>
      </section>
    } @else {
      <section class="section">
        <div class="container card">
          <h1>Guide Not Found</h1>
          <p>Browse our engineering and creator playbooks from the main guides index.</p>
          <a routerLink="/guides" class="btn btn-primary">View All Guides</a>
        </div>
      </section>
    }
  `,
  styles: `
    .byline { margin-top: 0.85rem; font-size: 0.88rem; color: var(--text-subtle); }
    caption { text-align: left; font-weight: 600; margin-bottom: 0.45rem; color: var(--text-subtle); font-size: 0.85rem; }
    .author-box { margin-top: 2.25rem; }
    .author-box h3 { margin-top: 0; }
    .cta-row { display: flex; flex-wrap: wrap; gap: 0.65rem; }
  `,
})
export class GuideDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoHubService);

  readonly guide = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    return ENGINEERING_GUIDES.find((g) => g.slug === slug) ?? null;
  });

  ngOnInit(): void {
    const g = this.guide();
    if (g) {
      this.seo.update({
        title: `${g.title} | keshavsingh.in`,
        description: g.summary,
        path: `/guides/${g.slug}`,
      });
    }
  }
}
