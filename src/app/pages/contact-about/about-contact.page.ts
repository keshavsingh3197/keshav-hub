import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EcosystemApiService } from '../../services/ecosystem-api.service';
import { I18nHubService } from '../../services/i18n-hub.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>{{ i18n.t('nav.about') }}</span></div>
        <span class="eyebrow">Founder &amp; Editorial Standards</span>
        <h1>{{ i18n.t('pages.aboutTitle') }}</h1>
        <p class="lead">
          The story, software architecture principles, and content transparency standards behind Keshav Singh’s interconnected web utilities and animation studios.
        </p>
      </div>
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

        <div class="cta-row">
          <a routerLink="/apps" class="btn btn-primary btn-sm">Explore All 8 Platforms</a>
          <a routerLink="/contact" class="btn btn-outline btn-sm">Contact Keshav</a>
          <a href="https://portfolio.keshavsingh.in" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Open Portfolio &amp; CV &#8599;</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .cta-row { display: flex; flex-wrap: wrap; gap: 0.65rem; margin-top: 1.5rem; }
  `,
})
export class AboutPageComponent {
  readonly i18n = inject(I18nHubService);
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a routerLink="/">{{ i18n.t('nav.home') }}</a> / <span>{{ i18n.t('nav.contact') }}</span></div>
        <span class="eyebrow">Direct Inbox &amp; Support</span>
        <h1>{{ i18n.t('pages.contactTitle') }}</h1>
        <p class="lead">
          Send creator membership requests, Pratiyogita sponsorship inquiries, privacy or data-deletion requests, bug reports, or collaboration messages straight to our encrypted admin inbox.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container grid-2">
        <div class="card">
          <h2>Send a Direct Message</h2>
          <form (ngSubmit)="submit()" class="form-grid">
            <div class="field">
              <label for="c-name">Your Name</label>
              <input id="c-name" name="name" required class="input" placeholder="e.g. Aarav Sharma" [ngModel]="name()" (ngModelChange)="name.set($event)" />
            </div>
            <div class="field">
              <label for="c-email">Email Address</label>
              <input id="c-email" name="email" type="email" required class="input" placeholder="you&#64;example.com" [ngModel]="email()" (ngModelChange)="email.set($event)" />
            </div>
            <div class="field">
              <label for="c-subject">Topic / Subject</label>
              <select id="c-subject" name="subject" class="select" [ngModel]="subject()" (ngModelChange)="subject.set($event)">
                <option value="General Ecosystem Inquiry">General Ecosystem Inquiry</option>
                <option value="Creator Studio & SSO Membership Request">Creator Studio &amp; SSO Membership Request</option>
                <option value="Sponsorship / Pratiyogita Collaboration">Sponsorship / Pratiyogita Collaboration</option>
                <option value="Technical Bug Report / Feature Suggestion">Technical Bug Report / Feature Suggestion</option>
                <option value="Privacy / Data Deletion Request">Privacy / Data Deletion Request</option>
              </select>
            </div>
            <div class="field">
              <label for="c-msg">Message</label>
              <textarea id="c-msg" name="message" rows="5" required class="textarea"
                placeholder="Share your question, channel/school details, or project goal..."
                [ngModel]="message()" (ngModelChange)="message.set($event)"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="submitting()">
              {{ submitting() ? 'Sending message...' : 'Send Message' }}
            </button>

            @if (statusMsg()) {
              <div class="callout" [class.ok]="statusKind() === 'ok'" [class.err]="statusKind() === 'err'">
                {{ statusMsg() }}
              </div>
            }
          </form>
        </div>

        <aside class="form-grid">
          <div class="card">
            <h2>Direct Channels &amp; Official Profiles</h2>
            <ul class="contact-list">
              <li><strong>Business &amp; Support Email:</strong> <a href="mailto:keshavsingh4522@gmail.com">keshavsingh4522&#64;gmail.com</a></li>
              <li><strong>Location:</strong> NCR (Gurgaon / Noida), India</li>
              <li><strong>GitHub:</strong> <a href="https://github.com/keshavsingh3197" target="_blank" rel="noopener noreferrer">github.com/keshavsingh3197 &#8599;</a></li>
              <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/keshavsingh3197/" target="_blank" rel="noopener noreferrer">linkedin.com/in/keshavsingh3197 &#8599;</a></li>
              <li><strong>YouTube Channels:</strong>
                <a href="https://www.youtube.com/@keshavsinghworld" target="_blank" rel="noopener noreferrer">&#64;keshavsinghworld</a>,
                <a href="https://www.youtube.com/@OmkarShivBhakti" target="_blank" rel="noopener noreferrer">&#64;OmkarShivBhakti</a>,
                <a href="https://www.youtube.com/@KESHAV-ANIM-FF" target="_blank" rel="noopener noreferrer">&#64;KESHAV-ANIM-FF</a>
              </li>
            </ul>
          </div>

          <div class="card">
            <h2>Response &amp; Privacy Notice</h2>
            <p class="muted">
              Form submissions transmit over HTTPS directly to <code>id.keshavsingh.in/api/contact</code>, where entries are encrypted at rest inside the central Admin Contact Inbox. We do not sell contact details or subscribe senders to automated marketing lists.
            </p>
            <p class="muted" style="margin-bottom: 0;">
              For privacy removal requests regarding FamSphere or ecosystem accounts, see our <a routerLink="/privacy-policy">Privacy Policy</a>.
            </p>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .card h2 { margin-top: 0; font-size: 1.25rem; }
    .contact-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.75rem; }
    .muted { color: var(--text-muted); }
    .ok { border-color: var(--success); background: var(--success-soft); }
    .err { border-color: var(--warn); background: var(--warn-soft); }
  `,
})
export class ContactPageComponent implements OnInit {
  private readonly api = inject(EcosystemApiService);
  private readonly route = inject(ActivatedRoute);
  readonly i18n = inject(I18nHubService);

  readonly name = signal('');
  readonly email = signal('');
  readonly subject = signal('General Ecosystem Inquiry');
  readonly message = signal('');
  readonly submitting = signal(false);
  readonly statusMsg = signal('');
  readonly statusKind = signal<'ok' | 'err' | ''>('');

  ngOnInit(): void {
    const topic = this.route.snapshot.queryParamMap.get('topic');
    if (topic === 'membership') {
      this.subject.set('Creator Studio & SSO Membership Request');
    }
  }

  submit(): void {
    if (!this.name().trim() || !this.email().trim() || !this.message().trim()) {
      this.statusKind.set('err');
      this.statusMsg.set('Please complete your name, email address, and message before submitting.');
      return;
    }

    this.submitting.set(true);
    this.statusMsg.set('');

    this.api
      .submitContact({
        name: this.name().trim(),
        email: this.email().trim(),
        subject: this.subject(),
        message: `[Hub Contact] ${this.subject()}\n\n${this.message().trim()}`,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.statusKind.set('ok');
          this.statusMsg.set('Thank you — your message was delivered securely to the Keshav Admin inbox.');
          this.message.set('');
        },
        error: () => {
          this.submitting.set(false);
          this.statusKind.set('err');
          this.statusMsg.set('Unable to reach the contact server right now. Please email keshavsingh4522@gmail.com directly.');
        },
      });
  }
}
