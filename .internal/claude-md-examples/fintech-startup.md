# CLAUDE.md — Fintech App (Annotated Example)
> Fintech application with PCI-DSS, SOC 2, and financial data handling — shows how to wire security and compliance constraints as hard gates Claude cannot bypass, not suggestions it can weigh.

<!-- ANNOTATION: The opening is unusually strong. "Non-negotiable" is intentional — fintech has regulatory consequences (fines, license revocation, customer harm) for security lapses. Claude must treat these constraints as hard rules, not soft preferences to trade off against delivery speed. -->
This is a financial technology application. Security and compliance constraints are non-negotiable — they are not tradeoffs to make against delivery speed. If implementing a feature cleanly would require violating a constraint below, stop and flag it rather than finding a workaround.

## Regulatory Context

<!-- ANNOTATION: Naming specific regulations (PCI-DSS, SOC 2, GLBA) gives Claude the vocabulary to recognize when a proposed implementation might create a compliance issue, even before the user realizes it. -->
- PCI-DSS Level 2 (processes card data via Stripe, not direct card storage)
- SOC 2 Type II audit in progress
- GLBA compliance required (financial data of US consumers)
- State money transmitter licenses in: CA, NY, TX, FL

## Stack

- Backend: Go 1.22 + Gin framework
- Database: PostgreSQL 16 with row-level encryption for PII fields
- Auth: Clerk (handles MFA, session management)
- Payments: Stripe (SCA-compliant, no raw card data touches our servers)
- Infrastructure: AWS (VPC-isolated, no public subnets for DB/cache)
- Secrets: AWS Secrets Manager — no `.env` files in production

## Security Hard Rules

<!-- ANNOTATION: These are not style preferences — they are compliance requirements. The phrase "do not implement" is chosen over "prefer not to" because Claude should refuse, not just hesitate. -->

### Authentication and Authorization
- Do not implement custom session management — use Clerk
- All API endpoints require authentication unless explicitly in the public endpoints list
- Authorization checks use RBAC roles defined in `internal/auth/roles.go` — do not inline permission logic
- Admin endpoints (`/admin/*`) require both RBAC role + MFA verification

### Secrets
- No secrets in code, environment variables files, or Git history
- All secrets via AWS Secrets Manager (`internal/config/secrets.go`)
- Rotate secrets by updating Secrets Manager + redeploying — never patch in place
- If a secret is accidentally committed: immediately rotate it, do not just delete the commit

### PII and Financial Data
- PII fields (SSN, DOB, bank account numbers) are encrypted at rest using AES-256 via `internal/crypto/`
- Log sanitization is mandatory — `internal/logging/sanitize.go` strips PII before any log write
- Do not log financial amounts, account balances, or transaction IDs at DEBUG level in production
- Data retention: PII deleted 90 days after account closure per `internal/jobs/retention.go`

### Input Validation
<!-- ANNOTATION: Financial applications are high-value targets for injection attacks. Validation rules are more important here than in typical apps — Claude must not skip them for brevity. -->
- All monetary values use `decimal.Decimal` (shopspring/decimal) — never `float64` for money
- Validate and sanitize all user input at the API boundary using request structs + validator tags
- SQL queries use parameterized queries only — no string interpolation in SQL ever
- Amount fields must validate: non-negative, within limits defined in `internal/limits/`

## Audit Logging

<!-- ANNOTATION: Audit logs are a compliance requirement, not optional instrumentation. Every financial event must be logged with immutable records. Claude must add audit log calls to any code that handles financial operations. -->
Every financial operation must write an audit log entry:
```go
auditlog.Write(ctx, auditlog.Entry{
    UserID:    userID,
    Action:    "transfer.initiated",
    Amount:    amount,
    AccountID: accountID,
    IPAddress: r.RemoteAddr,
})
```
Audit logs are append-only and written to a separate immutable store — never deleted.

## Code Review Requirements

Before any PR touching payments, auth, or PII handling:
1. Run `gosec ./...` — must pass with zero high/critical findings
2. Run `go vet ./...` and `staticcheck ./...`
3. Self-review: check against the security checklist in `docs/security-checklist.md`
4. Tag `@security-review` in the PR for payment and auth changes

## Testing for Financial Logic

<!-- ANNOTATION: Financial logic bugs are catastrophic. Double-charging, incorrect rounding, or wrong fee calculations can cause real customer harm and regulatory issues. Test coverage requirements are higher here than for non-financial code. -->
- 100% coverage required for `internal/payments/`, `internal/ledger/`, `internal/fees/`
- All monetary calculations must have table-driven tests with known inputs and expected outputs
- Regression tests for any bug — no fix without a test that reproduces the original failure
- Use `decimal.Decimal` test cases, not float arithmetic

## What Not To Do

<!-- ANNOTATION: Each item here represents a real fintech security failure mode — card data leakage, audit log deletion, float rounding errors, secret exposure. These aren't hypothetical; they are the exact mistakes that cause breaches and regulatory actions. -->
- Do not store card numbers, CVVs, or raw bank account numbers — use Stripe tokens
- Do not use `float64` for monetary values — use `decimal.Decimal`
- Do not delete or modify audit log entries
- Do not add logging statements that could output PII or financial data
- Do not bypass RBAC checks for "convenience" in admin tools
- Do not commit secrets or hardcoded credentials — even test/dummy values normalize bad habits
- Do not implement custom crypto — use the functions in `internal/crypto/`
