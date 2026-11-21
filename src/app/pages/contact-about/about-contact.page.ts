import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EcosystemApiService } from '../../services/ecosystem-api.service';
import { I18nHubService } from '../../services/i18n-hub.service';
import { IconComponent, IconName } from '../../ui/icon.component';

const ABOUT_FACTS: { icon: IconName; value: string; label: string }[] = [
  { icon: 'code', value: '.NET · Angular', label: 'Core stack' },
  { icon: 'server', value: 'Azure · AWS', label: 'Cloud' },
  { icon: 'lock', value: 'OAuth2 · Passkeys', label: 'Identity' },
  { icon: 'film', value: '3D · FFmpeg', label: 'Video' },
];

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <section class="page-header">
      <div class="container about-head">
        <img src="assets/k.png" width="88" height="88" alt="keshavsingh.in logo" class="about-avatar" />
        <div>
          <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>{{ i18n.t('nav.about') }}</span></div>
          <h1>{{ i18n.t('pages.aboutTitle') }}</h1>
          <p class="lead">Software engineer and creator building free tools, connected apps and animated stories for India and beyond.</p>
        </div>
      </div>
    </section>

    <section class="container facts" aria-label="Quick facts">
      @for (f of facts; track f.label) {
        <div class="fact">
          <span class="icon-chip sm fact-chip"><app-icon [name]="f.icon" [size]="17" /></span>
          <div><strong>{{ f.value }}</strong><span>{{ f.label }}</span></div>
        </div>
      }
    </section>

    <section class="section">
      <div class="container prose">
        <h2>Who Builds &amp; Operates keshavsingh.in</h2>
        <p>
          <strong>Keshav Singh</strong> is an Indian software engineer (B.Tech in Computer Science, Jaipur Engineering College &amp; Research Centre) specializing in distributed .NET microservices, Angular interfaces, cloud automation on Azure and AWS, and digital video workflows. Across enterprise roles at Publicis Sapient, R Systems, Marlabs, and Unthinkable Solutions, he has built resilient APIs, identity platforms (OAuth2, Azure AD B2C, FIDO2 Passkeys), gRPC pipelines, and event-driven systems.
        </p>
        <p>
          Outside full-time client delivery, Keshav develops and maintains an integrated network of free community tools, Vedic astronomy engines, creative animation suites, and educational coding guides under <code>*.keshavsingh.in</code>.
        </p>

        <h2>Editorial Originality &amp; Tool Accuracy Standard</h2>
        <p>
          Every calculator and guide hosted on <code>keshavsingh.in</code> is authored directly from real implementations running in our production codebases—never copied wholesale from third-party directories. Where tools provide estimates (such as YouTube RPM modeling or cloud container sizing), formulas and underlying assumptions are documented openly on the page so readers can verify every number themselves.
        </p>

        <h2>Why Career Portfolio and Main Hub Are Separate</h2>
        <p>
          To keep recruiters focused and visitors well served, software hiring materials (work timeline, skills matrix, GitHub repos, and PDF CV download) live cleanly at
          <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer">portfolio.keshavsingh.in</a>, while
          <code>keshavsingh.in</code> remains dedicated to interactive calculators, documentation for all eight ecosystem platforms, creator video showcases, and long-form engineering &amp; creator guides.
        </p>

        <div class="cta-row about-cta">
          <a routerLink="/apps" class="btn btn-primary btn-sm">Explore All 8 Platforms</a>
          <a routerLink="/contact" class="btn btn-outline btn-sm">Contact Keshav</a>
          <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Portfolio &amp; CV <app-icon name="external" [size]="14" /></a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .about-head { display: flex; align-items: center; gap: clamp(1rem, 3vw, 1.75rem); flex-wrap: wrap; }
    .about-head > div { flex: 1; min-width: 260px; }
    .about-avatar { width: clamp(64px, 12vw, 96px); height: auto; border-radius: 24px; box-shadow: var(--shadow-lg); background: #fff; }
    .facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 0.75rem; margin-top: 1.5rem; }
    .fact { display: flex; align-items: center; gap: 0.7rem; padding: 0.85rem 1rem; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--radius); }
    .fact strong { display: block; font-size: 0.94rem; }
    .fact span:last-child { font-size: 0.8rem; color: var(--text-muted); }
    .fact-chip { background: linear-gradient(135deg, var(--primary), var(--accent)); }
    .about-cta { margin-top: 1.5rem; }
  `,
})
export class AboutPageComponent {
  readonly i18n = inject(I18nHubService);
  readonly facts = ABOUT_FACTS;
}

/** Subject values are the exact strings the Admin Contact Inbox already receives; labels are localized. */
const CONTACT_TOPICS: { id: string; icon: IconName; subject: string }[] = [
  { id: 'general', icon: 'mail', subject: 'General Ecosystem Inquiry' },
  { id: 'membership', icon: 'user', subject: 'Creator Studio & SSO Membership Request' },
  { id: 'sponsor', icon: 'trophy', subject: 'Sponsorship / Pratiyogita Collaboration' },
  { id: 'bug', icon: 'bolt', subject: 'Technical Bug Report / Feature Suggestion' },
  { id: 'privacy', icon: 'shield', subject: 'Privacy / Data Deletion Request' },
];

const CONTACT_CHANNELS: { icon: IconName; label: string; value: string; url: string }[] = [
  { icon: 'mail', label: 'Email', value: 'keshavsingh4522@gmail.com', url: 'mailto:keshavsingh4522@gmail.com' },
  { icon: 'linkedin', label: 'LinkedIn', value: 'in/keshavsingh3197', url: 'https://www.linkedin.com/in/keshavsingh3197/' },
  { icon: 'github', label: 'GitHub', value: 'keshavsingh3197', url: 'https://github.com/keshavsingh3197' },
  { icon: 'youtube', label: 'YouTube', value: '@keshavsinghworld', url: 'https://www.youtube.com/@keshavsinghworld' },
];

export const CONTACT_LIMITS = { name: 80, email: 254, messageMin: 10, messageMax: 4000 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Client-side pre-check only (the contact API validates again server-side). */
export function isValidContact(name: string, email: string, message: string): boolean {
  const n = name.trim();
  const e = email.trim();
  const m = message.trim();
  return (
    n.length > 0 &&
    n.length <= CONTACT_LIMITS.name &&
    e.length <= CONTACT_LIMITS.email &&
    EMAIL_PATTERN.test(e) &&
    m.length >= CONTACT_LIMITS.messageMin &&
    m.length <= CONTACT_LIMITS.messageMax
  );
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [RouterLink, FormsModule, IconComponent],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>{{ i18n.t('nav.contact') }}</span></div>
        <span class="eyebrow">{{ i18n.t('contact.eyebrow') }}</span>
        <h1>{{ i18n.t('pages.contactTitle') }}</h1>
        <p class="lead">{{ i18n.t('contact.lead') }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container contact-grid">
        <form class="card form-grid" (ngSubmit)="submit()" novalidate>
          <fieldset class="topics">
            <legend>{{ i18n.t('contact.topicLabel') }}</legend>
            <div class="topic-row">
              @for (t of topics; track t.id) {
                <button type="button" class="topic" [class.active]="topicId() === t.id" [attr.aria-pressed]="topicId() === t.id" (click)="topicId.set(t.id)">
                  <app-icon [name]="t.icon" [size]="16" /> {{ i18n.t('contact.topics.' + t.id) }}
                </button>
              }
            </div>
          </fieldset>

          <div class="two-col">
            <div class="field">
              <label for="c-name">{{ i18n.t('contact.name') }}</label>
              <input id="c-name" name="name" required class="input" autocomplete="name" [attr.maxlength]="limits.name"
                [ngModel]="name()" (ngModelChange)="name.set($event)" />
            </div>
            <div class="field">
              <label for="c-email">{{ i18n.t('contact.email') }}</label>
              <input id="c-email" name="email" type="email" required class="input" autocomplete="email" inputmode="email" [attr.maxlength]="limits.email"
                [ngModel]="email()" (ngModelChange)="email.set($event)" />
            </div>
          </div>
          <div class="field">
            <label for="c-msg">{{ i18n.t('contact.message') }}</label>
            <textarea id="c-msg" name="message" rows="5" required class="textarea" [attr.minlength]="limits.messageMin" [attr.maxlength]="limits.messageMax"
              [ngModel]="message()" (ngModelChange)="message.set($event)"></textarea>
            <small class="counter">{{ message().length }} / {{ limits.messageMax }}</small>
          </div>

          <button type="submit" class="btn btn-primary send" [disabled]="submitting()">
            <app-icon name="mail" [size]="17" /> {{ submitting() ? i18n.t('contact.sending') : i18n.t('contact.send') }}
          </button>

          @if (statusKind()) {
            <div class="callout" role="status" [class.ok]="statusKind() === 'ok'" [class.err]="statusKind() !== 'ok'">
              {{ i18n.t('contact.' + statusKind()) }}
            </div>
          }
          <p class="note"><app-icon name="lock" [size]="14" /> {{ i18n.t('contact.privacyNote') }}</p>
        </form>

        <aside>
          <h2 class="aside-title">{{ i18n.t('contact.elsewhere') }}</h2>
          <div class="channels">
            @for (c of channels; track c.url) {
              <a [href]="c.url" class="card card-interactive channel" [attr.target]="c.url.startsWith('http') ? '_blank' : null" rel="noopener noreferrer">
                <span class="icon-chip sm ch-chip"><app-icon [name]="c.icon" [size]="17" /></span>
                <span><strong>{{ c.label }}</strong><small>{{ c.value }}</small></span>
              </a>
            }
          </div>
          <div class="callout aside-links">
            <a routerLink="/privacy-policy">{{ i18n.t('footer.privacy') }}</a> ·
            <a routerLink="/data-deletion">{{ i18n.t('footer.dataDeletion') }}</a> ·
            <a routerLink="/security">{{ i18n.t('nav.security') }}</a>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: clamp(1rem, 3vw, 1.75rem); align-items: start; }
    .contact-grid > form { grid-column: span 2; }
    @media (max-width: 760px) { .contact-grid > form { grid-column: auto; } }
    .topics { border: 0; padding: 0; margin: 0; }
    .topics legend { font-size: 0.86rem; font-weight: 600; margin-bottom: 0.55rem; }
    .topic-row { display: flex; flex-wrap: wrap; gap: 0.45rem; }
    .topic { display: inline-flex; align-items: center; gap: 0.4rem; font: inherit; font-size: 0.86rem; font-weight: 600; padding: 0.48rem 0.85rem; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--text-muted); cursor: pointer; }
    .topic.active { background: var(--primary); border-color: var(--primary); color: var(--on-primary); }
    .two-col { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 1rem; }
    .counter { align-self: flex-end; font-size: 0.75rem; color: var(--text-subtle); }
    .send { justify-self: start; }
    .ok { border-color: var(--success); background: var(--success-soft); }
    .err { border-color: var(--warn); background: var(--warn-soft); }
    .note { display: flex; align-items: center; gap: 0.4rem; margin: 0; font-size: 0.8rem; color: var(--text-subtle); }
    .aside-title { font-size: 1.05rem; margin: 0 0 0.85rem; }
    .channels { display: grid; gap: 0.6rem; }
    .channel { display: flex; align-items: center; gap: 0.8rem; padding: 0.85rem 1rem; color: var(--text); text-decoration: none !important; }
    .channel strong { display: block; font-size: 0.92rem; }
    .channel small { color: var(--text-muted); font-size: 0.8rem; word-break: break-all; }
    .ch-chip { background: linear-gradient(135deg, var(--primary), var(--accent)); }
    .aside-links { margin-top: 1rem; font-size: 0.86rem; }
  `,
})
export class ContactPageComponent implements OnInit {
  private readonly api = inject(EcosystemApiService);
  private readonly route = inject(ActivatedRoute);
  readonly i18n = inject(I18nHubService);

  readonly topics = CONTACT_TOPICS;
  readonly channels = CONTACT_CHANNELS;
  readonly limits = CONTACT_LIMITS;

  readonly topicId = signal('general');
  readonly name = signal('');
  readonly email = signal('');
  readonly message = signal('');
  readonly submitting = signal(false);
  readonly statusKind = signal<'ok' | 'err' | 'invalid' | ''>('');

  ngOnInit(): void {
    const topic = this.route.snapshot.queryParamMap.get('topic');
    if (topic && CONTACT_TOPICS.some((t) => t.id === topic)) {
      this.topicId.set(topic);
    }
  }

  submit(): void {
    if (this.submitting()) return;
    if (!isValidContact(this.name(), this.email(), this.message())) {
      this.statusKind.set('invalid');
      return;
    }
    const subject = (CONTACT_TOPICS.find((t) => t.id === this.topicId()) ?? CONTACT_TOPICS[0]).subject;

    this.submitting.set(true);
    this.statusKind.set('');
    this.api
      .submitContact({
        name: this.name().trim(),
        email: this.email().trim(),
        subject,
        message: `[Hub Contact] ${subject}\n\n${this.message().trim()}`,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.statusKind.set('ok');
          this.message.set('');
        },
        error: () => {
          this.submitting.set(false);
          this.statusKind.set('err');
        },
      });
  }
}
