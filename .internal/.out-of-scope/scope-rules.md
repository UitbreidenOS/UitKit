# Claudient — Out of Scope

This document defines what Claudient explicitly will NOT support. It exists to prevent scope creep from well-intentioned contributors and to set clear expectations.

---

## Out of Scope

### Multi-harness support (Cursor, OpenCode, Windsurf, Aider)
**Claudient is Claude Code-only.** Other AI coding tools use different configuration formats, hook systems, and agent APIs. Supporting multiple harnesses would require per-harness skill variants, fragmented testing, and maintenance overhead that dilutes the Claude Code focus.

If you want Cursor support, fork the repo and adapt the skill format. We may add a Cursor adapter after Claude Code reaches v1.0 maturity.

### Runtime application code
This repo contains no `src/`, no `app/`, no server code, no compiled artifacts. It is a knowledge system — documentation and configuration files only. PRs that add application code will be rejected.

### Vendor-specific cloud skills
No AWS-specific skills (ECS, Lambda, S3). No Azure-specific skills. No GCP-specific skills. Skills should be framework-level (Terraform, Kubernetes, Docker) not vendor-level. Cloud vendor specifics fragment into dozens of sub-skills and go stale fast as console UIs change.

Exception: where a vendor tool is the dominant standard (e.g., GitHub Actions over GitLab CI) it may be included.

### Tools with fewer than ~10,000 GitHub stars or equivalent adoption
Niche tools have small communities and go abandoned. Skills for low-adoption tools become misleading when the tool stagnates. Contributors may propose exceptions with justification.

### Per-skill versioning or changelogs
Individual skills do not have their own version numbers or CHANGELOG entries. The repository uses git history and tagged releases. Per-skill changelogs would create unsustainable documentation overhead.

### Skills for deprecated tools
No skills for tools that are officially deprecated or have a clear successor (e.g., Yarn 1.x, Create React App, Python 2, Flask-RESTful). If a skill's tool is deprecated, the skill is removed, not maintained.

### Compliance-as-code templates (HIPAA, SOC2, PCI-DSS)
Compliance requirements are jurisdiction- and auditor-specific and change with regulatory updates. Generic compliance templates give false confidence. This content is better served by specialized compliance tooling.

---

## In Scope (for clarity)

- Claude Code features: skills, agents, hooks, rules, MCP configs
- Language skills: Python, TypeScript/Node.js, Go, C#/.NET, and other mainstream languages
- Framework skills: FastAPI, Django, Next.js, NestJS, and equivalents
- Infrastructure skills: Kubernetes, Terraform, Docker, GitHub Actions
- Data skills: dbt, Pandas, PyTorch, and equivalents
- Domain skills: Stripe/payments, AI/ML engineering
- Guides: Claude Code concepts explained in depth
- Workflows: multi-step development process documentation
