---
name: ehr-integration-architect
description: Designs EHR integration architectures using HL7 FHIR, C-CDA, and X12 standards. Outputs interface specifications with data mapping, error handling, and interoperability compliance for health information exchange.
allowed-tools: Read, Write, WebSearch
effort: high
---

# EHR Integration Architect

## When to activate
When integrating a new system with an EHR (Epic, Cerner, Athenahealth), building health information exchange interfaces, implementing FHIR APIs, or when connecting labs, pharmacies, or imaging systems. Use for any clinical data integration project.

## When NOT to use
Skip for simple CSV imports, one-time data migrations (not ongoing interfaces), or when the integration already exists and is functioning within SLA.

## Instructions

1. **Define the interface:**
   - Source system and target system
   - Direction: Unidirectional vs. bidirectional
   - Transport: HL7 v2.x, FHIR R4, X12, C-CDA, REST API
   - Trigger: Real-time, batch, or on-demand

2. **Data mapping:**
   - Source fields → target fields with transformation rules
   - Code system mapping (SNOMED → ICD-10, local codes → LOINC)
   - Required vs. optional fields
   - Default values for missing data

3. **FHIR resource mapping (if applicable):**
   - Patient, Encounter, Observation, MedicationRequest, DiagnosticReport
   - USCDI data class compliance
   - SMART on FHIR scopes for authorization

4. **Error handling:**
   - Message validation (ACK/NAK for HL7, HTTP status for FHIR)
   - Retry logic (exponential backoff, max retries)
   - Error queue and manual review workflow
   - Alerting for interface failures

5. **Testing strategy:**
   - Unit tests per message type
   - Integration tests with sample data
   - Volume/stress testing
   - Go-live validation checklist

## Output Format

```
EHR INTERFACE: [Source] → [Target]
STANDARD: [HL7 v2.x / FHIR R4 / X12 / C-CDA]
DIRECTION: [Uni/Bidirectional] | TRANSPORT: [MLLP/HTTPS/SFTP]
TRIGGER: [Real-time/Batch/On-demand]

DATA MAPPING:
| Source Field | Target Field | Transform | Required | Code Map |
|-------------|-------------|-----------|----------|----------|

FHIR RESOURCES (if applicable):
  [Resource type]: [Profile URL]
  Scopes: [SMART scopes]

ERROR HANDLING:
  Validation: [Rules]
  Retry: [Strategy]
  Alerting: [Threshold + channel]

TESTING:
  Unit: [X] message types × [Y] scenarios
  Integration: [End-to-end scenarios]
  Volume: [X] messages/min for [Y] minutes
```

## Example

```
EHR INTERFACE: Lab System → Epic EHR
STANDARD: HL7 v2.5.1 (ORU^R01)
DIRECTION: Unidirectional | TRANSPORT: MLLP (port 6661)
TRIGGER: Real-time on result finalization

DATA MAPPING:
| Source Field    | Target Field     | Transform        | Required | Code Map       |
|-----------------|------------------|------------------|----------|----------------|
| result.test_code| OBX-3            | Local → LOINC    | Yes      | Lab→LOINC table|
| result.value    | OBX-5            | Unit conversion  | Yes      | —              |
| result.ref_range| OBX-7            | Format: "L-H"    | Yes      | —              |
| result.abnormal | OBX-8            | Map: A→A, H→H   | Yes      | Flag codes     |

ERROR HANDLING:
  Validation: Message structure, required fields, value range
  Retry: 3 attempts, 5/15/60 min intervals
  Alerting: >5 failures in 15 min → PagerDuty

TESTING:
  Unit: 12 result types × 5 scenarios each (normal, abnormal, critical, empty, malformed)
  Integration: 50 sample results end-to-end with Epic validation
  Volume: 200 messages/min for 30 minutes
```
