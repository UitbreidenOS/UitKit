# Security Policy

Claudient takes security seriously. This document outlines our responsible disclosure process, vulnerability reporting mechanisms, patch timelines, and known security issues.

---

## Reporting a Security Vulnerability

If you discover a security vulnerability in Claudient, please **do not** open a public GitHub issue. Instead, report it responsibly to our security team.

### Reporting Methods

**Option 1: GitHub Security Advisory (Recommended)**
- Navigate to [Claudient/Claudient Security Advisory](https://github.com/Claudient/Claudient/security/advisories/new)
- Fill out the vulnerability form with:
  - **Title**: Brief, non-specific description (e.g., "Potential credential exposure in configuration parsing")
  - **Description**: Detailed explanation, affected versions, CVSS score (if known)
  - **Severity**: Critical / High / Medium / Low
  - **Affected versions**: List all affected release tags
  - **Proof of concept**: Minimal reproduction (if safe to disclose)
  - **Suggested fix**: Your proposed patch (optional)

**Option 2: Email**
- Contact: `security@claudient.dev` (primary) or `security@uitbreiden.com` (fallback)
- Include subject line: `[SECURITY] Vulnerability Report: <brief title>`
- Use PGP if available (public key: [link to GPG key, if available])

**Option 3: Slack (Private Workspace)**
- If you have access to the Claudient private Slack, message `@security-team` directly

### Reporting Guidelines

Please include:
1. **Vulnerability type** (e.g., privilege escalation, code injection, credential exposure)
2. **Affected component** (e.g., skill name, hook, agent, MCP server)
3. **Severity** (critical / high / medium / low)
4. **Reproduction steps** — minimal, clear steps to reproduce
5. **Impact** — what can an attacker do; does it require user interaction?
6. **Affected versions** — which release tags are impacted?
7. **Suggested remediation** (optional)

---

## Security Response Timeline

Upon receipt of a vulnerability report:

| Phase | Timeline | Action |
|---|---|---|
| **Acknowledgment** | Within 24 hours | Security team acknowledges receipt |
| **Triage** | Within 48 hours | Confirm reproducibility; assess severity |
| **Patch Development** | Critical: 7 days; High: 14 days; Medium: 30 days | Fix is implemented and tested |
| **Internal Review** | During patch dev | Peer review; regression testing |
| **Release** | 1–5 days after patch ready | Released as patch or minor version |
| **Public Disclosure** | After patch release + 30 days | Public advisory published (CVSS ≥ 7.0) |

**Embargo Policy**: We observe a 30-day window after patch release before public disclosure (CVSS ≥ 7.0). Low-severity issues may not receive a public advisory. Researchers may request early disclosure under mutual agreement.

---

## Security Contacts

| Role | Contact | Availability |
|---|---|---|
| **Security Lead** | `security@claudient.dev` | Primary contact; responds within 24 hours |
| **Fallback Contact** | `security@uitbreiden.com` | Escalation; 48-hour response |
| **GitHub Security** | [Private advisory form](https://github.com/Claudient/Claudient/security/advisories/new) | Integrated GitHub alert system |
| **Public Disclosure** | [GitHub Security Advisories](https://github.com/Claudient/Claudient/security/advisories) | Published advisories appear here |

---

## Known Security Issues & Mitigation

### Active Issues

**None currently disclosed.** Check the [GitHub Security Advisories](https://github.com/Claudient/Claudient/security/advisories) page for the authoritative list.

### Historical Issues

All resolved security issues are published in the [Security Advisories](https://github.com/Claudient/Claudient/security/advisories) archive after the embargo period expires.

---

## Security in Claudient

### What Claudient Covers

Claudient is a **knowledge system** — skills, agents, hooks, prompts, workflows, and documentation for Claude Code. Security considerations include:

1. **Prompt Injection Prevention** — guides on safely passing user input to Claude
2. **Credential Management** — best practices for MCP server auth, API key handling
3. **Supply Chain Security** — dependency audit skills, lock-file validation, SCA tools
4. **Secure Coding Practices** — OWASP top 10, input validation, output encoding
5. **Infrastructure Security** — cloud security skills for AWS, GCP, Azure, Kubernetes
6. **Access Control** — role-based permission models in hooks and agents

### What Claudient Does NOT Cover

- Claudient does **not** provide runtime security for your applications — it is documentation and configuration
- Security vulnerabilities in your codebase are **not** Claudient's responsibility (but our guides help you find them)
- Vulnerabilities in third-party tools, MCP servers, or dependencies are **not** Claudient's responsibility (report to the upstream project)
- Claude Code runtime or API security is Anthropic's responsibility — report to [Anthropic's security team](https://www.anthropic.com/security)

---

## Dependency Security

### Dependency Updates

Claudient is maintained with:
- **npm dependencies** locked in `package-lock.json`
- **Regular audits** via `npm audit` and dependabot (GitHub Actions)
- **Patch automation** — security patches applied within 48 hours of disclosure
- **SCA scans** — periodic scanning with industry tools (Snyk, GitHub Advanced Security)

### Reporting Upstream Vulnerabilities

If you find a security issue in a **dependency**, **MCP server**, or **Claude Code itself**:

1. **Dependency** → Report to the upstream project (npm registry page)
2. **MCP Server** → Report to the MCP server's repository
3. **Claude Code** → Report to Anthropic: https://www.anthropic.com/security

Do **not** report third-party vulnerabilities to Claudient unless we actively bundle a vulnerable version and fail to patch within our timeline.

---

## Best Practices for Users

### Securing Your Claudient Installation

1. **Keep Claudient updated** — run `npm update claudient` regularly
2. **Audit your skills** — review third-party skill code before trusting it
3. **MCP server trust** — only connect to MCP servers you control or trust
4. **Credential handling** — never hardcode API keys; use `.env` files and `.gitignore`
5. **LLM prompt safety** — treat Claude input like user input; validate and sanitize
6. **Hook security** — review hook code; limit permissions via `settings.json`

### Security-Hardened Setup

Use the included security template:

```bash
cp settings-templates/security-hardened.json ~/.claude/settings.json
```

This template disables dangerous features by default:
- No automatic hook execution
- No shell commands without confirmation
- Limited file access
- Restricted MCP server permissions

### Running Security Audits

Claudient includes security audit skills and workflows:

```bash
/security-audit          # Scan your codebase for common vulns
/security-scan           # Audit Claude Code hooks and permissions
/workflow security-review # End-to-end security review
```

---

## Security in Development

### Contribution Guidelines

If you submit code (hooks, scripts, prompts) to Claudient:

1. **No secrets** — do not commit API keys, passwords, or tokens
2. **Input validation** — sanitize user input; never trust shell arguments
3. **Least privilege** — request minimal permissions in hooks
4. **Code review** — your PR will be security-reviewed by maintainers
5. **Testing** — include tests for security-critical changes

### What We Review

All PRs undergo security review for:
- Credential leaks (automated scanning + manual review)
- Shell injection risks (if hooks or scripts modify commands)
- Prompt injection vectors (if templates accept user input)
- Insecure cryptography or authentication
- Unvalidated third-party integrations

---

## Compliance & Standards

Claudient adheres to:

- **OWASP Top 10** — guides cover injection, auth failures, sensitive data exposure
- **CWE Top 25** — documentation references Common Weakness Enumeration
- **SANS Top 25** — security skills align with industry-standard vulnerability classes
- **NIST Cybersecurity Framework** — referenced in enterprise security stacks

---

## Responsible Disclosure Expectations

We ask security researchers to:

1. **Give us time** — allow 30–90 days before public disclosure
2. **Be specific** — provide clear reproduction steps and impact assessment
3. **Avoid harm** — do not access data or systems beyond proof-of-concept
4. **Coordinate** — work with us; don't report to third parties until patched
5. **Credit** — we will acknowledge you in the advisory and changelog (unless you prefer anonymity)

In return, we commit to:
- Timely acknowledgment and triage
- Regular status updates
- Good-faith patch development
- Transparent disclosure and CVE assignment (if warranted)
- Recognition in advisories

---

## Legal Disclaimer

Claudient is provided **as-is** under the terms of its [LICENSE](LICENSE) and [LICENSE-CODE](LICENSE-CODE). We make no warranty regarding security or fitness for a particular purpose. Users are responsible for:

- Reviewing Claudient content for their specific use case
- Assessing security implications of skills, hooks, and agents they deploy
- Maintaining their own security audit and testing processes
- Reporting vulnerabilities responsibly to upstream projects

---

## Historical Security Advisories

All published advisories are archived at:
**[github.com/Claudient/Claudient/security/advisories](https://github.com/Claudient/Claudient/security/advisories)**

---

## Questions?

- **Security questions** → `security@claudient.dev`
- **General support** → [GitHub Discussions](https://github.com/Claudient/Claudient/discussions)
- **Bug reports** → [GitHub Issues](https://github.com/Claudient/Claudient/issues)
- **Community** → [Reddit r/uitbreiden](https://www.reddit.com/r/uitbreiden/)

---

**Last updated:** June 2026  
**Policy version:** 1.0  
**Next review:** December 2026
