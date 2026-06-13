---
name: email-deliverability
description: "Email deliverability audit: SPF/DKIM/DMARC check, spam trigger analysis, list hygiene, warm-up strategy"
updated: 2026-06-13
---

# Email Deliverability Skill

## When to activate
- Open rates drop unexpectedly (> 20% decline week-over-week)
- A campaign lands in spam or promotions folder instead of inbox
- You're setting up a new sending domain and need to configure authentication
- You've never audited your sending infrastructure and aren't sure if it's configured correctly
- Launching a new email platform or IP address and need a warm-up plan
- You're seeing high bounce rates (> 2%) or spam complaint rates (> 0.1%)

## When NOT to use
- Email copywriting — use `/email-sequence` or `/email-campaign` skills
- Campaign strategy decisions — this skill is about infrastructure and hygiene, not messaging
- CRM data management — use your CRM tool; this skill diagnoses sending health
- One-off transactional emails you control end-to-end (password resets, receipts) — focus on marketing sends

## Instructions

### Full deliverability audit

```
Run a deliverability audit on my email sending setup.

My setup:
- Email platform: [Mailchimp / Klaviyo / HubSpot / SendGrid / Postmark / other]
- Sending domain: [e.g., newsletter.mycompany.com or mycompany.com]
- Monthly send volume: [X emails/month]
- List size: [X subscribers]
- List age: [how old is the oldest segment?]
- Average open rate (last 3 months): [X%]
- Average click rate: [X%]
- Bounce rate: [X%]
- Spam complaint rate: [X%] (find in your platform's analytics)
- Current inbox placement: [inbox / promotions / spam — or unknown]

Perform a diagnostic across these areas:

## 1. Authentication (SPF / DKIM / DMARC)
Check these records for [DOMAIN]:
SPF: verify the TXT record includes your sending platform's servers
DKIM: verify the CNAME or TXT records from your platform are active
DMARC: verify a DMARC policy exists and what it does (none / quarantine / reject)

What each means:
- SPF missing → easy spam classification, some providers reject outright
- DKIM missing → no cryptographic signature → treated as unsigned/unverified mail
- DMARC missing → domain spoofing trivial → providers penalise the domain

Recommended DMARC starting policy:
v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com; pct=100

Move to p=quarantine after 30 days of clean reports, then p=reject after 60 days.

## 2. Sending domain configuration
- Are you sending from a subdomain (newsletter.company.com) or root domain?
  Recommendation: subdomain for marketing, root domain for transactional — separate reputation pools
- Is the From address matching the authenticated domain?
- Is the Reply-To different from the From? (not a problem, but note it)
- Does the sending IP have reverse DNS (PTR record)?

## 3. Content analysis
Paste a recent email HTML + text version below and I'll scan for:
- Spam trigger words in subject line and body
- Text-to-image ratio (< 20% text = likely promotions folder)
- Link domains — are you using a custom click-tracking domain?
- Alt text on images (missing = spam signal)
- Unsubscribe link presence (legally required, improves deliverability)
- List-Unsubscribe header (must be present in headers)
- Physical address in footer (CAN-SPAM requirement)

## 4. List hygiene
Provide your list breakdown:
- Total subscribers: [X]
- Never opened in 90 days: [X] → suppression candidate
- Never opened in 180 days: [X] → sunset / re-engagement needed
- Hard bounces: [X] → must remove immediately
- Soft bounces (3+ times): [X] → remove
- Unsubscribes not honoured within 10 days: [X] → legal risk, fix immediately

## 5. Engagement segmentation
The most important deliverability factor in 2024+ is engagement.
Gmail and Apple Mail filter primarily based on whether recipients engage.

Segment your list:
- Highly engaged: opened or clicked in last 30 days → Priority 1 send
- Engaged: opened in last 90 days → Standard send
- Lightly engaged: last open 90-180 days → Re-engagement campaign before including
- Inactive: no open in 180+ days → Sunset sequence, then remove

Never send to inactive subscribers mixed with engaged subscribers.
The complaint and non-engagement rate from inactive segments penalises your entire domain reputation.

## 6. Deliverability score summary
| Area | Status | Action Required |
|---|---|---|
| SPF | ✓ / ✗ | [fix if missing] |
| DKIM | ✓ / ✗ | [fix if missing] |
| DMARC | ✓ / none / reject | [set policy] |
| Subdomain isolation | ✓ / ✗ | [split if needed] |
| List hygiene | Clean / Issues | [describe issues] |
| Engagement segments | Segmented / Unsegmented | [action] |
| Content flags | [N issues found] | [list] |

Overall health: Green / Amber / Red
Priority actions ranked by impact: [numbered list]
```

### DNS record configuration guide

```
Generate the exact DNS records I need to configure for [SENDING PLATFORM] on domain [DOMAIN].

Platform: [Mailchimp / Klaviyo / SendGrid / Postmark / HubSpot / other]
Sending domain: [yourdomain.com or subdomain]
Current DNS provider: [Cloudflare / Route53 / GoDaddy / Namecheap / other]

Generate:

## SPF Record
Type: TXT
Host: @ (or subdomain)
Value: [platform-specific include statement]
Example: "v=spf1 include:sendgrid.net include:_spf.google.com ~all"
TTL: 3600

Note: only ONE SPF record per domain/subdomain. If you already have one, add the new include to it — do not create a second TXT record.

## DKIM Records
[Platform provides these — list the CNAME or TXT records with host and value]
Type: CNAME or TXT (platform-specific)
TTL: 3600

## DMARC Record
Type: TXT
Host: _dmarc.[domain]
Value: v=DMARC1; p=none; rua=mailto:dmarc@[domain]; pct=100
Start with p=none. Review reports for 30 days. Move to p=quarantine, then p=reject.

## BIMI Record (optional — brand logo in inbox)
Requires DMARC with p=quarantine or p=reject first.
Type: TXT
Host: default._bimi.[domain]
Value: v=BIMI1; l=https://[domain]/logo.svg; a=;

## Verification steps after DNS propagation (24-48 hours)
Test SPF: use MXToolbox SPF record checker
Test DKIM: send a test email and check headers in Gmail (View source)
Test DMARC: check [domain] at dmarcanalyzer.com
Test deliverability: send to mail-tester.com to get a score out of 10
```

### Spam trigger word scanner

```
Scan this email for spam triggers.

Subject line: [paste]
Preview text: [paste]
Email body: [paste plain text or HTML]

Check for:
1. Classic spam words in subject (avoid entirely):
   - Financial: "free money", "guaranteed income", "no risk", "earn $", "cash"
   - Urgency abuse: "act now", "limited time!!!", "hurry", "don't miss out"
   - Too promotional: "best price", "buy now", "discount", "lowest price"
   - Phishing patterns: "click here", "verify your", "confirm your account"
   - EXCESSIVE CAPS AND EXCLAMATION MARKS!!!

2. Body content issues:
   - Image-to-text ratio: images with no alt text + minimal copy = promotion/spam
   - Links to suspicious domains or unrelated tracking domains
   - Missing or buried unsubscribe link
   - No physical address in footer

3. Subject line length and punctuation:
   - Optimal length: 30-50 characters
   - Avoid: 3+ punctuation marks, 3+ emoji in a row
   - Avoid: all lowercase or ALL CAPS subject lines

4. HTML issues:
   - Inline styles only (external CSS can be stripped)
   - Clean HTML — not copy-pasted from Word (Word embeds hidden tags)
   - Text-only version present (HTML without plain-text backup = spam signal)

Output:
- Spam risk score: Low / Medium / High
- Specific triggers found and which rule they violate
- Revised subject line (if needed)
- Top 3 body fixes
```

### New domain warm-up schedule

```
Build a warm-up schedule for a new sending domain or IP.

Domain/IP: [new sending domain or IP address]
Target send volume: [X emails/month at full scale]
Starting list quality: [verified opt-in, double opt-in, or imported/unknown]
Platform: [ESP name]

Warm-up principles:
1. Start with your most engaged subscribers (recent opens and clicks) — they signal positive engagement
2. Ramp slowly — doubling or tripling too fast triggers spam filters
3. Monitor bounce rate and complaint rate daily during warm-up
4. Never send to a cold/inactive list during warm-up — ruins the domain's reputation from day 1
5. Consistent daily sending beats irregular large sends

Warm-up schedule:

Week 1:
- Daily volume: 50 emails
- Send to: Most engaged subscribers (last 7 days)
- Bounce rate threshold: < 1%
- Complaint threshold: < 0.05%

Week 2:
- Daily volume: 200 emails
- Send to: Engaged (last 30 days)
- Thresholds: same

Week 3:
- Daily volume: 500 emails
- Send to: Engaged (last 60 days)

Week 4:
- Daily volume: 1,000-2,000 emails
- Send to: Engaged (last 90 days)

Month 2:
- Ramp to 10% of target volume
- Begin including moderately engaged (last 180 days)

Month 3+:
- Full volume, all verified subscribers
- Inactive > 180 days: sunset campaign before including

If bounce rate exceeds 2% or complaint rate exceeds 0.1% at any stage:
STOP the ramp. Diagnose. Clean the list. Resume from the previous volume tier.

Generate my specific weekly schedule from [START DATE] to reach [TARGET VOLUME] by [TARGET DATE].
```

### List hygiene SOP

```
Generate a list hygiene standard operating procedure for [PLATFORM].

Current list: [X subscribers]
Current problems: [high bounces / low open rate / spam complaints / all of the above]

Hygiene checklist (run monthly):

1. Remove hard bounces immediately
   Definition: email address doesn't exist or is permanently undeliverable
   Action: automatically suppressed by most platforms — verify your platform does this

2. Remove soft bounce accumulation
   Definition: 3+ soft bounces in 90 days (mailbox full, temporary server issue)
   Action: move to suppression list, re-verify via an email verification service

3. Remove spam complainants
   Definition: subscriber clicked "mark as spam" (reported to you via feedback loop)
   Action: immediately suppress, do not resubscribe even if they ask nicely

4. Sunset inactive subscribers (quarterly)
   Definition: no email open in 180 days
   Process:
   a. Send 3-email re-engagement campaign over 2 weeks
   b. Track who opens or clicks — restore to active list
   c. After 3 emails with no engagement: remove permanently
   d. Do not resend to removed contacts — respect their implicit opt-out

5. Verify new list imports
   Before sending to any imported list (trade show, purchased, old CRM data):
   - Run through email verification service (NeverBounce, ZeroBounce, BriteVerify)
   - Remove unknown/risky addresses (> 5% risky = don't send at all)
   - Double opt-in confirmation before adding to marketing sends

Output: monthly hygiene calendar and template email for re-engagement sequence.
```

### Key deliverability metrics reference

```typescript
interface DeliverabilityHealth {
  // Inbox placement rate (use GlockApps, Litmus, or 250ok to measure)
  inboxPlacementRate: number  // target: > 90%

  // From your ESP dashboard
  openRate: number            // target: > 20% (Gmail/Apple Mail clip post-privacy)
  clickRate: number           // target: > 2%
  bounceRate: number          // alert at > 2%, danger at > 5%
  spamComplaintRate: number   // alert at > 0.08%, danger at > 0.1% (Google threshold)
  unsubscribeRate: number     // alert at > 0.5% per campaign

  // List health
  activeEngagedPercent: number    // subscribers who opened in last 90 days / total
  inactivePercent: number         // no open in 180 days / total
}

const DELIVERABILITY_THRESHOLDS = {
  inboxPlacementRate: { healthy: 0.90, concern: 0.80, critical: 0.70 },
  bounceRate: { healthy: 0.02, concern: 0.05, critical: 0.10 },
  spamComplaintRate: { healthy: 0.0005, concern: 0.001, critical: 0.003 },
  // Note: Google's postmaster tools flag domains at 0.1% complaint rate
  // Apple Mail Privacy Protection (iOS 15+) inflates open rates — do not use open rate alone
}
```

## Example

**User:** My open rates dropped from 32% to 19% over 3 months. I haven't changed anything. What do I check first?

**Diagnosis framework:**

```
A 13-point open rate drop in 3 months with no content changes points to one of these causes
in order of likelihood:

1. List decay — inactive subscribers accumulated and are dragging engagement
   Check: % of your list with no open in 90 days. If > 30%, this is your culprit.
   Fix: suppress inactive segment immediately, run re-engagement campaign

2. Deliverability shift — domain or IP reputation changed (common after a high-bounce send)
   Check: log into Google Postmaster Tools for your domain. Look at domain reputation and
   spam rate charts. A drop in domain reputation directly correlates with inbox placement loss.
   Fix: run full authentication audit, clean list, reduce send frequency for 30 days

3. Apple Mail Privacy Protection accumulation — if your list is heavily iOS users,
   artificially inflated opens from 2021 are now churning out as those users become inactive.
   This isn't a real deliverability problem — it's a measurement problem.
   Fix: switch to click rate as primary engagement metric. Open rate is unreliable for iOS.

4. Sending domain change — did you migrate to a new subdomain, ESP, or IP without re-warming?
   Check: email headers of a sent campaign. What's the actual sending IP?
   Fix: warm-up schedule for new infrastructure.

Start with Google Postmaster Tools — it's free and tells you within 24 hours whether Gmail is
classifying your domain as spammy. That narrows the diagnosis immediately.
```

---
