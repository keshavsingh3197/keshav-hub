import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import enBundle from '../../assets/i18n/en.json';
import hiBundle from '../../assets/i18n/hi.json';

export type HubLocale = 'en' | 'hi';

type JsonRecord = Record<string, unknown>;

const STORAGE_KEY = 'ks_hub_lang';
const REMOTE_I18N_BASE = 'https://id.keshavsingh.in/api/i18n';

@Injectable({ providedIn: 'root' })
export class I18nHubService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser: boolean;

  readonly locale = signal<HubLocale>('en');
  private readonly remoteOverrides = signal<Partial<Record<HubLocale, Record<string, string>>>>({});

  readonly isHindi = computed(() => this.locale() === 'hi');

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(DOCUMENT) private readonly doc: Document,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const saved = this.safeReadStorage();
      if (saved === 'hi' || saved === 'en') {
        this.applyLocale(saved, false);
      } else {
        const navLang = (navigator.language || '').toLowerCase();
        if (navLang.startsWith('hi')) {
          this.applyLocale('hi', false);
        }
      }
    }
  }

  setLocale(next: HubLocale): void {
    this.applyLocale(next, true);
  }

  toggleLocale(): void {
    this.setLocale(this.locale() === 'en' ? 'hi' : 'en');
  }

  /**
   * Resolves a dotted translation key (e.g. `hero.title` or `items.apps.animstudio.name`), checking
   * admin runtime overrides first, then the active locale JSON file (`en.json` or `hi.json`), falling
   * back cleanly to English if a key is omitted.
   */
  t(key: string, fallback?: string): string {
    const active = this.locale();
    const override = this.remoteOverrides()[active]?.[key];
    if (override) return override;

    const fromActive = lookupDotted(active === 'hi' ? (hiBundle as JsonRecord) : (enBundle as JsonRecord), key);
    if (fromActive) return fromActive;

    const fromEn = lookupDotted(enBundle as JsonRecord, key);
    return fromEn || fallback || key;
  }

  private applyLocale(next: HubLocale, persist: boolean): void {
    this.locale.set(next);
    if (this.doc?.documentElement) {
      this.doc.documentElement.setAttribute('lang', next);
    }
    if (persist && this.isBrowser) {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore storage quota / private mode restrictions
      }
    }
    if (this.isBrowser) {
      this.fetchRemoteOverrides(next);
    }
  }

  private fetchRemoteOverrides(lang: HubLocale): void {
    if (this.remoteOverrides()[lang]) return;
    this.http
      .get<Record<string, string>>(`${REMOTE_I18N_BASE}/${lang}?ns=hub`)
      .pipe(catchError(() => of(null)))
      .subscribe((mapData) => {
        if (!mapData || typeof mapData !== 'object') return;
        this.remoteOverrides.update((cur) => ({ ...cur, [lang]: mapData }));
      });
  }

  private safeReadStorage(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }
}

function lookupDotted(obj: JsonRecord, path: string): string | null {
  let cur: unknown = obj;
  for (const part of path.split('.')) {
    if (!cur || typeof cur !== 'object' || !(part in (cur as JsonRecord))) {
      return null;
    }
    cur = (cur as JsonRecord)[part];
  }
  return typeof cur === 'string' ? cur : null;
}
