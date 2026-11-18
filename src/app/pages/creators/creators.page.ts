import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CREATOR_CHANNELS, CURATED_VIDEOS } from '../../data/creators-plans.catalog';
import { EcosystemApiService, LiveVideoRecord } from '../../services/ecosystem-api.service';

@Component({
  selector: 'app-creators-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">Home</a> / <span>Creator Studio &amp; Work</span></div>
        <span class="eyebrow">Original Video Studios</span>
        <h1>Creator Channels, 3D Comedy &amp; Cultural Storytelling</h1>
        <p class="lead">
          Behind-the-scenes workflows, active YouTube channels, original 3D animation pipelines built inside AnimStudio AI, and searchable multi-channel video library.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Active Official Creator Channels</h2>
        <div class="grid-3 channels-grid">
          @for (ch of channels; track ch.key) {
            <article class="card">
              <div class="meta-line">
                <span class="badge badge-accent">{{ ch.handle }}</span>
                <span class="badge">{{ ch.scheduleCadence }}</span>
              </div>
              <h3>{{ ch.name }}</h3>
              <p class="muted">{{ ch.tagline }}</p>
              <p class="small"><strong>Audience:</strong> {{ ch.audience }}</p>
              <ul>
                @for (s of ch.seriesList; track s) {
                  <li>{{ s }}</li>
                }
              </ul>
              <a [href]="ch.url" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Open on YouTube &#8599;</a>
            </article>
          }
        </div>

        <div class="prose production-notes">
          <h2>How Episodes Are Produced With Uniqueness &amp; Policy Compliance</h2>
          <p>
            Every series published across our network follows an explicit human-reviewed production chain built on
            <a routerLink="/apps/animstudio">AnimStudio AI</a> rather than low-effort mass re-uploads:
          </p>
          <ul>
            <li><strong>Original 3D Visual Archetypes:</strong> Procedural character animations, stage lights, exaggerated reaction facial timing, and Motion Copy 3D body replacement create distinct visual identity rather than scraped footage.</li>
            <li><strong>Source-Grounded Devotional Storytelling:</strong> Cultural kathas cite classical texts responsibly, paired with verified daily timings from <a href="https://panchang.keshavsingh.in" target="_blank" rel="noopener noreferrer">Hindu Panchang</a>.</li>
            <li><strong>Pre-Publish Verification:</strong> Scheduled titles, multilingual tags, thumbnails, and chapter notes are audited inside our studio schedule view before release.</li>
          </ul>
        </div>

        <div class="catalog-box card">
          <div class="catalog-head">
            <div>
              <h2>Search Ecosystem Video Archive</h2>
              <p class="muted">Filter featured series and live synced uploads from id.keshavsingh.in across English and Hindi.</p>
            </div>
            <div class="pill-bar">
              <button type="button" class="pill-btn" [class.active]="selectedFormat() === 'all'" (click)="setFormat('all')">All Formats</button>
              <button type="button" class="pill-btn" [class.active]="selectedFormat() === 'Short'" (click)="setFormat('Short')">Shorts</button>
              <button type="button" class="pill-btn" [class.active]="selectedFormat() === 'Video'" (click)="setFormat('Video')">Full Videos</button>
            </div>
          </div>

          <div class="filter-bar">
            <label for="creator-video-q" class="visually-hidden">Search videos</label>
            <input id="creator-video-q" type="search" class="input"
              placeholder="Search comedy, panchang, SSO architecture, katha..."
              [ngModel]="query()" (ngModelChange)="onSearch($event)" />
          </div>

          @if (liveVideos().length > 0) {
            <div class="grid-3 video-grid">
              @for (v of liveVideos(); track v.id) {
                <article class="card video-card">
                  <span class="badge">{{ v.channelHandle || v.channelName }} &middot; {{ v.format }}</span>
                  <h3>{{ v.title }}</h3>
                  <p class="muted small">{{ v.description }}</p>
                  <a [href]="v.url" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Watch Video &#8599;</a>
                </article>
              }
            </div>
          } @else {
            <div class="grid-2 video-grid">
              @for (v of filteredFallbackVideos(); track v.id) {
                <article class="card video-card">
                  <div class="meta-line">
                    <span class="badge badge-accent">{{ v.channelHandle }}</span>
                    <span class="badge">{{ v.format }} &middot; {{ v.language }}</span>
                  </div>
                  <h3>{{ v.title }}</h3>
                  <p class="muted small">{{ v.summary }}</p>
                  <a [href]="v.url" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Open {{ v.channelName }} &#8599;</a>
                </article>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .channels-grid { margin-top: 1rem; margin-bottom: 2.5rem; }
    .meta-line { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.5rem; }
    .muted { color: var(--text-muted); }
    .small { font-size: 0.9rem; }
    .production-notes { margin-bottom: 2.5rem; }
    .catalog-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .catalog-head h2 { margin: 0 0 0.25rem; }
    .filter-bar { margin-bottom: 1.25rem; max-width: 460px; }
    .video-grid { margin-top: 0.5rem; }
    .video-card h3 { margin: 0.55rem 0 0.45rem; font-size: 1.05rem; }
  `,
})
export class CreatorsPageComponent implements OnInit {
  private readonly api = inject(EcosystemApiService);

  readonly channels = CREATOR_CHANNELS;
  readonly query = signal('');
  readonly selectedFormat = signal<'all' | 'Short' | 'Video'>('all');
  readonly liveVideos = signal<LiveVideoRecord[]>([]);

  readonly filteredFallbackVideos = computed(() => {
    const q = this.query().trim().toLowerCase();
    const fmt = this.selectedFormat();
    return CURATED_VIDEOS.filter((v) => {
      if (fmt !== 'all' && v.format !== fmt) return false;
      if (!q) return true;
      return `${v.title} ${v.channelName} ${v.niche} ${v.summary}`.toLowerCase().includes(q);
    });
  });

  ngOnInit(): void {
    this.fetchVideos();
  }

  onSearch(val: string): void {
    this.query.set(val);
    this.fetchVideos();
  }

  setFormat(fmt: 'all' | 'Short' | 'Video'): void {
    this.selectedFormat.set(fmt);
    this.fetchVideos();
  }

  private fetchVideos(): void {
    this.api
      .searchVideos({ q: this.query(), format: this.selectedFormat(), limit: 9 })
      .subscribe((res) => this.liveVideos.set(res.items));
  }
}
