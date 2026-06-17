# Data Governance Validator

## When to activate

When validating compliance of training data sources, conducting data governance audits, reviewing consent and privacy practices, establishing data lineage tracking, or designing data retention and deletion procedures.

## When NOT to use

For data quality checks (missing values, outliers). This skill is specifically for compliance and governance aspects of data: consent, lineage, retention, deletion, PII handling, privacy.

## Instructions

### Data Governance Assessment Framework

1. **Define Scope**
   - Which AI systems are we assessing? (Models, datasets)
   - What data is in scope? (Training data, validation data, inference data, logs)
   - Applicable regulations? (GDPR, CCPA, HIPAA, sector-specific)
   - Key stakeholders? (Legal, Data Officer, Privacy Officer, ML team)

2. **Data Inventory & Lineage**
   
   Create comprehensive data inventory for each dataset used:
   
   **For each data source:**
   - Source: Where did the data come from? (vendor, internal system, third party)
   - Collection method: How was it collected? (scraping, user consent, purchase, internal logs)
   - Volume: How many records? Size? (important for compliance scope)
   - Features: What fields are captured? (especially identify PII, protected classes)
   - Retention period: How long is it kept? (GDPR: minimum necessary; HIPAA: 6 years; CCPA: requestor identifies)
   - Access: Who has access? (data science team, analytics, engineering)
   - Transformations: What preprocessing? (anonymization, aggregation, deletion)
   - Destination: What models/systems use this data?
   
   **Data Lineage Tracking:**
   ```
   Raw Data (Production System)
       ↓ [Extract]
   Data Warehouse
       ↓ [Aggregate, join, deduplicate]
   Feature Store
       ↓ [Feature engineering, scaling]
   Training Dataset
       ↓ [Train/val/test split]
   Trained Model → Inference
   ```
   
   Each transformation step should be logged and reversible for audit.

3. **Assess Lawful Basis for Processing (GDPR)**
   
   GDPR requires lawful basis for processing personal data. Identify for each data source:
   
   | Lawful Basis | Requirement | Governance Evidence |
   |---|---|---|
   | **Consent** | Explicit consent from data subject | Signed consent forms; consent records; withdrawal tracking |
   | **Contract** | Processing necessary to fulfill contract | Contract terms referencing data processing; data minimization |
   | **Legal Obligation** | Processing required by law | Reference to specific statute; regulatory requirement |
   | **Vital Interests** | Processing necessary to protect someone's life | Documentation of vital interest; emergency context |
   | **Public Task** | Processing necessary for public authority function | Government role documentation |
   | **Legitimate Interests** | Organization's interests balanced against data subject's rights | Legitimate Interest Assessment (LIA) completed and documented |
   
   **Audit steps:**
   - For each data source, identify which lawful basis applies
   - Obtain evidence of lawful basis (consent forms, LIA, etc.)
   - For consent: track consent withdrawal and deletion requests
   - Document for regulatory inspection

4. **Evaluate Consent & Privacy Practices**
   
   **If processing is based on consent:**
   - [ ] Consent mechanism: How was consent obtained? (UI, form, signature)
   - [ ] Consent records: Can you prove consent was obtained? (logged, timestamped)
   - [ ] Scope: What did you tell users you would do with their data?
   - [ ] Granularity: Can users consent to specific uses? (e.g., ML training vs. direct marketing)
   - [ ] Withdrawal: Can users withdraw consent? Is withdrawal honored?
   - [ ] Age verification: If users < 16 (or local age of digital age), was parental consent obtained?
   
   **Example consent audit output:**
   ```
   # Consent Audit: Customer Email List
   
   ## Consent Mechanism
   - Users sign up for email newsletter via web form
   - Consent checkbox: "Allow us to use your data for product recommendations and analytics"
   
   ## Assessment
   ✓ Explicit checkbox (users must affirmatively opt-in)
   ✓ Clear language about data use
   ⚠ Granularity: Single consent for both marketing and analytics (not granular)
   ✗ Scope: Does not explicitly mention machine learning or third-party model training
   
   ## Governance Evidence
   - Consent forms: [Database/link]
   - Consent timestamp: [System captures date/time]
   - Withdrawal mechanism: [Users can email support; no automated withdrawal]
   - Consent withdrawal logs: [Deletion request records]
   
   ## Risk Assessment
   ⚠ GDPR Risk: Scope of original consent may not cover model training; recommend obtaining new consent or documenting Legitimate Interest Assessment
   
   ## Recommended Mitigation
   - Conduct Legitimate Interest Assessment (LIA) for model training use case
   - Consider sending privacy notice to existing users explaining model training
   - Implement withdrawal mechanism to stop using data for model training
   ```

5. **Verify Data Subject Rights Procedures**
   
   GDPR requires organizations provide data subject rights. Assess:
   
   **Right to Access:**
   - [ ] Can data subjects request all data you hold on them?
   - [ ] Process documented: request intake → data retrieval → delivery to subject
   - [ ] SLA: How quickly do you respond? (GDPR: 30 days, extendable to 90)
   - [ ] Evidence of fulfillment: Tracking log of access requests
   
   **Right to Erasure ("Right to be Forgotten"):**
   - [ ] Can data subjects request deletion of their data?
   - [ ] Deletion process: How is data actually deleted? (database deletion, anonymization, etc.)
   - [ ] Retention exceptions: Do you have business/legal reasons to retain? (document them)
   - [ ] Evidence: Audit trail of deletion requests and fulfillment
   
   **Right to Rectification:**
   - [ ] Can data subjects correct inaccurate data?
   - [ ] Correction process: How are corrections made? Logged?
   - [ ] Retrain trigger: Do you retrain models when significant corrections are made?
   
   **Right to Restrict Processing:**
   - [ ] Can data subjects restrict use of their data (e.g., stop model training)?
   - [ ] Implementation: How do you honor the restriction?
   
   **Right to Data Portability:**
   - [ ] Can data subjects request data in machine-readable format?
   - [ ] Format: CSV, JSON, or other standard format?
   
   **Audit example:**
   ```
   # Data Subject Rights Assessment
   
   | Right | Process | SLA | Audit Trail | Assessment |
   |-------|---------|-----|-------------|------------|
   | Access | Request via support; retrieve from warehouse; deliver in 5 days | 5 days (< GDPR 30-day requirement) | Support tickets logged | ✓ Compliant |
   | Erasure | Request via support; delete from warehouse and backups within 48 hours; model retraining not triggered | 48 hours | Deletion logs available | ⚠ Compliant but retraining should be considered |
   | Rectification | Users can update profile via app; IT updates warehouse | Real-time | Update logs available | ✓ Compliant |
   | Restriction | Not currently supported; recommend feature implementation | N/A | None | ✗ Not compliant |
   | Portability | Support provides CSV export | 10 days | Export logs | ✓ Compliant |
   ```

6. **Assess Data Retention & Deletion**
   
   **Retention policy design:**
   - What is the minimum necessary retention period?
   - GDPR: "no longer than necessary" for stated purpose
   - HIPAA: Typically 6 years for medical records
   - CCPA: Consumers can request deletion; you must delete unless legal exception
   - Industry: Define retention periods by data type
   
   **Deletion procedure:**
   - How is data actually deleted? (Database deletion, purging, anonymization?)
   - Backups: How long are backups retained? Can they be recovered?
   - Logs: Are logs of data access kept longer than data? (document justification)
   - Verification: How do you verify deletion was complete?
   
   **Example retention schedule:**
   ```
   # Data Retention Schedule
   
   | Data Type | Source | Retention Period | Justification | Deletion Method |
   |-----------|--------|-----------------|---|---|
   | Customer Personal Data | CRM System | 3 years after last interaction | Customer service, marketing | Database deletion; backups deleted after 90 days |
   | Transaction Data | Payment System | 7 years | Regulatory (tax, fraud) | Database deletion; audit logs retain for 7 years |
   | Model Training Data | Curated Dataset | 2 years | Model retraining; not required after 2 years | Full database purge; anonymization acceptable |
   | Access Logs | Application Logs | 1 year | Incident investigation, security | Log aggregation and archival; purge after 1 year |
   | Model Predictions | Inference Logs | 90 days | Monitoring, debugging; not needed longer | Purge from production database; archived logs encrypted and retained separately |
   ```

7. **Evaluate PII Handling & Privacy-Preserving Techniques**
   
   **PII Identification:**
   - What personally identifiable information is in your data?
   - Direct PII: Name, email, phone, ID number, address
   - Quasi-PII: Age, gender, location (can be combined to re-identify)
   - Sensitive: Health, financial, criminal history, political beliefs
   
   **Privacy protection techniques:**
   - **Anonymization:** Remove or encrypt PII; can individuals be re-identified?
   - **Aggregation:** Group data so individual records cannot be isolated
   - **Differential Privacy:** Add controlled noise so individual data cannot be extracted from model
   - **Federated Learning:** Train model without centralizing data
   - **Access Control:** Who can view sensitive data? (role-based, purpose-limited)
   
   **Audit example:**
   ```
   # PII Handling Assessment
   
   ## Data Inventory
   | Field | Data Type | PII Status | Sensitivity | Protection |
   |-------|-----------|-----------|---|---|
   | customer_id | Integer | Direct PII | Medium | Encrypted in database |
   | email | String | Direct PII | Medium | Hashed for model training |
   | date_of_birth | Date | Quasi-PII | Low | Age derived; DOB deleted after feature engineering |
   | income | Float | Sensitive | High | Encrypted; accessible only to compliance team |
   | credit_score | Integer | Quasi-PII | High | Aggregated by decile; exact scores not stored |
   | health_condition | String | Sensitive | Critical | Encrypted; field-level access control |
   
   ## Protection Techniques Assessment
   ✓ Hashing: Email hashed for model input; cannot be reversed
   ✓ Aggregation: Income stored by bracket, not exact amount
   ✓ Encryption: Health data encrypted at rest; decryption logged
   ⚠ Differential Privacy: Not currently used; consider for future model training
   ⚠ Access Control: Should implement more granular field-level access
   
   ## Risk Assessment
   - Residual PII risk: Medium (data could be re-identified via linkage attack)
   - Recommended: Implement differential privacy for next model version
   ```

8. **Document Data Governance in Compliance Artifacts**
   
   Include in model card and risk register:
   - Data sources and lineage
   - Lawful basis for processing
   - Data subject rights procedures
   - Retention policy
   - PII handling and protection
   - Third-party data processors (with DPA)
   - Incident response procedures (data breach)

## Example

**Scenario:** Financial services company training credit risk model. Data sources include customer financial profiles, transaction history, credit bureau records, and third-party alternative data.

```
# Data Governance Audit: Credit Risk Model

## 1. Data Inventory & Lineage

### Data Source 1: Customer Financial Profile (Internal)
- Source: Core banking system
- Volume: 500,000 customer records
- Features: Income, employment history, assets, liabilities, credit utilization
- Collection: Collected during loan application or KYC process
- Lawful basis: Consent (customer signed loan application)
- Retention: 7 years (regulatory requirement for credit files)
- Deletion: On customer request or after 7 years (with exceptions for ongoing litigation)

### Data Source 2: Transaction History (Internal)
- Source: Payment processing system
- Volume: 50 million transactions (subset selected for last 2 years)
- Features: Transaction amount, merchant category, frequency, patterns
- Collection: Captured during payment processing (no additional consent)
- Lawful basis: Contract (necessary to deliver payment services)
- Retention: 7 years (regulatory)
- Deletion: Anonymized after 2 years; exact transaction details deleted; aggregates retained

### Data Source 3: Credit Bureau Records (Third-Party)
- Source: Equifax, Experian, TransUnion
- Volume: 500,000 records
- Features: Payment history, delinquencies, credit score, inquiries
- Collection: Purchased via licensing agreement
- Lawful basis: Legitimate Interest (credit risk assessment; consumer has opportunity to dispute)
- Retention: 7 years (regulatory)
- DPA: Executed with each bureau; data processing agreement terms reviewed
- Deletion: Bureau handles deletion per federal requirements; company complies with "delete" requests

### Data Source 4: Alternative Data (Third-Party Vendor)
- Source: Fintech vendor (non-traditional credit indicators)
- Volume: 250,000 records
- Features: Utility payment history, rent payment history, mobile phone payment history
- Collection: Provided by vendor; customer consent handled by vendor
- Lawful basis: Vendor certifies consent/FCRA compliance; reliance agreement in place
- Retention: 3 years (vendor retention policy)
- Deletion: Forwarded to vendor; vendor responsible for deletion
- Risk: ⚠ Vendor-provided consent; audit vendor practices annually

---

## 2. Data Lineage Tracking

```
Core Banking System (Customer Profile)
    ↓ [Daily extract, PII encrypted]
Data Warehouse
    ↓ [Join with transaction history]
Enriched Customer Dataset
    ↓ [Integrate credit bureau data]
Consolidated Customer Profile (PII: name, ID encrypted; age/income aggregated)
    ↓ [Feature engineering: income bucket, debt-to-income ratio, payment consistency]
Feature Store
    ↓ [Train/val/test split: 70/15/15; stratified by outcome]
Training Dataset (10,000 records; PII removed/hashed)
    ↓ [Train model]
Trained Credit Risk Model
    ↓ [Inference on new applicants]
Risk Score (0-100) → Loan Decision
```

Each step is logged with:
- Timestamp
- Data volume
- Transformations applied
- PII handling (what was encrypted/deleted)
- Access (who accessed data)
- Retention (how long is intermediate data kept?)

---

## 3. Lawful Basis Assessment

| Data Source | Primary Lawful Basis | Secondary Justification | Evidence |
|---|---|---|---|
| Customer Financial Profile | Consent | Contract (loan application) | Signed loan application form; customer signature |
| Transaction History | Contract | Legitimate Interest (fraud detection) | Payment processing agreement; customer consented to T&Cs |
| Credit Bureau Records | Legitimate Interest | FCRA compliance (permitted purpose) | Fair Credit Reporting Act Section 604(a); certified use for credit determination |
| Alternative Data | Vendor Certifies Consent | Reliance Agreement | Vendor compliance certification; indemnification clause |

**Risk Assessment:**
✓ All data sources have documented lawful basis
⚠ Credit bureau data: FCRA compliance is narrow (credit decisions only); cannot use for other purposes without additional lawful basis
✗ Alternative data: Vendor-provided consent; company has indirect reliance; audit vendor annually

**Recommendation:** Limit use of credit bureau and alternative data to credit decisions; do not use for direct marketing without separate consent

---

## 4. Consent & Privacy Assessment

### Customer Financial Profile (Consent-Based)

**Consent Mechanism:**
- Collected during loan application via paper form or online portal
- Consent language: "I authorize [Company] to use my financial information to assess creditworthiness and prevent fraud"

**Assessment:**
⚠ Scope issue: Consent mentions "creditworthiness" but not "machine learning model training" or "model development"
⚠ Granularity: Single consent for multiple purposes (credit assessment, fraud prevention, model training)
✗ Language: Does not mention third-party use (e.g., sharing with vendors)

**Mitigations:**
- Conduct Legitimate Interest Assessment (LIA) for model training use case
- Send privacy notice explaining model training practices
- Implement opt-out mechanism for model training use
- Update consent form for future applicants with granular options

### Consent Evidence:
- Sample consent forms: [Database, 500k records]
- Consent timestamps: [System captures collection date; 99% have timestamp within 30 days of application]
- Consent withdrawal: 120 requests received in 2024; process takes 10 business days; deletion requests tracked

---

## 5. Data Subject Rights Procedures

| Right | Process | SLA | Audit Evidence | Status |
|-------|---------|-----|---|---|
| **Access** | Customer requests via support; company retrieves from data warehouse; delivered as PDF | 30 days (FCRA-compliant) | 45 requests in 2024; avg 18 days to fulfill | ✓ Compliant |
| **Erasure** | Customer requests deletion; company deletes from systems (within limitations of 7-year retention) | 30 days | 10 deletion requests in 2024; fulfillment logs available | ✓ Compliant with caveats (retention for regulatory compliance) |
| **Rectification** | Customer corrects data via online portal; company updates database; credit bureau notified | Real-time for internal systems; 30 days to credit bureau | Correction logs available | ✓ Compliant |
| **Restrict** | Not currently supported | N/A | No requests in 2024 | ⚠ Gap: Should implement |
| **Portability** | Customer requests data export; system generates CSV | 30 days | 5 requests in 2024 | ✓ Compliant |

**Audit Finding:** Data subject rights procedures are largely compliant but "right to restrict processing" is missing. Recommend feature implementation.

---

## 6. Data Retention & Deletion

**Retention Policy:**
```
Customer Financial Data: 7 years (regulatory requirement for credit files)
  → Exact data deleted after 7 years
  → Anonymized aggregate data retained indefinitely for model retraining

Transaction History: 
  → Detailed transaction data: 2 years
  → Aggregated daily summaries: 7 years
  → Year-over-year summaries: Indefinite

Credit Bureau Records: 7 years (per FCRA)

Model Training Data: 2 years (not required after retraining cycle)
  → Deleted or anonymized after 2 years
  → Derived features retained for model monitoring
```

**Deletion Verification:**
- ✓ Production database: Automated deletion jobs run monthly; audit logs confirm deletion
- ⚠ Backups: Retained for 90 days (for disaster recovery); after 90 days, older backups purged
- ✓ Deletion audit trail: All deletions logged with timestamp, reason, and requester

**Finding:** Backup retention of 90 days is reasonable for disaster recovery compliance.

---

## 7. PII Handling & Privacy-Preserving Techniques

**PII Inventory:**
| Field | Type | Sensitivity | Protection Method |
|-------|------|-------------|---|
| name | String | Direct PII | Hashed (not stored in model training data) |
| social_security_number | String | Critical PII | Encrypted at rest; token used for deduplication |
| date_of_birth | Date | Quasi-PII | Derived to age_bucket (18-30, 30-50, 50+); DOB not stored |
| income | Float | Sensitive | Aggregated to income_bracket (< 50k, 50-100k, > 100k); exact amount deleted |
| address | String | Quasi-PII | Stored at state level only; zip code not stored |
| transaction_history | List | Sensitive | Aggregated to monthly summaries; individual transactions deleted after 2 years |

**Privacy-Preserving Techniques:**
- ✓ Hashing: Customer name hashed; cannot be reversed
- ✓ Aggregation: Income and age aggregated to brackets
- ✓ Tokenization: SSN replaced with token; mapping table encrypted and access-controlled
- ⚠ Differential privacy: Not currently used; consider for next iteration
- ✓ Access control: Only 15 data scientists have access to PII; access logged and audited

**Risk Assessment:**
- Re-identification risk: Medium (quasi-identifiers like age, gender, zip code could be linked to external data)
- Recommended mitigation: Differential privacy for model training; k-anonymity analysis for quasi-identifiers

---

## 8. Third-Party Data Processors

**Data Processing Agreements (DPAs):**
| Vendor | Data Type | DPA Status | Security Assessment | Risk |
|--------|-----------|-----------|---|---|
| Credit Bureaus (3) | Credit records | ✓ Executed | SOC 2 Type II certified | Low |
| Alternative Data Vendor | Non-traditional indicators | ✓ Executed | Not yet assessed | Medium: Schedule annual security audit |
| Data Warehouse Host (Cloud provider) | All data | ✓ Executed | SOC 2 Type II + FedRAMP | Low |
| Model Training Platform (Third-party ML service) | Training data | ✗ Not executed | Not assessed | High: Do not use until DPA in place |

**Recommendation:** Execute DPA with third-party ML service before using for training; conduct security assessment.

---

## 9. Overall Data Governance Assessment

**Compliance Score:** 8/10

**Strengths:**
- ✓ Comprehensive data inventory and lineage tracking
- ✓ Clear retention policies aligned with regulatory requirements
- ✓ Data subject rights procedures documented and tested
- ✓ PII handling with encryption and aggregation
- ✓ DPAs in place with major vendors

**Gaps:**
- ⚠ Consent scope may not cover model training use case; recommend LIA or privacy notice
- ⚠ "Right to restrict processing" not implemented
- ⚠ Differential privacy not used; recommend for future model versions
- ⚠ Alternative data vendor security not assessed

**Recommendations (Priority Order):**
1. Conduct Legitimate Interest Assessment for model training use case
2. Implement "right to restrict processing" feature
3. Execute DPA with third-party ML platform before use
4. Conduct annual security assessments of alternative data vendor
5. Plan differential privacy implementation for next model version

**Approvals:**
- Data Officer: _____________________ Date: _____ [Confirms data governance compliant]
- General Counsel: _____________________ Date: _____ [Confirms legal compliance]
- Model Owner: _____________________ Date: _____ [Confirms understanding of data restrictions]

Approved: [Date] with recommendations tracked and follow-up audit scheduled for [Date + 90 days]
```

---

## Data Governance Checklist

Ensure comprehensive assessment:

**Data Inventory:**
- [ ] All data sources identified and documented
- [ ] Data lineage mapped end-to-end
- [ ] Data volume and feature descriptions recorded
- [ ] Retention requirements identified

**Lawful Basis:**
- [ ] GDPR lawful basis documented for each source
- [ ] Consent records (if applicable) available
- [ ] Legitimate Interest Assessments (if applicable) completed
- [ ] Legal/regulatory basis (if applicable) cited

**Privacy Rights:**
- [ ] Access request procedure documented and tested
- [ ] Deletion request procedure documented and tested
- [ ] Rectification procedure documented
- [ ] Right to restrict implementation status assessed
- [ ] Data portability capability verified

**Retention & Deletion:**
- [ ] Retention schedule defined by data type
- [ ] Deletion procedures documented
- [ ] Backup retention policy clear and justified
- [ ] Deletion verification and audit trail in place

**PII Handling:**
- [ ] PII inventory completed (direct, quasi, sensitive)
- [ ] Protection methods assigned: encryption, hashing, aggregation, anonymization
- [ ] Access controls documented (who can see PII?)
- [ ] Differential privacy (if applicable) considered

**Third-Party Management:**
- [ ] All vendors/data processors identified
- [ ] Data Processing Agreements (DPAs) executed
- [ ] Security assessments completed or planned
- [ ] Vendor compliance obligations documented

**Documentation:**
- [ ] Data governance policy written
- [ ] Model card includes data governance section
- [ ] Risk register addresses data risks
- [ ] Decision log includes data governance decisions
- [ ] Incident response plan includes data breach procedures
