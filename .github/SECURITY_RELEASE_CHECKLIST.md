# Security Release Checklist

Use this checklist when releasing a security patch or addressing a vulnerability.

---

## Pre-Release (Before Patch Development)

- [ ] **Triage vulnerability**
  - [ ] Confirm reproducibility
  - [ ] Assess CVSS score / severity
  - [ ] Identify all affected versions
  - [ ] Determine if embargo is needed (yes for CVSS ≥ 7.0)

- [ ] **Set embargo window**
  - [ ] Critical: 7-day patch window
  - [ ] High: 14-day patch window
  - [ ] Medium: 30-day patch window
  - [ ] Low: 30-day window (may waive public advisory)

- [ ] **Notify security team**
  - [ ] Add GitHub security advisory (private, if embargo applies)
  - [ ] Document in internal tracking system
  - [ ] Assign patch owner

---

## Development Phase

- [ ] **Implement fix**
  - [ ] Create feature branch: `fix/security-cve-XXXX-YYYY`
  - [ ] Write minimal, targeted patch (no unrelated changes)
  - [ ] Add regression test
  - [ ] Document fix in commit message (include CVE/advisory ID if available)

- [ ] **Code review**
  - [ ] Security-focused peer review
  - [ ] Verify fix doesn't introduce new vulns
  - [ ] Test on all affected versions (if backporting)

- [ ] **Compliance check**
  - [ ] Run `npm audit` — no new vulnerabilities introduced
  - [ ] Run security linters (if applicable)
  - [ ] Verify no credentials leaked in diff

---

## Pre-Release Testing

- [ ] **Regression testing**
  - [ ] Run full test suite
  - [ ] Smoke test affected features
  - [ ] Test fix on minimum and maximum affected versions

- [ ] **Performance check**
  - [ ] Verify patch doesn't degrade performance
  - [ ] Monitor memory/CPU if applicable

---

## Release Phase

- [ ] **Prepare release**
  - [ ] Update `CHANGELOG.md` with security note
  - [ ] Bump version number (semantic versioning)
  - [ ] Create git tag: `v<version>`

- [ ] **Publish**
  - [ ] Publish to npm: `npm publish`
  - [ ] Verify npm package page reflects new version
  - [ ] Tag release on GitHub

- [ ] **Notify users**
  - [ ] Convert private advisory to public (GitHub)
  - [ ] Post release notes emphasizing security fix
  - [ ] Tag relevant team members for amplification

---

## Post-Release Disclosure

- [ ] **Advisory publication** (after embargo if applicable)
  - [ ] Publish to [GitHub Security Advisories](https://github.com/Claudient/Claudient/security/advisories)
  - [ ] Include:
    - [ ] CVE ID (if assigned)
    - [ ] CVSS score
    - [ ] Clear description of vulnerability
    - [ ] Affected versions
    - [ ] Mitigation steps
    - [ ] Researcher credit (if applicable)

- [ ] **CVE assignment** (for critical/high)
  - [ ] Request CVE ID if not auto-assigned
  - [ ] Update GitHub advisory with CVE ID
  - [ ] Update NVD entry

- [ ] **Amplification** (critical/high only)
  - [ ] Post to Twitter/X
  - [ ] Notify relevant communities (Reddit, Discord, etc.)
  - [ ] Add to security mailing list (if one exists)

---

## Communication & Timeline

| Audience | Message | Timing |
|---|---|---|
| **Patch owner** | Vulnerability details, ETA | Immediately |
| **Maintainers** | Security advisory, embargo date | Pre-release |
| **Users** | Patch is available, upgrade recommended | Release date |
| **Public** | Vulnerability details, CVSS, fix info | 30 days post-patch (or earlier for low/medium) |

---

## Follow-Up

- [ ] **Incident postmortem**
  - [ ] Document how vulnerability entered codebase
  - [ ] Identify systemic issues (code review gaps, testing, etc.)
  - [ ] Propose preventive measures

- [ ] **Process improvement**
  - [ ] Update security policy if needed
  - [ ] Enhance automated scanning
  - [ ] Improve code review guidelines

---

## Escalation Paths

**If patch is delayed beyond timeline:**
- [ ] Notify reporter within 48 hours
- [ ] Provide revised ETA with justification
- [ ] Request embargo extension (if needed)
- [ ] Escalate to project maintainer

**If embargo is broken (public disclosure before patch):**
- [ ] Accelerate patch release if possible
- [ ] Update advisory with discovery date
- [ ] Document incident for future prevention

---

## Template: Security Advisory

Use this template for GitHub advisories:

```markdown
## Summary
[One-sentence description of vulnerability]

## Details
[2-3 sentence explanation]
- **Vulnerability type**: [e.g., Prompt injection]
- **CVSS score**: [e.g., 7.5 (High)]
- **CWE**: [e.g., CWE-94 (Improper Control of Generation of Code)]

## Affected versions
- [e.g., v1.0.0 through v1.2.1]
- [e.g., v2.0.0 through v2.1.0]

## Fixed in
- v1.2.2
- v2.1.1

## Workaround
[If available: manual mitigation steps]

## Credit
[Researcher name, if applicable]
```

---

**Maintainer responsibility:** Complete this checklist for every security release.

**Questions?** Contact `security@claudient.dev`
