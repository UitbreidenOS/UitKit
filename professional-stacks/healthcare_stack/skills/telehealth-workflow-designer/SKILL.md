---
name: telehealth-workflow-designer
description: Designs telehealth and virtual care workflows including platform selection, patient/provider experience, licensing compliance, and reimbursement considerations. Outputs a complete telehealth program specification.
allowed-tools: Read, Write, WebSearch
effort: medium
---

# Telehealth Workflow Designer

## When to activate
When launching a new telehealth program, expanding virtual care services, selecting a telehealth platform, or when optimizing existing virtual visit workflows. Use for synchronous (video), asynchronous (store-and-forward), and remote patient monitoring programs.

## When NOT to use
Skip for in-person-only services requiring physical examination or procedures, or when the telehealth program is already operational with no planned changes.

## Instructions

1. **Program scope:**
   - Visit types: Follow-up, new patient, specialist, urgent care, behavioral health
   - Modality: Synchronous video, audio-only, asynchronous (store-and-forward), RPM
   - Patient population: Age, tech literacy, connectivity requirements

2. **Platform requirements:**
   - HIPAA-compliant video (BAA required)
   - EHR integration (scheduling, documentation, billing)
   - Patient experience: No download required, mobile-friendly, accessibility (ADA)
   - Provider experience: Dual monitor support, integrated chat, screen sharing

3. **Licensing & compliance:**
   - State licensure: Provider must be licensed in patient's location at time of service
   - Interstate compacts: eNLC (nursing), PSYPACT (psychology), IMLC (physicians)
   - Informed consent: Telehealth-specific consent documented
   - Prescribing: Ryan Haight Act for controlled substances via telemedicine

4. **Reimbursement:**
   - Payer mix: Medicare (CMS telehealth list), Medicaid (state-specific), commercial
   - Modifiers: -95 (synchronous), -GT (legacy), -GQ (asynchronous)
   - Place of service: 10 (patient home), 02 (telehealth)
   - Parity laws: State-by-state payment parity requirements

5. **Patient workflow:**
   - Pre-visit: Technology check, consent, intake forms
   - During: Virtual waiting room, video visit, documentation
   - Post-visit: E-prescribing, follow-up scheduling, patient education

## Output Format

```
TELEHEALTH PROGRAM: [Name] — [Service type]
MODALITY: [Video/Audio/Async/RPM] | PLATFORM: [Selection criteria]

SCOPE:
  Visit types: [list]
  Patient population: [description]

PLATFORM REQUIREMENTS:
  - HIPAA BAA: [Required/Executed]
  - EHR integration: [Scheduling, documentation, billing]
  - Patient access: [Browser-based, app required, etc.]
  - Accessibility: [WCAG 2.1 AA, screen reader support]

COMPLIANCE:
  Licensure: [States covered, compact participation]
  Consent: [Process documented]
  Prescribing: [Controlled substance policy]

REIMBURSEMENT:
  Medicare: [Eligible CPT codes]
  Medicaid: [State coverage]
  Commercial: [Parity status]
  Modifiers: [-95, POS 10/02]

PATIENT WORKFLOW:
  Pre-visit: [Steps]
  During visit: [Steps]
  Post-visit: [Steps]
```

## Example

```
TELEHEALTH PROGRAM: Virtual Primary Care — Follow-up Visits
MODALITY: Synchronous video | PLATFORM: Doxy.me (BAA executed)

SCOPE:
  Visit types: Chronic disease follow-up, medication management, lab review
  Patient population: Adults 18+, English/Spanish, broadband or 4G

PLATFORM REQUIREMENTS:
  - HIPAA BAA: Executed (Doxy.me Enterprise)
  - EHR integration: Epic MyChart → Doxy.me deep link, auto-documentation
  - Patient access: Browser-based, no download, mobile-responsive
  - Accessibility: WCAG 2.1 AA, Spanish language option

COMPLIANCE:
  Licensure: 12 states (IMLC participating), expanding via compact
  Consent: Telehealth consent embedded in MyChart pre-visit flow
  Prescribing: Non-controlled via eRx, controlled substances in-person only per policy

REIMBURSEMENT:
  Medicare: 99212-99215 + modifier -95, POS 10
  Medicaid: Covered in all 12 states (parity laws)
  Commercial: 85% of covered lives have telehealth parity
  Modifiers: -95, POS 10

PATIENT WORKFLOW:
  Pre-visit: MyChart reminder 48h before → tech check → consent → vitals (home BP if available)
  During visit: Virtual waiting room → video connect → provider documents in Epic → orders placed
  Post-visit: Visit summary in MyChart → Rx sent to pharmacy → follow-up scheduled
```
