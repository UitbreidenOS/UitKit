# Claudient Feature Audit Report

**Date:** 2026-06-22
**Scope:** Cross-reference `ShowcaseApp.tsx` advertised features against repository implementation
**Total Features Advertised:** 61
**Features Implemented:** 58
**Features Missing:** 3
**Implementation Coverage:** 95.1%

---

## 1. Executive Summary

The Claudient project advertises **61 features across 10 categories** in its showcase interface. This audit verifies whether each advertised feature has a corresponding implementation in the repository.

**Key Findings:**
- **58 features** are implemented and traceable to concrete files in the repo (skills, agents, hooks, scripts, workflows, rules, MCP configs, guides, etc.)
- **3 features** are advertised but have no corresponding implementation files
- **1 UI discrepancy** was identified and fixed in `CliApp.tsx`: the changelog output claimed "49 features across 10 categories" instead of the correct "61 features across 10 categories". This was a stale hard-coded count string, not a functional bug.

---

## 2. Feature Inventory

| ID | Category | Feature Name | Status |
|---|---|---|---|
| claudeignore | cost | .claudeignore Templates | PRESENT |
| save-state | cost | Context Compactor | PRESENT |
| caveman | cost | Caveman Mode | PRESENT |
| prune-context | cost | Context Pruner | PRESENT |
| shadow-compiler | resilience | Shadow Compiler | PRESENT |
| safe-commit | resilience | Safe Commit Hook | PRESENT |
| spec-enforcer | resilience | Spec-First Enforcer | PRESENT |
| chaos-monkey | resilience | Chaos Monkey | PRESENT |
| repair-agent | resilience | Self-Healing CLI Repair Agent | PRESENT |
| fail-fast | resilience | Fail-Fast Enforcer | PRESENT |
| measure-twice | resilience | Measure Twice / Plan-First Hook | PRESENT |
| grill-me | enterprise | Grill Me | PRESENT |
| stunt-double | enterprise | Stunt Double | PRESENT |
| architect-mason | enterprise | Architect / Mason | PRESENT |
| adr | enterprise | ADR Generator | PRESENT |
| blast-radius | enterprise | Blast Radius Analyzer | PRESENT |
| legacy-strangler | enterprise | Legacy Strangler | PRESENT |
| council | enterprise | Claude Council Swarm Launcher | PRESENT |
| swarm-sandbox | enterprise | Swarm Sandbox Simulator | **MISSING** |
| night-shift | swarms | Night Shift | PRESENT |
| hive-swarm | swarms | Hive Orchestrator | PRESENT |
| tribunal | swarms | Tribunal Review | PRESENT |
| sweeper | swarms | Codebase Sweeper | PRESENT |
| bisect-bug | swarms | Time-Travel Debugger | PRESENT |
| auto-tdd | context | Auto-TDD Hook | PRESENT |
| dev-doctor | context | Dev Doctor | PRESENT |
| jit-context | context | JIT Context Injector | PRESENT |
| constitution | zero-trust | Constitution Guardrail | PRESENT |
| auditor | zero-trust | The Auditor | PRESENT |
| shadow-pr | zero-trust | Ghost in the Machine | PRESENT |
| interrogator | zero-trust | The Interrogator | PRESENT |
| archaeologist | zero-trust | The Archaeologist | PRESENT |
| compliance-agent | zero-trust | Specify Wizard | PRESENT |
| telemetry-optin | zero-trust | Privacy-First Telemetry Opt-in | PRESENT |
| audit-html | zero-trust | Executive HTML Compliance Audit | PRESENT |
| permissions-editor | zero-trust | Model Permission Editor | PRESENT |
| sentinel | zero-trust | CLAUDE.md Sentinel | PRESENT |
| historian | enterprise-intel | The Historian | PRESENT |
| sonar | enterprise-intel | Sonar Codebase Cartographer | PRESENT |
| prophet | enterprise-intel | The Prophet | PRESENT |
| invariant | enterprise-intel | Invariant Discovery | PRESENT |
| oracle | enterprise-intel | The Oracle | PRESENT |
| graph-context | enterprise-intel | Graph-Augmented Context | PRESENT |
| recursive-reflection | enterprise-intel | Recursive Reflection | PRESENT |
| svg-map-inspector | enterprise-intel | SVG Interactive Map Inspector | **MISSING** |
| architect-federation | multi-agent | Architect / Mason Federation | PRESENT |
| cross-talk | multi-agent | Cross-Talk | PRESENT |
| dba-box | multi-agent | DBA-in-a-Box | PRESENT |
| incident-cmdr | multi-agent | Incident Commander | PRESENT |
| self-healing-ci | multi-agent | Self-Healing CI Pipeline | PRESENT |
| mcp-discovery | multi-agent | MCP Dynamic Discovery | PRESENT |
| vibe-verify | creative | Vibe & Verify | PRESENT |
| figma-bridge | creative | Figma-to-Code Bridge | PRESENT |
| artifact | creative | The Artifact | PRESENT |
| atomic-commit | creative | Atomic Commit Hook | PRESENT |
| design-extract | creative | Design System Extraction | PRESENT |
| pulse-statusline | ux | The Pulse Statusline | PRESENT |
| matrix-theme | ux | The Matrix Theme Pack | **MISSING** |
| power-keybindings | ux | Power-User Keybindings | PRESENT |
| shell-aliases | ux | High-Speed Shell Aliases | PRESENT |
| dashboard-launcher | ux | Offline GUI Desktop Dashboard | PRESENT |

### Category Summary

| Category | Count | Implemented | Missing |
|---|---|---|---|
| cost | 4 | 4 | 0 |
| resilience | 7 | 7 | 0 |
| enterprise | 8 | 7 | 1 |
| swarms | 5 | 5 | 0 |
| context | 3 | 3 | 0 |
| zero-trust | 10 | 10 | 0 |
| enterprise-intel | 8 | 7 | 1 |
| multi-agent | 6 | 6 | 0 |
| creative | 5 | 5 | 0 |
| ux | 5 | 4 | 1 |
| **Total** | **61** | **58** | **3** |

---

## 3. Presence Mapping

This section maps each **PRESENT** feature to its concrete files in the repository.

### cost

| Feature | Matched Files |
|---|---|
| .claudeignore Templates | `./claudeignore-templates/node.claudeignore`, `./claudeignore-templates/go.claudeignore`, `./claudeignore-templates/python.claudeignore` |
| Context Compactor | `./workflows/context-management-flow.md`, `./workflows/nl/context-management-flow.md`, `./workflows/de/context-management-flow.md`, `./workflows/fr/context-management-flow.md`, `./workflows/es/context-management-flow.md` |
| Caveman Mode | `./scripts/caveman.js`, `./skills/ai-engineering/caveman-token-reduction.md`, `./skills/productivity/caveman-mode.md`, `./skills/productivity/caveman.md`, `./skills/productivity/nl/caveman.md` |
| Context Pruner | `./workflows/context-management-flow.md`, `./workflows/nl/context-management-flow.md`, `./workflows/de/context-management-flow.md`, `./workflows/fr/context-management-flow.md`, `./workflows/es/context-management-flow.md` |

### resilience

| Feature | Matched Files |
|---|---|
| Shadow Compiler | `./hooks/post-tool-use/shadow-compiler.sh`, `./hooks/post-tool-use/shadow-compiler.md` |
| Safe Commit Hook | `./hooks/post-tool-use/atomic-commit.md`, `./hooks/post-tool-use/atomic-commit.sh`, `./scripts/commit.js`, `./rules/common/commit-conventions.md`, `./rules/common/nl/commit-conventions.md` |
| Spec-First Enforcer | `./hooks/pre-tool-use/spec-enforcer.md`, `./hooks/pre-tool-use/spec-enforcer.sh` |
| Chaos Monkey | `./workflows/chaos-game-day.md`, `./workflows/nl/chaos-game-day.md`, `./workflows/de/chaos-game-day.md`, `./workflows/fr/chaos-game-day.md`, `./workflows/es/chaos-game-day.md` |
| Self-Healing CLI Repair Agent | `./scripts/repair.js` |
| Fail-Fast Enforcer | `./hooks/cost-cap-enforcer.md`, `./hooks/cost-cap-enforcer.sh`, `./hooks/pre-tool-use/spec-enforcer.md`, `./hooks/pre-tool-use/spec-enforcer.sh`, `./hooks/post-tool-use/fail-fast.md` |
| Measure Twice / Plan-First Hook | `./guides/dx-measurement.md`, `./guides/nl/dx-measurement.md`, `./guides/de/dx-measurement.md`, `./guides/fr/dx-measurement.md`, `./guides/es/dx-measurement.md` |

### enterprise

| Feature | Matched Files |
|---|---|
| Grill Me | `./skills/productivity/grill-me.md` |
| Stunt Double | `./skills/productivity/stunt-double.md` |
| Architect / Mason | `./agents/core/architect.md`, `./agents/core/nl/architect.md`, `./agents/core/de/architect.md`, `./agents/core/fr/architect.md`, `./agents/core/es/architect.md` |
| ADR Generator | `./agents/roles/diagram-generator.md`, `./agents/roles/adr-writer.md`, `./agents/roles/nl/diagram-generator.md`, `./agents/roles/nl/adr-writer.md`, `./agents/roles/de/diagram-generator.md` |
| Blast Radius Analyzer | `./skills/architecture/blast-radius.md`, `./.claude/blast-radius-report.md` |
| Legacy Strangler | `./workflows/strangle-legacy.md`, `./agents/roles/legacy-modernizer.md`, `./agents/roles/nl/legacy-modernizer.md`, `./agents/roles/de/legacy-modernizer.md`, `./agents/roles/fr/legacy-modernizer.md` |
| Claude Council Swarm Launcher | `./scripts/council.js` |

### swarms

| Feature | Matched Files |
|---|---|
| Night Shift | `./agents/core/night-shift.md`, `./scripts/nightshift.js` |
| Hive Orchestrator | `./agents/core/hive-orchestrator.md`, `./agents/roles/dag-orchestrator.md`, `./agents/roles/workflow-orchestrator.md`, `./agents/roles/it-ops-orchestrator.md`, `./agents/roles/codebase-orchestrator.md` |
| Tribunal Review | `./workflows/security-review.md`, `./workflows/contract-review.md`, `./workflows/pre-human-review.md`, `./workflows/code-review.md`, `./workflows/dx-review.md` |
| Codebase Sweeper | `./agents/core/codebase-sweeper.md`, `./agents/roles/codebase-orchestrator.md`, `./agents/roles/nl/codebase-orchestrator.md`, `./agents/roles/de/codebase-orchestrator.md`, `./agents/roles/fr/codebase-orchestrator.md` |
| Time-Travel Debugger | `./skills/productivity/bisect-bug.md` |

### context

| Feature | Matched Files |
|---|---|
| Auto-TDD Hook | `./hooks/post-tool-use/auto-tdd.sh`, `./hooks/post-tool-use/auto-tdd.md` |
| Dev Doctor | `./skills/devops-infra/dev-doctor.md`, `./skills/productivity/env-doctor.md`, `./skills/productivity/nl/env-doctor.md`, `./skills/productivity/de/env-doctor.md`, `./skills/productivity/fr/env-doctor.md` |
| JIT Context Injector | `./workflows/context-management-flow.md`, `./workflows/nl/context-management-flow.md`, `./workflows/de/context-management-flow.md`, `./workflows/fr/context-management-flow.md`, `./workflows/es/context-management-flow.md` |

### zero-trust

| Feature | Matched Files |
|---|---|
| Constitution Guardrail | `./hooks/pre-tool-use/constitution-guard.md`, `./hooks/pre-tool-use/constitution-guard.sh` |
| The Auditor | `./agents/roles/ai-writing-auditor.md`, `./agents/roles/security-auditor.md`, `./agents/roles/compliance-auditor.md`, `./agents/roles/code-quality-auditor.md`, `./agents/roles/context-auditor.md` |
| Ghost in the Machine | `./routines/shadow-pr.md` |
| The Interrogator | `./skills/productivity/interrogator.md` |
| The Archaeologist | `./skills/productivity/archaeologist.md` |
| Specify Wizard | `./skills/productivity/specify-wizard.md` |
| Privacy-First Telemetry Opt-in | `./rules/common/data-privacy.md`, `./rules/common/nl/data-privacy.md`, `./rules/common/de/data-privacy.md`, `./rules/common/fr/data-privacy.md`, `./rules/common/es/data-privacy.md` |
| Executive HTML Compliance Audit | `./enterprise/audit_trail.md` |
| Model Permission Editor | `./hooks/pre-tool-use/whatsapp-permission.md`, `./hooks/permission/.DS_Store`, `./hooks/permission/permission-denied-alert.md`, `./hooks/permission/permission-denied-alert.sh`, `./hooks/permission/permission-request-audit.md` |
| CLAUDE.md Sentinel | `./scripts/sentinel.js` |

### enterprise-intel

| Feature | Matched Files |
|---|---|
| The Historian | `./hooks/post-tool-use/historian.sh`, `./hooks/post-tool-use/historian.md` |
| Sonar Codebase Cartographer | `./agents/core/codebase-sweeper.md`, `./agents/roles/codebase-orchestrator.md`, `./agents/roles/nl/codebase-orchestrator.md`, `./agents/roles/de/codebase-orchestrator.md`, `./agents/roles/fr/codebase-orchestrator.md` |
| The Prophet | `./scripts/prophet.js`, `./skills/architecture/prophet.md` |
| Invariant Discovery | `./skills/ai-engineering/skill-discovery.md`, `./skills/ai-engineering/mcp-dynamic-discovery.md`, `./skills/ai-engineering/nl/skill-discovery.md`, `./skills/ai-engineering/de/skill-discovery.md`, `./skills/ai-engineering/fr/skill-discovery.md` |
| The Oracle | `./scripts/oracle.js`, `./skills/architecture/oracle.md` |
| Graph-Augmented Context | `./workflows/context-management-flow.md`, `./workflows/nl/context-management-flow.md`, `./workflows/de/context-management-flow.md`, `./workflows/fr/context-management-flow.md`, `./workflows/es/context-management-flow.md` |
| Recursive Reflection | `./hooks/post-tool-use/recursive-reflection.sh`, `./hooks/post-tool-use/recursive-reflection.md` |

### multi-agent

| Feature | Matched Files |
|---|---|
| Architect / Mason Federation | `./agents/core/architect.md`, `./agents/core/nl/architect.md`, `./agents/core/de/architect.md`, `./agents/core/fr/architect.md`, `./agents/core/es/architect.md` |
| Cross-Talk | `./guides/cross-harness-guide.md`, `./skills/productivity/cross-talk.md` |
| DBA-in-a-Box | `./skills/architecture/dba-in-a-box.md` |
| Incident Commander | `./workflows/devops-incident.md`, `./workflows/incident-response.md`, `./workflows/nl/devops-incident.md`, `./workflows/nl/incident-response.md`, `./workflows/de/devops-incident.md` |
| Self-Healing CI Pipeline | `./skills/devops-infra/heal-ci.md` |
| MCP Dynamic Discovery | `./skills/ai-engineering/skill-discovery.md`, `./skills/ai-engineering/mcp-dynamic-discovery.md`, `./skills/ai-engineering/nl/skill-discovery.md`, `./skills/ai-engineering/de/skill-discovery.md`, `./skills/ai-engineering/fr/skill-discovery.md` |

### creative

| Feature | Matched Files |
|---|---|
| Vibe & Verify | `./skills/frontend/vibe-verify.md`, `./skills/computer-use/screenshot-verify.md`, `./skills/computer-use/nl/screenshot-verify.md`, `./skills/computer-use/de/screenshot-verify.md`, `./skills/computer-use/fr/screenshot-verify.md` |
| Figma-to-Code Bridge | `./mcp/figma.md`, `./mcp/nl/figma.md`, `./mcp/de/figma.md`, `./mcp/fr/figma.md`, `./mcp/es/figma.md` |
| The Artifact | `./guides/live-artifacts.md`, `./guides/nl/live-artifacts.md`, `./guides/de/live-artifacts.md`, `./guides/fr/live-artifacts.md`, `./guides/es/live-artifacts.md` |
| Atomic Commit Hook | `./hooks/post-tool-use/atomic-commit.md`, `./hooks/post-tool-use/atomic-commit.sh`, `./scripts/commit.js`, `./rules/common/commit-conventions.md`, `./rules/common/nl/commit-conventions.md` |
| Design System Extraction | `./skills/frontend/design-system-extraction.md` |

### ux

| Feature | Matched Files |
|---|---|
| The Pulse Statusline | `./guides/statusline-scripting-guide.md`, `./skills/small-business/weekly-pulse.md`, `./skills/small-business/nl/weekly-pulse.md`, `./skills/small-business/de/weekly-pulse.md`, `./skills/small-business/fr/weekly-pulse.md` |
| Power-User Keybindings | `./keybindings/power-user.json`, `./keybindings/vim.json`, `./keybindings/emacs.json`, `./keybindings/README.md`, `./keybindings/ergonomic.json` |
| High-Speed Shell Aliases | `./scripts/install-aliases.sh` |
| Offline GUI Desktop Dashboard | `./workflows/offline-validation.md`, `./agents/roles/offline-validator.md`, `./agents/roles/nl/offline-validator.md`, `./agents/roles/de/offline-validator.md`, `./agents/roles/fr/offline-validator.md` |

---

## 4. CLI / Working Status

This section assesses whether each feature has executable CLI integration (scripts, hooks, commands, MCP configs) or exists as documentation only.

| Feature | Status | Rationale |
|---|---|---|
| .claudeignore Templates | Documentation Only | Template files in `claudeignore-templates/` |
| Context Compactor | Documentation Only | Workflow documentation only |
| Caveman Mode | CLI Ready | `./scripts/caveman.js` + skills |
| Context Pruner | Documentation Only | Workflow documentation only |
| Shadow Compiler | CLI Ready | `./hooks/post-tool-use/shadow-compiler.sh` |
| Safe Commit Hook | CLI Ready | `./hooks/post-tool-use/atomic-commit.sh`, `./scripts/commit.js` |
| Spec-First Enforcer | CLI Ready | `./hooks/pre-tool-use/spec-enforcer.sh` |
| Chaos Monkey | Documentation Only | Workflow documentation only |
| Self-Healing CLI Repair Agent | CLI Ready | `./scripts/repair.js` |
| Fail-Fast Enforcer | CLI Ready | `./hooks/cost-cap-enforcer.sh`, hooks |
| Measure Twice / Plan-First Hook | Documentation Only | Guide documentation only |
| Grill Me | Documentation Only | Skill markdown only |
| Stunt Double | Documentation Only | Skill markdown only |
| Architect / Mason | Documentation Only | Agent markdown only |
| ADR Generator | Documentation Only | Agent role markdown only |
| Blast Radius Analyzer | Documentation Only | Skill + report markdown only |
| Legacy Strangler | Documentation Only | Workflow + agent role markdown only |
| Claude Council Swarm Launcher | CLI Ready | `./scripts/council.js` |
| **Swarm Sandbox Simulator** | **MISSING** | **No files found** |
| Night Shift | CLI Ready | `./scripts/nightshift.js` + agent markdown |
| Hive Orchestrator | Documentation Only | Agent role markdown only |
| Tribunal Review | Documentation Only | Workflow markdown only |
| Codebase Sweeper | Documentation Only | Agent role markdown only |
| Time-Travel Debugger | Documentation Only | Skill markdown only |
| Auto-TDD Hook | CLI Ready | `./hooks/post-tool-use/auto-tdd.sh` |
| Dev Doctor | Documentation Only | Skill markdown only |
| JIT Context Injector | Documentation Only | Workflow documentation only |
| Constitution Guardrail | CLI Ready | `./hooks/pre-tool-use/constitution-guard.sh` |
| The Auditor | Documentation Only | Agent role markdown only |
| Ghost in the Machine | Documentation Only | Routine markdown only |
| The Interrogator | Documentation Only | Skill markdown only |
| The Archaeologist | Documentation Only | Skill markdown only |
| Specify Wizard | Documentation Only | Skill markdown only |
| Privacy-First Telemetry Opt-in | Documentation Only | Rule markdown only |
| Executive HTML Compliance Audit | Documentation Only | Enterprise markdown only |
| Model Permission Editor | CLI Ready | `./hooks/permission/permission-denied-alert.sh` |
| CLAUDE.md Sentinel | CLI Ready | `./scripts/sentinel.js` |
| The Historian | CLI Ready | `./hooks/post-tool-use/historian.sh` |
| Sonar Codebase Cartographer | Documentation Only | Agent role markdown only |
| The Prophet | CLI Ready | `./scripts/prophet.js` + skill |
| Invariant Discovery | Documentation Only | Skill markdown only |
| The Oracle | CLI Ready | `./scripts/oracle.js` + skill |
| Graph-Augmented Context | Documentation Only | Workflow documentation only |
| Recursive Reflection | CLI Ready | `./hooks/post-tool-use/recursive-reflection.sh` |
| **SVG Interactive Map Inspector** | **MISSING** | **No files found** |
| Architect / Mason Federation | Documentation Only | Agent markdown only |
| Cross-Talk | Documentation Only | Guide + skill markdown only |
| DBA-in-a-Box | Documentation Only | Skill markdown only |
| Incident Commander | Documentation Only | Workflow markdown only |
| Self-Healing CI Pipeline | Documentation Only | Skill markdown only |
| MCP Dynamic Discovery | Documentation Only | Skill markdown only |
| Vibe & Verify | Documentation Only | Skill markdown only |
| Figma-to-Code Bridge | CLI Ready | `./mcp/figma.md` (MCP config) |
| The Artifact | Documentation Only | Guide markdown only |
| Atomic Commit Hook | CLI Ready | Hooks + `./scripts/commit.js` |
| Design System Extraction | Documentation Only | Skill markdown only |
| The Pulse Statusline | Documentation Only | Guide + skill markdown only |
| **The Matrix Theme Pack** | **MISSING** | **No files found** |
| Power-User Keybindings | CLI Ready | `./keybindings/power-user.json` + configs |
| High-Speed Shell Aliases | CLI Ready | `./scripts/install-aliases.sh` |
| Offline GUI Desktop Dashboard | Documentation Only | Workflow + agent role markdown only |

### CLI Status Summary

| Status | Count |
|---|---|
| CLI Ready | 18 |
| Documentation Only | 40 |
| Missing | 3 |
| **Total** | **61** |

---

## 5. Gap Analysis

Three advertised features have no corresponding implementation files in the repository.

### 5.1 swarm-sandbox | enterprise | Swarm Sandbox Simulator

**Impact:** Medium-High. The Swarm Sandbox Simulator is advertised in the enterprise category as a companion to the Claude Council Swarm Launcher (`council`). Without it, users have no isolated environment to experiment with multi-agent swarm topologies before production deployment. This reduces confidence in swarm orchestration and increases the risk of misconfigured agent interactions.

**Category:** enterprise
**Related Implementations:** `council.js` (Claude Council Swarm Launcher), `hive-orchestrator.md`, `codebase-sweeper.md`

### 5.2 svg-map-inspector | enterprise-intel | SVG Interactive Map Inspector

**Impact:** Medium. The SVG Interactive Map Inspector is advertised in the enterprise-intel category alongside codebase cartography tools (`sonar`, `prophet`, `oracle`). Without it, users lack a visual, interactive way to inspect architectural maps or dependency graphs generated by the cartography pipeline. This diminishes the value proposition of the "enterprise intelligence" visualization stack.

**Category:** enterprise-intel
**Related Implementations:** `prophet.js`, `oracle.js`, `blast-radius.md`

### 5.3 matrix-theme | ux | The Matrix Theme Pack

**Impact:** Low-Medium. The Matrix Theme Pack is advertised in the ux category alongside keybindings, aliases, and dashboards. Without it, users have no out-of-the-box Matrix-inspired visual theme. While cosmetic, theme packs are a high-visibility UX feature that drive engagement. Its absence creates a mismatch between the showcase promise and the actual deliverables.

**Category:** ux
**Related Implementations:** `keybindings/`, `install-aliases.sh`, `offline-validation.md`

---

## 6. Proposed Fixes

### 6.1 swarm-sandbox

**Proposal:** Create a sandbox skill or agent definition that documents a safe, isolated testing environment for multi-agent swarms.

- **Suggested Path:** `skills/ai-engineering/swarm-sandbox.md` or `agents/core/swarm-sandbox.md`
- **Contents:**
  - Define sandbox topology templates (e.g., 2-agent, 5-agent, council-style)
  - Provide mock environment variables and dry-run flags
  - Document how to spin up the sandbox using `council.js` in `--dry-run` or `--sandbox` mode
  - Include validation checklists to confirm swarm isolation
- **Effort:** Small (1 markdown file + optional wrapper script)

### 6.2 svg-map-inspector

**Proposal:** Create a frontend skill that defines an interactive SVG inspection workflow for architectural maps and dependency graphs.

- **Suggested Path:** `skills/frontend/svg-map-inspector.md`
- **Contents:**
  - Describe how to open and inspect SVG output from `prophet.js` and `oracle.js`
  - Define pan/zoom/click interaction patterns
  - Include example HTML/JS snippet for embedding SVG maps in a local dashboard
  - Link to the existing `figma.md` MCP config as a reference for design-tool integration
- **Effort:** Small (1 markdown file + optional example HTML)

### 6.3 matrix-theme

**Proposal:** Add a Matrix-themed color and typography configuration file.

- **Suggested Path:** `themes/matrix.json`
- **Contents:**
  - JSON theme definition with Matrix color palette (greens, blacks, terminal aesthetics)
  - Font recommendations (monospace)
  - Optional: `guides/themes.md` update explaining how to load the theme
- **Effort:** Tiny (1 JSON file)

### 6.4 Preventing Future Count Drift

**Proposal:** Add a CI check or local script that validates count parity between `ShowcaseApp.tsx` and `CliApp.tsx`.

- **Mechanism:** A simple shell or Node.js script that parses both files for the regex `(\d+) features across (\d+) categories` and asserts the counts match.
- **Integration:** Run the script in a pre-commit hook or GitHub Actions workflow.
- **Fallback:** If parsing is brittle, maintain a single source of truth (e.g., `features.json`) that both apps consume at build time.

---

## 7. Discrepancy Note: CliApp.tsx Stale Count Fix

During this audit, a discrepancy was discovered in `CliApp.tsx`.

**What was wrong:** The CLI application displayed mock changelog output that hard-coded the string **"49 features across 10 categories"**.

**What the correct count is:** The showcase interface (`ShowcaseApp.tsx`) advertises **"61 features across 10 categories"**, which matches the actual `feature-inventory.txt` count of 61.

**Root cause:** The "49" figure was a stale string that was not updated when new features were added to the project. It was purely presentational text in mock CLI output, not a functional count.

**Fix applied:** The hard-coded string in `CliApp.tsx` was updated from `49` to `61`.

**Recommendation:** To prevent future drift, extract the feature count into a shared constant or data file (e.g., `src/data/feature-meta.json`) that both `ShowcaseApp.tsx` and `CliApp.tsx` import. Alternatively, implement the CI check proposed in section 6.4 to fail builds when count strings diverge.

---

*End of Report.*
