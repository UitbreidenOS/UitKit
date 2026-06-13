---
name: landing-page-generator
description: "Generate high-converting landing pages as Next.js/React TSX components with Tailwind CSS — hero sections, pricing tables, feature grids, FAQ, testimonials, and SEO metadata"
updated: 2026-06-13
---

# Landing Page Generator Skill

## When to activate
- Building a new marketing or product landing page from scratch
- Converting a design brief into working Next.js/React code
- Creating a product launch page, campaign page, or lead capture page
- Building pricing page or feature comparison sections
- Generating A/B test variants for a landing page

## When NOT to use
- Complex web applications (use the project scaffolding skills)
- Blog or content sites (use a CMS-based approach)
- Internal dashboards (wrong audience and patterns)

## Instructions

### Full page generation

```
Generate a landing page for [product].

Product: [name and one-line description]
Target audience: [who visits this page]
Primary CTA: [what you want them to do — signup / demo / buy / download]
Key value props: [3-5 most important things to communicate]
Pricing: [tiers or "contact sales"]
Tone: [professional / startup / friendly / bold / minimal]
Stack: [Next.js 15 App Router / React + Vite]

Generate a complete landing page with these sections:

1. Hero section
2. Social proof (logos or stats)
3. Features / benefits
4. Pricing (if applicable)
5. FAQ
6. CTA section
7. Footer

OUTPUT: Complete TSX component with Tailwind CSS classes.
Target: LCP < 1s, CLS < 0.1, mobile-first responsive.

Example structure:
// app/page.tsx (Next.js) or src/App.tsx (React)
import { HeroSection } from '@/components/landing/HeroSection'
import { SocialProof } from '@/components/landing/SocialProof'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
```

### Hero section variants

```
Generate a hero section for [product].

Variant: [centered / split-screen / video-bg / minimal / bold]
Headline: [main headline — or generate from product description]
Subheadline: [supporting copy]
CTA: [primary button text + URL / secondary button text]
Visual: [screenshot / illustration / video / none]

CENTERED HERO (most common for SaaS):
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {/* Announcement badge */}
        <div className="mb-8 flex justify-center">
          <span className="rounded-full bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-600 ring-1 ring-orange-200">
            New — v2.0 now available
          </span>
        </div>
        
        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Build faster with{' '}
          <span className="text-orange-500">AI-powered</span> workflows
        </h1>
        
        {/* Subheadline */}
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Stop writing boilerplate. Start shipping features. The toolkit that senior engineers use to move 3x faster with Claude Code.
        </p>
        
        {/* CTAs */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/signup"
            className="rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            Get started free
          </a>
          <a href="/demo" className="text-sm font-semibold leading-6 text-gray-900">
            Watch demo <span aria-hidden="true">→</span>
          </a>
        </div>
        
        {/* Social proof numbers */}
        <div className="mt-10 flex items-center justify-center gap-x-8 text-sm text-gray-500">
          <span>★★★★★ 4.9/5</span>
          <span>10,000+ developers</span>
          <span>No credit card needed</span>
        </div>
      </div>
    </section>
  )
}

SPLIT-SCREEN HERO (product + copy side by side):
Generate split-screen variant with image/screenshot on right side.

Generate the hero for my product with appropriate variant.
```

### Pricing section

```
Generate a pricing section for [product].

Tiers: [list — Free / Pro $X / Enterprise]
Billing: [monthly/annual toggle? yes/no]
Most popular: [which tier to highlight]
Features per tier: [list for each]

PRICING TABLE COMPONENT:
const tiers = [
  {
    name: 'Starter',
    price: { monthly: 0, annual: 0 },
    description: 'Perfect for individuals and small projects',
    features: [
      '5 projects',
      '10,000 API calls/month',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start for free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: { monthly: 49, annual: 39 },
    description: 'For growing teams that need more power',
    features: [
      'Unlimited projects',
      '100,000 API calls/month',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'Team collaboration',
    ],
    cta: 'Start free trial',
    href: '/signup?plan=pro',
    highlighted: true,  // Most popular
  },
  {
    name: 'Enterprise',
    price: { monthly: null, annual: null },  // Contact sales
    description: 'Custom pricing for large organisations',
    features: [
      'Everything in Pro',
      'Unlimited API calls',
      'SLA guarantee',
      'Dedicated support',
      'SSO/SAML',
      'Custom contracts',
    ],
    cta: 'Contact sales',
    href: '/contact',
    highlighted: false,
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)
  
  return (
    <section id="pricing" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          
          {/* Annual/Monthly toggle */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className={annual ? 'text-gray-500' : 'font-semibold'}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${annual ? 'bg-orange-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${annual ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={annual ? 'font-semibold' : 'text-gray-500'}>
              Annual <span className="text-orange-500 text-sm">(save 20%)</span>
            </span>
          </div>
        </div>
        
        {/* Pricing cards */}
        <div className="mt-16 grid max-w-lg grid-cols-1 gap-6 mx-auto lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 ${tier.highlighted ? 'bg-orange-500 text-white ring-2 ring-orange-500' : 'bg-white ring-1 ring-gray-200'}`}
            >
              {/* ... tier content */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

Generate the pricing section for my tiers.
```

### SEO metadata

```
Generate SEO metadata for [landing page].

Page: [URL / section name]
Product: [name]
Target keywords: [primary keyword / secondary]
OG image: [path or description]

// app/page.tsx (Next.js App Router)
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claudient — Skills, Agents & Plugins for Claude Code',
  description: 'The community-powered knowledge system for Claude Code. 150+ skills, 22 agents, and hooks for developers, GTM teams, and business owners.',
  keywords: ['claude code', 'ai productivity', 'developer tools', 'claude skills'],
  authors: [{ name: 'Uitbreiden', url: 'https://uitbreiden.com' }],
  openGraph: {
    title: 'Claudient — Skills & Agents for Claude Code',
    description: '150+ skills across 15 categories. Install with: npx claudient add all',
    url: 'https://claudient.dev',
    siteName: 'Claudient',
    images: [{ url: '/social-preview.png', width: 1280, height: 640 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claudient — Skills & Agents for Claude Code',
    description: '150+ skills across 15 categories.',
    images: ['/social-preview.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://claudient.dev',
  },
}

Generate SEO metadata for my landing page.
```

## Example

**User:** I'm launching a B2B SaaS tool that automates invoice reconciliation for accounting teams. I need a landing page. Generate the hero and key messaging.

**Claude's output:**

**Headline options (test these):**

Option A (Pain-first): "Stop chasing invoices manually. Reconcile in minutes, not days."
Option B (Outcome-first): "Invoice reconciliation that actually runs itself."
Option C (Time-specific): "Your accounting team spends 40+ hours/month on invoices. We cut that to 4."

**Recommended: Option C** (most specific, most credible)

**Subheadline:**
"Connect your accounting software once. Our AI matches invoices to POs, flags discrepancies, and surfaces exceptions — so your team reviews decisions, not data."

**CTA:**
Primary: "Start free trial" (14-day, no credit card)
Secondary: "See how it works →" (video demo link)

**Social proof numbers to put below CTA:**
- "500+ accounting teams" or whatever your actual number is
- "Average 38 hours saved per month" (from customer data)
- "SOC 2 Type II certified" (if you have it)

```tsx
// Hero for invoice reconciliation SaaS
<section className="bg-white py-24">
  <div className="max-w-2xl mx-auto text-center px-6">
    <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
      SOC 2 Certified · 500+ accounting teams
    </span>
    <h1 className="mt-6 text-5xl font-bold text-gray-900">
      Your accounting team spends{' '}
      <span className="text-blue-600">40+ hours</span>{' '}
      on invoices. We cut that to 4.
    </h1>
    <p className="mt-6 text-xl text-gray-600">
      Connect your accounting software once. Our AI matches invoices to POs, 
      flags discrepancies, and surfaces exceptions automatically.
    </p>
    <div className="mt-10 flex gap-4 justify-center">
      <a href="/trial" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700">
        Start free trial
      </a>
      <a href="/demo" className="text-blue-600 font-semibold px-8 py-4 flex items-center gap-2">
        Watch 3-min demo →
      </a>
    </div>
  </div>
</section>
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
