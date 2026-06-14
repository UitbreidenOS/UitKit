# Deal Logger Skill

## When to activate

Immediately after investment decision (GO or PASS) has been made and partner has signed off.

## When NOT to use

- Deals still in evaluation (use during /score-opportunity or /dd-report workflow only)
- Companies with no scoring yet
- Preliminary conversations before thesis scoring

## Instructions

1. Gather deal information:
   - Company name, industry, stage, headquarters
   - Founder(s) and key team
   - Opportunity score (0–100) with category breakdown
   - Investment recommendation (GO/REVIEW/PASS)
   - Partner sign-off and decision date
2. Document decision rationale:
   - Key reasons for GO/PASS decision (2–3 bullets max)
   - Red flags or mitigating factors
   - Term recommendation if applicable (check size, ownership target)
3. Log to session-log.md entry:
   - Company name, stage, geography
   - Opportunity score and recommendation
   - Financial snapshot (ARR if available, burn, runway)
   - Market snapshot (TAM, CAGR)
   - Partner approval with date/time
   - Next steps (if GO: legal review, follow-up call; if PASS: keep in network for future)
4. Add deal card or record to deal tracking system (CRM, Airtable, etc.)
5. Flag for pipeline metrics reporting

## Example

**Input:** Series B fintech company evaluated, scored 92/100, partner approved GO

**Log Entry:**

```
## [2026-06-13 14:30]

**Company:** XYZ Fintech, Payments, Series B, London
**Founder(s):** Jane Smith (ex-Stripe), Alex Johnson (ex-Wise)
**Opportunity Score:** 92/100 — GO
- Founder/Team: 24/25
- Market Opportunity: 24/25
- Financial Health: 23/25
- Product Clarity: 21/25

**Action:** Due Diligence Report Generated + Partner Review + Investment Decision
**Status:** APPROVED

**Key Metrics:** ARR $2M, Burn $400K/mo, Runway 8 months, CAC $8K, LTV $80K
**Market:** TAM $30B, 12% CAGR (SMB cross-border payments)

**Recommendation:** GO — Strong founders with relevant exits, clear unit economics, substantial market opportunity. Primary risk is runway pressure but Series C trajectory is evident.

**Partner Sign-off:** Partner A — Approved for $500K–$1M check — 2026-06-13 14:25
**Terms:** Target 1–2% ownership stake

**Next Steps:** 
- Schedule legal review of cap table and docs
- Prepare term sheet
- CEO follow-up call on product roadmap and Series C plan
```
