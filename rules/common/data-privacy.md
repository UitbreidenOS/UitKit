# Data Privacy Rules

Apply when handling personal, sensitive, or regulated data.

## Data minimisation

- Collect only data you have a specific, documented use for — collecting "just in case" is a liability
- Set retention periods at collection time; delete or anonymise data when the period expires
- Don't log personal data (names, emails, IPs, device IDs) unless operationally required — and even then, scope it
- Prefer storing a derived attribute over the raw value: age bucket instead of birthdate, hashed ID instead of email

## Classification

- Classify all data fields before storing them: public / internal / confidential / restricted
- Restricted data (PII, payment data, health records) requires encryption at rest and in transit
- Never store passwords in recoverable form — use bcrypt, Argon2, or scrypt with sufficient cost factor
- Treat session tokens, API keys, and JWTs as restricted data

## Access control

- Apply the principle of least privilege: services and users access only what they need
- Implement row-level security for multi-tenant data — never rely solely on application-layer filters
- Audit-log reads of sensitive records: who accessed what and when
- Revoke access immediately on role change or offboarding — don't wait for the next provisioning cycle

## Cross-border and regulatory

- Know which regulations apply: GDPR (EU residents), CCPA (California residents), HIPAA (US health data), PCI DSS (payment cards)
- Data subject rights (access, deletion, portability) must be implementable — design the schema so you can find and delete all data for a given user
- Don't transfer personal data to jurisdictions without an adequate legal basis (SCCs, adequacy decision)
- Document your data flows: what data goes where, processed by whom, under what legal basis

## Third-party integrations

- Vet third-party processors before sending them personal data — check their DPA and certifications
- Use tokenisation when passing user identifiers to analytics or ad platforms — never raw PII
- Honour Do Not Track / opt-out signals at the integration boundary, not just the UI layer

## Incident response

- Define what constitutes a notifiable breach before one happens
- GDPR requires notifying the supervisory authority within 72 hours of discovery
- Have a documented runbook for: containment, assessment, notification, and post-mortem
- Never attempt to conceal a breach — it compounds legal exposure

## Testing

- Use synthetic or anonymised data in non-production environments — never copy production PII to staging
- Redact or mask sensitive fields in logs and error reports before they leave the system boundary
