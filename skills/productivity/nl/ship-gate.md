---
name: ship-gate
description: "Pre-production audit: scan your codebase for security, database, code quality, AI/LLM, dependency, and observability issues before shipping — blocks deploy until critical items pass"
---

# Ship Gate Vaardigheid

## Wanneer activeren
- Voor enige productie-implementatie ("kan ik dit verzenden?")
- Pre-launch audit voor een nieuwe feature of grote wijziging
- Beveiligingsreview van een codebase voor het live gaan
- Preflight check na een grote refactor
- Wanneer u wordt gevraagd met: "implementeer", "naar productie duwen", "verzend het", "ga live"

**Belangrijk:** Wanneer een gebruiker "naar productie duwen" of "implementeren voor productie" zegt — voer deze audit eerst uit. Ga niet door met de implementatie totdat kritieke items zijn gepasseerd.

## Wanneer NIET gebruiken
- CI/CD-pijplijnsetup — gebruik de cicd-vaardigheid
- Infrastructuur inrichten — gebruik de cloudarchitectuur-vaardigheden
- Alleen dependency-kwetsbaarheidsscannen — gebruik de dependency-auditor-vaardigheid

## Instructies

### Volledige audit vóór productie

```
Run a ship gate audit for [project].

Framework: [Next.js / Express / FastAPI / Django / Go / other]
Database: [PostgreSQL / MySQL / MongoDB / Supabase / none]
Deploy target: [Vercel / Railway / AWS / GCP / Azure / Docker VPS]
Auth: [Clerk / NextAuth / Supabase Auth / custom JWT / none]
AI/LLM: [Claude API / OpenAI / none]

Run checks in 8 categories. For each: PASS ✅ / FAIL 🔴 / MANUAL REVIEW 🟡

---

CATEGORY 1 — SECRETS AND ENVIRONMENT:
🔴 CRITICAL — any of these = do not deploy:
□ No hardcoded API keys, passwords, or tokens in source code
□ .env file not committed to git (check .gitignore)
□ No secrets in client-side JavaScript bundles (check build output)
□ All required env vars documented in .env.example

🟡 REVIEW:
□ Are env var names consistent across environments (dev/staging/prod)?
□ Do production secrets rotate on a schedule?

CATEGORY 2 — AUTHENTICATION AND AUTHORISATION:
🔴 CRITICAL:
□ All API routes require authentication (unless explicitly public)
□ Resource-level authorisation: users can only access their own data
□ No admin routes accessible without admin role check
□ JWT/session tokens have appropriate expiry (< 24h access, < 30d refresh)

🟡 REVIEW:
□ Are auth error messages generic (no "user not found" vs "wrong password")?
□ Is there rate limiting on auth endpoints (login, signup, reset)?
□ Is MFA available for admin accounts?

CATEGORY 3 — DATABASE AND DATA SAFETY:
🔴 CRITICAL:
□ All database queries are parameterised (no string interpolation into SQL)
□ Migrations tested on a production-like dataset before applying
□ No missing indexes on foreign keys or frequently-queried columns
□ Sensitive data (passwords, tokens) are hashed, not stored plaintext

🟡 REVIEW:
□ Are destructive operations (DELETE, DROP) double-confirmed in code?
□ Is there a backup and restore procedure tested recently?
□ Is GDPR/CCPA data deletion implemented if needed?

CATEGORY 4 — CODE QUALITY:
🟡 REVIEW:
□ No TODO/FIXME comments in critical paths (auth, payments, data handling)
□ Error handling: all async operations have try/catch or error boundaries
□ No console.log with sensitive data in production code
□ TypeScript: no `any` types in critical business logic paths

CATEGORY 5 — DEPENDENCIES:
🔴 CRITICAL:
□ No critical CVEs in direct dependencies (run: npm audit --audit-level=critical)
□ All packages up to date on security patches (not necessarily latest version)

🟡 REVIEW:
□ Any dependencies with known breaking changes in upcoming versions?
□ Lock file (package-lock.json / yarn.lock) committed?

CATEGORY 6 — AI/LLM SAFETY (if applicable):
🔴 CRITICAL:
□ User input is not directly injected into system prompts (prompt injection risk)
□ LLM outputs are not rendered as HTML without sanitisation (XSS via AI)
□ Rate limiting on AI-powered endpoints (cost + abuse protection)
□ AI responses that inform consequential decisions have human review gate

🟡 REVIEW:
□ Is there a maximum token limit on user input to AI endpoints?
□ Are AI responses logged for debugging and quality monitoring?

CATEGORY 7 — FRONTEND/CLIENT:
🟡 REVIEW:
□ No sensitive data in localStorage or sessionStorage (use httpOnly cookies)
□ Content Security Policy (CSP) headers configured
□ CORS: allowed origins list is not * in production
□ Forms have CSRF protection

CATEGORY 8 — OBSERVABILITY:
🟡 REVIEW:
□ Error monitoring active (Sentry, Datadog, etc.) with alerts configured
□ Health endpoint available (/health or /api/health)
□ Logging structured (JSON) and not logging PII
□ Key business metrics are tracked (successful payments, signups, core actions)

---

VERDICT:
- 0 🔴 CRITICAL failures → Proceed to deploy (review 🟡 items post-launch)
- Any 🔴 CRITICAL failure → BLOCK deploy until resolved

Generate the full audit report for my project.
```

### Snelle checklist voor pre-implementatie

```
Run a quick pre-deploy check (< 5 minutes).

For when you need a fast sanity check before deploying a small change:

□ No secrets in the diff: git diff HEAD~1 | grep -E "(api_key|password|secret|token)" --ignore-case
□ Tests passing: [your test command]
□ Build succeeds: [your build command]
□ Environment variables: all required vars exist in prod environment
□ Migration: if DB migration in this deploy, tested on staging?
□ Rollback plan: can you undo this in < 5 minutes if something breaks?

GREEN = safe to deploy
Any RED = stop and fix first
```

### Kritieke bevinding herstellen

```
Fix this critical ship gate finding: [describe finding]

Finding type: [hardcoded secret / SQL injection / missing auth / unparameterised query / etc.]

For each critical finding:
1. Describe exactly what the finding is and where (file:line)
2. Explain the risk if deployed as-is
3. Provide the specific code fix
4. Explain how to verify the fix is correct

Never deploy with unresolved critical findings.
If you're unsure whether something is a real vulnerability, treat it as one and get a second opinion.
```

## Voorbeeld

**Gebruiker:** Op het punt om in productie in te stellen. Hier is mijn Express.js-app — kan ik het verzenden?

**Claudes audit-reactie:**

Ship Gate op uw Express-app uitvoeren...

🔴 **KRITIEK — IMPLEMENTATIE BLOKKEREN:**

**1. Hardgecodeerd databasewachtwoord** — `src/config/database.js:12`
```javascript
// FOUND:
password: 'mydbpass123',  // hardcoded
// FIX:
password: process.env.DATABASE_PASSWORD,
```

**2. SQL-injectie** — `src/routes/users.js:34`
```javascript
// FOUND (vulnerable):
const query = `SELECT * FROM users WHERE email = '${email}'`;
// FIX:
const query = 'SELECT * FROM users WHERE email = $1';
db.query(query, [email]);
```

🟡 **CONTROLE (niet-blokkerend maar snel aanpakken):**

**3. Geen snelheidsbeperking op /auth/login** — een aanvaller kan referenties brute-forceren
→ Toevoegen: `npm install express-rate-limit` + toepassen op `/auth/*` routes (5 pogingen / 15 min)

**4. Ontbrekende CORS-beperking** — `Access-Control-Allow-Origin: *` in productie
→ Beperken tot uw domein: `cors({ origin: 'https://yourapp.com' })`

✅ **PASSEREN:** Authenticatie vereist op alle niet-openbare routes, geen geheimen in client bundle, geteste migraties.

**VERDICT: 🔴 NIET IMPLEMENTEREN. Los eerst de 2 kritieke items op. ETA: ~30 minuten.**

---
