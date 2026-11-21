import type { IconName } from '../ui/icon.component';

/** Visual identity (icon + two-stop gradient) for every catalog item, so cards read at a glance. */
export interface VisualIdentity {
  icon: IconName;
  from: string;
  to: string;
}

export const APP_VISUALS: Record<string, VisualIdentity> = {
  animstudio: { icon: 'film', from: '#7c3aed', to: '#db2777' },
  panchang: { icon: 'calendar', from: '#ea580c', to: '#f59e0b' },
  pratiyogita: { icon: 'trophy', from: '#0891b2', to: '#2563eb' },
  'social-analytics': { icon: 'chart', from: '#db2777', to: '#f97316' },
  'content-blog': { icon: 'book', from: '#2563eb', to: '#4f46e5' },
  'ghar-ledger': { icon: 'wallet', from: '#059669', to: '#10b981' },
  famsphere: { icon: 'heart', from: '#e11d48', to: '#a855f7' },
  portfolio: { icon: 'user', from: '#334155', to: '#0f766e' },
};

export const TOOL_VISUALS: Record<string, VisualIdentity> = {
  'youtube-earnings-estimator': { icon: 'chart', from: '#dc2626', to: '#f97316' },
  'short-hook-pacing-planner': { icon: 'clock', from: '#7c3aed', to: '#db2777' },
  'panchang-samvat-converter': { icon: 'calendar', from: '#ea580c', to: '#f59e0b' },
  'api-latency-capacity-planner': { icon: 'server', from: '#2563eb', to: '#0891b2' },
};

export const CHANNEL_VISUALS: Record<string, VisualIdentity> = {
  keshavsinghworld: { icon: 'code', from: '#2563eb', to: '#7c3aed' },
  omkarshivbhakti: { icon: 'sparkles', from: '#ea580c', to: '#dc2626' },
  'keshav-anim-ff': { icon: 'film', from: '#db2777', to: '#7c3aed' },
};

export const GUIDE_CATEGORY_VISUALS: Record<string, VisualIdentity> = {
  Architecture: { icon: 'server', from: '#2563eb', to: '#0891b2' },
  'Creator & Media': { icon: 'film', from: '#7c3aed', to: '#db2777' },
  'Vedic Astronomy': { icon: 'calendar', from: '#ea580c', to: '#f59e0b' },
  'Policy & Monetization': { icon: 'shield', from: '#059669', to: '#0d9488' },
};

const FALLBACK: VisualIdentity = { icon: 'sparkles', from: '#2563eb', to: '#7c3aed' };

export function visualOf(map: Record<string, VisualIdentity>, key: string): VisualIdentity {
  return map[key] ?? FALLBACK;
}

/** CSS `background` value for an icon chip / banner. */
export function gradientOf(v: VisualIdentity): string {
  return `linear-gradient(135deg, ${v.from}, ${v.to})`;
}
