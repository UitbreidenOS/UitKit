# Security Scan Routine

Automated security scanning — dependency vulnerabilities, secret detection, and configuration audits.

---

## Schedule

Weekly on Sunday night + on every PR.

---

## Steps

1. **Dependency audit.** Run `npm audit`, `pip-audit`, `cargo audit` — flag critical and high severity.
2. **Secret scanning.** Check for hardcoded API keys, tokens, passwords in code and config files.
3. **SAST scan.** Run static analysis (Semgrep, ESLint security plugin) for common vulnerability patterns.
4. **Config review.** Check Docker images for root users, exposed ports, outdated base images.
5. **Generate report.** Summary with findings grouped by severity (Critical → Low).
6. **Create issues.** Auto-create GitHub issues for Critical/High findings with remediation steps.

---

## Configuration

```yaml
schedule: "weekly Sunday 23:00 + on PR"
tools:
  - npm audit / pip-audit / cargo audit
  - gitleaks / trufflehog (secret scanning)
  - semgrep (SAST)
  - trivy (container scanning)
output: security-report-YYYY-MM-DD.md + GitHub issues
```

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
