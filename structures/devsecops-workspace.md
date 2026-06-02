# 📂 DevSecOps Workspace
> The canonical workspace for a Security Engineer or DevSecOps lead, designed to automate threat modeling, triage vulnerabilities, and enforce zero-trust policies without slowing down the engineering pipeline.

📄 `security-charter.md`       # Canonical brief: Zero-trust principles, data classification matrix, and acceptable risk thresholds
🧠 `active-audits-memory.md`   # Session memory: Dynamic context tracking for ongoing penetration tests and active CVE mitigations
🤖 `CLAUDE.md`                 # Operating rules: Strict instructions to NEVER output unencrypted secrets, hardcoded credentials, or bypass RBAC controls

## 📁 threat-modeling/ (4 skills - Proactive Defense)
📄 `stride-analyzer.md`        # Framework for mapping Spoofing, Tampering, Repudiation, Info Disclosure, Denial of Service, and Elevation of Privilege
📄 `attack-tree-builder.md`    # Generates visual paths an adversary might take to compromise a specific microservice
📄 `secure-design-reviewer.md` # Parses PRDs and architecture diagrams to flag security flaws before code is even written
📄 `red-team-scenarios.md`     # Drafts specific breach simulations for engineering tabletop exercises

## 📁 vulnerability-management/ (3 skills - AppSec)
📄 `cve-triage-bot.md`         # Filters noisy Dependabot/Snyk alerts, prioritizing fixes based on exploitability (EPSS) and business context
📄 `sast-dast-orchestrator.md` # CI/CD rules for Static and Dynamic Application Security Testing (e.g., SonarQube, OWASP ZAP)
📄 `patch-management-sla.md`   # Tracks mitigation deadlines (e.g., Critical = 24h, High = 7 days) and escalates breached SLAs

## 📁 infrastructure-security/ (3 skills - CloudSec)
📄 `iam-policy-generator.md`   # Scaffolds least-privilege AWS IAM/GCP policies, completely avoiding `"*"` resource access
📄 `cspm-auditor.md`           # Cloud Security Posture Management • flags public S3 buckets, open port 22, and unencrypted RDS instances
📄 `secret-rotation-engine.md` # Workflows for safely rotating API keys and database credentials via HashiCorp Vault or AWS Secrets Manager

## 📁 incident-response/ (4 skills - Firefighting & Forensics)
📄 `breach-playbook.md`        # Step-by-step containment instructions for specific scenarios (e.g., Ransomware, Insider Threat, Credential Stuffing)
📄 `forensics-log-parser.md`   # Analyzes CloudTrail and VPC Flow Logs to trace the exact lateral movement of an attacker
📄 `ioc-extractor.md`          # Pulls Indicators of Compromise (IPs, file hashes, domains) from threat intelligence reports
📄 `post-mortem-generator.md`  # Drafts the blameless incident review and root-cause analysis after a security event

## 📁 compliance-and-audit/ (3 skills - Governance)
📄 `soc2-evidence-collector.md`# Automates the gathering of background check logs, access reviews, and penetration test summaries for external auditors
📄 `gdpr-anonymizer.md`        # Scripts to ensure PII (Personally Identifiable Information) is scrubbed from staging databases
📄 `github-final-sync.md`      # CI/CD action to commit hardened configuration templates and sanitized threat models to Github final repos

---
**Configuration Files**
⚙️ `semgrep-rules.yaml`        # Custom static analysis rules tailored specifically to the company's tech stack
📦 `opa-policies.rego`         # Open Policy Agent rules enforcing infrastructure compliance at the Kubernetes/Terraform layer

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
