import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    pathMatch: 'full',
    data: {
      title: 'Keshav Singh — Engineering Guides, Vedic Calculators & Creator Tools | keshavsingh.in',
      description:
        'Sixteen original .NET 10, FFmpeg, WebGL & Vedic astronomy guides plus 8 free client-side calculators and platform case studies by Keshav Singh.',
    },
  },
  {
    path: 'apps',
    loadComponent: () => import('./pages/apps/apps.page').then((m) => m.AppsPageComponent),
    data: {
      title: 'Ecosystem System Architecture & Platform Case Studies | keshavsingh.in',
      description:
        'System architecture case studies across all 8 platforms on *.keshavsingh.in including AnimStudio AI, Hindu Panchang, Pratiyogita, SocialPulse, Content Blog, Ghar Ledger, FamSphere, and Portfolio.',
    },
  },
  {
    path: 'apps/:slug',
    loadComponent: () => import('./pages/apps/app-detail.page').then((m) => m.AppDetailPageComponent),
  },
  {
    path: 'tools',
    loadComponent: () => import('./pages/tools/tools.page').then((m) => m.ToolsPageComponent),
    data: {
      title: '8 Free Creator, FFmpeg, Vedic Astronomy & Architecture Calculators | keshavsingh.in',
      description:
        'Free client-side utilities: YouTube RPM Estimator, 3D Short Pacing Planner, Vikram Samvat & Rahu Kaal, Microservices Capacity, FFmpeg Bitrate, Lunar Tithi Explorer, JSON-LD Generator, and Cron/JWT Planner.',
    },
  },
  {
    path: 'tools/:slug',
    loadComponent: () => import('./pages/tools/tool-detail.page').then((m) => m.ToolDetailPageComponent),
  },
  {
    path: 'creators',
    loadComponent: () => import('./pages/creators/creators.page').then((m) => m.CreatorsPageComponent),
    data: {
      title: 'Creator Studios, 3D Animated Series & YouTube Channels | keshavsingh.in',
      description:
        'Discover official YouTube creator channels (@keshavsinghworld, @OmkarShivBhakti, @KESHAV-ANIM-FF), original 3D animations, and searchable video episodes.',
    },
  },
  {
    path: 'guides',
    loadComponent: () => import('./pages/guides/guides.page').then((m) => m.GuidesPageComponent),
    data: {
      title: '16 Original Engineering, FFmpeg, Vedic Astronomy & Policy Guides | keshavsingh.in',
      description:
        'In-depth technical guides covering .NET 10 Passkey SSO, AES-256-GCM LLM failover, FFmpeg xfade/loudnorm, Lahiri Ayanamsa Tithi math, MongoDB ESR indexes, and Angular SSG SEO.',
    },
  },
  {
    path: 'guides/:slug',
    loadComponent: () => import('./pages/guides/guide-detail.page').then((m) => m.GuideDetailPageComponent),
  },
  {
    path: 'plans',
    loadComponent: () => import('./pages/plans/plans-roadmap.page').then((m) => m.PlansPageComponent),
    data: {
      title: 'Community Access, Creator Workspaces & Support | keshavsingh.in',
      description:
        'Compare open community access, Creator Studio Central SSO membership, and Pratiyogita tournament sponsorship.',
      noindex: true,
    },
  },
  {
    path: 'roadmap',
    loadComponent: () => import('./pages/plans/plans-roadmap.page').then((m) => m.RoadmapPageComponent),
    data: {
      title: 'Engineering Release Changelog & Architecture Milestones | keshavsingh.in',
      description:
        'Shipped engineering releases and active development tracks across keshavsingh.in, AnimStudio AI, Hindu Panchang, and Pratiyogita.',
      noindex: true,
    },
  },
  {
    path: 'interact',
    loadComponent: () => import('./pages/plans/plans-roadmap.page').then((m) => m.InteractPageComponent),
    data: {
      title: 'How to Interact & Collaborate | keshavsingh.in',
      description:
        'Ways to join live stream quizzes, moderated technical blog comments, SSO creator access, and community feedback.',
      noindex: true,
    },
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/contact-about/about-contact.page').then((m) => m.AboutPageComponent),
    data: {
      title: 'About Keshav Singh — Software Architect & Publishing Standards | keshavsingh.in',
      description:
        'Author biography, enterprise .NET/cloud engineering background, editorial verification standards, and domain governance for keshavsingh.in.',
    },
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact-about/about-contact.page').then((m) => m.ContactPageComponent),
    data: {
      title: 'Contact Keshav Singh & Ecosystem Support | keshavsingh.in',
      description:
        'Message Keshav Singh directly regarding technical feedback, creator memberships, sponsorships, or privacy requests.',
    },
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.PrivacyPolicyPageComponent),
    data: {
      title: 'Privacy Policy (AdSense, Central SSO & FamSphere) | keshavsingh.in',
      description:
        'Privacy policy covering keshavsingh.in, Google AdSense third-party advertising cookies, Central SSO, and FamSphere mobile permissions.',
    },
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.PrivacyPolicyPageComponent),
    data: {
      title: 'Privacy Policy (AdSense & FamSphere) | keshavsingh.in',
      description:
        'Official Privacy Policy for keshavsingh.in and FamSphere Android/iOS mobile app (in.keshavsingh.famsphere).',
      canonicalPath: '/privacy-policy',
      noindex: true,
    },
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.TermsPageComponent),
    data: {
      title: 'Terms & Conditions | keshavsingh.in',
      description: 'Terms governing use of calculators, technical guides, and connected apps across keshavsingh.in.',
    },
  },
  {
    path: 'terms-and-conditions',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.TermsPageComponent),
    data: {
      title: 'Terms & Conditions | keshavsingh.in',
      description: 'Terms governing use of calculators, technical guides, and connected apps across keshavsingh.in.',
      canonicalPath: '/terms',
      noindex: true,
    },
  },
  {
    path: 'cookie-policy',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.CookiePolicyPageComponent),
    data: {
      title: 'Cookie Policy & Consent Settings | keshavsingh.in',
      description: 'Details on essential theme/consent preferences, telemetry, and advertising cookies on keshavsingh.in.',
    },
  },
  {
    path: 'cookies',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.CookiePolicyPageComponent),
    data: {
      title: 'Cookie Policy & Consent Settings | keshavsingh.in',
      description: 'Details on essential theme/consent preferences, telemetry, and advertising cookies on keshavsingh.in.',
      canonicalPath: '/cookie-policy',
      noindex: true,
    },
  },
  {
    path: 'security',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.SecurityPageComponent),
    data: {
      title: 'Security Architecture & Responsible Disclosure | keshavsingh.in',
      description:
        'How keshavsingh.in protects accounts with passkeys, HttpOnly sessions and TLS — and how to report a security vulnerability responsibly.',
    },
  },
  {
    path: 'disclaimer',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.DisclaimerPageComponent),
    data: {
      title: 'General, Financial & Astronomical Disclaimer | keshavsingh.in',
      description: 'Scope disclosures for financial estimators, Panchang timings, and outbound platform links.',
    },
  },
  {
    path: 'data-deletion',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.DataDeletionPageComponent),
    data: {
      title: 'Account & Data Deletion Instructions | keshavsingh.in',
      description: 'How to delete your Central SSO account, FamSphere app records, or Contact Inbox submissions.',
      noindex: true,
    },
  },
  {
    path: 'robots',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.RobotsPageComponent),
    data: {
      title: 'Robots.txt Directives | keshavsingh.in',
      description: 'Human-readable view of search crawler access rules on keshavsingh.in.',
      noindex: true,
    },
  },
  {
    path: 'sitemap',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.SitemapPageComponent),
    data: {
      title: 'Complete Site Directory | keshavsingh.in',
      description: 'Directory of all tools, application case studies, technical articles, and policy pages on keshavsingh.in.',
      noindex: true,
    },
  },
  {
    path: 'resume',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.ResumeBridgePageComponent),
    data: {
      title: 'Engineering Resume & Portfolio Bridge | keshavsingh.in',
      description: 'Keshav Singh’s engineering CV and PDF resume live at portfolio.keshavsingh.in.',
      noindex: true,
    },
  },
  {
    path: '404',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.NotFoundPageComponent),
    data: { title: 'Page Not Found | keshavsingh.in', description: 'Route not found.', noindex: true },
  },
  {
    path: '**',
    loadComponent: () => import('./pages/legal/legal.page').then((m) => m.NotFoundPageComponent),
    data: { title: 'Page Not Found | keshavsingh.in', description: 'Route not found.', noindex: true },
  },
];
