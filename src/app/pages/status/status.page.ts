import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EcosystemApiService,
  LiveEcosystemStatusReport,
  LiveServiceStatus,
} from '../../services/ecosystem-api.service';

@Component({
  selector: 'app-status-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="status-hero">
      <div class="container">
        <p class="eyebrow">LIVE INFRASTRUCTURE TELEMETRY</p>
        <h1>Keshav Ecosystem System Status</h1>
        <p class="lead">
          Real-time availability and response latency across all public web applications and Google Cloud Run
          backend APIs under <code>*.keshavsingh.in</code>.
        </p>

        @if (loading() && !report()) {
          <div class="banner loading">Checking live service health…</div>
        } @else if (error() && !report()) {
          <div class="banner outage">
            <div>
              <strong>Status Monitor Unreachable</strong>
              <p>{{ error() }}</p>
            </div>
            <button type="button" class="btn btn-sm" (click)="load(true)">Retry</button>
          </div>
        } @else if (report(); as r) {
          <div
            class="banner"
            [class.operational]="r.overallStatus === 'operational'"
            [class.degraded]="r.overallStatus === 'degraded'"
            [class.outage]="r.overallStatus === 'outage'"
          >
            <div class="banner-main">
              <span class="pulse-dot"></span>
              <div>
                <strong>{{ overallTitle(r) }}</strong>
                <p>
                  {{ r.healthyCount }} of {{ r.totalCount }} services operational · Last checked
                  {{ r.checkedAtUtc | date: 'medium' }}
                </p>
              </div>
            </div>
            <button type="button" class="btn btn-sm" [disabled]="loading()" (click)="load(true)">
              {{ loading() ? 'Refreshing…' : 'Refresh' }}
            </button>
          </div>
        }
      </div>
    </section>

    @if (report(); as r) {
      <section class="container status-body">
        <div class="group-card">
          <div class="group-head">
            <h2>Backend APIs (Google Cloud Run · us-central1)</h2>
            <span>{{ backends().length }} services</span>
          </div>
          <div class="service-list">
            @for (svc of backends(); track svc.key) {
              <div class="service-row">
                <div class="svc-info">
                  <span class="dot" [class]="svc.status"></span>
                  <div>
                    <strong>{{ svc.name }}</strong>
                    <a [href]="svc.url" target="_blank" rel="noopener noreferrer">{{ svc.url }}</a>
                  </div>
                </div>
                <div class="svc-meta">
                  @if (svc.note) {
                    <span class="note">{{ svc.note }}</span>
                  }
                  @if (svc.latencyMs !== null) {
                    <span class="latency">{{ svc.latencyMs }} ms</span>
                  }
                  <span class="badge" [class]="svc.status">
                    {{ statusLabel(svc) }}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="group-card">
          <div class="group-head">
            <h2>Frontend Web Applications</h2>
            <span>{{ frontends().length }} apps</span>
          </div>
          <div class="service-list">
            @for (svc of frontends(); track svc.key) {
              <div class="service-row">
                <div class="svc-info">
                  <span class="dot" [class]="svc.status"></span>
                  <div>
                    <strong>{{ svc.name }}</strong>
                    <a [href]="svc.url" target="_blank" rel="noopener noreferrer">{{ svc.url }}</a>
                  </div>
                </div>
                <div class="svc-meta">
                  @if (svc.latencyMs !== null) {
                    <span class="latency">{{ svc.latencyMs }} ms</span>
                  }
                  <span class="badge" [class]="svc.status">
                    {{ statusLabel(svc) }}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="status-notes">
          <h3>How Health Checks Work</h3>
          <p>
            Status probes are executed server-side by the central identity hub (<code>id.keshavsingh.in/api/status</code>)
            and cached for 60 seconds so public monitoring stays fast without triggering unnecessary cold starts.
            Services marked <strong>Degraded</strong> responded slowly (often due to a serverless cold start) or returned
            a non-5xx status, while <strong>Operational</strong> indicates an active HTTP response within normal latency.
          </p>
          <p>
            Need to inspect platform architecture or report an issue? Visit
            <a routerLink="/apps">Ecosystem Architecture</a> or <a routerLink="/contact">Contact Support</a>.
          </p>
        </div>
      </section>
    }
  `,
  styles: `
    .status-hero { padding: 3rem 0 1.75rem; border-bottom: 1px solid var(--border, #e2e8f0); }
    .eyebrow { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; color: var(--accent, #2563eb); margin: 0 0 0.5rem; }
    h1 { margin: 0 0 0.5rem; font-size: clamp(1.75rem, 3vw, 2.35rem); }
    .lead { max-width: 68ch; color: var(--muted, #64748b); margin: 0 0 1.5rem; }
    .banner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 1.25rem; border-radius: 12px; border: 1px solid var(--border, #cbd5e1); background: var(--surface, #f8fafc); flex-wrap: wrap; }
    .banner.operational { border-color: #10b981; background: color-mix(in srgb, #10b981 10%, var(--surface, #ffffff)); }
    .banner.degraded { border-color: #f59e0b; background: color-mix(in srgb, #f59e0b 10%, var(--surface, #ffffff)); }
    .banner.outage { border-color: #ef4444; background: color-mix(in srgb, #ef4444 10%, var(--surface, #ffffff)); }
    .banner-main { display: flex; align-items: center; gap: 0.85rem; }
    .banner-main p { margin: 0.2rem 0 0; font-size: 0.88rem; color: var(--muted, #64748b); }
    .pulse-dot { width: 12px; height: 12px; border-radius: 50%; background: #10b981; flex: none; }
    .banner.degraded .pulse-dot { background: #f59e0b; }
    .banner.outage .pulse-dot { background: #ef4444; }
    .status-body { padding: 2rem 0 3.5rem; display: grid; gap: 1.5rem; }
    .group-card { border: 1px solid var(--border, #e2e8f0); border-radius: 12px; background: var(--surface, #ffffff); overflow: hidden; }
    .group-head { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 1.2rem; border-bottom: 1px solid var(--border, #e2e8f0); background: color-mix(in srgb, var(--surface, #f8fafc) 70%, var(--bg, #f1f5f9)); }
    .group-head h2 { margin: 0; font-size: 1.05rem; }
    .group-head span { font-size: 0.82rem; color: var(--muted, #64748b); }
    .service-list { display: grid; }
    .service-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.85rem 1.2rem; border-bottom: 1px solid var(--border, #e2e8f0); flex-wrap: wrap; }
    .service-row:last-child { border-bottom: none; }
    .svc-info { display: flex; align-items: center; gap: 0.75rem; }
    .svc-info strong { display: block; font-size: 0.95rem; }
    .svc-info a { font-size: 0.8rem; color: var(--muted, #64748b); text-decoration: none; }
    .svc-info a:hover { text-decoration: underline; }
    .dot { width: 10px; height: 10px; border-radius: 50%; flex: none; }
    .dot.operational { background: #10b981; }
    .dot.degraded { background: #f59e0b; }
    .dot.down { background: #ef4444; }
    .svc-meta { display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap; }
    .latency, .note { font-size: 0.8rem; color: var(--muted, #64748b); }
    .badge { font-size: 0.76rem; font-weight: 700; padding: 0.22rem 0.6rem; border-radius: 999px; }
    .badge.operational { background: color-mix(in srgb, #10b981 14%, transparent); color: #059669; }
    .badge.degraded { background: color-mix(in srgb, #f59e0b 16%, transparent); color: #d97706; }
    .badge.down { background: color-mix(in srgb, #ef4444 16%, transparent); color: #dc2626; }
    .status-notes { padding: 1.1rem 1.25rem; border-radius: 12px; border: 1px solid var(--border, #e2e8f0); background: var(--surface, #ffffff); }
    .status-notes h3 { margin: 0 0 0.45rem; font-size: 1rem; }
    .status-notes p { margin: 0 0 0.5rem; font-size: 0.9rem; color: var(--muted, #64748b); }
    .status-notes p:last-child { margin-bottom: 0; }
  `,
})
export class StatusPageComponent implements OnInit {
  private readonly api = inject(EcosystemApiService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly report = signal<LiveEcosystemStatusReport | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly backends = computed(() =>
    (this.report()?.services ?? []).filter((s) => s.category === 'backend'),
  );
  readonly frontends = computed(() =>
    (this.report()?.services ?? []).filter((s) => s.category === 'frontend'),
  );

  ngOnInit(): void {
    if (this.isBrowser) {
      this.load(false);
    }
  }

  load(refresh: boolean): void {
    this.loading.set(true);
    this.error.set('');
    this.api.getEcosystemStatus(refresh).subscribe({
      next: (r) => {
        this.report.set(r);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not reach id.keshavsingh.in/api/status right now.');
      },
    });
  }

  overallTitle(r: LiveEcosystemStatusReport): string {
    if (r.overallStatus === 'operational') return 'All Systems Operational';
    if (r.overallStatus === 'degraded') return 'Partial Service Degradation';
    return 'Service Outage Detected';
  }

  statusLabel(svc: LiveServiceStatus): string {
    if (svc.status === 'operational') return svc.httpStatus ? `Operational (${svc.httpStatus})` : 'Operational';
    if (svc.status === 'degraded') return svc.httpStatus ? `Degraded (${svc.httpStatus})` : 'Degraded';
    return svc.httpStatus ? `Down (${svc.httpStatus})` : 'Down';
  }
}
