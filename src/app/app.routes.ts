import { Routes } from '@angular/router';
import { AppDetailPageComponent } from './pages/apps/app-detail.page';
import { AppsPageComponent } from './pages/apps/apps.page';
import { AboutPageComponent, ContactPageComponent } from './pages/contact-about/about-contact.page';
import { CreatorsPageComponent } from './pages/creators/creators.page';
import { GuideDetailPageComponent } from './pages/guides/guide-detail.page';
import { GuidesPageComponent } from './pages/guides/guides.page';
import { HomePageComponent } from './pages/home/home.page';
import {
  CookiePolicyPageComponent,
  DisclaimerPageComponent,
  NotFoundPageComponent,
  PrivacyPolicyPageComponent,
  SitemapPageComponent,
  TermsPageComponent,
} from './pages/legal/legal.page';
import { InteractPageComponent, PlansPageComponent, RoadmapPageComponent } from './pages/plans/plans-roadmap.page';
import { ToolDetailPageComponent } from './pages/tools/tool-detail.page';
import { ToolsPageComponent } from './pages/tools/tools.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    pathMatch: 'full',
    data: {
      title: 'Keshav Ecosystem Hub — Interactive Web Tools, Creator Studios & Platform Guides',
      description:
        'Main creator and software ecosystem hub on keshavsingh.in: free calculators, AnimStudio AI & Panchang walkthroughs, YouTube creator work, original guides, and plans.',
    },
  },
  {
    path: 'apps',
    component: AppsPageComponent,
    data: {
      title: 'All 8 Ecosystem Apps & Platforms | keshavsingh.in',
      description:
        'Explore every connected website and app across keshavsingh.in including AnimStudio AI, Hindu Panchang, Pratiyogita, SocialPulse, Content Blog, Ghar Ledger, FamSphere, and Portfolio.',
    },
  },
  { path: 'apps/:slug', component: AppDetailPageComponent },
  {
    path: 'tools',
    component: ToolsPageComponent,
    data: {
      title: 'Interactive Creator, Panchang & Architecture Calculators | keshavsingh.in',
      description:
        'Free browser utilities including YouTube RPM Estimator, 3D Short Pacing JSON Planner, Vikram Samvat & Rahu Kaal Calculator, and Microservices Capacity Planner.',
    },
  },
  { path: 'tools/:slug', component: ToolDetailPageComponent },
  {
    path: 'creators',
    component: CreatorsPageComponent,
    data: {
      title: 'Creator Studios, 3D Animated Series & YouTube Channels | keshavsingh.in',
      description:
        'Discover official YouTube creator channels (@keshavsinghworld, @OmkarShivBhakti, @KESHAV-ANIM-FF), original 3D animations, and searchable video episodes.',
    },
  },
  {
    path: 'guides',
    component: GuidesPageComponent,
    data: {
      title: 'Original Engineering, Vedic Astronomy & Creator Guides | keshavsingh.in',
      description:
        'Long-form technical guides covering .NET 10 SSO, FFmpeg 3D animations, Vedic Panchang astronomy math, YouTube AdSense compliance, and Pratiyogita architecture.',
    },
  },
  { path: 'guides/:slug', component: GuideDetailPageComponent },
  {
    path: 'plans',
    component: PlansPageComponent,
    data: {
      title: 'Plans, Creator Memberships & Support | keshavsingh.in',
      description:
        'Compare Ecosystem Explorer free access, Creator Studio SSO membership, and Pratiyogita tournament sponsorship tiers.',
    },
  },
  {
    path: 'roadmap',
    component: RoadmapPageComponent,
    data: {
      title: 'Public Product Roadmap 2026–2027 | keshavsingh.in',
      description:
        'Track shipped and upcoming milestones across AnimStudio AI, creator channels, Pratiyogita, and keshavsingh.in tools.',
    },
  },
  {
    path: 'interact',
    component: InteractPageComponent,
    data: {
      title: 'How to Interact & Collaborate | keshavsingh.in',
      description:
        'Ways to join live stream quizzes, moderated technical blog comments, SSO creator access, and community feedback.',
    },
  },
  {
    path: 'about',
    component: AboutPageComponent,
    data: {
      title: 'About Keshav Ecosystem Hub & Publishing Standards | keshavsingh.in',
      description:
        'Learn who builds keshavsingh.in, our original editorial and calculator standards, and how our career portfolio links via portfolio.keshavsingh.in.',
    },
  },
  {
    path: 'contact',
    component: ContactPageComponent,
    data: {
      title: 'Contact Us & Membership Inquiries | keshavsingh.in',
      description:
        'Message Keshav Singh directly regarding creator memberships, sponsorships, bug reports, or privacy requests.',
    },
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyPageComponent,
    data: {
      title: 'Privacy Policy (AdSense & FamSphere) | keshavsingh.in',
      description:
        'Privacy policy covering keshavsingh.in, Google AdSense third-party advertising cookies, Central SSO, and FamSphere mobile permissions.',
    },
  },
  {
    path: 'terms',
    component: TermsPageComponent,
    data: {
      title: 'Terms & Conditions | keshavsingh.in',
      description: 'Terms governing use of calculators, guides, and connected apps across keshavsingh.in.',
    },
  },
  {
    path: 'cookie-policy',
    component: CookiePolicyPageComponent,
    data: {
      title: 'Cookie Policy & Consent Settings | keshavsingh.in',
      description: 'Details on essential theme/consent preferences, telemetry, and advertising cookies on keshavsingh.in.',
    },
  },
  {
    path: 'disclaimer',
    component: DisclaimerPageComponent,
    data: {
      title: 'General & Calculator Disclaimer | keshavsingh.in',
      description: 'Scope disclosures for financial estimators, Panchang timings, and outbound platform links.',
    },
  },
  {
    path: 'sitemap',
    component: SitemapPageComponent,
    data: {
      title: 'Sitemap | keshavsingh.in',
      description: 'Directory of all tools, application guides, articles, and legal pages on keshavsingh.in.',
    },
  },
  { path: '404', component: NotFoundPageComponent, data: { title: 'Page Not Found | keshavsingh.in', description: 'Route not found.' } },
  { path: '**', component: NotFoundPageComponent, data: { title: 'Page Not Found | keshavsingh.in', description: 'Route not found.' } },
];
