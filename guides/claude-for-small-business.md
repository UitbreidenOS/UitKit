# Claude for Small Business — Product Guide

Claude for Small Business is a specific product layer inside Claude Cowork, launched May 13, 2026. It is not the general Claude.ai chatbot, and it is not Claude Code. It is a set of 15 pre-built, one-toggle workflows built for business owners who want AI to work inside the tools they already pay for — QuickBooks, HubSpot, PayPal, Google Workspace, and the rest — without writing prompts, configuring servers, or hiring a developer.

This guide covers what the product is, what each workflow does, how to set it up, what it requires from each connected tool, and what to expect in the first 90 days.

---

## What It Is and What It Is Not

**What it is:** A structured layer inside Claude Cowork (the GUI-based, no-terminal version of Claude's agentic capabilities) that ships with 15 purpose-built workflows aimed at small business operations. Each workflow connects to one or more business tools you already use, reads data, drafts outputs, and presents everything for your review before anything leaves or changes.

**What it is not:**

- It is not the Claude.ai chatbot. You can ask Claude.ai anything in conversation, but it has no connection to your QuickBooks, no access to your HubSpot pipeline, and produces generic outputs with no business context. Claude for Small Business is opinionated and integrated.
- It is not Claude Code. Claude Code is a terminal-based developer tool. Claude for Small Business is a point-and-click product for owners and operators who should not have to open a terminal to get value from AI.
- It is not a replacement for your existing software. QuickBooks still runs your accounting. HubSpot still stores your CRM. Claude reads what those tools know, adds reasoning and draft output on top, and returns control to you.
- It is not autonomous. Nothing sends, posts, pays, deletes, or publishes without your explicit approval on each individual action.

**Who it is for:** Small business owners — solo operators, partnerships, businesses with 2-50 employees — who spend 8-15 hours per week on tasks that are mostly mechanical: drafting follow-up emails, preparing cash reports, reviewing which leads to prioritize, reconciling bank data. The product's promise is to reduce that mechanical time to 1-2 hours per week without requiring you to learn how to use AI.

---

## Pricing and Access

Claude for Small Business requires a Claude Pro subscription at $20/month or a Claude Team plan at $30/seat/month. Both plans include access to Claude Cowork and all 15 workflows. There is no additional per-workflow charge.

For teams with higher usage — running 8 or more workflows daily, or working with large financial datasets — Claude Max plans are available at $100/month (5x usage limit) or $200/month (20x usage limit).

The product ships inside Claude Cowork. You do not download a separate application.

---

## Design Principles

Understanding the design saves you from expecting the wrong things.

**Owner-initiated, approval-based.** Every workflow runs when you decide to run it. Nothing polls your accounts in the background and acts on your behalf. When a workflow completes, it presents a structured output — draft emails, scoring summaries, reconciliation flags — and waits for you to approve each action individually.

**Data access matches your role.** Each integration connects via OAuth using your credentials. Claude can read and write exactly what you can read and write — no more. A QuickBooks integration authorized with your owner credentials gives Claude the same access you have. It does not create a separate elevated service account.

**Outputs are drafts, not decisions.** Lead scores are recommendations, not rules. Invoice emails are drafts, not sent messages. Contract flags are annotations, not legal opinions. The workflows are designed to compress the time you spend on information gathering and first-draft writing, while keeping you in the decision seat.

**Context is yours.** Anthropic does not use your connected business data to train Claude. The data your integrations expose — customer records, invoice amounts, pipeline stages — is processed at query time and not retained for model training.

---

## The 15 Workflows

The workflows are organized here by typical weekly time savings, from highest to lowest. Your specific savings will depend on your business size, how consistently you run the workflows, and how well you've configured your business context in Claude.

---

### Tier 1 — High-frequency, high-savings (5-10+ hours/week)

**Invoice Chasing**

Connects to QuickBooks. Reads the accounts receivable aging report, identifies invoices past due by 7, 14, 30, and 60+ days, and drafts a personalized follow-up email for each customer. The drafts reference the specific invoice number, the amount owed, the original due date, and a payment link if PayPal is also connected. The tone scales with aging — a 7-day overdue message is different from a 60-day overdue message.

You review the draft batch, edit any individual emails, and send the ones you approve. The workflow tracks which invoices had follow-ups sent and flags when payments clear so you are not sending a reminder to someone who paid yesterday.

Time saved: 4-6 hours per week for businesses with 10+ active receivables. The savings come from eliminating the manual pull-and-draft cycle, not from automating the sends.

Integration requirements: QuickBooks Online (any subscription tier). PayPal Business (optional — enables payment link inclusion in emails).

**Lead Triager**

Connects to HubSpot. Reads new and recently updated contacts, scores them against your Ideal Customer Profile (ICP) criteria, enriches records where public data is available, and flags the highest-priority leads for immediate follow-up. Scoring criteria are set by you in plain language: "we work best with SaaS companies in North America with 10-200 employees, where the contact is a founder or VP of Operations."

The output is a prioritized list with a one-line rationale per lead, sorted by fit score. Contacts you should call today appear first. Contacts that don't fit your ICP are labeled and moved to a lower-priority queue rather than discarded.

You review the ranked list, confirm or override the scoring on any lead where you disagree, and Claude updates the HubSpot records to reflect the decisions.

Time saved: 3-5 hours per week for businesses with 20+ new leads per week. The savings come from eliminating manual contact review and the mental overhead of deciding who to call next.

Integration requirements: HubSpot (Free tier is sufficient for lead reading and record updates).

**Business Pulse**

Connects to QuickBooks, PayPal, HubSpot, and Google Workspace or Microsoft 365. Runs as a Monday morning briefing — a structured overview of business health across every connected system.

The output covers: cash position and accounts receivable summary from QuickBooks; settlement and refund totals from PayPal for the prior week; pipeline movement from HubSpot (deals that advanced, deals that went cold, new deals added); and calendar commitments for the coming week from Google Calendar or Outlook.

This is designed to replace the 45-90 minutes most owners spend on Monday morning hunting through four tabs to get a picture of where they stand. The Business Pulse compresses that into a single structured report you can read in 5 minutes.

No approval is required because no action is taken — the workflow reads and reports only.

Time saved: 3-5 hours per week when used as a true Monday ritual that replaces manual dashboard review. Less if you only use it occasionally.

Integration requirements: Minimum one financial integration (QuickBooks or PayPal). Additional integrations (HubSpot, Google Workspace or Microsoft 365) expand the coverage but are not required.

---

### Tier 2 — Mid-frequency, high-savings (3-5 hours/week)

**Month-End Close**

Connects to QuickBooks and PayPal. Compares QuickBooks revenue records against PayPal settlement reports for the calendar month, identifies transactions that appear in one system but not the other, flags amount discrepancies where the same transaction is recorded differently, and drafts a reconciliation summary.

The output is a structured table: matched transactions, unmatched transactions, amount discrepancies, and a plain-language P&L draft that your bookkeeper or CPA can use as a starting point.

This does not replace your accountant. It reduces the time your accountant spends (and bills you for) pulling raw transaction data and identifying obvious discrepancies, because that work arrives pre-organized.

Time saved: 3-4 hours per month, compressed into one 30-45 minute review session instead of a half-day reconciliation.

Integration requirements: QuickBooks Online, PayPal Business. Both are required for full reconciliation — with only QuickBooks, the workflow still produces a transaction summary but cannot perform the cross-system reconciliation.

**Payroll Planning**

Connects to QuickBooks. Builds a 30-day cash forecast, calculates payroll runway based on current receivables and expected settlements, ranks overdue invoices by size and age (so you know which ones to chase hardest before payroll), and produces a payroll readiness checklist.

This is not a payroll processor. It does not run payroll, touch employee accounts, or integrate with Gusto, ADP, or similar platforms. It gives you the cash clarity you need to decide whether to run payroll as scheduled, whether you need to accelerate collections, or whether you need a line of credit conversation with your bank.

Time saved: 2-3 hours per pay cycle. Most owners spend this time manually building the same cash picture in a spreadsheet.

Integration requirements: QuickBooks Online.

**Campaign Manager**

Connects to HubSpot and Canva. Reads campaign performance data from HubSpot — email open rates, click-through rates, form submissions, deal attribution — analyzes what worked and what did not, builds a promotional strategy for the next campaign period, and generates branded creative assets in Canva based on your existing brand templates.

The output covers a written campaign brief, audience segmentation recommendations, and a set of Canva designs (social graphics, email headers, or ad creatives depending on what you specify) sized for the channels you identify.

You review the strategy and the creative assets, request revisions on specific elements, and export the approved designs for use in your campaign platforms.

Time saved: 3-5 hours per campaign cycle. The savings are highest on the design side for teams without a dedicated graphic designer.

Integration requirements: HubSpot (any paid tier for analytics — Free tier lacks the campaign performance data needed for analysis). Canva (Free or Pro — Pro is needed for brand kit access, which meaningfully improves output quality).

---

### Tier 3 — Periodic, substantial-savings (2-4 hours/week)

**Cash-Flow Forecasting**

Connects to QuickBooks and PayPal. Builds a rolling 13-week cash forecast using actual receivables, historical payment timing by customer, upcoming scheduled expenses, and recent PayPal settlement patterns.

The output is a week-by-week table showing projected cash position, flagged shortfall risk weeks (where projected cash drops below a threshold you set), and the receivables most critical to collect before each risk week.

Run this weekly or bi-weekly to stay ahead of cash surprises. The first run takes 10-15 minutes to review. Subsequent runs take 3-5 minutes because you already understand the format.

Time saved: 2-3 hours per week compared to maintaining a manual cash flow spreadsheet.

Integration requirements: QuickBooks Online. PayPal Business (optional — improves settlement timing accuracy).

**Content Strategist**

Connects to HubSpot and Canva, with optional Google Drive access for existing content assets. Pulls campaign performance data, reviews existing content in Drive if connected, identifies content gaps against your target audience, and drafts a content calendar for the next 4-8 weeks.

The calendar output includes topics, recommended formats, suggested posting cadence by channel, and draft copy for 2-3 pieces as examples. Canva assets are generated for the first batch of posts.

This is most useful for businesses that have content as part of their customer acquisition strategy — service businesses with a blog, e-commerce brands with social channels, consultants with a newsletter.

Time saved: 2-4 hours per planning cycle for businesses that currently build content calendars manually.

Integration requirements: HubSpot (campaign performance data), Canva (asset generation). Google Drive (optional, for content inventory).

**Tax Organizer**

Connects to QuickBooks and Google Drive. Gathers all tax-relevant transactions for the period — categorized expenses, revenue totals, contractor payments, equipment purchases — retrieves receipts and supporting documentation from Google Drive where filenames and dates match, and drafts a CPA packet.

The CPA packet is a structured document: revenue by category, deductible expenses by category, receipts attached and indexed, contractor 1099 candidates, and a list of items where documentation is missing or uncertain.

This does not prepare your tax return. It prepares the organized input your CPA needs, reducing the billable hours you spend on tax preparation meetings and follow-up requests.

Time saved: 6-8 hours per tax year in CPA prep time (spread across two or three sessions), plus a meaningful reduction in CPA bill if your firm charges by the hour.

Integration requirements: QuickBooks Online, Google Drive (for receipt retrieval).

---

### Tier 4 — Situational use (1-2 hours per use)

**Margin Analysis**

Connects to QuickBooks. Breaks down gross margin by product line, customer segment, and sales channel based on revenue and cost data in QuickBooks. Flags which products, customers, or channels are margin-dilutive versus margin-accretive.

Run this when you are making pricing decisions, considering dropping a product line, or evaluating whether a large customer is actually profitable after accounting for service costs.

Integration requirements: QuickBooks Online. Requires that your QuickBooks chart of accounts distinguishes revenue and COGS by product line — if you record all revenue as a single line item, the output will be limited.

**Contract Reviewer**

Connects to Google Drive or Microsoft 365 (SharePoint/OneDrive). Reads incoming contracts, compares them against a set of standard terms you define (payment terms, liability caps, IP ownership, termination notice requirements), highlights deviations, and produces a redlined summary showing what differs from your standard.

This is not legal advice. It is a first-pass review that tells you which clauses deviate from your standard and by how much — so that when you send the document to your attorney, you are paying for their judgment on the flagged issues, not for them to find the issues in the first place.

Integration requirements: Google Drive or Microsoft 365 (for document access). You must define your standard contract terms in plain language during initial setup — typically a one-time 30-minute exercise.

**Business Monitoring**

Connects to all active integrations. Runs on a schedule you define and flags anomalies: a customer who normally pays in 20 days who is now at 35 days; a deal stage that has not moved in 21 days; a weekly revenue total more than 25% below the prior 4-week average; a PayPal dispute opened that has not been addressed.

Monitoring is passive — it reads across your systems and surfaces the deviations worth your attention, without taking any action. You receive a structured alert list and decide what to investigate.

Integration requirements: At minimum two active integrations. Monitoring is most useful the more integrations you have connected, because the value is in the cross-system picture.

**Cold Outreach**

Connects to HubSpot. Given a target company or contact, drafts a personalized first-touch email based on the prospect's industry, role, and any public signals you specify. After a meeting or call, produces a structured call summary and drafts a follow-up email. For prospects in a multi-touch sequence, generates the next follow-up based on where they are in the sequence and how they have engaged so far.

Time saved: 20-30 minutes per prospect versus manual drafting, compounding significantly across a full outreach list.

Integration requirements: HubSpot (for contact records and sequence tracking).

**Meeting to Action**

Accepts a meeting transcript (pasted or uploaded from Google Drive). Produces a structured meeting summary with decisions made, open questions, and action items with owners. Drafts follow-up emails to each attendee. Logs key CRM notes to the relevant HubSpot contacts or deals.

Run this immediately after any meeting where follow-up matters: sales calls, client reviews, vendor negotiations, team standups.

Integration requirements: Google Drive (optional, for transcript upload). HubSpot (optional, for CRM note logging).

**Email Campaign**

Connects to HubSpot. Segments your contact list based on criteria you specify, generates 2-3 subject line variants per email, writes body copy for each variant, and sets up A/B test parameters in HubSpot. All copy is drafted to your brand voice and reviewed before any campaign is activated.

Integration requirements: HubSpot (Marketing Hub Starter or above — Free tier does not include A/B testing or campaign send functionality).

---

## How to Set It Up

Setup takes 2-3 hours total. Spread it across two sessions rather than rushing it in one.

**Step 1: Subscribe to Claude Pro or Team**

Claude Pro is $20/month and is sufficient for one owner running most workflows. If multiple team members will use the system simultaneously, Claude Team at $30/seat/month is the right plan. Both plans include all 15 workflows — there is no separate Small Business subscription.

**Step 2: Access Claude Cowork**

Claude for Small Business lives inside Claude Cowork — the GUI interface to Claude's agentic capabilities. Open Claude Cowork from the Claude dashboard. You will see a Workflows panel on the left sidebar.

**Step 3: Write Your Business Context**

Before connecting anything, create a Business Context document inside Claude. This is 200-400 words describing: what your business does, who your ideal customer is (industry, company size, role, geography), your communication tone (formal, friendly, direct), any specific terms or phrases you use in your industry, and what your typical deals or transactions look like.

This step is the highest-leverage setup action. Every workflow reads your business context and uses it to personalize outputs. Skipping it means Claude produces technically correct but generic outputs — the same invoice follow-up email it would write for any business, rather than one that sounds like you wrote it.

**Step 4: Connect Your Integrations**

From the Cowork settings panel, connect each tool via OAuth. The connections are one-time authorizations — you will not re-authorize on each use.

Connect in this order based on the workflows you plan to use first:
- QuickBooks Online: required for Invoice Chasing, Month-End Close, Cash-Flow Forecasting, Payroll Planning, Margin Analysis, Tax Organizer
- HubSpot: required for Lead Triager, Campaign Manager, Content Strategist, Cold Outreach, Email Campaign
- PayPal Business: required for Business Pulse (financial view), Month-End Close (reconciliation), Cash-Flow Forecasting (settlement accuracy)
- Google Workspace or Microsoft 365: required for Business Pulse (calendar), Tax Organizer (receipts), Contract Reviewer, Meeting to Action
- Canva: required for Campaign Manager, Content Strategist
- DocuSign: used by Contract Reviewer (for routing after review), Tax Organizer (for CPA packet delivery)
- Slack: used by Business Monitoring (alert delivery)

Do not connect everything on day one if you have not decided which workflows to activate first. Connect only what you need for your first workflow, verify it works, then add the next.

**Step 5: Toggle On Your First Workflow**

Start with one workflow. The strong recommendation is Invoice Chasing — it has the clearest ROI (you know exactly how much money is outstanding), the lowest risk (you review every email before it sends), and it produces a concrete deliverable within the first session.

Toggle the workflow on from the Workflows panel. Run it once manually. Read the output carefully. Note what Claude got right and what it would have gotten wrong if you had not reviewed it. This first run is the fastest way to learn how to tune your business context to improve future outputs.

**Step 6: Expand Deliberately**

Add one workflow per week for the first month. The constraint is not technical — it is your capacity to review outputs thoughtfully. Activating all 15 workflows in the first week produces 15 sets of outputs, few of which will get reviewed properly, and the workflows that do not get reviewed are workflows that will produce errors you do not catch.

---

## Integration Requirements in Detail

Each integration has its own requirements. What you need varies by workflow.

**QuickBooks Online**

Any active QuickBooks Online subscription works. QuickBooks Desktop does not connect — the OAuth integration is QuickBooks Online-only. Simple Start, Essentials, Plus, and Advanced are all supported.

The Invoice Chasing, Month-End Close, and Payroll Planning workflows are most useful with QuickBooks Plus or above because those plans include class and location tracking, which enables the Margin Analysis workflow to break down profitability by product line or location. On Simple Start, Margin Analysis is limited to company-level totals.

**PayPal Business**

Requires a PayPal Business account (not Personal). The Business account API connection gives Claude access to transaction history, settlement reports, dispute status, and payout data. Claude does not have access to initiate transfers, reverse transactions, or modify account settings.

If your business processes payments through Stripe, Square, or another processor instead of PayPal, those integrations are not currently supported in the native workflow set. The financial workflows can still run using QuickBooks data alone, with reduced accuracy on settlement timing.

**HubSpot**

The Free tier of HubSpot supports Lead Triager, Cold Outreach, Meeting to Action, and basic Contact management. Campaign Manager and Email Campaign require Marketing Hub Starter ($45/month or above) for campaign analytics and A/B send functionality. Content Strategist uses HubSpot campaign data if available but can run on Free tier with reduced analytical depth.

If you use Salesforce, Pipedrive, or another CRM, those do not connect to the native Small Business workflows as of the May 2026 launch.

**Canva**

The Free tier connects and supports asset generation. Canva Pro ($15/month or included in some team plans) is strongly recommended for Campaign Manager and Content Strategist because Pro accounts include brand kits — your exact fonts, colors, and logo — which Claude uses to generate on-brand assets. Without a brand kit, Claude generates visually clean assets that may not match your brand identity.

**DocuSign**

Requires DocuSign Business Pro or above. The standard Personal plan does not include API access. DocuSign is used by Contract Reviewer (to route approved contracts for signature) and optionally by Tax Organizer (to send the CPA packet for acknowledgment). DocuSign connection is optional — both workflows produce their outputs without it; the integration simply adds a send-to-signature step at the end of the review.

**Google Workspace**

Any Google Workspace plan (Business Starter, Standard, Plus, or Enterprise) works. The connection requires an OAuth authorization from an admin account if your workspace has admin-restricted OAuth policies. For sole proprietors using a personal Google account, the connection is straightforward.

Gmail, Google Drive, Google Calendar, and Google Sheets are all covered under the single Google Workspace connection. You do not authorize each service separately.

**Microsoft 365**

Business Basic ($6/user/month) or above supports the connection. Personal Microsoft accounts work for solo operators. The connection covers Outlook (email and calendar), OneDrive, and SharePoint. The same Gmail-or-Outlook choice applies throughout — Business Pulse reads your Google Calendar or your Outlook Calendar, not both simultaneously.

**Slack**

Any Slack plan (Free, Pro, Business+, Enterprise) supports the Slack integration. Business Monitoring uses Slack to deliver alert messages to a channel you designate. The integration does not read channel history or post unsolicited messages — it only posts alerts you have configured it to send.

---

## Data Permissions Model

Understanding the data model prevents both over-trust and unnecessary fear.

**What Claude accesses:** Only what you explicitly authorize via OAuth, and only when a workflow is actively running. There is no background data collection, no persistent connection polling your accounts, and no data stored between sessions.

**Write access:** Write access is granted per integration but constrained by workflow design. Claude does not create or modify QuickBooks entries without your approval. Claude does not send emails without your approval. Claude does not update HubSpot records without your confirmation. The OAuth permissions may technically allow write access (because those integrations require it for the approval-based actions), but the workflows are built to present output for review before writing anything.

**Data training:** Anthropic does not use business data accessed through connected integrations to train Claude. Your customer names, invoice amounts, email content, and CRM records are not retained for model improvement.

**Enterprise options:** Claude Team and Claude Enterprise plans include additional data controls: data residency options (EU residency for businesses with GDPR obligations), audit logs showing which workflows accessed which integrations and when, and admin-level controls over which workflows team members can activate.

---

## Human-in-the-Loop Design

The approval-based design is not a limitation — it is the correct architecture for consequential business operations.

Every output Claude produces is a draft recommendation. The categories are: emails drafted but not sent, documents flagged but not changed, leads scored but not acted upon, cash forecasts calculated but not published, contracts redlined but not returned. Nothing moves from Claude's output to your external systems without a deliberate human action.

This matters for three reasons:

**Errors.** Claude makes mistakes. It misreads an invoice date, misidentifies a customer's payment pattern, or writes a follow-up email at the wrong urgency level. These errors are caught when you review the output. They become problems only if you bypass the review.

**Context Claude does not have.** You know that the customer marked for aggressive collections is going through a difficult situation and you want to handle it personally. You know that the deal in HubSpot is stalled because you are waiting for a reference call, not because the prospect went cold. Claude cannot know what you have not told it. The review step is where your judgment fills in what the data cannot show.

**Legal and financial exposure.** An email sent incorrectly to a customer cannot be unsent. An invoice posted at the wrong amount creates a reconciliation problem. A contract clause missed because you trusted the review too quickly becomes a liability. The review step is your last checkpoint, and skipping it to save 2 minutes is not a trade worth making.

---

## What to Expect in the First 90 Days

**Days 1-7: Setup and first run**

Plan 2-3 hours for setup across two sessions. The first session covers subscription, business context, and first integration. The second session covers the first workflow run and output review. By end of week one, you should have run Invoice Chasing or Business Pulse at least once and understood what the output looks like.

**Days 8-21: Building the habit**

Run your first workflow at its natural cadence. Invoice Chasing runs weekly, or whenever you have a batch of overdue invoices. Business Pulse runs every Monday. Do not add a second workflow until the first one is part of your routine. The discipline of reviewing Claude's output carefully — reading every email draft before approving, not rubber-stamping the batch — is a habit that takes 2-3 weeks to establish.

**Days 22-30: Adding the second workflow**

After 3 weeks, add one more workflow. The recommended second workflow depends on your business type: Lead Triager for service businesses and B2B operators; Month-End Close for any business with a QuickBooks reconciliation problem; Campaign Manager for retail and e-commerce.

**Days 31-60: Three to four active workflows**

By the end of month two, most users are running 3-4 workflows regularly. Time saved is typically 6-10 hours per week at this point. The quality of outputs has improved because you have refined your business context document based on what Claude consistently got wrong in the first month.

**Days 61-90: Establishing the full rhythm**

By 90 days, users who follow the ramp-up approach are running 6-8 workflows, saving 8-12 hours per week on the mechanical work those workflows cover. Some owners at this stage extend the system using Claude Projects — creating custom prompts for workflows that the 15 pre-built options do not cover — but this is optional and requires more engagement with Claude's underlying capabilities.

---

## Success Patterns from Early Adopters

The following patterns emerged from businesses that adopted Claude for Small Business in the first quarter after the May 2026 launch.

**Start with Invoice Chasing.** Across business types, this was the highest-ROI starting point. The reason is specificity: the workflow reads actual invoice data and produces specific, personalized drafts. The output quality difference between Claude with QuickBooks access and Claude without it is visible immediately. First-time users understand the product's value proposition within the first session.

**Build Business Pulse into Monday morning.** Owners who ran Business Pulse every Monday for the first four weeks consistently rated it as their highest-value workflow after the initial period — even though it saves less time per run than Invoice Chasing. The value is the weekly rhythm and the early-warning function. Owners who skipped Mondays and ran it occasionally got less from it.

**Add financial workflows after 30 days.** Month-End Close and Payroll Planning produce outputs that feel higher-stakes than invoice follow-ups. Owners who trusted these workflows from day one occasionally caught errors they would not have caught if they had been less careful. Waiting until you are confident in Claude's output format — and in your own ability to spot a mistake — reduces the risk of acting on a misread reconciliation.

**Industry-specific additions:** Service businesses (consultants, agencies, contractors) consistently ranked Lead Triager highest after Invoice Chasing. Retail and e-commerce businesses got the highest return from Campaign Manager and Content Strategist. Professional services firms (law, accounting, architecture) found Contract Reviewer the most differentiated because it saved meaningful attorney review time on incoming vendor agreements.

---

## Common Failure Modes

**Activating all 15 workflows in week one.** The outputs accumulate faster than you can review them. Unreviewed outputs sit idle. Workflows that produce actionable outputs you never act on become habit-forming in the wrong direction — you start treating them as noise rather than signal. Start with one.

**Skipping the review step.** Claude's first-draft invoice emails are good but not perfect. On the first run, you will find 2-3 that need editing. On the tenth run, it will be 0-1. The editing process is how you refine Claude's understanding of your voice. Bypassing it to save time in the short term means the outputs never improve, and the first error you miss that actually reaches a customer costs more than the time you saved.

**Using vague inputs.** Claude's output quality is directly proportional to the specificity of the context you provide. A business context document that says "we are a marketing agency that helps small businesses" produces generic outputs. One that says "we are a 4-person performance marketing agency in Austin serving e-commerce brands with $1-10M in revenue, focused on Meta and Google Ads, with a direct and results-first communication style" produces outputs that sound like your team wrote them.

**Not updating the business context.** If your ICP changes, your pricing changes, or your business model shifts, update your business context document. Claude uses the context from your most recent update. Stale context produces outputs calibrated to where your business was six months ago.

**Treating Lead Triager as a replacement for sales judgment.** Lead scores are inputs to your sales process, not decisions. A lead scored 85/100 by Claude is a high-fit lead based on the data in HubSpot. It is not a certainty that you should drop everything to call them. And a lead scored 40/100 by Claude might be your next best client if you know something about them that HubSpot does not capture.

**Expecting Contract Reviewer to provide legal advice.** The workflow reads contracts and flags deviations from your standard terms. It does not interpret ambiguous clauses, assess risk in context, or advise on whether to sign. It is a pre-review tool that reduces your attorney's time to value, not a replacement for the attorney.

---

## What It Is Not For

**Complex financial decisions requiring CPA judgment.** Month-End Close produces a structured reconciliation. Tax Organizer produces an organized CPA packet. Neither produces tax strategy, entity structuring advice, or guidance on gray-area deductions. Those require professional judgment that no AI workflow should replace.

**Legal interpretation.** Contract Reviewer flags deviations from your standard. It cannot tell you whether a non-standard clause is acceptable given your negotiating position, your relationship with the counterparty, or the jurisdiction governing the contract.

**Fully autonomous operations.** If you want AI to run without your involvement — scanning, deciding, sending, posting, paying — Claude for Small Business is the wrong tool. The approval-based design is intentional and non-negotiable. Every consequential action requires your explicit confirmation.

**Replacing your business software.** QuickBooks, HubSpot, Canva, and the other integrated tools remain the systems of record. Claude reads from them and assists with the reasoning and writing layer on top. Canceling your QuickBooks subscription and expecting Claude to handle your accounting is not a supported use case and would leave you without a financial system of record.

**Businesses without the supported integrations.** If your business runs on Salesforce, Xero, FreshBooks, Stripe, Square, or other platforms not in the current integration list, the pre-built workflows will not connect. The general Claude Cowork platform can still assist with document and email work, but the integrated workflow automations require the specific tool connections listed above.

---

## Moving Beyond the 15 Workflows

After 60-90 days of regular use, some owners find that the pre-built workflows do not cover certain recurring tasks specific to their business. At this point, Claude Projects becomes the natural extension.

A Claude Project is a persistent context environment where you can define custom workflows using plain-language prompts backed by the same integration connections you have already authorized. Building a custom workflow requires more Claude fluency than toggling on a pre-built one, but owners who have been using the system for 90 days typically have that fluency.

Custom extensions that early adopters built within the first 90 days include: custom weekly reporting templates specific to their industry, vendor onboarding communication sequences, customer onboarding checklists auto-populated from HubSpot, and pricing proposal generators that pull from a Google Sheet of service packages and rates.

The pre-built 15 workflows are the on-ramp. Claude Projects are the freeway.

---
