import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

export interface LiveEcosystemWebsite {
  key: string;
  name: string;
  url: string;
  icon?: string;
  description?: string;
  sortOrder?: number;
  showInEcosystemBar?: boolean;
}

export interface LiveCreatorChannel {
  key: string;
  name: string;
  handle: string;
  platform: string;
  url: string;
  niche?: string;
  tagline?: string;
  isEnabled?: boolean;
}

export interface LiveVideoRecord {
  id: string;
  videoId: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  channelKey: string;
  channelName: string;
  channelHandle: string;
  platform: string;
  niche: string;
  language: string;
  format: string;
  views: number;
  durationSeconds: number;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface LiveServiceStatus {
  key: string;
  name: string;
  category: 'backend' | 'frontend';
  url: string;
  probeUrl: string;
  status: 'operational' | 'degraded' | 'down';
  httpStatus: number | null;
  latencyMs: number | null;
  note: string | null;
}

export interface LiveEcosystemStatusReport {
  overallStatus: 'operational' | 'degraded' | 'outage';
  healthyCount: number;
  degradedCount: number;
  downCount: number;
  totalCount: number;
  checkedAtUtc: string;
  services: LiveServiceStatus[];
}

const HUB_API_BASE = 'https://id.keshavsingh.in/api';

@Injectable({ providedIn: 'root' })
export class EcosystemApiService {
  private readonly isBrowser: boolean;
  private config$?: Observable<{ websites: LiveEcosystemWebsite[]; channels: LiveCreatorChannel[] }>;

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getDirectory(): Observable<{ websites: LiveEcosystemWebsite[]; channels: LiveCreatorChannel[] }> {
    if (!this.isBrowser) {
      return of({ websites: [], channels: [] });
    }
    if (!this.config$) {
      this.config$ = this.http
        .get<{ websites?: LiveEcosystemWebsite[]; channels?: LiveCreatorChannel[] }>(`${HUB_API_BASE}/config`)
        .pipe(
          map((res) => ({
            websites: (res?.websites ?? []).filter((w) => !!w?.url),
            channels: (res?.channels ?? []).filter((c) => c?.isEnabled !== false),
          })),
          catchError(() => of({ websites: [], channels: [] })),
          shareReplay({ bufferSize: 1, refCount: false }),
        );
    }
    return this.config$;
  }

  searchVideos(filters: {
    q?: string;
    channel?: string;
    locale?: string;
    format?: string;
    limit?: number;
  }): Observable<{ items: LiveVideoRecord[]; total: number }> {
    if (!this.isBrowser) {
      return of({ items: [], total: 0 });
    }
    let params = new HttpParams().set('limit', String(filters.limit ?? 12));
    if (filters.q?.trim()) params = params.set('q', filters.q.trim());
    if (filters.channel?.trim()) params = params.set('channel', filters.channel.trim());
    if (filters.locale && filters.locale !== 'all') params = params.set('locale', filters.locale);
    if (filters.format && filters.format !== 'all') params = params.set('format', filters.format);

    return this.http
      .get<{ items?: LiveVideoRecord[]; total?: number }>(`${HUB_API_BASE}/videos/search`, { params })
      .pipe(
        map((res) => ({ items: res?.items ?? [], total: res?.total ?? 0 })),
        catchError(() => of({ items: [], total: 0 })),
      );
  }

  submitContact(payload: ContactSubmission): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ success: boolean; message?: string }>(`${HUB_API_BASE}/contact`, payload);
  }

  getEcosystemStatus(refresh = false): Observable<LiveEcosystemStatusReport> {
    const suffix = refresh ? '?refresh=true' : '';
    return this.http.get<LiveEcosystemStatusReport>(`${HUB_API_BASE}/status${suffix}`);
  }

  trackVisit(path: string): void {
    if (!this.isBrowser) return;
    this.http
      .post(`${HUB_API_BASE}/analytics/visit`, {
        websiteKey: 'hub',
        path: path || '/',
        referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : null,
      })
      .pipe(catchError(() => of(null)))
      .subscribe();
  }
}
