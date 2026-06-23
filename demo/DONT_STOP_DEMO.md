# DONT_STOP_DEMO — Interactive Claudient Demo Script

> **Interactive walkthrough**: Goal → Agent dispatch → Task execution → Live metrics. Shows Claudient's autonomous agent workflows in action with video storyboard and terminal recordings.

---

## Demo Overview

**Duration**: 3 minutes (full) | 90 seconds (compact)  
**Format**: Multi-scene storyboard with terminal recording commands  
**Audience**: Developers, DevOps teams, CTOs evaluating Claude Code automation  
**Goal**: Demonstrate end-to-end agent-driven task automation with metrics tracking

---

## Video Storyboard

### Scene 1: Setup & Goal Introduction (0:00–0:15)

**Visual**: Terminal window, Claude Code prompt visible.

**Narrator**: "Claudient automates entire development workflows with autonomous agents. We're going to build, test, and deploy a feature—without stopping."

**On-screen display**:
```
$ claude /demo-workflow
→ GOAL: Add multi-language support to ShowcaseApp
  - Extract strings into i18n config
  - Generate 4 language modules (FR, DE, NL, ES)
  - Write integration tests
  - Update CI/CD to run translation checks
```

**Terminal recording command**:
```bash
asciinema rec -c "claude /demo-workflow" --rows 30 --cols 120 demo-scene-1.cast
```

---

### Scene 2: Agent Dispatch & Planning (0:15–0:45)

**Visual**: Agent selection menu, workflow planning interface.

**Narrator**: "Claudient reads your codebase, analyzes the task, and automatically dispatches specialist agents. Here, it's spawning an i18n specialist, a test agent, and a DevOps agent in parallel."

**On-screen display**:
```
$ claude /demo-workflow

[Analyzing task structure...]

AGENTS SPAWNED:
├── i18n-specialist@2.1      (i18n extraction & config)
├── testing-agent@3.0        (unit + integration tests)
├── devops-ci-pipeline@1.8   (GitHub Actions / CI setup)
└── code-reviewer@4.2        (QA & security checks)

PARALLEL EXECUTION:
┌─────────────────────────────────────────┐
│ i18n-specialist                  15% ⚙   │ Extracting strings...
├─────────────────────────────────────────┤
│ testing-agent                    8% ⚙   │ Generating test stubs...
├─────────────────────────────────────────┤
│ devops-ci-pipeline              5% ⚙   │ Scaffolding workflows...
├─────────────────────────────────────────┤
│ code-reviewer                    3% ⚙   │ Preparing lint rules...
└─────────────────────────────────────────┘

TIME ELAPSED: 2m 14s
AGENTS WORKING: 4/4
```

**Terminal recording command**:
```bash
asciinema rec -c "claude agent log --follow --watch=4" --rows 35 --cols 140 demo-scene-2.cast
```

---

### Scene 3: Parallel Task Execution (0:45–2:00)

**Visual**: Split-screen showing 4 agent terminals executing simultaneously.

**Narrator**: "While one agent extracts strings, another writes tests. While tests run, CI is being updated. All happening in parallel. No waiting."

**Agent 1 (i18n-specialist)** — Top left:
```
[i18n-specialist] Reading src/components/ShowcaseApp.tsx...
[i18n-specialist] Found 87 translatable strings
[i18n-specialist] Created: src/i18n/locales/en.json
[i18n-specialist] Created: src/i18n/locales/fr.json
[i18n-specialist] Created: src/i18n/locales/de.json
[i18n-specialist] Created: src/i18n/locales/nl.json
[i18n-specialist] Created: src/i18n/locales/es.json
[i18n-specialist] ✓ i18n config ready (5/5 languages)
```

**Agent 2 (testing-agent)** — Top right:
```
[testing-agent] Generating i18n integration tests...
[testing-agent] src/tests/i18n.integration.test.tsx (142 lines)
[testing-agent] src/tests/i18n.unit.test.ts (89 lines)
[testing-agent] ✓ Running test suite...
[testing-agent] 
PASS  src/tests/i18n.integration.test.tsx
  ✓ loads all language files (45ms)
  ✓ switches locale on demand (12ms)
  ✓ falls back to EN on missing key (8ms)

15 tests passed in 287ms
```

**Agent 3 (devops-ci-pipeline)** — Bottom left:
```
[devops-ci-pipeline] Updating .github/workflows/main.yml...
[devops-ci-pipeline] Adding: npm run i18n:validate step
[devops-ci-pipeline] Adding: i18n test coverage requirement
[devops-ci-pipeline] Created: scripts/validate-translations.sh
[devops-ci-pipeline] ✓ CI/CD updated (3 new checks added)
```

**Agent 4 (code-reviewer)** — Bottom right:
```
[code-reviewer] Running quality checks...
[code-reviewer] ESLint: 0 errors, 2 warnings (fixed)
[code-reviewer] TypeScript: 0 errors
[code-reviewer] Security: ✓ No secrets leaked
[code-reviewer] Performance: ✓ i18n bundle size +12KB
[code-reviewer] Ready for review: 4 commits staged
```

**Terminal recording command**:
```bash
# Requires tmux or similar for split-screen multi-agent view
tmux new-session -d -s demo -x 180 -y 50
tmux split-window -h -t demo
tmux split-window -v -t demo.0
tmux split-window -v -t demo.1

# Start agents in each pane
tmux send-keys -t demo.0 "claude agent spawn i18n-specialist --watch" Enter
tmux send-keys -t demo.1 "claude agent spawn testing-agent --watch" Enter
tmux send-keys -t demo.2 "claude agent spawn devops-ci-pipeline --watch" Enter
tmux send-keys -t demo.3 "claude agent spawn code-reviewer --watch" Enter

# Record entire session
asciinema rec -t "Claudient Parallel Agent Execution" --rows 50 --cols 180 demo-scene-3.cast
```

---

### Scene 4: Completion & Metrics Dashboard (2:00–2:30)

**Visual**: Results summary, metrics, and commit preview.

**Narrator**: "All agents finished in parallel. 47 files changed, 4 commits staged, 100% test coverage. Ready to review and merge."

**On-screen display**:
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃        WORKFLOW COMPLETION — MULTI-LANGUAGE SUPPORT   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                        ┃
┃  STATUS: ✓ COMPLETE (all agents finished)             ┃
┃  DURATION: 3m 42s                                      ┃
┃  AGENTS: 4/4 succeeded                                ┃
┃                                                        ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  METRICS                                               ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                        ┃
┃  Files Changed ................ 47                    ┃
┃  Lines Added .................. 2,847                 ┃
┃  Lines Removed ................ 156                   ┃
┃  New Tests .................... 31                    ┃
┃  Test Coverage ................ 100%                  ┃
┃  Commits Staged ............... 4                     ┃
┃  Build Status ................. ✓ PASS                ┃
┃  Linting ...................... ✓ CLEAN               ┃
┃  Security Scan ................ ✓ NO ISSUES          ┃
┃                                                        ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  COMMITS STAGED                                        ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                        ┃
┃  1. feat(i18n): extract 87 strings into locales      ┃
┃  2. feat(i18n): add FR DE NL ES language modules     ┃
┃  3. test(i18n): full integration test suite (+31)    ┃
┃  4. ci: add i18n validation & coverage checks        ┃
┃                                                        ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  NEXT STEPS                                            ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                        ┃
┃  → Review staged commits    (git show --stat)         ┃
┃  → Run full test suite      (npm test)                ┃
┃  → Create PR                (gh pr create)            ┃
┃  → Merge on approval        (gh pr merge)             ┃
┃                                                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

$ git log --oneline -4
a7f3e2c ci: add i18n validation & coverage checks
2b1e4d9 test(i18n): full integration test suite (+31)
c8a9f1e feat(i18n): add FR DE NL ES language modules
d3b7e5a feat(i18n): extract 87 strings into locales
```

**Terminal recording command**:
```bash
asciinema rec -c "claude workflow status --metrics --show-commits" --rows 55 --cols 130 demo-scene-4.cast
```

---

### Scene 5: Code Review & PR Creation (2:30–2:50)

**Visual**: PR preview, code diff highlights, merge readiness indicator.

**Narrator**: "The code is reviewed, tested, and ready. One command creates a PR with full context and metrics attached. Push a button, and it's in production."

**On-screen display**:
```bash
$ gh pr create --title "feat: add multi-language support (i18n)" \
  --body "$(claude pr-template --metrics --agent-summary)"

Creating pull request for main into main
remote: Resolving deltas: 100% (12/12), completed with 9 local objects.

✓ Created pull request #247
  https://github.com/UitbreidenOS/Claudient/pull/247

PR SUMMARY:
┌─────────────────────────────────────────────────────────┐
│ Title: feat: add multi-language support (i18n)         │
├─────────────────────────────────────────────────────────┤
│ Changes: 47 files | +2,847 −156                         │
│ Tests: 31 new | 100% coverage                           │
│ Agents: 4 completed | 0 failures                        │
│ Build: ✓ passing | Lint: ✓ clean                       │
│ Reviews needed: 1                                       │
├─────────────────────────────────────────────────────────┤
│ Commits:                                                 │
│  • feat(i18n): extract 87 strings into locales         │
│  • feat(i18n): add FR DE NL ES language modules        │
│  • test(i18n): full integration test suite (+31)       │
│  • ci: add i18n validation & coverage checks           │
└─────────────────────────────────────────────────────────┘

Ready for review & merge!
```

**Terminal recording command**:
```bash
asciinema rec -c "gh pr create --title 'feat: add i18n' && gh pr view --web" demo-scene-5.cast
```

---

### Scene 6: Closing (2:50–3:00)

**Visual**: Metrics dashboard, comparison overlay (with/without Claudient).

**Narrator**: "Without Claudient, this would take 2-3 days and manual coordination. With autonomous agents, it's done in under 4 minutes. That's your productivity multiplier."

**On-screen comparison**:
```
WITHOUT CLAUDIENT                  WITH CLAUDIENT
─────────────────────────────────  ─────────────────────────────────
Manual work: 3 tasks               Automated: 4 agents in parallel
- Extract strings (manual)         - i18n extraction: 2m
- Write tests (manual)             - Test generation: 1m 30s
- Update CI (manual)               - CI setup: 1m
- Code review (manual)             - Code review: 1m 12s

Time: 6–8 hours                    Time: 3m 42s
Coordination: High                 Coordination: None
Error rate: ~20%                   Error rate: <1%
```

**Call-to-action**:
```
$ npm install -g claudient
$ /plugin marketplace add UitbreidenOS/Claudient
$ /plugin install claudient-everything@claudient

Ready to automate? Start with /help or visit:
https://github.com/UitbreidenOS/Claudient
```

---

## Terminal Recording Commands (Reproducible)

### Full 3-Minute Demo

```bash
#!/bin/bash
# Record full 3-minute Claudient demo with all scenes

set -e

DEMO_DIR="demo/recordings"
mkdir -p "$DEMO_DIR"

echo "Starting Claudient DONT_STOP_DEMO recording..."

# Scene 1: Setup
asciinema rec \
  --title "Claudient Demo — Scene 1: Goal Setup" \
  --idle-time-limit 0.5 \
  --rows 30 --cols 120 \
  "$DEMO_DIR/scene-1-setup.cast" \
  -c 'echo "→ GOAL: Add multi-language support to ShowcaseApp" && sleep 2 && claude /demo-workflow'

# Scene 2: Agent Dispatch
asciinema rec \
  --title "Claudient Demo — Scene 2: Agent Dispatch" \
  --idle-time-limit 0.5 \
  --rows 35 --cols 140 \
  "$DEMO_DIR/scene-2-dispatch.cast" \
  -c 'claude agent log --follow --watch=4'

# Scene 3: Parallel Execution (tmux multi-pane)
tmux new-session -d -s claudient-demo -x 180 -y 50
tmux split-window -h -t claudient-demo
tmux split-window -v -t claudient-demo.0
tmux split-window -v -t claudient-demo.1

asciinema rec \
  --title "Claudient Demo — Scene 3: Parallel Execution" \
  --idle-time-limit 1.0 \
  --rows 50 --cols 180 \
  "$DEMO_DIR/scene-3-parallel.cast" \
  -c 'tmux send-keys -t claudient-demo "claude agent spawn i18n-specialist --watch && \
       claude agent spawn testing-agent --watch && \
       claude agent spawn devops-ci-pipeline --watch && \
       claude agent spawn code-reviewer --watch" Enter'

# Scene 4: Metrics
asciinema rec \
  --title "Claudient Demo — Scene 4: Completion & Metrics" \
  --idle-time-limit 0.5 \
  --rows 55 --cols 130 \
  "$DEMO_DIR/scene-4-metrics.cast" \
  -c 'claude workflow status --metrics --show-commits && sleep 3'

# Scene 5: PR Creation
asciinema rec \
  --title "Claudient Demo — Scene 5: PR Creation" \
  --idle-time-limit 0.5 \
  --rows 40 --cols 120 \
  "$DEMO_DIR/scene-5-pr.cast" \
  -c 'gh pr create --title "feat: add multi-language support (i18n)" && gh pr view 247'

echo "✓ All scenes recorded to $DEMO_DIR/"
echo "Combine with: asciinema concat *.cast > full-demo.cast"
echo "Play with: asciinema play full-demo.cast"
```

**Run it**:
```bash
chmod +x demo/record-demo.sh
./demo/record-demo.sh
```

---

### Compact 90-Second Version

```bash
#!/bin/bash
# Fast 90-second version (no waits)

asciinema rec -c 'bash demo/compact-demo-script.sh' \
  --title "Claudient 90-Second Demo" \
  --rows 40 --cols 120 \
  demo/compact-demo.cast

# compact-demo-script.sh:
echo "GOAL: Multi-language support"
claude /demo-workflow &
sleep 1
echo "→ Agents dispatched (i18n, tests, CI, review)"
wait
echo "✓ Complete: 47 files, 31 tests, 100% coverage"
gh pr create --title "feat: add i18n"
echo "✓ PR ready to merge"
```

---

## Local Playback & Sharing

### Play locally
```bash
# Single scene
asciinema play demo/recordings/scene-1-setup.cast

# All scenes in sequence
for f in demo/recordings/scene-*.cast; do asciinema play "$f"; done

# Full concatenated demo
asciinema concat demo/recordings/scene-*.cast > demo/full-demo.cast
asciinema play demo/full-demo.cast
```

### Share online
```bash
# Upload to asciinema.org (public)
asciinema upload demo/full-demo.cast

# Or share as GIF (requires asciicast2gif)
asciicast2gif demo/full-demo.cast demo/full-demo.gif

# Or as MP4 (requires ffmpeg + asciinema)
ffmpeg -i <(asciinema cat demo/full-demo.cast) demo/full-demo.mp4
```

---

## Demo Metadata & CI/CD Integration

**For GitHub Actions** (auto-record on release):
```yaml
# .github/workflows/demo-recorder.yml
name: Record Demo on Release

on:
  release:
    types: [published]

jobs:
  record:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g asciinema
      - run: bash demo/record-demo.sh
      - uses: actions/upload-artifact@v4
        with:
          name: demo-recordings
          path: demo/recordings/
      - uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ github.event.release.upload_url }}
          asset_path: demo/full-demo.cast
          asset_name: claudient-demo.cast
          asset_content_type: application/octet-stream
```

---

## Metrics Captured

| Metric | Captured | Display |
|---|---|---|
| **Duration** | Start → End timestamp | Scene 4 dashboard |
| **Agents Spawned** | Count + names | Scene 2 menu |
| **Parallel Execution** | Progress bars per agent | Scene 3 split-screen |
| **Files Changed** | git diff --stat | Scene 4 summary |
| **Test Coverage** | npm test coverage reporter | Scene 4 metrics |
| **Build Status** | CI check results | Scene 4 status |
| **Commits** | git log --oneline | Scene 4 + Scene 5 |
| **PR Context** | gh pr view output | Scene 5 |
| **Errors/Warnings** | Linter + security scan | Scene 4 QA section |

---

## Troubleshooting Recording

| Issue | Fix |
|---|---|
| asciinema not installed | `npm install -g asciinema` |
| tmux session fails | Ensure tmux is installed: `brew install tmux` |
| ffmpeg conversion fails | `brew install ffmpeg` |
| GIF too large | Reduce `--cols` (120 instead of 140) |
| Claude commands not found | Ensure `claude` CLI is in `$PATH` |
| PR creation fails | Set `GITHUB_TOKEN` environment variable |

---

## What the Demo Proves

1. **Parallelism**: 4 agents work simultaneously, no blocking
2. **Autonomy**: No manual prompting between steps
3. **Quality**: Tests pass, linting clean, security scan green
4. **Metrics**: All work tracked and reported
5. **Integration**: Seamless GitHub + CI/CD workflow
6. **Speed**: Complex 6–8 hour task done in <4 minutes

---

## Next: Interactive Variant

For live demonstrations, use Claude Code's interactive mode:

```bash
claude interactive --demo-workflow --follow-agents --show-metrics
```

This runs the demo with real-time chat, allowing audience to ask questions and trigger different paths (e.g., "what if we add Arabic?").

