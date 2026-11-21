import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export type ConsentChoice = 'accepted' | 'essential';

export const CONSENT_KEY = 'ks_hub_consent';

/**
 * Single source of truth for the visitor's cookie / telemetry choice.
 *
 * - Analytics is opt-in: visit telemetry is only sent once the visitor accepts (fail closed).
 * - "Essential only" also asks AdSense for non-personalised ads. `index.html` applies the same flag
 *   before the AdSense script loads on later visits.
 */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly choice = signal<ConsentChoice | null>(null);
  readonly bannerOpen = signal(false);
  readonly analyticsAllowed = computed(() => this.choice() === 'accepted');

  constructor() {
    if (!this.isBrowser) return;
    const saved = readStorage();
    if (saved === 'accepted' || saved === 'essential') {
      this.choice.set(saved);
    } else {
      this.bannerOpen.set(true);
    }
  }

  choose(choice: ConsentChoice): void {
    this.choice.set(choice);
    this.bannerOpen.set(false);
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
    applyAdPersonalization(choice);
  }

  reopen(): void {
    this.bannerOpen.set(true);
  }
}

function readStorage(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function applyAdPersonalization(choice: ConsentChoice): void {
  const w = window as unknown as { adsbygoogle?: { requestNonPersonalizedAds?: number } & unknown[] };
  w.adsbygoogle = w.adsbygoogle || ([] as unknown as { requestNonPersonalizedAds?: number } & unknown[]);
  w.adsbygoogle.requestNonPersonalizedAds = choice === 'accepted' ? 0 : 1;
}
