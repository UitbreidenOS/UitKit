# Claude Code Auto Mode — Deep Reference (March 2026, Stable)

Auto Mode's March 2026 stable release replaced the earlier heuristic-based permission tiers with a trained ML classifier. The practical result: 84% fewer permission prompts on average codebases, with a hard-deny layer that is immune to configuration overrides. This guide covers how the classifier works, every `defaultMode` option, team-wide configuration patterns, the `bypassPermissions` vs `--auto` distinction, and a systematic approach to diagnosing blocked actions.

---

## The ML Permission Classifier

### What It Is

Before March 2026, Auto Mode used a static tiered ruleset — read operations auto-approved, writes ask-once, destructive ops always ask. The problem: that ruleset had no context. `git push` to a personal fork in a sandbox triggered the same prompt as `git push --force origin main` on a shared repository. Every `npm run` invoked confirmation regardless of what the script did.

The March 2026 classifier replaces static tiers with a model that evaluates each proposed tool call against three axes:

1. **Reversibility** — can this action be undone without data loss?
2. **Blast radius** — how many systems or collaborators are affected if this goes wrong?
3. **Authorization signal** — does the current session context (project config, prior approvals, user identity) indicate this was pre-authorized?

The classifier emits one of three labels: `auto`, `ask`, or `deny`. The `deny` label has two subtypes: `deny-soft` (overridable by explicit user configuration) and `deny-hard` (not overridable under any circumstances).

### How It Achieves 84% Prompt Reduction

The reduction comes primarily from three improvements over the static tier system:

**Contextual git awareness.** The classifier knows whether the target remote is the canonical upstream branch or a personal/fork branch, whether `--force` is present, whether the branch has open PRs, and whether the repository is a shared team repo or a private sandbox. A `git push` to `origin feature/my-branch` in a solo project is classified `auto`; the same command targeting `main` on a repo with branch protection is classified `ask`.

**Script fingerprinting.** When Claude proposes `npm run <script>`, the classifier reads the script definition from `package.json` before labeling the call. A `build` script that only runs `tsc` or `vite build` is `auto`. A `deploy` script containing `aws s3 sync` or `kubectl apply` is `ask`. A `purge` script containing `rm -rf dist/ && ...` is `deny-soft`.

**Session memory.** Once a call pattern is approved within a session, semantically equivalent calls are `auto` for the remainder of that session. You approve `git commit` once; subsequent `git commit` calls don't re-prompt. This is scoped to the session — it does not persist across restarts unless you encode it in `settings.json`.

### Classifier Confidence and Fallback

When the classifier's confidence score falls below 0.72 (the default threshold), it falls back to `ask` regardless of the predicted label. You can observe this in verbose mode:

```bash
claude --auto --verbose "Refactor the auth module"
```

A low-confidence decision appears in the output as:

```
[classifier] git push origin feature/auth-refactor → ask (confidence: 0.61, fallback from: auto)
```

The threshold is configurable but not recommended to change — it is the primary guard against classifier errors causing unintended automation.

---

## `defaultMode` Options

`defaultMode` is the top-level `settings.json` field that governs how Auto Mode behaves when no more specific rule matches.

### The Three Values

```json
{
  "defaultMode": "auto" | "ask" | "deny"
}
```

**`"ask"` (the default)**

Every tool call that does not match an explicit `allow` rule generates a prompt. This is the standard interactive experience. The ML classifier is still active — it informs the UI (e.g., pre-selecting "Allow" for high-confidence safe calls) but does not suppress the prompt.

**`"auto"`**

Tool calls classified `auto` by the ML classifier proceed without a prompt. Calls classified `ask` generate a prompt. Calls classified `deny-soft` are blocked but can be unblocked via explicit `allow` rules. Calls classified `deny-hard` are blocked regardless of any configuration.

This is the mode intended for developer workstations running extended sessions.

**`"deny"`**

Only tool calls covered by explicit `allow` rules in `settings.json` proceed. Everything else is blocked. This is the correct mode for constrained agents — CI pipelines, production-adjacent automation, restricted contractor environments.

### Setting Per-Scope

`defaultMode` can be set at three scopes. Lower scopes override higher ones:

| Scope | File | Typical use |
|---|---|---|
| Global | `~/.claude/settings.json` | Developer personal default |
| Project | `.claude/settings.json` | Shared team baseline |
| Local | `.claude/settings.local.json` | Per-developer override, gitignored |

```json
// ~/.claude/settings.json — personal default: auto for all projects
{
  "defaultMode": "auto"
}
```

```json
// .claude/settings.json — project override: ask on this shared repo
{
  "defaultMode": "ask"
}
```

```json
// .claude/settings.local.json — developer override: auto even on shared repo
{
  "defaultMode": "auto"
}
```

A developer can set their global default to `"auto"` while the project enforces `"ask"`, and their `settings.local.json` opts back into `"auto"` for their workstation. This is the recommended team pattern.

---

## Configuring Auto Mode for Teams

### The Layered Config Strategy

For a team of any size, the recommended approach is:

1. **Project `.claude/settings.json`** defines the safe baseline — typically `"ask"` with explicit `allow` rules for the operations every developer runs constantly (read, search, test).
2. **Developer `~/.claude/settings.json`** sets personal preference — most developers set `"auto"` here.
3. **Developer `.claude/settings.local.json`** handles project-specific overrides — useful when a developer needs `"auto"` on a project that mandates `"ask"`.

This gives teams auditability (the shared config is checked in) while not constraining individual developer workflow.

### Baseline Team Config

A reasonable starting point for a TypeScript/Node.js project:

```json
// .claude/settings.json
{
  "defaultMode": "ask",
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git show*)",
      "Bash(npm run lint)",
      "Bash(npm run test*)",
      "Bash(npm run typecheck)",
      "Bash(npm run build)",
      "Bash(tsc*)",
      "Bash(find . *)",
      "Bash(ls*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push origin main*)",
      "Bash(git push origin master*)",
      "Bash(npm publish*)",
      "Bash(rm -rf*)",
      "Bash(* | sudo *)",
      "Bash(sudo *)"
    ]
  }
}
```

This config means: with `defaultMode: "ask"`, Claude prompts for most things, but the listed read and test operations never interrupt flow, and the listed destructive operations are hard-denied at the project level regardless of the developer's personal settings.

### CI/CD Config

In CI, use `"deny"` as the default and enumerate exactly what the pipeline needs:

```json
// .claude/settings.ci.json (pass via --config flag)
{
  "defaultMode": "deny",
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(npm ci)",
      "Bash(npm run build)",
      "Bash(npm run test)",
      "Bash(npm run lint)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Write(dist/*)",
      "Write(.claude/tasks.jsonl)"
    ]
  }
}
```

```bash
# In CI
claude --config .claude/settings.ci.json --dangerously-skip-permissions \
  "Work through .claude/tasks.jsonl and run the test suite"
```

`--dangerously-skip-permissions` in this context is safe: the `"deny"` default and explicit allow list mean the only operations Claude can perform are the ones in the `allow` array. The flag just removes the UI prompt layer — the permission model is still enforced by the config.

### Onboarding New Team Members

Include the following in your project README or onboarding docs:

```bash
# Enable auto mode globally (recommended for all developers)
# Add to ~/.claude/settings.json:
{
  "defaultMode": "auto"
}

# The project .claude/settings.json enforces safe baselines automatically.
# Your global "auto" setting is scoped down by the project config.
# To further override for this project only, create (gitignored):
touch .claude/settings.local.json
```

A common onboarding mistake: setting `defaultMode: "auto"` in the project's shared `.claude/settings.json`. This forces every developer into auto mode on CI and in contexts where a human may not be watching. Keep the shared config conservative.

---

## Hard Deny Rules

### What Hard Deny Means

`deny-hard` labels from the ML classifier cannot be overridden by any `allow` rule in any `settings.json` at any scope. They cannot be bypassed with `--dangerously-skip-permissions`. They cannot be unlocked with `bypassPermissions`. They are enforced in the Claude Code binary itself, not in configuration.

The March 2026 stable release shipped with the following hard deny set:

| Pattern | Reason |
|---|---|
| `Bash(* --no-verify *)` on `git commit` or `git push` | Bypasses pre-commit and pre-push hooks, which are security controls |
| `Bash(rm -rf /)`, `Bash(rm -rf /*)` | Filesystem destruction |
| `Bash(dd if=* of=/dev/*)` | Raw disk writes |
| `Bash(mkfs*)` | Filesystem creation (destructive to existing data) |
| `Bash(chmod -R 777 *)` on system paths | Permission escalation |
| Any command modifying `/etc/sudoers` or `/etc/passwd` | Privilege escalation |
| `Bash(curl * | bash)`, `Bash(wget * | bash)` | Remote code execution via pipe |
| `Bash(python -c "import os; os.system*")` and similar eval chains | Sandbox escape patterns |

### Soft Deny vs Hard Deny in Practice

When a `deny-soft` call is blocked, Claude's output includes the label and the path to unblock it:

```
Action blocked: Bash(rm -rf dist/)
Classification: deny-soft
To allow: add "Bash(rm -rf dist/)" to permissions.allow in .claude/settings.json
```

When a `deny-hard` call is blocked:

```
Action blocked: Bash(git commit --no-verify)
Classification: deny-hard
This action cannot be enabled via configuration. It is blocked at the binary level.
Reason: bypasses pre-commit hooks (security control)
```

If you encounter a hard deny that is blocking a legitimate use case (e.g., `--no-verify` during a deliberate hook bypass in a controlled script), you must run that command yourself in the terminal rather than delegating it to Claude. Claude will not execute it under any configuration.

### Identifying Deny Labels Before Running

Use `--dry-run` to see the classifier's labels for every proposed tool call before execution:

```bash
claude --auto --dry-run "Clean up the build artifacts and push to the release branch"
```

Output includes a per-call breakdown:

```
[dry-run] Bash(rm -rf dist/)         → deny-soft  (confidence: 0.97)
[dry-run] Bash(git push origin main) → ask        (confidence: 0.89)
[dry-run] Read(package.json)         → auto        (confidence: 0.99)
```

This lets you adjust your task prompt or `settings.json` before spending tokens on a session that will stall.

---

## `bypassPermissions` vs `--auto`

This is the most commonly misunderstood distinction in Auto Mode.

### What Each Does

**`--auto` (or `defaultMode: "auto"`)**

Tells the classifier to suppress prompts for calls it labels `auto`. The permission model still runs. Calls labeled `ask` still prompt. Calls labeled `deny-soft` are still blocked (unless you have an explicit `allow` rule). Calls labeled `deny-hard` are always blocked.

Auto mode is a UX optimization. It removes friction for operations the classifier is confident about. The safety net is intact.

**`bypassPermissions: true` / `--dangerously-skip-permissions`**

Disables the prompt UI layer entirely. Claude executes all tool calls without stopping to ask. However — and this is the critical distinction — `deny-hard` rules are still enforced. The difference is that `deny-soft` blocks are also bypassed.

`bypassPermissions` is a CI/sandbox flag. It assumes you have encoded your safety constraints entirely in `deny` rules and the hard deny set. If you have not done this correctly, Claude can execute destructive operations without any confirmation.

### The Correct Mental Model

```
User prompt
    │
    ▼
ML Classifier
    │ auto ──────────────────────────────────────────── execute (no prompt)
    │ ask  ──── [bypassPermissions?] ──── yes ────────── execute (no prompt)
    │            │                                        │
    │            no                                       │
    │            │                                        │
    │            ▼                                        │
    │         prompt user ──── approved ──────────────── execute
    │ deny-soft ── [explicit allow rule?] ── yes ──────── execute (no prompt)
    │               │                                     │
    │               no                                    │
    │               ▼                                     │
    │            blocked (overridable via config)         │
    │ deny-hard ─────────────────────────────────────────── always blocked
```

### When to Use Each

Use `--auto` (or `defaultMode: "auto"`) when:
- A human is available to respond to occasional `ask` prompts
- You want smoother flow without sacrificing the safety net
- Running on a developer workstation

Use `--dangerously-skip-permissions` when:
- Running in a sandboxed CI environment with a pre-configured `deny` list
- The environment is throwaway (container, VM, ephemeral workspace)
- You have verified the `settings.json` `deny` rules cover all destructive operations
- No human is watching and you need completely non-interactive execution

Never use `--dangerously-skip-permissions` on a developer workstation without a locked-down `deny` list. The combination of `defaultMode: "auto"` and `--dangerously-skip-permissions` with no explicit `deny` rules is effectively no permission model.

### Practical Example: The Difference Matters

```bash
# This session will pause at "git push origin main" and wait for approval
claude --auto "Implement the feature from TICKET-442 and push when tests pass"

# This session will NOT pause — it will push to main without confirmation
# Safe only if .claude/settings.json denies "Bash(git push origin main)"
claude --dangerously-skip-permissions "Implement the feature from TICKET-442 and push when tests pass"
```

For most development workflows, `--auto` is the right choice. `--dangerously-skip-permissions` is for pipelines.

---

## Troubleshooting Blocked Actions

### Step 1: Identify the Classification

Run with `--verbose` to see the classifier's output for the blocked call:

```bash
claude --auto --verbose "Run the deployment script"
```

Look for lines like:

```
[classifier] Bash(./scripts/deploy.sh) → deny-soft (confidence: 0.94)
[classifier] reason: script contains 'kubectl apply' — blast radius: cluster
```

If the output does not include classifier lines, check that `--verbose` is active and that the block is happening at the permission layer (not a runtime error).

### Step 2: Check for Script Fingerprinting Misclassification

The classifier reads script contents from `package.json` and common script files, but it can misclassify if:

- The script is a wrapper that calls another script dynamically
- The script path is constructed at runtime (e.g., `bash ${SCRIPT_DIR}/run.sh`)
- The script file is outside the project root

To diagnose: run `claude --auto --dry-run` and inspect the confidence score. Low confidence (< 0.72) triggers a fallback to `ask` or `deny-soft`. If a script is misclassified, add an explicit `allow` rule in `settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(./scripts/deploy-staging.sh)"
    ]
  }
}
```

Note: the allow rule must match the exact command string Claude will produce. Use `--dry-run` to see the exact string before writing the rule.

### Step 3: Distinguish Soft Deny from Hard Deny

Claude's output explicitly states whether a block is soft or hard. If soft, the output tells you the exact `allow` rule to add. If hard, no configuration change will help — you need to run the command yourself.

Common misidentification: developers assume `--force` commits are hard-denied. They are not. `git commit --amend` is `deny-soft`. `git commit --no-verify` is `deny-hard`. The distinction is: `--amend` rewrites history (reversible with reflog), while `--no-verify` bypasses security hooks (the bypass itself is the problem, not the commit).

### Step 4: Check Settings Scope Precedence

A common issue: a developer adds an `allow` rule to `settings.local.json`, but the project `settings.json` has a `deny` rule for the same pattern. `deny` rules in lower-scope files do not override `deny` rules in higher-scope files — but `allow` rules at any scope can override `deny-soft` rules from higher scopes unless the project config uses `forcePermissions`.

Check effective config:

```bash
claude --print-config
```

Output shows the merged permission set with source annotations:

```
permissions.allow:
  "Read"                          [global]
  "Bash(npm run test)"            [project]
  "Bash(./scripts/deploy.sh)"     [local]

permissions.deny:
  "Bash(git push --force*)"       [project] [forced]
  "Bash(rm -rf*)"                 [project] [forced]
```

Rules marked `[forced]` cannot be overridden by lower-scope `allow` rules. The project admin sets these with the `forcePermissions` key:

```json
// .claude/settings.json
{
  "forcePermissions": {
    "deny": [
      "Bash(git push --force*)",
      "Bash(npm publish*)"
    ]
  }
}
```

### Step 5: Classifier Threshold Tuning

If the classifier is consistently applying `ask` prompts to operations you consider safe — and the confidence scores are hovering around 0.65–0.75 — you can lower the confidence threshold at your own risk:

```json
// ~/.claude/settings.json
{
  "classifier": {
    "confidenceThreshold": 0.65
  }
}
```

This is a personal setting, not a team setting. Do not put it in the project config. Lower thresholds mean more automation but also more potential for misclassified calls to execute silently.

### Step 6: Debug with Session Transcripts

Every Claude Code session writes a transcript to `~/.claude/sessions/`. For a blocked or stalled auto mode session, examine the last transcript:

```bash
ls -t ~/.claude/sessions/ | head -1 | xargs -I{} cat ~/.claude/sessions/{}
```

Look for `[blocked]` entries with the classifier output attached. This gives you the exact call string, the label, and the confidence score — the three inputs you need to write a targeted `allow` rule or diagnose a misclassification.

### Common Patterns and Fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| `npm run deploy` always prompts | Script fingerprinted as deployment | Add explicit `allow` rule for the exact script |
| `git push` to personal fork prompts | Classifier can't verify fork status | Add `allow` for that specific remote pattern |
| Everything prompts despite `defaultMode: "auto"` | Project `settings.json` has `defaultMode: "ask"` and `forcePermissions` | Check `--print-config` for forced rules |
| Hard deny on a command you control | Command matches a hard deny pattern | Restructure the command to avoid the pattern |
| Session stalls silently | `ask` prompt issued but terminal not watching | Use `--max-turns` to force exit; review transcript |
| Low confidence on all calls | Project uses unusual tooling the classifier hasn't seen | Add explicit `allow` rules for your toolchain |

---

## Reference: Key Settings Fields

```json
{
  "defaultMode": "auto",                    // auto | ask | deny
  "permissions": {
    "allow": ["..."],                       // patterns that always proceed
    "deny": ["..."]                         // patterns that are blocked (soft)
  },
  "forcePermissions": {
    "deny": ["..."]                         // deny rules that lower scopes cannot override
  },
  "classifier": {
    "confidenceThreshold": 0.72,            // below this → fallback to ask
    "verbose": false                        // log classifier decisions to console
  },
  "maxTurns": 200,                          // hard cap on turns per session
  "bypassPermissions": false               // set true only in sandboxed CI
}
```

---

## Quick-Start Checklist

- [ ] Set `defaultMode: "auto"` in `~/.claude/settings.json` for local dev
- [ ] Add explicit `deny` rules for destructive operations in project `.claude/settings.json`
- [ ] Use `forcePermissions.deny` for rules that must hold even when developers override
- [ ] Test your config with `--dry-run` before running a long autonomous session
- [ ] Use `--dangerously-skip-permissions` only in CI with a locked-down `deny` list
- [ ] Monitor `--print-config` output when onboarding new developers to catch scope conflicts
- [ ] Check `~/.claude/sessions/` transcripts after any stalled session

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
