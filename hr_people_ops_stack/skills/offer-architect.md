---
name: offer-architect
description: Drafts a competitive offer with base salary benchmarks, equity breakdown, sign-on bonus, benefits, and negotiation ranges. Returns complete offer ready for review, not for sending.
allowed-tools: Read, Write
effort: medium
---

# Offer Architect

## When to activate

After hiring manager approves an offer to a candidate (post-interview, score >75, offer decision made). You have access to the candidate's current compensation, salary expectations, interview feedback, and company's offer bands.

## When NOT to use

Not for rejected candidates. Not before offer decision is made. Not for internal promotions (use offer-architect but reference internal equity guidelines). Not without knowledge of your company's salary bands and equity grant framework.

## Offer Components

Every offer includes:

### 1. Base Salary
- **Range:** Your company defines a salary band per level/role (e.g., "Senior Engineer: $140–160k")
- **Placement:** New external hires typically land at 40–60% of band (entry) or 70–90% of band (experienced)
- **Justification:** Benchmark against 2–3 data sources (Levels.fyi, PayScale, Blind) and candidate's prior salary
- **Market adjustment:** Factor in: cost of living, remote vs. in-office, market for role (e.g., ML engineers command premium)

### 2. Equity
- **Grant amount:** Expressed as percentage of company (e.g., 0.05% for IC3, 0.15% for Senior, 0.5% for Manager)
- **Vesting schedule:** Standard is 4-year vest with 1-year cliff
- **Refresh grants:** For existing employees, note if refresh cycle exists
- **Strike price:** Typically FMV (fair market value) at grant date
- **Example:** "You'll receive 5,000 option shares (0.05% of the company) vesting 25% after 1 year, then monthly over 3 years."

### 3. Sign-On Bonus (Optional)
- **Typical amount:** 10–25% of base salary; higher for senior/external hires from high-paying companies
- **Justification:** Compensate for forfeited bonus/equity at previous company; incentivize join
- **Cap:** Never exceed 25% of base (signals overreaching on offer)
- **Clawback:** Some companies require 12-month clawback if employee leaves voluntarily
- **Example:** "$20,000 sign-on bonus (paid upon first paycheck)"

### 4. Benefits Package
- **Health insurance:** Medical, dental, vision (employee/employer split)
- **Retirement:** 401(k) with company match (e.g., 4% match)
- **PTO:** State-compliant minimum + company policy (e.g., "Unlimited, with minimum 3 weeks encouraged")
- **Equity:** As above
- **Professional development:** Annual budget (e.g., $1,000/year for courses, conferences)
- **Parental leave:** Paid time per state law + company policy
- **Remote/flexibility:** Work-from-home policy, flexible hours, etc.

### 5. Contingencies
- **Background check:** "Offer contingent on satisfactory background check per [background check company]"
- **References:** "References must confirm prior employment and performance"
- **Education verification:** "Verification of degrees claimed in resume"
- **Drug screening:** If applicable to role/company
- **Non-compete/IP assignment:** May apply depending on jurisdiction and seniority

### 6. Negotiation Ranges (Internal Use Only, Not in Offer)

Define these upfront to ensure consistency when negotiating:

- **Base salary:** 80–100% of band floor (what's your walk-away point?)
- **Equity:** Can you flex ±20% equity if candidate pushes on salary?
- **Sign-on:** Can you add sign-on to close if salary is locked?
- **Benefits:** Are PTO, parental leave, dev budget negotiable?
- **Start date:** Can you flex start date (they have notice period)?

## Offer Review Checklist

Before sending to candidate, verify:

- [ ] Base salary justified with 2–3 market sources
- [ ] Base salary within company band (no exceptions without director approval)
- [ ] Equity percentage consistent with level (no 2x standard grant)
- [ ] Equity cliff at 1 year (standard; don't offer 0-year cliff)
- [ ] Sign-on bonus <25% base (if included)
- [ ] All benefits listed explicitly (no "standard benefits" references)
- [ ] At-will employment clause present (both directions)
- [ ] Contingencies listed (background, references, etc.)
- [ ] Offer expires in 5 business days (standard timeline)
- [ ] Salary, equity, and sign-on are non-overlapping (no double-compensation)
- [ ] No salary cliffs between roles (consistency check)

## Output Format

Return offer in this format:

```
## OFFER OF EMPLOYMENT

[Full Legal Name]
[Address (optional)]

### Role & Compensation

**Position:** [Job Title]  
**Department:** [Department]  
**Reports To:** [Manager Name and Title]  
**Start Date:** [Date] or [Date ranges if flexible]  
**Employment Status:** Full-Time, At-Will

### Total Compensation Package

**Base Salary:** $[X] annually, paid bi-weekly  
**Sign-On Bonus:** $[X] (paid upon first paycheck) [OPTIONAL]  
**Equity:** You will receive [X] option shares ([X]% of the company), vesting over 4 years with a 1-year cliff.  
**Benefits:** As outlined below

### Benefits

- **Health Insurance:** Medical, dental, vision coverage. [X]% company-paid, [X]% employee contribution
- **Retirement:** 401(k) with [X]% company match
- **Paid Time Off:** [X] days/weeks per year + [state-specific] days. [Include parental leave, sick leave if applicable]
- **Professional Development:** $[X] annual budget for courses, conferences, certifications
- **Equity:** As stated above; additional details in [Stock Option Agreement]

### Contingencies

This offer is contingent upon:
- Satisfactory background check (via [background check vendor])
- Positive reference checks from previous employers
- Verification of educational credentials claimed in your resume

### At-Will Employment

Your employment is at-will, meaning you or [Company] may terminate employment at any time, for any reason, with or without cause or notice.

### Offer Validity

This offer is valid for [5 business days] from the date of this letter. Please confirm your acceptance by [Date] by signing and returning a copy of this letter.

### Next Steps

Upon acceptance:
1. You will receive an Employee Handbook and onboarding documentation
2. Please plan to start on [Date]
3. Your hiring manager is [Name, email]

---

**[Hiring Manager Name]**  
**[Title]**  
**[Company Name]**  

---

Enclosures:
- Stock Option Agreement
- Employee Handbook
- Confidentiality & IP Assignment Agreement [if applicable]
```

## Negotiation Talking Points

If candidate counters, use these scripts:

**"Can you go higher on salary?"**
- Response: "We benchmarked your role at $[X], and you're landing at the [40th/60th/75th] percentile based on your experience. If there's a specific number you were expecting, I'm happy to discuss."
- If they say a number above your max: "That's above what we can do on salary, but I'd be open to [adding sign-on / increasing equity / flexible start date]. What would make this package work for you?"

**"I have another offer at $[X+20k]."**
- Response: "Happy to understand your options. Is the difference primarily salary, or is there an equity difference too? Let me see if we can build a competitive package here."
- (Then reassess: Is equity lower at their other offer? Can you adjust yours?)

**"Can I get [X]% equity instead of [Y]%?"**
- Response: "That grant is [X]% above our standard for your level. What's driving that expectation?"
- (Listen—they may have a offer from a later-stage startup offering much higher. If so, level-set on dilution/value.)

**"I need to start in [X weeks] because of my notice period."**
- Response: "We're flexible on start date within reason. Let's align on a timeframe that works for you."

## Red Flags in Negotiation

- **Demands keep escalating:** "OK, 1.5x equity too?" — Sign of unrealistic expectations. May be difficult hire.
- **Only negotiates on headline number:** Doesn't care about total comp, equity vesting, or benefits — Sign of misalignment with company values.
- **Refuses any contingencies:** "I'm not doing a background check" — Red flag. Surface to hiring manager.
- **Compensation expectation >30% above band:** High flight risk; likely to have regret post-hire.

## Example Offer

```
## OFFER OF EMPLOYMENT

Sarah Chen
123 Main St
San Francisco, CA 94102

### Role & Compensation

**Position:** Senior Backend Engineer  
**Department:** Engineering  
**Reports To:** Alex (Engineering Manager)  
**Start Date:** July 1, 2026  
**Employment Status:** Full-Time, At-Will

### Total Compensation Package

**Base Salary:** $155,000 annually, paid bi-weekly  
**Sign-On Bonus:** $25,000 (paid upon first paycheck)  
**Equity:** You will receive 5,000 option shares (0.05% of the company), vesting over 4 years with a 1-year cliff.  
**Benefits:** As outlined below

### Benefits

- **Health Insurance:** Medical, dental, vision coverage. 85% company-paid, 15% employee contribution (for single coverage).
- **Retirement:** 401(k) with 4% company match.
- **Paid Time Off:** 20 days (4 weeks) per year. Parental leave: 4 weeks paid (either parent).
- **Professional Development:** $1,500 annual budget.
- **Equity:** As stated above; option agreement and details provided separately.

### Contingencies

This offer is contingent upon:
- Satisfactory background check (via [background vendor])
- Positive references from Stripe, confirming employment and performance
- Verification of BS Computer Science from UC Berkeley

### At-Will Employment

Your employment is at-will. [Company] or you may terminate employment at any time, for any reason, with or without cause or notice.

### Offer Validity

This offer is valid for 5 business days (through June 20, 2026). Please confirm acceptance by signing and returning this letter by that date.

---

**Alex**  
**Engineering Manager**  
**[Company Name]**
```

---
