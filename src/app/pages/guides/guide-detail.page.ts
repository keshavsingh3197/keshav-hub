import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ENGINEERING_GUIDES } from '../../data/guides.catalog';
import { I18nHubService } from '../../services/i18n-hub.service';
import { SeoHubService } from '../../services/seo-hub.service';
import { guideSchema } from '../../services/structured-data';

@Component({
  selector: 'app-guide-detail-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="reading-progress" [style.width.%]="scrollPct()" aria-hidden="true"></div>
    @if (guide(); as g) {
      <section class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a routerLink="/">{{ i18n.t('nav.home', 'Home') }}</a> / <a routerLink="/guides">{{ i18n.t('nav.guides', 'Guides') }}</a> / <span>{{ g.category }}</span>
          </div>
          <span class="eyebrow">{{ g.category }} &middot; {{ g.readMinutes }} min read &middot; ~{{ wordCount() }} words</span>
          <h1>{{ g.title }}</h1>
          <p class="lead">{{ g.summary }}</p>
          <p class="byline">
            Written by <a routerLink="/about">Keshav Singh</a> (Software Architect) &middot; Published {{ g.publishedDate }} &middot; Updated {{ g.updatedDate }}
          </p>
        </div>
      </section>

      <section class="section">
        <div class="container article-layout">
          <aside class="toc-rail" aria-label="Article Outline">
            <div class="card toc-card">
              <h2>Contents</h2>
              <ol>
                @for (sec of g.sections; track sec.heading; let idx = $index) {
                  <li><a [href]="'#sec-' + idx">{{ sec.heading }}</a></li>
                }
                @if (g.faqs?.length) {
                  <li><a href="#sec-faq">Frequently Asked Questions</a></li>
                }
              </ol>
              <div class="toc-footer">
                @if (g.relatedToolSlug) {
                  <a [routerLink]="['/tools', g.relatedToolSlug]" class="btn btn-primary btn-sm">Try Companion Calculator</a>
                }
                <a [routerLink]="['/apps', g.relatedAppSlug]" class="btn btn-outline btn-sm">Platform Case Study</a>
              </div>
            </div>
          </aside>

          <article class="prose">
            <div class="callout">
              <strong>Key Engineering Takeaways</strong>
              <ul style="margin-bottom: 0; margin-top: 0.5rem;">
                @for (item of g.takeaways; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>

            @for (sec of g.sections; track sec.heading; let idx = $index) {
              <h2 [id]="'sec-' + idx">{{ sec.heading }}</h2>
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
              @if (sec.codeBlock; as cb) {
                <figure class="code-fig">
                  <figcaption>{{ cb.caption }} <span class="badge">{{ cb.language }}</span></figcaption>
                  <pre><code>{{ cb.code }}</code></pre>
                </figure>
              }
              @if (sec.codeOrTable; as tbl) {
                <div class="table-scroll">
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
                </div>
              }
            }

            @if (g.faqs?.length) {
              <h2 id="sec-faq">Frequently Asked Questions</h2>
              @for (faq of g.faqs; track faq.question) {
                <div class="card faq-card">
                  <h3>{{ faq.question }}</h3>
                  <p>{{ faq.answer }}</p>
                </div>
              }
            }

            <div class="callout" style="margin-top: 1.5rem;">
              {{ i18n.t('common.editorialDisclosure') }}
            </div>

            <div class="author-box card">
              <h3>About the Author — Keshav Singh</h3>
              <p>
                Keshav Singh is a Software Architect (B.Tech CS) specializing in distributed .NET 10 microservices, Angular 22 static and reactive web systems, OAuth2/Passkey identity servers, Vedic astronomy algorithms, and FFmpeg/WebGL 3D video pipelines. View his career history on
                <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer">portfolio.keshavsingh.in</a>.
              </p>
              <div class="cta-row">
                @if (g.relatedToolSlug) {
                  <a [routerLink]="['/tools', g.relatedToolSlug]" class="btn btn-primary btn-sm">Launch Companion Calculator</a>
                }
                <a [routerLink]="['/apps', g.relatedAppSlug]" class="btn btn-outline btn-sm">Read Platform Case Study</a>
                <a routerLink="/guides" class="btn btn-outline btn-sm">All 16 Guides</a>
              </div>
            </div>

            @if (relatedGuides().length) {
              <h2>Related Deep-Dive Guides</h2>
              <div class="related-grid">
                @for (rel of relatedGuides(); track rel.slug) {
                  <a [routerLink]="['/guides', rel.slug]" class="card card-interactive rel-card">
                    <span class="badge badge-accent">{{ rel.category }} &middot; {{ rel.readMinutes }} min</span>
                    <strong>{{ rel.title }}</strong>
                    <span class="muted">{{ rel.summary }}</span>
                  </a>
                }
              </div>
            }
          </article>
        </div>
      </section>
    } @else {
      <section class="section">
        <div class="container card">
          <h1>Guide Not Found</h1>
          <p>Browse all sixteen original engineering, astronomy, and creator playbooks from the main guides index.</p>
          <a routerLink="/guides" class="btn btn-primary">View All Guides</a>
        </div>
      </section>
    }
  `,
  styles: `
    .reading-progress { position: fixed; top: 68px; left: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent)); z-index: 45; transition: width 80ms linear; }
    .byline { margin-top: 0.85rem; font-size: 0.88rem; color: var(--text-subtle); }
    .article-layout { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 2rem; align-items: start; }
    .toc-rail { position: sticky; top: 88px; }
    .toc-card h2 { margin: 0 0 0.65rem; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-subtle); }
    .toc-card ol { padding-left: 1.15rem; margin: 0 0 1rem; display: grid; gap: 0.45rem; font-size: 0.86rem; }
    .toc-footer { display: grid; gap: 0.45rem; }
    .table-scroll { overflow-x: auto; }
    caption { text-align: left; font-weight: 600; margin-bottom: 0.45rem; color: var(--text-subtle); font-size: 0.85rem; }
    .code-fig { margin: 1.25rem 0; border: 1px solid var(--border-soft); border-radius: 12px; overflow: hidden; background: var(--surface-alt); }
    .code-fig figcaption { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; padding: 0.55rem 0.9rem; font-size: 0.82rem; font-weight: 600; color: var(--text-subtle); border-bottom: 1px solid var(--border-soft); }
    .code-fig pre { margin: 0; padding: 0.95rem; overflow-x: auto; font-size: 0.84rem; line-height: 1.55; color: var(--text); }
    .faq-card { margin-bottom: 0.85rem; }
    .faq-card h3 { margin-top: 0; }
    .author-box { margin-top: 2rem; }
    .author-box h3 { margin-top: 0; }
    .cta-row { display: flex; flex-wrap: wrap; gap: 0.65rem; }
    .related-grid { display: grid; gap: 0.85rem; margin-top: 0.75rem; }
    .rel-card { display: grid; gap: 0.35rem; color: var(--text); text-decoration: none !important; }
    .rel-card .muted { font-size: 0.88rem; }
    @media (max-width: 900px) { .article-layout { grid-template-columns: minmax(0, 1fr); } .toc-rail { position: static; } }
  `,
})
export class GuideDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoHubService);
  readonly i18n = inject(I18nHubService);
  private readonly isBrowser: boolean;

  readonly scrollPct = signal(0);
  readonly currentSlug = signal('');

  readonly guide = computed(() => {
    const slug = this.currentSlug();
    return ENGINEERING_GUIDES.find((g) => g.slug === slug) ?? null;
  });

  readonly relatedGuides = computed(() => {
    const g = this.guide();
    if (!g) return [];
    const others = ENGINEERING_GUIDES.filter((item) => item.slug !== g.slug);
    const sameCat = others.filter((item) => item.category === g.category);
    const diffCat = others.filter((item) => item.category !== g.category);
    return [...sameCat, ...diffCat].slice(0, 3);
  });

  readonly wordCount = computed(() => {
    const g = this.guide();
    if (!g) return 0;
    const text = [
      g.title,
      g.summary,
      ...g.takeaways,
      ...g.sections.flatMap((s) => [
        s.heading,
        ...s.paragraphs,
        ...(s.bullets ?? []),
        s.codeBlock?.caption ?? '',
        s.codeBlock?.code ?? '',
      ]),
      ...(g.faqs ?? []).flatMap((f) => [f.question, f.answer]),
    ].join(' ');
    return text.trim().split(/\s+/).length;
  });

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) return;
    const docEl = document.documentElement;
    const scrollable = Math.max(1, docEl.scrollHeight - docEl.clientHeight);
    this.scrollPct.set(Math.min(100, Math.max(0, Math.round((window.scrollY / scrollable) * 100))));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentSlug.set(params.get('slug') ?? '');
      const g = this.guide();
      if (g) {
        this.seo.update({
          title: `${g.title} | keshavsingh.in`,
          description: g.summary,
          path: `/guides/${g.slug}`,
          ogType: 'article',
          crumbName: g.title,
          schema: guideSchema(g),
        });
      }
    });
  }
}
