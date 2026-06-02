# Healthcare Administrator Workspace — Project Structure

> For a healthcare administrator managing clinical operations, scheduling, prior authorizations, insurance verification, compliance, and patient communications — with zero PHI stored outside the EHR.

## Stack

- **Epic** or **Athenahealth** — EHR/PM system of record; all patient-specific data lives here exclusively
- **Google Workspace** (Gmail, Docs, Drive, Calendar) — external communications, document storage, scheduling coordination
- **Microsoft Teams** or **Slack** — internal staff communications, department channels, shift coverage requests
- **DocuSign** — consent form routing, vendor contract signing, policy acknowledgment tracking
- **Zoom** — telehealth visit coordination, staff training sessions, vendor meetings
- **QuickBooks** — billing reconciliation, claim payment posting, denial tracking, vendor invoice management
- **Claude Code** — prior auth drafting, compliance checklists, patient letter generation, SOP writing, staff onboarding docs

## Directory tree

```
healthcare-admin-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace instructions — PHI rules, commands, conventions
│   ├── settings.json                          # MCP servers, hooks, permissions
│   └── commands/
│       ├── patient-intake.md                  # /patient-intake — generate intake packet checklist and welcome letter template
│       ├── prior-auth.md                      # /prior-auth — draft prior authorization request letter from clinical criteria
│       ├── insurance-verify.md                # /insurance-verify — insurance verification checklist and follow-up script
│       ├── compliance-check.md                # /compliance-check — run HIPAA/CMS compliance checklist against a process
│       ├── staff-schedule.md                  # /staff-schedule — generate shift coverage plan or on-call rotation template
│       ├── patient-letter.md                  # /patient-letter — draft appointment reminders, discharge instructions, or referral letters
│       └── incident-report.md                 # /incident-report — structured incident report template with root cause fields
├── patients/
│   ├── README.md                              # CRITICAL: PHI policy — no patient names, DOB, MRN, or diagnosis stored here
│   ├── templates/
│   │   ├── welcome-letter-template.md         # New patient welcome letter — [NAME] placeholder only, no real patient data
│   │   ├── appointment-reminder-template.md   # Appointment reminder — date/time/location fields; merge from Epic
│   │   ├── discharge-instructions-template.md # Post-visit discharge instructions — generic by condition category
│   │   ├── referral-letter-template.md        # Referral letter to specialist — clinical summary placeholder structure
│   │   ├── no-show-follow-up-template.md      # Follow-up letter after missed appointment
│   │   ├── payment-plan-letter-template.md    # Financial hardship payment plan offer letter
│   │   └── prior-auth-denial-appeal.md        # Appeal letter template for insurance prior auth denials
│   ├── intake/
│   │   ├── new-patient-checklist.md           # Admin checklist: insurance card, photo ID, consent forms, demographics
│   │   ├── insurance-verification-sop.md      # Step-by-step insurance eligibility verification process
│   │   ├── intake-packet-contents.md          # List of forms in new patient packet — references DocuSign envelope IDs
│   │   └── intake-workflow-diagram.md         # Flowchart of intake steps from check-in to roomed
│   └── discharge/
│       ├── discharge-checklist.md             # Admin steps at discharge: after-visit summary, follow-up scheduling, referrals
│       ├── referral-tracking-log.md           # Log of pending referrals by date sent — no PHI; track by case number only
│       └── telehealth-discharge-sop.md        # Zoom telehealth visit wrap-up checklist and tech support script
├── compliance/
│   ├── hipaa/
│   │   ├── hipaa-checklist-annual.md          # Annual HIPAA security and privacy rule audit checklist
│   │   ├── hipaa-checklist-new-hire.md        # New employee HIPAA training verification checklist
│   │   ├── phi-access-log-template.md         # Template for logging PHI access requests and disclosures (populate in EHR)
│   │   ├── breach-notification-sop.md         # Step-by-step breach notification procedure — HHS reporting, patient notice
│   │   ├── minimum-necessary-policy.md        # Policy doc: minimum necessary standard for PHI use and disclosure
│   │   └── business-associate-agreement-log.md # Tracker of active BAAs — vendor name, signed date, renewal date
│   ├── cms/
│   │   ├── cms-conditions-of-participation.md # CMS CoP checklist for ambulatory care compliance
│   │   ├── meaningful-use-checklist.md        # MIPS/APM reporting requirement tracker by quarter
│   │   └── quality-measure-tracker.md         # Monthly quality measure performance log (de-identified aggregate only)
│   ├── audits/
│   │   ├── audit-log.md                       # Running log of internal and external audits — date, scope, findings, status
│   │   ├── corrective-action-plan-template.md # CAP template for audit findings — finding, owner, due date, evidence
│   │   └── mock-survey-checklist.md           # Internal mock survey prep — questions, documentation required, owner
│   └── policies/
│       ├── policy-index.md                    # Master index of active policies — name, effective date, review date, owner
│       ├── privacy-policy-summary.md          # Plain-language summary of Notice of Privacy Practices
│       ├── security-incident-policy.md        # Security incident response policy and escalation path
│       └── telehealth-consent-policy.md       # Telehealth informed consent requirements by state
├── scheduling/
│   ├── shift-templates/
│   │   ├── weekday-shift-template.md          # Standard M-F shift blocks — MA, front desk, provider, billing
│   │   ├── weekend-shift-template.md          # Weekend/holiday coverage rotation template
│   │   ├── on-call-rotation-template.md       # On-call schedule template — roles, contact hierarchy, escalation
│   │   └── coverage-request-template.md       # Shift coverage request form — reason, dates, preferred swap partner
│   ├── sops/
│   │   ├── scheduling-sop.md                  # Appointment scheduling SOP — booking rules, slot types, hold policies
│   │   ├── cancellation-sop.md                # Cancellation and no-show handling — wait list, reschedule, billing flags
│   │   ├── provider-template-sop.md           # How to build and modify provider scheduling templates in Epic/Athena
│   │   └── telehealth-scheduling-sop.md       # Telehealth visit scheduling — Zoom link generation, patient prep steps
│   └── coverage-log.md                        # Running log of open shifts, coverage confirmed, and escalations
├── billing/
│   ├── claim-templates/
│   │   ├── clean-claim-checklist.md           # Pre-submission clean claim checklist — required fields by payer
│   │   ├── secondary-claim-template.md        # Coordination of benefits secondary claim submission steps
│   │   └── superbill-review-checklist.md      # Superbill audit checklist — diagnosis, modifier, place of service
│   ├── denials/
│   │   ├── denial-appeal-sop.md               # Step-by-step denial appeal process — timelines, required docs by denial code
│   │   ├── denial-code-reference.md           # Common denial codes (CO-4, CO-97, PR-96, etc.) with resolution steps
│   │   ├── appeal-letter-library/
│   │   │   ├── medical-necessity-appeal.md    # Appeal template for medical necessity denials
│   │   │   ├── timely-filing-appeal.md        # Appeal template for timely filing denials with proof of timely submission
│   │   │   ├── authorization-retro-appeal.md  # Retroactive authorization appeal template
│   │   │   └── duplicate-claim-appeal.md      # Duplicate claim appeal with proof of distinct service
│   │   └── denial-tracker.md                  # Denial tracking log — payer, denial code, date, status (no PHI — case # only)
│   ├── reconciliation/
│   │   ├── daily-reconciliation-sop.md        # End-of-day cash, check, and card reconciliation with QuickBooks steps
│   │   ├── era-posting-sop.md                 # Electronic Remittance Advice posting workflow — ERA to QuickBooks
│   │   ├── monthly-close-checklist.md         # Month-end billing close checklist — outstanding claims, write-offs, reports
│   │   └── payer-contract-rate-sheet.md       # Contracted rates by payer and CPT code range (non-PHI reference doc)
│   └── payers/
│       ├── payer-contact-directory.md         # Insurance payer contacts — provider relations, claim status, auth lines
│       └── payer-portal-login-sop.md          # Payer portal access steps — do not store credentials here; use password manager
├── staff/
│   ├── onboarding/
│   │   ├── new-hire-checklist.md              # Day 1-90 onboarding checklist — IT access, badge, training, HIPAA sign-off
│   │   ├── hipaa-training-checklist.md        # HIPAA training completion tracker — role, date completed, attestation
│   │   ├── epic-access-request-sop.md         # Step-by-step Epic role-based access request and provisioning
│   │   ├── athenahealth-access-request-sop.md # Athenahealth user setup and role assignment steps
│   │   └── welcome-email-template.md          # New hire welcome email template — first day logistics
│   ├── training/
│   │   ├── training-calendar.md               # Scheduled staff training sessions — topic, date, required vs. optional
│   │   ├── competency-checklist-ma.md         # Medical assistant competency verification checklist
│   │   ├── competency-checklist-front-desk.md # Front desk staff competency checklist — scheduling, registration, copay
│   │   └── in-service-log.md                  # Log of completed in-service training sessions and attendees
│   └── performance/
│       ├── performance-review-template.md     # Semi-annual staff performance review template
│       └── corrective-action-template.md      # Corrective action documentation template
├── vendors/
│   ├── vendor-contract-log.md                 # Active vendor contracts — vendor, service, term, renewal date, BAA required?
│   ├── vendor-contact-directory.md            # Key vendor contacts — Epic/Athena support, DocuSign, Zoom, QuickBooks
│   ├── docusign-sop.md                        # DocuSign envelope setup, consent form routing, audit trail retrieval
│   └── zoom-telehealth-setup-sop.md           # Zoom for Healthcare configuration — HIPAA BAA, waiting room, recording policy
└── templates/
    ├── letters/
    │   ├── prior-auth-request-letter.md       # Prior authorization request letter — clinical rationale placeholder structure
    │   ├── prior-auth-appeal-letter.md        # Prior auth appeal — peer-to-peer request and written appeal versions
    │   ├── insurance-verification-script.md   # Phone script for insurance eligibility verification calls
    │   ├── collections-letter-template.md     # Patient balance collections letter — first notice, second notice
    │   └── provider-credentialing-letter.md   # Cover letter template for payer credentialing submissions
    ├── forms/
    │   ├── consent-form-checklist.md          # Required consent forms by visit type — links to DocuSign templates
    │   └── release-of-information-log.md      # ROI request log — date, requestor type, status (no PHI — use case # only)
    └── sops/
        ├── sop-template.md                    # Master SOP template — purpose, scope, steps, owner, review date
        └── sop-index.md                       # Index of all active SOPs — name, owner, last reviewed, location
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/prior-auth.md` | Slash command that drafts a prior authorization request letter using clinical criteria — takes payer name, procedure, and clinical rationale as input; never includes actual patient identifiers |
| `.claude/commands/compliance-check.md` | Slash command that runs a HIPAA or CMS compliance checklist against a described process — returns pass/fail by item and recommended corrective actions |
| `.claude/commands/incident-report.md` | Slash command that generates a structured incident report template with root cause analysis fields, timeline section, and corrective action plan scaffolding |
| `compliance/hipaa/breach-notification-sop.md` | Step-by-step breach response procedure covering HHS OCR reporting timeline (60-day rule), patient notification requirements, and documentation to retain |
| `billing/denials/denial-appeal-sop.md` | Authoritative denial appeal process with payer-specific timelines, required documentation by denial code category, and escalation path to peer-to-peer review |
| `billing/denials/appeal-letter-library/` | Ready-to-use appeal letter templates for the four most common denial categories — reduces drafting time from 30 minutes to under 5 minutes per appeal |
| `patients/README.md` | PHI policy enforcement notice — the single most important file; sets the rule that no patient-specific data (name, DOB, MRN, diagnosis) is ever stored in this workspace |
| `compliance/policies/policy-index.md` | Master index of all active policies with effective dates and review dates — used during audits and mock surveys to confirm policy currency |
| `scheduling/sops/scheduling-sop.md` | Canonical scheduling SOP covering booking rules, template slot types, hold and cancel policies, and escalation for same-day urgent add-ons |
| `staff/onboarding/new-hire-checklist.md` | Day 1-90 onboarding checklist covering IT access provisioning, HIPAA training sign-off, Epic/Athena access, badge, and 30/60/90-day check-ins |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p healthcare-admin-workspace

# Create .claude structure
mkdir -p healthcare-admin-workspace/.claude/commands

# Create patient template directories (NO PHI — templates only)
mkdir -p healthcare-admin-workspace/patients/templates
mkdir -p healthcare-admin-workspace/patients/intake
mkdir -p healthcare-admin-workspace/patients/discharge

# Create compliance directories
mkdir -p healthcare-admin-workspace/compliance/hipaa
mkdir -p healthcare-admin-workspace/compliance/cms
mkdir -p healthcare-admin-workspace/compliance/audits
mkdir -p healthcare-admin-workspace/compliance/policies

# Create scheduling directories
mkdir -p healthcare-admin-workspace/scheduling/shift-templates
mkdir -p healthcare-admin-workspace/scheduling/sops

# Create billing directories
mkdir -p healthcare-admin-workspace/billing/claim-templates
mkdir -p healthcare-admin-workspace/billing/denials/appeal-letter-library
mkdir -p healthcare-admin-workspace/billing/reconciliation
mkdir -p healthcare-admin-workspace/billing/payers

# Create staff directories
mkdir -p healthcare-admin-workspace/staff/onboarding
mkdir -p healthcare-admin-workspace/staff/training
mkdir -p healthcare-admin-workspace/staff/performance

# Create vendor and template directories
mkdir -p healthcare-admin-workspace/vendors
mkdir -p healthcare-admin-workspace/templates/letters
mkdir -p healthcare-admin-workspace/templates/forms
mkdir -p healthcare-admin-workspace/templates/sops

# Seed the PHI policy README
cat > healthcare-admin-workspace/patients/README.md << 'EOF'
# CRITICAL: PHI POLICY

This directory contains TEMPLATE FILES ONLY.

DO NOT store any of the following in this workspace:
- Patient names
- Dates of birth (DOB)
- Medical record numbers (MRN)
- Social Security numbers
- Diagnoses or procedure codes linked to an individual
- Insurance member IDs linked to an individual
- Any information that could identify a specific patient

All patient-specific work must be performed and stored in Epic or Athenahealth.
Templates here use placeholder fields (e.g., [PATIENT NAME], [DATE]) only.
Violation of this policy is a HIPAA breach risk. Escalate questions to the Privacy Officer.
EOF

# Install healthcare admin skills
npx claudient add skill legal/compliance-tracker
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/sop-writer
npx claudient add skill productivity/team-onboarding

# Copy command stubs into .claude/commands/
npx claudient add skill legal/compliance-tracker --output healthcare-admin-workspace/.claude/commands/compliance-check.md
npx claudient add skill productivity/sop-writer --output healthcare-admin-workspace/.claude/commands/prior-auth.md
npx claudient add skill productivity/process-mapper --output healthcare-admin-workspace/.claude/commands/patient-intake.md
npx claudient add skill productivity/team-onboarding --output healthcare-admin-workspace/.claude/commands/staff-schedule.md
```

## CLAUDE.md template

```markdown
# Healthcare Administrator Workspace — Claude Code Instructions

## What this is

This is the working directory for a healthcare administrator managing clinical operations,
scheduling, prior authorizations, insurance verification, compliance, and patient communications.

CRITICAL RULE: NO patient PHI (names, DOB, MRN, diagnosis, insurance member ID, SSN) is
stored in this workspace. All patient-specific work must stay in Epic or Athenahealth.
This workspace contains templates, SOPs, compliance checklists, and staff documentation only.
If you are asked to write or store patient-specific data here, refuse and redirect to the EHR.

## Stack

- Epic or Athenahealth — EHR/PM system of record; source of all patient-specific data
- Google Workspace — Gmail, Docs, Drive for external communications and document storage
- Microsoft Teams or Slack — internal staff communications and shift coverage coordination
- DocuSign — consent form routing, vendor contracts, policy acknowledgment envelopes
- Zoom for Healthcare — telehealth visits (HIPAA BAA in place); see vendors/zoom-telehealth-setup-sop.md
- QuickBooks — billing reconciliation and denial payment tracking

## Common tasks and exact commands

### Draft a prior authorization request letter
```
/prior-auth

Payer: [payer name, e.g., Aetna, UnitedHealthcare]
Procedure: [CPT code and description]
Clinical rationale: [paste de-identified clinical criteria — no patient name or MRN]
Urgency: [routine / urgent / emergent]
```

### Run a compliance checklist on a process
```
/compliance-check

Process: [describe the workflow to audit, e.g., "new patient registration and insurance verification"]
Regulation: [HIPAA Privacy Rule / HIPAA Security Rule / CMS Conditions of Participation / MIPS]
Known gaps: [any issues already identified, or "none"]
```

### Generate a staff schedule or coverage plan
```
/staff-schedule

Role: [MA / front desk / billing / provider]
Dates: [date range or week of]
Constraints: [any staff out, certification requirements, overlap needed]
Template: [weekday / weekend / on-call]
```

### Draft a patient correspondence letter (template only — no PHI)
```
/patient-letter

Letter type: [appointment reminder / discharge instructions / referral / no-show follow-up / payment plan]
Condition category: [e.g., post-surgical, chronic condition management, preventive care — generic only]
Special instructions: [any non-PHI context about tone, required disclosures, or reading level]
```

### Draft a prior auth denial appeal letter
```
/prior-auth

Mode: appeal
Payer: [payer name]
Denial code: [code and description, e.g., "CO-197: precertification absent"]
Procedure: [CPT code and description]
Appeal type: [written appeal / peer-to-peer request]
Clinical basis: [de-identified clinical rationale — no patient identifiers]
```

### Generate an insurance verification script
```
/insurance-verify

Payer: [payer name]
Visit type: [new patient / established patient / specialist / telehealth]
Key fields to verify: [eligibility, deductible, copay, coinsurance, authorization required Y/N, referral required Y/N]
```

### Generate an incident report
```
/incident-report

Incident type: [privacy incident / safety event / billing error / equipment failure / staff complaint]
Date of incident: [date]
Location: [department or area — no patient names]
Description: [what happened — de-identified]
Immediate actions taken: [list]
```

### Generate a patient intake checklist
```
/patient-intake

Visit type: [new patient / annual wellness / specialist consult / telehealth]
Payer type: [commercial / Medicare / Medicaid / self-pay]
Special requirements: [e.g., minor patient, interpreter needed, disability accommodation]
```

## Conventions to follow

- PHI RULE: Never write patient names, DOBs, MRNs, diagnoses, or insurance IDs into any file in this workspace
- All letters and forms use bracketed placeholders ([PATIENT NAME], [DATE], [PROVIDER NAME]) — real data merges from Epic/Athena
- SOP files follow the template at templates/sops/sop-template.md — every SOP has purpose, scope, steps, owner, and review date
- Denial appeal letters live in billing/denials/appeal-letter-library/ — add new templates as new denial patterns emerge
- Compliance checklists in compliance/ are reviewed on a rolling schedule documented in compliance/policies/policy-index.md
- New vendor contracts are logged in vendors/vendor-contract-log.md within 48 hours of signing, including BAA status
- Staff onboarding tasks are tracked in staff/onboarding/new-hire-checklist.md — do not mark complete until attestation is signed
- Shift coverage confirmations are logged in scheduling/coverage-log.md with the date and confirming staff member
- All appeal letters include the claim or case number — never the patient's identifying information — so payer can locate the claim
```

## MCP servers

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-google-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-oauth-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@slack/mcp-server"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-slack-bot-token",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/healthcare-admin-workspace"
      ]
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -qE \"patients/\"; then python3 -c \"import sys,re; content=open(sys.argv[1]).read() if __import__(\\\"os\\\").path.exists(sys.argv[1]) else \\\"\\\"; phi_patterns=[r\\\"\\\\b\\\\d{4}-\\\\d{2}-\\\\d{2}\\\\b\\\",r\\\"\\\\bMRN[:\\\\s]\\\\s*\\\\d+\\\",r\\\"\\\\bDOB[:\\\\s]\\\",r\\\"\\\\bSSN[:\\\\s]\\\\s*\\\\d\\\"]; found=[p for p in phi_patterns if re.search(p,content)]; sys.exit(1) if found else sys.exit(0)\" \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || echo \"[PHI GUARD] Potential PHI pattern detected in patients/ file — review before saving. All patient data must stay in the EHR.\"; fi'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"compliance/\"; then echo \"[compliance] File updated: $FILE — check compliance/policies/policy-index.md if this is a new or revised policy\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'DOW=$(date +%u); if [ \"$DOW\" = \"5\" ]; then echo \"[reminder] Friday checklist: confirm this week denial appeals logged in billing/denials/denial-tracker.md, open shift coverage confirmed in scheduling/coverage-log.md, and any new vendor contracts entered in vendors/vendor-contract-log.md\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Core healthcare admin skills
npx claudient add skill legal/compliance-tracker
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/sop-writer
npx claudient add skill productivity/team-onboarding

# Supporting productivity skills
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/exec-briefing
```

## Related

- [Healthcare Administrator guide](../guides/for-healthcare-admin.md)
- [Prior authorization workflow](../workflows/prior-auth-workflow.md)
- [HIPAA compliance workflow](../workflows/hipaa-compliance-audit.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
