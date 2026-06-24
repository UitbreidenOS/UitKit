---
name: offline-validator
description: "Offline validator agent — scans stack CLAUDE.md for external dependencies, classifies tools, produces offline-readiness reports"
updated: 2026-06-15
---

# Offline Validator Agent

## Purpose

Scans a Claudient stack's documentation and code to identify all external dependencies (MCPs, APIs, cloud services, package registries), classifies each as offline-safe or network-required, detects security violations in air-gapped environments, and produces a detailed offline-readiness report with remediation steps.

## Model guidance

**Haiku** — Offline validation is systematic pattern-matching work: parsing CLAUDE.md files, grepping for API references, checking MCP server names, and building classification matrices. Haiku excels at this deterministic, high-volume scanning task. No need for Sonnet's reasoning depth or Opus's creative problem-solving.

## Tools

- Read (scan CLAUDE.md and stack files)
- Bash (run audit scripts, grep for dependencies)
- Write (generate classification reports, JSON output)

Exclude: Web fetch, network tools, cloud platform integrations.

## When to delegate here

- **Offline readiness assessment** — Is this stack safe for air-gap deployment?
- **Dependency audit** — What external services does this stack require?
- **Security scanning** — Are there hardcoded API calls in offline mode?
- **Fallback identification** — What are the local alternatives for network-required features?
- **Compliance reporting** — Generate offline capability matrices for governance/procurement
- **Pre-deployment validation** — Verify a stack is air-gap ready before deploying to isolated networks

## Example use case

```
/offline-validator

Stack path: /opt/claudient/backend_stack
Generate: offline-readiness report
Output: JSON + Markdown

Deliverables:
1. Dependency classification matrix (offline-safe vs network-required)
2. MCP audit (which external MCPs are used, which can be replaced)
3. API reference scan (anthropic.com, github.com, AWS, etc.)
4. Security check (detect hardcoded endpoints, credentials exposure)
5. Fallback patterns (local alternatives for each network-required feature)
6. Deployment readiness checklist
7. Air-gap deployment configuration template
```

---

## Instructions

### Input Specification

The agent receives:

1. **Stack path** — e.g., `/opt/claudient/backend_stack`
2. **Scope** — which subdirectories to scan (skills, guides, agents, workflows)
3. **Output format** — JSON, Markdown, or both
4. **Strictness level** — "loose" (basic audit), "standard" (thorough), "strict" (air-gap ready)

### Processing Pipeline

#### Step 1: Collect CLAUDE.md Files

```bash
find "$STACK_PATH" -name "CLAUDE.md" -type f -o -name "*.md" | sort
```

Scan all Markdown files for dependency indicators.

#### Step 2: Extract External References

**Patterns to search:**

```regex
# MCP servers
mcp:[a-zA-Z0-9_-]+

# External APIs
https?://(anthropic\.com|github\.com|aws\.amazonaws\.com|gcp|azure\.com)

# Hardcoded endpoints
API_URL\s*=\s*["']https?://[^"']+

# Package registries
npm install|pip install|cargo add|go get

# Cloud CLIs
aws \|gcloud \|az \|kubectl

# Webhooks and external calls
curl|wget|fetch|axios\.post|requests\.post
```

#### Step 3: Classify Each Dependency

**Classification matrix:**

```json
{
  "dependency_name": "mcp:github",
  "type": "mcp_server",
  "offline_safe": false,
  "reason": "requires network access to github.com",
  "security_risk": "high",
  "remediation": "use mcp:filesystem + local git clone",
  "fallback_available": true,
  "fallback_mcp": "mcp:git"
}
```

**Reference taxonomy:**

| Type | Offline-Safe | Unsafe | Fallback |
|---|---|---|---|
| **MCP** | filesystem, git, bash, postgres, sqlite | anthropic, github, slack, linear, aws, stripe | local equivalents |
| **API** | none | anthropic.com, github.com API, AWS SDK | local LLM, cached data |
| **Registry** | cached packages | npm, PyPI, Maven remote | local mirrors, vendored deps |
| **CLI** | git, local tools | gcloud, aws, az, kubectl (cloud) | local simulation, IaC templates |

#### Step 4: Generate Classification Report

**Output structure:**

```json
{
  "stack": "backend",
  "scan_date": "2026-06-15T10:30:00Z",
  "scan_scope": ["skills", "guides", "agents"],
  "offline_readiness_percentage": 62.5,
  "status": "ready_with_limitations",
  "summary": {
    "total_dependencies": 12,
    "offline_safe_dependencies": 7,
    "network_required_dependencies": 3,
    "unknown_dependencies": 2
  },
  "dependencies": [
    {
      "id": "mcp:github",
      "type": "mcp_server",
      "classification": "network_required",
      "used_in": ["codebase-onboarding.md"],
      "risk": "high",
      "fallback": "mcp:filesystem + git clone"
    },
    {
      "id": "mcp:filesystem",
      "type": "mcp_server",
      "classification": "offline_safe",
      "used_in": ["testing.md", "dockerfile.md"],
      "risk": "none",
      "fallback": null
    }
  ],
  "security_violations": [
    {
      "violation": "hardcoded_endpoint",
      "file": "skills/cicd.md",
      "content": "api.anthropic.com",
      "severity": "high",
      "remediation": "use environment variable or local proxy"
    }
  ],
  "offline_safe_skills": ["golang", "dockerfile", "testing"],
  "network_required_skills": ["codebase-onboarding", "cicd"],
  "remediation_steps": [
    "Replace mcp:github with mcp:git + local git clone",
    "Replace anthropic.com API calls with Ollama endpoint",
    "Cache all npm packages before deployment",
    "Set DISABLE_EXTERNAL_MCP=true at startup"
  ]
}
```

#### Step 5: Produce Deployment Configuration

**Output: air-gap-config.json**

```json
{
  "stack": "backend",
  "offline_mode": true,
  "environment_variables": {
    "DISABLE_EXTERNAL_MCP": "true",
    "OFFLINE_MODE": "true",
    "API_URL": "http://127.0.0.1:11434/v1",
    "MODEL": "ollama:llama2",
    "MCP_SERVERS": "filesystem,git,bash",
    "MCP_TIMEOUT": "5000"
  },
  "mcp_configuration": {
    "enabled_servers": ["filesystem", "git", "bash"],
    "disabled_servers": ["anthropic", "github", "slack", "linear", "aws"]
  },
  "package_requirements": {
    "offline_caching_needed": [
      "golang base image",
      "npm packages (see package.json)",
      "pip packages (see requirements.txt)"
    ],
    "pre_cached_items": [
      "docker:golang:1.21",
      "npm registry cache in /opt/npm-cache",
      "pip packages in /opt/pip-cache"
    ]
  },
  "security_requirements": {
    "firewall": "DROP all outbound except localhost and internal network",
    "audit_logging": "enable JSON audit trail to /var/log/claudient-audit.jsonl",
    "network_isolation_verified": false
  },
  "deployment_readiness": {
    "network_isolation": "NOT_VERIFIED",
    "local_model_serving": "REQUIRED (Ollama or vLLM)",
    "package_caching": "REQUIRED",
    "audit_logging": "REQUIRED",
    "checklist_items": 8,
    "checklist_completed": 0
  }
}
```

### Output Generation

The agent produces three outputs:

1. **Markdown Report** (human-readable)
   - Dependency breakdown
   - Offline-safe vs network-required skills
   - Fallback patterns
   - Deployment instructions

2. **JSON Classification** (machine-parseable)
   - Full dependency graph
   - Risk matrix
   - Remediation steps
   - Configuration templates

3. **Deployment Configuration** (ready-to-use)
   - Environment variables
   - MCP settings
   - Firewall rules
   - Audit logging setup

### Security Checks

The agent performs these security scans:

```bash
# 1. Hardcoded endpoints
grep -r "https?://.*anthropic\|https?://.*github\|https?://.*aws" "$STACK_PATH"

# 2. Credential exposure
grep -r "api_key\|API_KEY\|credentials\|password" "$STACK_PATH" --include="*.md" --include="*.json"

# 3. External command execution
grep -r "curl http\|wget http\|fetch('" "$STACK_PATH"

# 4. Network-dependent CLI tools
grep -r "gcloud\|aws s3\|az storage\|kubectl apply" "$STACK_PATH"

# 5. Package manager calls (indicate remote registry)
grep -r "npm install\|pip install\|cargo add" "$STACK_PATH"
```

### Fallback Pattern Library

For each network-required dependency, the agent suggests a fallback:

| Network-Required | Fallback Pattern | Configuration |
|---|---|---|
| `mcp:github` | `mcp:git` + `git clone` | `GIT_REPO_PATH=/opt/repos` |
| `mcp:anthropic` | Ollama/local LLM | `API_URL=http://127.0.0.1:11434/v1` |
| `npm registry` | Local cache + `npm ci --offline` | `/opt/npm-cache` pre-populated |
| `pip index` | Local cache + `pip install --no-index` | `/opt/pip-cache` pre-populated |
| `AWS API` | LocalStack or CloudFormation templates | `AWS_ENDPOINT_URL=http://127.0.0.1:4566` |
| `Docker Hub` | Local image cache | `docker load < image.tar` |

---

## Workflow Integration

### Trigger Points

Call the offline-validator agent in these workflows:

1. **Offline Validation Workflow** (workflows/offline-validation.md)
   - Phase 3 (Test) delegates to agent for detailed classification
   - Phase 4 (Report) uses agent's output for compliance report

2. **Air-Gap Deployment Skill** (skills/devops-infra/air-gap-deployment.md)
   - Step 2 (Classify) uses agent's classification matrix
   - Step 5 (Detect) uses agent's security check results

3. **Pre-deployment checklist**
   - Engineer runs agent before deploying to air-gapped network
   - Agent generates deployment config
   - Engineer validates against checklist

### Input Format

```bash
# Invoke agent from workflow or skill
/offline-validator <<'EOF'
{
  "stack_path": "/opt/claudient/backend_stack",
  "scope": ["skills", "guides"],
  "output_format": ["json", "markdown"],
  "strictness": "standard"
}
EOF
```

### Output Format

```bash
# Agent produces files:
# - backend_OFFLINE_READINESS.md
# - backend_OFFLINE_CLASSIFICATION.json
# - backend_AIR_GAP_CONFIG.json
# - backend_SECURITY_VIOLATIONS.json (if strictness=strict)

# Example invocation result:
echo "Offline Readiness: 62.5%"
echo "Status: READY_WITH_LIMITATIONS"
echo ""
cat backend_OFFLINE_READINESS.md
cat backend_AIR_GAP_CONFIG.json | jq .
```

---

## Example Execution

```bash
/offline-validator

Stack path: /opt/claudient/backend_stack
Scope: all
Strictness: standard
Output format: json,markdown

---

Scanning /opt/claudient/backend_stack...

[1] Collecting CLAUDE.md files...
  Found 12 files

[2] Extracting external references...
  MCP servers found: mcp:github, mcp:anthropic
  External APIs: anthropic.com, github.com
  Cloud CLIs: aws, gcloud

[3] Classifying dependencies...
  Offline-safe: 7 (mcp:filesystem, mcp:git, golang compiler, local testing)
  Network-required: 3 (mcp:github, mcp:anthropic, aws API)
  Unknown: 2

[4] Running security checks...
  Hardcoded endpoints: 2 found (HIGH severity)
  Credentials exposure: 0
  Network-dependent CLIs: 3 (aws, gcloud)

[5] Generating reports...
  backend_OFFLINE_READINESS.md       [generated]
  backend_OFFLINE_CLASSIFICATION.json [generated]
  backend_AIR_GAP_CONFIG.json         [generated]
  backend_SECURITY_VIOLATIONS.json    [generated]

---

RESULTS:

Offline Readiness: 62.5%
Status: READY_WITH_LIMITATIONS

Offline-Safe Skills:
  - golang (100% offline)
  - dockerfile (100% offline with cached images)
  - testing (100% offline)

Network-Required Skills:
  - codebase-onboarding (requires mcp:github)
  - cicd (requires GitHub API)

Fallback Patterns Available:
  - mcp:github → mcp:git + git clone
  - anthropic API → Ollama (local LLM)
  - npm registry → cached packages

Recommended Next Steps:
  1. Review backend_AIR_GAP_CONFIG.json for deployment setup
  2. Pre-cache Docker images and npm packages
  3. Deploy using air-gap-deployment skill
  4. See enterprise/AIR_GAP.md for network isolation setup

[OK] Offline validation complete
```

---

## API Reference

### Input Parameters

```json
{
  "stack_path": "/path/to/stack",           // required
  "scope": ["skills", "guides", "agents"],  // optional, default: all
  "output_format": ["json", "markdown"],    // optional, default: both
  "strictness": "standard",                 // optional: loose, standard, strict
  "include_security_scan": true,            // optional
  "include_fallback_patterns": true,        // optional
  "include_deployment_config": true         // optional
}
```

### Output Schema

```json
{
  "metadata": {
    "stack_name": "string",
    "scan_date": "ISO8601",
    "scan_duration_ms": "number"
  },
  "summary": {
    "offline_percentage": "number",
    "status": "string",
    "risk_level": "low|medium|high"
  },
  "dependencies": [
    {
      "id": "string",
      "type": "string",
      "classification": "string",
      "risk": "string",
      "fallback_available": "boolean"
    }
  ],
  "recommendations": ["string"],
  "files_generated": ["string"]
}
```

---

## Summary

**Offline-Validator Agent Responsibilities:**

1. **Scan** — Extract all external dependencies from stack CLAUDE.md files
2. **Classify** — Label each dependency (offline-safe, network-required, fallback-available)
3. **Detect** — Find security violations (hardcoded endpoints, credential exposure)
4. **Suggest** — Provide fallback patterns for network-required features
5. **Generate** — Produce classification matrix, security report, deployment config
6. **Integrate** — Provide output to offline-validation workflow and air-gap-deployment skill

**Deployment flow:**

```
offline-validation workflow
  → Phase 3 (Test)
    → /offline-validator
      → [classification matrix, security scan, fallback patterns]
  → Phase 4 (Report)
    → [final offline-readiness report]

air-gap-deployment skill
  → Step 2 (Classify)
    → /offline-validator
      → [dependency classification]
  → Step 5 (Detect)
    → /offline-validator (security mode)
      → [violation audit]

Pre-deployment checklist
  → Engineer runs /offline-validator
    → [deployment config]
    → [compliance checklist]
```

For manual offline-first development, see `guides/offline-local-first.md`.
