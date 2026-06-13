# Claude for Local Services

Claude for local services businesses is built for the owner who runs a service trade in a geographic territory — plumbers, electricians, HVAC, landscaping, cleaning, painting, dental practices, salons, fitness studios, photographers, auto repair shops, and the long tail of skilled trades. This guide covers how Claude (the AI from Anthropic) handles the dispatch, follow-up, review management, and admin work that pulls owners off the truck or the chair.

If your business runs a route, fills appointments, or invoices per job, this guide is for you.

---

## Why local services is different

Local services businesses share three operational facts that change how Claude is used:

1. **Cash and capacity are visible weekly, not monthly.** A plumber knows by Wednesday whether the week will hit revenue. An ecommerce operator sees it at the end of the month. Workflows must run on weekly cadence.
2. **Reviews are existential.** A salon owner whose Google rating drops from 4.7 to 4.4 loses 20% of new client bookings. Review response is not a marketing nice-to-have — it is core operations.
3. **Most owners are field operators first.** The owner is on a job site, in a chair, behind a counter. They open their phone, not a laptop. Workflows have to be runnable in 5 minutes from a phone.

Claudient's small-business skill set is built around those three facts.

---

## The local services skill stack

### Dispatch and scheduling

- [Contractor Trades](../skills/small-business/contractor-trades.md) — quote drafting, job scheduling, and customer comms for plumbing, HVAC, electrical
- [Customer Inquiry](../skills/small-business/customer-inquiry.md) — first-response drafts for booking requests after hours
- [Meeting to Action](../skills/small-business/meeting-to-action.md) — turn a phone consultation into a structured quote and follow-up

### Specific verticals

- [Restaurant Operations](../skills/small-business/restaurant-ops.md) — full-service and QSR-specific workflows
- [Real Estate Listing](../skills/small-business/real-estate-listing.md) — listing copy, comp research, buyer follow-up
- [Salon and Spa Operations](../skills/small-business/salon-spa-ops.md) — no-show recovery, retention sequences, service descriptions
- [Dental Practice](../skills/small-business/dental-practice.md) — recall scheduling, insurance verification, treatment plan follow-up
- [Fitness Gym Operations](../skills/small-business/fitness-gym-ops.md) — class fill rates, retention, trial-to-member conversion
- [Photography Studio](../skills/small-business/photography-studio.md) — inquiry-to-booking, contract, gallery delivery
- [Bookkeeper Practice](../skills/small-business/bookkeeper-practice.md) — for the bookkeeper or accountant running their own firm

### Reviews and reputation

- [Review Response](../skills/small-business/review-response.md) — Google and Yelp reply drafts that match your voice
- [Customer Feedback Synthesizer](../skills/small-business/customer-feedback-synthesizer.md) — pattern detection across hundreds of reviews

### Finance and admin

- [Invoice Chaser](../skills/small-business/invoice-chaser.md) — AR follow-up by aging bucket
- [QuickBooks Workflow](../skills/small-business/quickbooks-workflow.md) — month-end close
- [Cash Flow Forecast](../skills/small-business/cash-flow-forecast.md) — especially important for service businesses with uneven payment timing
- [Margin Analyzer](../skills/small-business/margin-analyzer.md) — which job types and which technicians produce the best margin
- [Payroll Planner](../skills/small-business/payroll-planner.md) — cash runway against payroll for businesses with W-2 staff

### Hiring and team

- [Job Description](../skills/small-business/job-description.md) — accurate job descriptions for technicians, assistants, and apprentices
- [Hiring Pipeline](../skills/small-business/hiring-pipeline.md) — structured screening for a high-application, low-show industry
- [SOP Writer](../skills/small-business/sop-writer.md) — codify what the founder does into a manual the team can run

---

## How a local services owner sets it up

The setup time budget is 90 minutes total. Local services owners do not have a free evening — set up across three lunch breaks if needed.

### Lunch 1 — Foundation (30 minutes)

1. **Claude Pro at $20/month** for solo owner-operators. **Claude Team at $30/seat** if you have a dispatcher, office manager, or assistant.
2. **Open Claude Cowork** from your Claude dashboard.
3. **Write Business Context.** For a service business, include: trade or specialty, service area (city/region), service mix and average ticket, team size and structure, brand voice (warm-and-trustworthy vs straight-shooter), and your three biggest competitors.

### Lunch 2 — Connect (30 minutes)

1. **Connect QuickBooks Online.** Unlocks finance workflows.
2. **Connect your CRM or service software** if it has an MCP/API integration. ServiceTitan, Housecall Pro, Jobber, Mindbody, Acuity, and Square Appointments all have varying levels of compatibility. If yours doesn't yet, the workflows still run on copy-paste data.
3. **Connect Google Workspace.** Needed for calendar reads and email drafting.

### Lunch 3 — First workflow (30 minutes)

1. **Run Review Response on the last 10 reviews on your Google Business Profile.** Read Claude's drafts, post the ones that sound like you. This is the most immediately satisfying workflow for any local services owner — it clears a backlog that's been sitting for weeks.
2. **Set up the weekly Monday Brief.** Even for service businesses where every day looks the same operationally, knowing the previous week's revenue, AR aging, and pipeline before 9am Monday changes how you run Monday.

---

## Local services 30/60/90

### Days 1-30: Reviews and AR

Two workflows running weekly: Review Response on new reviews, Invoice Chaser on overdue invoices. Together they recover 60% of the operator hours typically lost to "admin." Owners report that the AR follow-up alone collects $2-5K of previously-stuck money in the first 30 days.

### Days 31-60: Dispatch and customer

Customer Inquiry handles after-hours booking requests, which is the single biggest source of lost business for most local services operators (the lead that called at 7pm on Tuesday and went with the next company that called them back by Wednesday morning). The vertical-specific skill (Contractor Trades for trades, Salon-Spa for personal services, Dental for healthcare) layers on the work specific to your industry.

Time saved: 8-12 hours per week.

### Days 61-90: Hiring and scale

Job Description and Hiring Pipeline activate when you decide to hire. SOP Writer captures the founder's process in writing — the gating step to handing real work to a new hire. Margin Analyzer reveals which services are actually profitable (and which are loss-leaders disguised as revenue).

Time saved: 10-15 hours per week, and the business becomes operable without the owner on every call.

---

## Local services-specific success patterns

**Review Response runs every Monday morning, without exception.** The 4.7-to-4.4 rating drop happens silently. Weekly response keeps your responsiveness visible to future searchers — Google considers response cadence as a ranking signal for local pack results.

**Run Customer Feedback Synthesizer quarterly.** The pattern that emerges from 200 reviews is rarely what individual reviews say. Common surfaces: techs are great but the office is slow to call back; pricing is fine but the upfront estimate doesn't match the final invoice; cleanups after the job are inconsistent. These are fixable. Individual reviews don't make them loud enough to fix.

**Invoice Chaser saves the most money in trades and contracting.** Skilled trades have the highest AR aging of any small-business category — 30-day average is common, 60+ days is not unusual. Weekly chasing recovers a meaningful chunk of working capital and changes which jobs the business can take next month.

**Cash Flow Forecast prevents the bad month.** For service businesses with payroll, knowing two weeks ahead that cash is going to be tight is the difference between rescheduling a vacation and missing payroll. Run it weekly.

**Don't let Claude write quotes you haven't reviewed.** The Contractor Trades skill drafts quotes from your scope notes. They look right. But pricing nuances — the customer who always asks for a discount, the materials surcharge that just hit, the union rate vs non-union — live in your head. Claude drafts, you sign.

---

## What Claude is NOT for in local services

**Dispatch decisions.** Routing optimization (which tech goes to which job) belongs to ServiceTitan, Housecall Pro, Jobber, or your dispatch software. Claude reads the result, not the route planner.

**Pricing strategy without your inputs.** Pricing Optimizer is a structured framework for testing prices you're considering. It does not tell you what to charge based on your local market — that's your read.

**Insurance and warranty interpretation.** Workflows touch insurance verification and warranty follow-up but do not replace your judgment on coverage decisions. Especially in dental, auto, and HVAC — the warranty fine print matters.

**Replacing the relationship-based parts of the business.** Local services run on trust. A first-time HVAC customer becomes a 20-year customer because of how you handled their first emergency at 11pm. That call is yours.

---

## FAQ

### Is Claude good for local services businesses?

Yes. The combination of weekly cadence workflows (Invoice Chaser, Cash Flow, Review Response) and vertical-specific skills (Contractor Trades, Salon-Spa, Dental, Fitness) covers the operational work that consumes most of a local services owner's week.

### Does Claude work with ServiceTitan, Housecall Pro, or Jobber?

Integration depth varies by platform. The native Claude for Small Business integrations cover QuickBooks, HubSpot, PayPal, Google Workspace, and a growing list of vertical platforms. Service-software-specific integrations are improving via MCP servers — check the [MCP directory](../mcp/) for the current list. Workflows still run on copy-paste data when a direct integration isn't available.

### How does Claude help with Google reviews?

Review Response drafts replies to new Google Business Profile reviews in your brand voice. You approve and post. The skill also flags reviews that contain operational complaints worth digging into (specific tech named, recurring issue, location/scheduling complaint).

### Can Claude help me hire technicians, stylists, or assistants?

Job Description writes the post. Hiring Pipeline structures screening calls and scores candidates against your criteria. The skills do not interview, conduct trade tests, or check references — those are the parts of hiring that need to stay human.

### How much does Claude cost for a local services business?

$20/month for solo owner-operators on Claude Pro. $30/seat/month for Claude Team if you have an office manager, dispatcher, or business partner using the workflows. Plus your existing QuickBooks, CRM, and Google Workspace subscriptions.

### Will Claude work for trades like plumbing, HVAC, electrical?

Yes. Contractor Trades is the dedicated skill for trades operators. It covers quoting, scheduling comms, follow-up, and post-job thank-you sequences. Combined with Invoice Chaser and Cash Flow Forecast, it handles the operational backbone of a trades business.

### Can Claude handle insurance verification or claims?

Claude drafts insurance verification requests and reads back responses for completeness, but the final read on coverage is yours. For dental, the Dental Practice skill includes a structured insurance verification sub-flow. For trades and auto, insurance work is more variable and Claude assists rather than owns it.

### Is Claude better than ChatGPT for local services?

For workflow automation tied to your real business data, yes — significantly. ChatGPT writes a generic invoice reminder. Claude reads your QuickBooks AR aging report and drafts personalized reminders by invoice. For one-off questions and brainstorming, both work fine.

### What if I'm not technical at all?

The Claude for Small Business workflows are point-and-click. The Claudient skills in this repo are activated by typing plain English instructions to Claude. The most technical step is connecting QuickBooks via OAuth, which is a 3-click process.

---

## Related guides

- [Claude for Small Business — Product Guide](claude-for-small-business.md)
- [Claude for Solopreneurs](claude-for-solopreneurs.md) — if you run the business alone
- [Claude for Ecommerce](claude-for-ecommerce.md) — if you also sell online
- [Claude for Coaches and Consultants](claude-for-coaches-consultants.md)
- [SEO Strategy for Small Business Content](claude-small-business-seo-strategy.md)

---
