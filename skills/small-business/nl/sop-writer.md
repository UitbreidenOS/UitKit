# SOP Writer

## Wanneer activeren
- Een standaard operationele procedure (SOP) schrijven voor een proces dat herhaaldelijk wordt uitgevoerd
- Processdocumentatie voor teamleden of ingehuurde werknemers
- Compliance-vereisten documenteren (audit trail nodig)
- Een bestaand mondelinge of ad-hoc proces formaliseren
- Onboarding gids maken zodat nieuwe teamleden het proces snel kunnen leren

## Wanneer NIET gebruiken
- Eenmalige of unieke taken — SOP's zijn bedoeld voor repetitief werk
- Snelle, mondeling communicatie tussen twee mensen — overkill
- Software-handleidingen of gebruikershandleidingen voor externe klanten — ander formaat
- Beleid of strategische besluiten — SOP's zijn taktisch, niet strategisch

## Instructies

### SOP Template

```markdown
# Standard Operating Procedure: [Name]

## Purpose
[1-2 sentences: what this SOP achieves and who does it]

## Scope
[Who is responsible? Which teams? What's in/out of scope?]

## Prerequisites / Prerequisites
- [Item 1 that must be true before starting]
- [Item 2: systems/access/training required]

## Step-by-step Process

### Step 1: [Action]
- Sub-action a
- Sub-action b
**Decision point:** If X, go to Step 3. If Y, continue to Step 2.

### Step 2: [Action]
- Sub-action a

### Step 3: [Validation]
[Checklist to confirm success]
- [ ] Condition 1 met
- [ ] Condition 2 met

## Common Issues & Solutions

| Issue | Solution |
|---|---|
| X happens | Do Y to resolve |
| Z fails | Check A, then try B |

## Approval / Sign-off
- [ ] Manager: __________ Date: __________
- [ ] Team lead: __________ Date: __________

## Version History
| Date | Author | Change |
|---|---|---|
| 2025-05-23 | [Name] | Initial SOP |

## Related Docs
- [Linked SOP 1]
- [Linked SOP 2]
```

### Elements of a Clear SOP

**Precision over brevity:**
- "Click the 'Deploy' button in the top-right corner" — specific
- "Deploy the app" — vague

**Decision trees:**
- Use flowcharts or if/then steps for conditional logic
- Never assume — state every path

**Screenshots / video:**
- One image per 5-10 steps is ideal
- Label buttons and fields
- Use arrows to show clicks

**Frequency and scope:**
- State how often this runs ("weekly", "per customer", "as needed")
- Who performs it: individual, team, on behalf of whom

### Common SOP Types

- **Customer Service SOP** — ticket handling, escalation
- **Financial SOP** — expense approval, invoice processing, payroll
- **Hiring SOP** — job posting, interview scheduling, offer letter
- **Product Release SOP** — deployment checklist, rollback plan
- **Data Backup SOP** — frequency, verification, retention

## Voorbeeld

**Gebruiker:** We're a small agency with a messy invoicing process. Create an SOP so any team member can generate and send invoices without asking me.

**Claude's SOP output:**

```markdown
# Standard Operating Procedure: Monthly Client Invoicing

## Purpose
Consistently generate and send client invoices by the 1st of each month. This SOP ensures accurate billing, professional delivery, and audit compliance.

## Scope
Applied to all active client accounts on the service tier. Does not cover refunds or adjustments (see SOP: Invoice Adjustments).

## Prerequisites
- Access to accounting software (Xero / Wave)
- Client contact list (in CRM or email group)
- Approval from Finance Manager

## Step-by-step Process

### Step 1: Gather Invoice Data (by 25th of month)
1. Log into [accounting software]
2. Go to: Invoices → New Invoice
3. Select client from dropdown
4. Verify client billing address matches CRM
5. **Decision:** Is the address correct?
   - YES → continue to Step 2
   - NO → update in CRM first, then continue

### Step 2: Enter Line Items
1. For each service rendered:
   - Select service from template (e.g., "Design Services")
   - Enter quantity (hours or units)
   - System auto-calculates rate and total
2. Add any reimbursable expenses (receipts attached in [folder path])
3. Review subtotal

### Step 3: Review and Approve
Checklist before sending:
- [ ] Client name and address match master list
- [ ] All services listed match statement of work
- [ ] Invoice number is sequential
- [ ] Due date is 30 days from invoice date
- [ ] No math errors (system auto-calculates but verify total)

### Step 4: Send
1. Click "Send" → email template auto-fills
2. Recipient: auto-filled from client contact (verify it's correct person)
3. Click "Send"
4. Screenshot confirmation and file in: [Shared drive]/Invoices/[Month-Year]/Sent

## Common Issues & Solutions

| Issue | Solution |
|---|---|
| "Client not found" error | Client may be inactive. Ask Finance Manager to reactivate in system. |
| Email bounces | Verify email address in CRM matches company records. Call client if unsure. |
| Math doesn't match hours | Check statement of work for agreed rate. If rate changed, ask FM to update before invoicing. |

## Approval / Sign-off
- [ ] Finance Manager: _________________ Date: _________
- [ ] Operations: _________________ Date: _________

## Version History
| Date | Author | Change |
|---|---|---|
| 2025-05-23 | [You] | Initial SOP |
| TBD | [Name] | Add expense tracking |

## Related Docs
- SOP: Invoice Adjustments & Refunds
- Client Contact List (CRM link)
- Accounting Software Login Guide
```

---
