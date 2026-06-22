# Feature Error Codes & Recovery Guide

Error specification for 3 enterprise features: Swarm Sandbox Simulator, SVG Interactive Map Inspector, and Matrix Theme Pack.

Format: `ERROR_XXXX | Message | Recovery Steps`

---

## Swarm Sandbox Simulator Errors

### Configuration & Topology Validation

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SS001` | Duplicate agent ID detected in topology | (1) Review `.swarm-sandbox.env` and topology config (2) Rename conflicting agent ID to unique value (3) Re-run validator with `--topology ./path/to/config.json` |
| `ERROR_SS002` | Agent missing required role field | (1) Open topology JSON/YAML (2) Add `"role"` field to agent (valid: orchestrator, specialist, researcher, analyst, writer, risk_assessor) (3) Run validation: `python3 swarm_sandbox_validator.py --topology ./config.json` |
| `ERROR_SS003` | Topology exceeds maximum agent count (limit: 10) | (1) Review swarm design (2) Consolidate roles or split into separate councils (3) For large swarms: use peer-to-peer topology instead of hub-and-spoke (4) Re-validate at reduced scale |
| `ERROR_SS004` | Communication topology malformed or missing | (1) Check `"communication"` section in config (2) Verify `"topology"` is one of: hub-and-spoke, bilateral, peer-to-peer (3) For hub-and-spoke: ensure `"hub"` field names valid agent ID (4) Run: `python3 swarm_sandbox_validator.py --topology ./config.json` |
| `ERROR_SS005` | Cycle detected in agent communication graph | (1) Run graph analysis: `python3 swarm_sandbox_validator.py --topology ./config.json --detailed` (2) Identify cycle in output (3) Remove or redirect problematic edge in communication rules (4) Consider circuit breaker settings: increase `circuit_breaker.threshold` from 5 to 8+ (5) Re-validate |
| `ERROR_SS006` | Agent timeout too low (minimum: 1000ms) | (1) Locate agent in config with `timeout_ms < 1000` (2) Increase timeout to at least 1000ms (3) For fast operations: set to 2000-5000ms (4) Verify agent model can complete within timeout (5) Re-validate |
| `ERROR_SS007` | Agent timeout excessively high (warning: >300000ms) | (1) Review agent timeout (currently >300 seconds) (2) For most operations: 15000-30000ms is sufficient (3) If intentionally high: acknowledge and proceed (4) Consider splitting long operations into phases (5) Re-validate or override with `--force` |
| `ERROR_SS008` | Insufficient memory allocated (minimum: 128MB) | (1) Check agent `memory_limit_mb` (2) Increase to minimum 128MB (3) For complex analysis: 256-512MB recommended (4) Verify system has available RAM (run `free -h` on Linux / `vm_stat` on macOS) (5) Re-validate |
| `ERROR_SS009` | Network access not restricted (sandbox security violation) | (1) Open isolation config (2) Ensure `"network_restricted": true` (3) Only mock/localhost URLs allowed in sandbox (4) Remove any external API calls from test payloads (5) Re-run validation with `--isolation-level strict` |
| `ERROR_SS010` | Context isolation disabled (agents may leak internal state) | (1) Check `isolation.context_isolation` in config (2) Set to `true` (3) This prevents inter-agent state leakage (4) Acknowledge if intentional (rare edge case) (5) Re-validate or override with `--force` |

### Rate Limiting & Resource Enforcement

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SS011` | Rate limit not defined for agent | (1) Locate agent in config (2) Add `"rate_limit": { "requests_per_minute": N }` (3) Typical values: 60-120 RPM for primary, 80-120 for specialists (4) Validate against model quotas (5) Re-validate |
| `ERROR_SS012` | Rate limit exceeded during sandbox run | (1) Check metrics: `cat .swarm-sandbox-metrics.json \| jq .error_counts` (2) Reduce concurrent task load (3) Increase `SANDBOX_RATE_LIMIT_MULTIPLIER` in env (currently too low) (4) Stagger message timing (5) Re-run with reduced load: `--scenario slow_council` |
| `ERROR_SS013` | Message queue depth exceeded (max: 5000) | (1) Run simulation at lower concurrency (2) Increase `SANDBOX_MAX_CONCURRENT_AGENTS` in env (3) Reduce task batch size (4) Monitor queue depth: `python3 swarm_sandbox_report.py --metrics ./metrics.json` (5) Re-run simulation |
| `ERROR_SS014` | Message size exceeds limit (max: 1MB) | (1) Check largest message in scenario payload (2) Break large payloads into smaller chunks (3) Compress JSON or use references instead of inline data (4) Verify: `SANDBOX_MAX_MESSAGE_SIZE_BYTES=1048576` in env (5) Re-run validation |
| `ERROR_SS015` | Request budget exhausted (max per run: 5000) | (1) Check metrics for total requests: `jq .total_requests .swarm-sandbox-metrics.json` (2) Reduce scenario scope or agent count (3) Increase budget: `SANDBOX_MAX_TOTAL_REQUESTS_PER_RUN=10000` (4) Split into multiple sandbox runs (5) Re-run with adjusted budget |

### Retry & Circuit Breaker

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SS016` | Retry policy missing or invalid | (1) Check `communication.retry_policy` in config (2) Add: `{ "max_attempts": 3, "backoff_ms": [100, 250, 500] }` (3) Verify `max_attempts >= 1` (4) Set backoff array length to match `max_attempts` (5) Re-validate |
| `ERROR_SS017` | Circuit breaker not configured | (1) Locate `retry_policy.circuit_breaker` (2) Add: `{ "threshold": 5, "reset_ms": 60000 }` (3) Threshold = failures before breaking circuit (recommend 3-5) (4) Reset time in ms (recommend 30000-120000) (5) Re-validate |
| `ERROR_SS018` | Circuit breaker activated (agent unreachable) | (1) Check which agent tripped breaker in logs (2) Verify agent is actually running/reachable (3) Increase `circuit_breaker.threshold` if frequent false-positives (4) Increase `reset_ms` to allow longer recovery time (5) Manual reset: `python3 swarm_sandbox_simulator.py --reset-circuit-breaker agent-id` (6) Retry scenario |
| `ERROR_SS019` | Max retry attempts exceeded | (1) Check agent that failed in logs (2) Increase `max_attempts` in retry policy (3) Increase backoff delays: `"backoff_ms": [200, 500, 1000]` (4) Check if underlying issue is resolved (timeout, agent crash, etc.) (5) Re-run with increased retry budget |
| `ERROR_SS020` | Exponential backoff calculation overflow | (1) Check backoff array length (should match `max_attempts`) (2) Limit backoff values to reasonable range (max 5000ms) (3) Example correct config: `"backoff_ms": [100, 250, 500, 1000]` for 4 attempts (4) Re-validate |

### Dry-Run Execution

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SS021` | Dry-run scenario not found | (1) List available scenarios: `python3 swarm_sandbox_simulator.py --list-scenarios` (2) Verify scenario name matches: `--scenario scenario_name` (3) Create custom scenario in topology config if needed (4) Re-run with valid scenario name |
| `ERROR_SS022` | Sandbox environment initialization failed | (1) Check file permissions: `ls -la .swarm-sandbox.env` (2) Verify all required env vars set: `env \| grep SANDBOX_` (3) Re-source env: `source .swarm-sandbox.env` (4) Check disk space: `df -h` (5) Create fresh env: `cp .swarm-sandbox.env.template .swarm-sandbox.env` (6) Re-initialize |
| `ERROR_SS023` | Mock API endpoint unreachable during dry-run | (1) Verify mock endpoint is running (if using local mock server) (2) Check network restrictions in isolation config (3) If using URLs: ensure they're in allowed list for sandbox (4) Use relative/internal mock URLs only (5) Re-run with `--network-access local_only` |
| `ERROR_SS024` | Dry-run timeout exceeded (exceeded max_ms) | (1) Check expected_duration_ms for scenario (2) Increase timeout: `SANDBOX_TIMEOUT_OVERRIDE_MS=15000` (3) Reduce agent count or task complexity (4) Enable trace to see where time is spent: `python3 swarm_sandbox_simulator.py --trace-enabled` (5) Re-run with increased timeout |
| `ERROR_SS025` | Sandbox run crashed or terminated unexpectedly | (1) Check logs: `cat .swarm-sandbox.log \| tail -50` (2) Look for out-of-memory error: increase `memory_limit_mb` per agent (3) Check for syntax errors in topology: `python3 swarm_sandbox_validator.py --topology ./config.json` (4) Enable debug logging: `SANDBOX_LOG_LEVEL=debug python3 swarm_sandbox_simulator.py ...` (5) Re-run with debug enabled |

### Monitoring & Metrics

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SS026` | Metrics collection failed | (1) Verify output path is writable: `touch $SANDBOX_METRICS_OUTPUT` (2) Check disk space: `df -h` (3) Ensure parent directory exists: `mkdir -p $(dirname $SANDBOX_METRICS_OUTPUT)` (4) Set env: `SANDBOX_COLLECT_METRICS=true` (5) Re-run simulation |
| `ERROR_SS027` | Agent latency exceeds SLA | (1) Check measured latency in metrics: `jq '.agent_latencies' .swarm-sandbox-metrics.json` (2) Increase timeout_ms for affected agent (3) Check if system is under resource pressure (CPU/memory) (4) Reduce concurrent load (5) Profile with trace: `--trace-enabled` to see bottleneck (6) Re-run with optimization |
| `ERROR_SS028` | Error rate too high (>5%) | (1) Analyze error breakdown: `jq '.error_counts' .swarm-sandbox-metrics.json` (2) For timeout errors: increase timeout_ms (3) For circuit breaker trips: increase threshold (4) For network errors: verify mock endpoints (5) Run chaos test: `python3 swarm_sandbox_simulator.py --chaos-mode true --failure-rate-percent 5` (6) Compare against baseline |
| `ERROR_SS029` | Health status degraded during validation | (1) Check which metric triggered degraded status (2) Common causes: latency (80%+ of timeout), error rate (3-5%) (3) Address root cause per ERROR_SS027 or ERROR_SS028 (4) Re-validate and re-run until status is healthy (5) Generate report: `python3 swarm_sandbox_report.py --readiness` |

### Deployment Readiness

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SS030` | Sandbox readiness yellow (warnings present) | (1) Review warnings in validation report (2) Each warning is non-blocking but should be addressed (3) Common: missing retry policy, no circuit breaker, high timeout (4) Fix issues or acknowledge intentional (5) Re-validate (6) Proceed to production if acceptable risk |
| `ERROR_SS031` | Sandbox readiness red (errors prevent deployment) | (1) Review errors in validation report (2) Errors are blocking: fix all before deployment (3) Common: duplicate IDs, invalid topology, network restrictions violated (4) Address each error per ERROR_SS001-SS010 (5) Re-validate until green (6) Then proceed to production |
| `ERROR_SS032` | Production topology differs from sandbox | (1) Compare configs: `diff ./council-topology-sandbox.json ./council-topology-production.json` (2) Update production config to match sandbox-validated version (3) Run validation on production config (4) If intentional changes: re-run sandbox validation on new config (5) Proceed with matched configs only |
| `ERROR_SS033` | Deployment script not found or executable | (1) Verify deployment script path: `ls -la ./deploy-council.sh` (2) Make executable: `chmod +x ./deploy-council.sh` (3) Check script syntax: `bash -n ./deploy-council.sh` (4) Ensure all dependencies in script are available (5) Execute: `./deploy-council.sh` |

---

## SVG Interactive Map Inspector Errors

### SVG Loading & Parsing

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SI001` | SVG file not found or inaccessible | (1) Verify file path is correct and absolute (2) Check file permissions: `ls -la ./architecture-map.svg` (3) Ensure SVG file has read permissions for user (4) Verify file isn't corrupted: `file ./architecture-map.svg` (5) Retry loading: `inspector.loadSVG(svgData)` |
| `ERROR_SI002` | SVG parsing failed (malformed XML) | (1) Validate SVG syntax: `xmllint --noout ./architecture-map.svg` (2) Open in text editor and check for missing closing tags (3) Common issues: unescaped quotes, invalid attribute values (4) Run through SVG validator: https://validator.w3.org/nu/ (5) Fix XML errors and retry loading |
| `ERROR_SI003` | SVG missing required root element | (1) Verify file starts with `<svg>` tag (2) Check DOCTYPE is not preventing loading (3) If wrapped in XML: extract root SVG element (4) Ensure viewBox or width/height attributes present (5) Fix and retry loading |
| `ERROR_SI004` | SVG contains invalid namespace | (1) Check SVG namespace: should be `xmlns="http://www.w3.org/2000/svg"` (2) Remove duplicate or incorrect xmlns declarations (3) If from Figma export: normalize namespaces with svgo (4) Tool: `svgo --multipass ./input.svg --output ./output.svg` (5) Retry loading cleaned SVG |
| `ERROR_SI005` | SVG file too large to load (>50MB) | (1) Check file size: `du -h ./architecture-map.svg` (2) For large maps: simplify or split into multiple views (3) Reduce node count by grouping or filtering (4) Use svgo to optimize: `svgo --multipass ./map.svg` (5) Or split geographically: top-level, subsystems, details (6) Retry with smaller file |

### Node & Element Validation

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SI006` | Node missing required data-node-id attribute | (1) Inspect SVG source for `<g>` or `<circle>` elements (2) Each interactive node must have: `data-node-id="unique-id"` (3) Find elements without this: use text search for `data-node` (4) Add missing attributes or regenerate from source (5) If from code analysis tool (prophet.js): regenerate SVG (6) Retry loading |
| `ERROR_SI007` | Node ID duplicated (not unique) | (1) Find all `data-node-id` values: `grep -o 'data-node-id="[^"]*"' ./map.svg \| sort \| uniq -d` (2) Each ID must be unique (3) Rename duplicates by appending suffix: `node-1`, `node-1-alt` (4) Update corresponding edges to reference new IDs (5) Validate uniqueness and retry |
| `ERROR_SI008` | Node missing label or metadata | (1) Check if `data-node-label`, `data-node-type` present (2) Optional but recommended: add at least `data-node-label` (3) Add to existing node: `data-node-label="Module Name"` (4) For analysis tools: verify export config includes labels (5) Regenerate if source supports it, or manually add (6) Retry loading |
| `ERROR_SI009` | Edge references non-existent node | (1) Find edge with invalid reference: `grep -o 'data-edge-from="[^"]*"\|data-edge-to="[^"]*"' ./map.svg` (2) Cross-reference against valid `data-node-id` values (3) Fix typos in edge references (4) Remove edges referencing deleted nodes (5) Validate all references are valid (6) Retry loading |
| `ERROR_SI010` | Circular reference in node relationships | (1) This is a warning, not blocking (circular edges are valid) (2) If unintended: edit SVG and remove problematic edges (3) Inspector highlights circular edges in red/warning color (4) For documentation: note the circular dependency (5) Continue with inspection or fix upstream in source |

### Rendering & Viewport

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SI011` | SVG viewport not defined (no viewBox or dimensions) | (1) Check root `<svg>` element (2) Add `viewBox="0 0 1200 800"` if missing (3) Or set `width="1200px" height="800px"` (4) Adjust values to match your content bounds (5) Save and retry loading |
| `ERROR_SI012` | Pan/zoom transformation broken | (1) Verify SVG has `<g data-content>` wrapper (2) Check browser console for JS errors: F12 → Console tab (3) Ensure CSS doesn't conflict: `g { pointer-events: none; }` (4) Try reset: click "Reset" button in toolbar (5) If persistent: reload page or inspector |
| `ERROR_SI013` | Zoom level exceeds limits (min: 0.1x, max: 5x) | (1) This is normal constraint, not an error (2) Zoom is clamped: minimum 10% view, maximum 500% zoom (3) If need to zoom further: increase viewport size in SVG (4) Or split map into multiple views (5) Zoom will auto-constrain to valid range |
| `ERROR_SI014` | Pan offset calculation error | (1) Occurs when dragging map aggressively (2) Try: click "Reset" button to recenter (3) Then pan gently with small movements (4) Check browser memory: if low, performance degraded (5) Reload inspector if offset persists (6) Reduce SVG complexity if frequent |
| `ERROR_SI015` | Transform not applying to viewport | (1) Check if SVG element has width/height style (2) Remove conflicting CSS: width/height should not be fixed px (3) Inspector needs fluid sizing: `width: 100%; height: 100%;` (4) Verify CSS: `.map-viewport svg { width: 100%; height: 100%; }` (5) Reload and retry |

### Node Selection & Interaction

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SI016` | Node click handler not firing | (1) Verify event delegation: `svg.addEventListener('click', handler)` (2) Check if SVG element has `pointer-events: auto` in CSS (3) Ensure node has `data-node-id` attribute (4) Open DevTools → Elements, click node, check if event fires (5) If not: check for event bubbling issues (6) Reload page |
| `ERROR_SI017` | Metadata panel not updating on selection | (1) Click a node and check sidebar updates (2) If sidebar empty: verify node has metadata attributes (3) Check `updateMetadataPanel()` is being called (4) Inspect: F12 → Console → `inspector.state.selectedNode` (5) If null: click a node again (6) If still empty: verify node data attributes are populated |
| `ERROR_SI018` | Drill-down zoom not working | (1) Select a node first (should highlight) (2) If node has children: double-click to drill down (3) Verify node has valid `data-node-id` (4) Check console for errors: F12 → Console (5) Try fit-to-view first: click "Fit View" button (6) Then click node and retry drill-down |
| `ERROR_SI019` | Connection highlighting not visible | (1) Select a node (it should highlight in blue) (2) Connected edges should turn green (3) If not visible: check CSS for `.highlighted` styles (4) Verify edge elements have `data-edge-from` and `data-edge-to` attributes (5) Check browser zoom level (not CSS zoom, browser zoom) (6) Reload inspector |
| `ERROR_SI020` | Multiple nodes selected simultaneously (should be one) | (1) This shouldn't happen with normal usage (2) Try clicking elsewhere to deselect (3) Then click single node (4) If issue persists: check for event binding conflicts (5) In console: `document.querySelectorAll('[data-node].selected').length` (6) Should return 1 after single click |

### Export & Download

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SI021` | SVG download failed or aborted | (1) Check browser console: F12 → Console (2) Verify file size isn't too large (>100MB) (3) Try clearing browser cache: DevTools → Application → Clear storage (4) Check browser storage quota (5) Click "Download" button again (6) If persistent: manually save via "Save As" |
| `ERROR_SI022` | Downloaded SVG missing nodes or edges | (1) Downloaded file is a snapshot of current view (zoom/pan state) (2) Original file has all content (3) If need full SVG: click "Fit View" first (4) Then download to capture entire canvas (5) Or export from original source (prophet.js, oracle.js) |
| `ERROR_SI023` | Downloaded filename incorrect or missing | (1) Browser should save as `map.svg` by default (2) If saving with wrong name: check browser downloads folder (3) Rename file: `mv downloaded_file.svg map.svg` (4) Verify it's valid SVG: `file ./map.svg` (5) Reload in inspector to confirm |

### Performance & Optimization

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SI024` | Map rendering slow or unresponsive | (1) Check SVG complexity: number of nodes/edges (2) Large maps (1000+ nodes): browser may struggle (3) Split map into subsystem views (4) Reduce visual detail: hide labels if 500+ nodes (5) Use browser DevTools → Performance tab to profile (6) Upgrade browser or use modern browser (Chrome/Firefox) |
| `ERROR_SI025` | Pan/zoom laggy or jittery | (1) Reduce SVG complexity (see ERROR_SI024) (2) Close other browser tabs to free memory (3) Disable browser extensions that modify DOM (4) Check browser zoom level: reset to 100% (Cmd+0 or Ctrl+0) (5) Restart browser (6) On low-end hardware: consider static image instead |
| `ERROR_SI026` | Memory leak or excessive RAM usage | (1) Check browser task manager: Shift+Esc (Chrome) (2) Close inspector tab and reopen if >500MB RAM used (3) Reduce number of open inspector instances (4) Limit SVG file size to <10MB (5) Use modern browser with better memory management (6) Consider static visualization if dynamic isn't needed |
| `ERROR_SI027` | Touch gestures not working (mobile/tablet) | (1) Inspector optimized for desktop (mouse + keyboard) (2) Mobile touch may not be fully supported (3) For touch: use two-finger pinch for zoom (4) Single-finger drag for pan (5) Tap node to select (6) For full experience: use desktop browser |

### Data & Content Issues

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_SI028` | Map data incomplete or outdated | (1) Regenerate map from source: `python3 oracle.js --output ./map.svg` (2) Verify source data is current (3) Check timestamp: `stat ./map.svg` (4) If from code analysis: re-run analysis tool (5) Reload fresh SVG into inspector (6) Compare with previous version if available |
| `ERROR_SI029` | Sensitive data exposed in metadata | (1) Check node attributes for PII, API keys, secrets (2) Before sharing map: redact sensitive data (3) Edit SVG to remove or mask sensitive attributes (4) Use jq/sed to filter: `sed 's/secret=[^ ]*/secret=***/' map.svg` (5) Verify clean version before sharing (6) Or use aggregated/anonymized version for sharing |
| `ERROR_SI030` | Map structure doesn't match codebase | (1) Verify map was generated from correct repository (2) Check git commit hash in map metadata if available (3) Codebase may have changed since map generation (4) Regenerate map with current code (5) Re-run analysis: `python3 oracle.js --current-branch` (6) Reload new map in inspector |

---

## Matrix Theme Pack Errors

### Installation & Setup

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_MT001` | Theme pack not found at expected path | (1) Verify installation: `ls ~/.claude/themes/matrix-dark/` (2) If missing: reinstall from marketplace (3) Claude Code: `/config theme` → select Matrix (4) Or manual: git clone theme repo to `~/.claude/themes/` (5) Verify directory structure: core/, variants/, terminal/ (6) Restart Claude Code |
| `ERROR_MT002` | settings.json missing or invalid JSON | (1) Check file exists: `ls ~/.claude/settings.json` (2) Validate JSON syntax: `cat ~/.claude/settings.json \| jq .` (3) If invalid: fix syntax errors (missing commas, quotes) (4) Or restore from backup: `cp ~/.claude/settings.json.bak ~/.claude/settings.json` (5) Re-apply theme via `/config theme` (6) Verify theme persists after restart |
| `ERROR_MT003` | Insufficient permissions to write settings | (1) Check file permissions: `ls -la ~/.claude/settings.json` (2) Make writable: `chmod 644 ~/.claude/settings.json` (3) Or write to user settings: `~/.claude/settings.local.json` (4) Create if missing: `touch ~/.claude/settings.local.json` (5) Set permissions: `chmod 644 ~/.claude/settings.local.json` (6) Apply theme again |
| `ERROR_MT004` | Theme variant not recognized or misspelled | (1) List available variants: `ls ~/.claude/themes/matrix-dark/variants/` (2) Valid: strict, soft, neon, amber (3) Correct spelling in settings.json: `"variant": "strict"` (4) Or use `/config theme` UI to select (5) Reload config: `/config reload` (6) Restart Claude Code if needed |
| `ERROR_MT005` | Required theme files missing (base.json, colors.json) | (1) Reinstall theme pack (2) Or download from marketplace again (3) Verify directory contents: `ls ~/.claude/themes/matrix-dark/core/` (4) Should have: base.json, effects.json, palette.json (5) If corrupted: restore from backup or reinstall (6) Then restart Claude Code |

### Claude Code Configuration

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_MT006` | Theme not applying after restart | (1) Verify settings saved: `grep matrix ~/.claude/settings.json` (2) Check if using settings.local.json (takes precedence) (3) Force reload: `/config reload` (4) Or manually restart: quit and relaunch Claude Code (5) If still not applied: delete cache `~/.claude/cache/*` (6) Restart Claude Code |
| `ERROR_MT007` | Glow effect not rendering or invisible | (1) Verify effect enabled: `grep -A3 "effects" ~/.claude/settings.json` (2) Should have: `"textGlow": true, "glowIntensity": 0.8` (3) Check GPU acceleration enabled: `/config debug` (4) If on remote/SSH: glow effects may be disabled (5) Switch to soft variant which has reduced glow (6) Reload config |
| `ERROR_MT008` | Cascade effect causing performance lag | (1) Check if cascade enabled: `grep -A2 "cascade" ~/.claude/settings.json` (2) Disable: set `"cascade": false` (3) Or slow down: `"cascadeSpeed": "very-slow"` (4) Or increase spacing: `"cascadeSpacing": 50` (5) Save settings and reload (6) Test performance |
| `ERROR_MT009` | Font not displaying correctly (wrong family) | (1) Check configured font: `grep fontFamily ~/.claude/settings.json` (2) Verify font installed on system: `fc-list \| grep Monaco` (3) Use available font: Monaco (macOS), Menlo (macOS), Ubuntu Mono (Linux) (4) Update settings with available font (5) Restart Claude Code (6) Verify display |
| `ERROR_MT010` | Line height or font size making text unreadable | (1) Check values: `grep -A5 "display" ~/.claude/settings.json` (2) Typical: fontSize: 12-14, lineHeight: 1.4-1.8 (3) Too large font: reduce to 12 (4) Too small: increase to 14 (5) Line height too tight: increase to 1.6+ (6) Save and verify readability |
| `ERROR_MT011` | High contrast mode interfering with theme colors | (1) Check setting: `grep highContrast ~/.claude/settings.json` (2) If true: set to `false` (3) High contrast may override theme colors (4) Save settings: `"highContrast": false` (5) Reload: `/config reload` (6) Verify theme colors display correctly |

### VS Code Integration

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_MT012` | VS Code extension not found or not installed | (1) Install from marketplace: `code --install-extension matrix-dark-theme.matrix-dark` (2) Or via UI: Cmd+Shift+X → search "Matrix Dark" → Install (3) Manual install: `code --install-extension ./matrix-dark-theme-1.0.0.vsix` (4) Verify installed: `code --list-extensions \| grep matrix` (5) If still missing: restart VS Code (6) Then verify |
| `ERROR_MT013` | VS Code theme not applying (showing default theme) | (1) Open settings: Cmd+Shift+P → "Color Theme" (2) Select "Matrix Dark" (3) Or edit `.vscode/settings.json`: `"workbench.colorTheme": "Matrix Dark"` (4) Save and verify immediately (5) If not applied: restart VS Code (6) Check for conflicting extensions disabling theme |
| `ERROR_MT014` | Icon theme not showing (file icons missing) | (1) Install icon theme: `code --install-extension matrix-icons` (2) Or: Cmd+Shift+P → "Icon Theme" → select "matrix-icons" (3) Or edit settings: `"workbench.iconTheme": "matrix-icons"` (4) Save and verify (5) If missing: clear cache: `rm -rf ~/Library/Application\ Support/Code/Cache/` (6) Restart VS Code |
| `ERROR_MT015` | VS Code settings.json syntax error after manual edit | (1) Open `.vscode/settings.json` in text editor (2) Use online JSON validator to check syntax (3) Common: missing comma between properties (4) Fix errors and save (5) Or restore from backup if unsure (6) Restart VS Code and verify |
| `ERROR_MT016` | Terminal colors in VS Code not matching theme | (1) Check integrated terminal: Ctrl+` (backtick) (2) Open settings: Cmd+Shift+P → "Terminal: New" (3) Verify COLORTERM=truecolor: `echo $COLORTERM` (4) Add to settings: `"terminal.integrated.env.osx": { "COLORTERM": "truecolor" }` (5) Reload: restart terminal (6) Verify 24-bit color |
| `ERROR_MT017` | Font ligatures not working in editor | (1) Check setting: `grep fontLigatures ~/.vscode/settings.json` (2) Enable: set `"editor.fontLigatures": true` (3) Use compatible font: JetBrains Mono, Fira Code, Ligature variants (4) Restart VS Code (5) If still not working: font may not support ligatures (6) Try different font |

### Terminal Configuration

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_MT018` | Terminal colors not appearing (default colors instead) | (1) Check COLORTERM: `echo $COLORTERM` (2) Should be: xterm-256color or truecolor (3) Set manually: `export COLORTERM=truecolor` (4) Add to ~/.zshrc or ~/.bashrc: `export COLORTERM=truecolor` (5) Reload: `source ~/.zshrc` (6) Test: colors should appear immediately |
| `ERROR_MT019` | Terminal reporting insufficient color support (256 max) | (1) Verify terminal emulator: echo $TERM (2) Modern terminals support 24-bit (truecolor) (3) Upgrade terminal: iTerm2 2.9+, Terminal.app (recent), Alacritty (4) Or configure: set TERM to xterm-256color minimum (5) For SSH: ensure remote also exports COLORTERM=truecolor (6) Test color: `printf "\x1b[38;2;0;255;0mGreen\x1b[0m\n"` |
| `ERROR_MT020` | iTerm2 theme import failed (wrong format) | (1) Verify file: matrix.itermcolors (2) Should be XML format (3) Location: ~/.config/iterm2/colorschemes/ (4) Open iTerm2 Prefs → Profiles → Colors (5) Click "Color Presets..." → "Import..." (6) Select matrix.itermcolors and confirm |
| `ERROR_MT021` | Terminal.app theme import failed or not found | (1) Check file: ~/Library/Preferences/matrix.terminal (2) Open Terminal.app → Preferences → Profiles (3) Click gear icon → "Import..." (4) Browse to matrix.terminal file (5) Select imported profile (6) Click "Default" to make default |
| `ERROR_MT022` | Alacritty theme not applying (config not loaded) | (1) Edit ~/.config/alacritty/alacritty.yml (2) Add import: `import: [~/.config/alacritty/matrix.yml]` (3) Verify matrix.yml exists (4) Check YAML syntax: no tabs, proper indentation (5) Save and reload Alacritty (6) Test colors |
| `ERROR_MT023` | Gnome Terminal doesn't show Matrix theme in dropdown | (1) Verify file copied: `ls ~/.local/share/gnome-terminal/color-schemes/matrix.xml` (2) If missing: copy manually (3) Restart Gnome Terminal or log out/in (4) Open Prefs → Colors (5) Matrix should appear in scheme dropdown (6) Select and apply |
| `ERROR_MT024` | Prompt colors not visible (PS1 override issue) | (1) Check custom PS1 in ~/.zshrc or ~/.bashrc (2) Matrix theme sets PS1 with color codes (3) If overridden: remove custom PS1 (4) Or manually set: `export PS1="\[\033[38;2;0;255;0m\]\u@\h\[\033[0m\]:\w\$ "` (5) Save and reload: `source ~/.zshrc` (6) Prompt should show green now |
| `ERROR_MT025` | Windows Terminal theme import (PowerShell) failed | (1) Verify file copied: `dir $env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\matrix.json` (2) If missing: copy manually (3) Open Windows Terminal → Settings (4) Navigate to "Schemes" section (5) Matrix should appear in dropdown (6) Select and apply |

### Theme Customization

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_MT026` | Custom variant JSON not parsing | (1) Validate JSON: `cat ~/.claude/themes/matrix-custom/config.json \| jq .` (2) Common errors: unescaped quotes, missing commas (3) Fix syntax and save (4) Or restore from template: `cp matrix-dark/config.json matrix-custom/` (5) Verify parsed: `jq . config.json` (6) Restart Claude Code |
| `ERROR_MT027` | Custom palette colors not applying | (1) Check config.json for palette section (2) Verify color format: hex (#RRGGBB), not rgb (3) Example: `"background": "#000000"` (4) Save changes (5) Reload: `/config reload` (6) If still not applied: clear cache and restart |
| `ERROR_MT028` | Color values invalid or out of range | (1) Colors must be hex: #000000 to #FFFFFF (2) Common error: missing # prefix (3) Fix: `"color": "#00ff00"` not `"color": "00ff00"` (4) Verify against color palette validator (5) Save and reload (6) Test in editor/terminal |
| `ERROR_MT029` | Glow intensity parameter not recognized | (1) Check glow section in config (2) Valid key: `"intensity"` (range: 0-1) (3) Also: `"spread"` (range: 0-10) (4) Example: `"glow": { "enabled": true, "intensity": 0.8, "spread": 2 }` (5) Save and verify effect (6) Adjust if too subtle or too strong |
| `ERROR_MT030` | Custom variant not appearing in theme selector | (1) Verify registered in settings.json (2) Should have: `"name": "matrix-custom", "path": "~/.claude/themes/matrix-custom"` (3) Directory must exist and be readable (4) Restart Claude Code (5) Try `/config theme` → should list custom variant (6) If not: check file permissions: `chmod 755 ~/.claude/themes/matrix-custom` |

### Performance & Resource Issues

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_MT031` | Theme causing high CPU usage (cascade effects too intensive) | (1) Disable cascade: `"cascade": false` (2) Or reduce speed: `"cascadeSpeed": "very-slow"` (3) Reduce glow: `"glowIntensity": 0.5` (4) Switch to performance tier: `"performance": { "tier": "balanced" }` (5) Save and monitor CPU (6) Should drop to normal levels |
| `ERROR_MT032` | Theme causing high memory usage or crashes | (1) Disable effects: `"cascade": false, "textGlow": false` (2) Use low performance tier: `"performance": { "tier": "low" }` (3) Clear cache: `rm -rf ~/.claude/cache/*` (4) Restart Claude Code (5) Monitor memory: Activity Monitor (macOS) or Task Manager (Windows) (6) If persistent: use minimal theme |
| `ERROR_MT033` | Rendering stutters or frame drops with cascade effect | (1) Reduce cascade speed: `"cascadeSpeed": "very-slow"` (2) Increase cascade spacing: `"cascadeSpacing": 100` (3) Or disable entirely: `"cascade": false` (4) Check system resources: CPU at 100%? (5) Close other apps consuming CPU (6) Verify GPU acceleration enabled in Claude Code settings |
| `ERROR_MT034` | Remote SSH session: theme effects don't work | (1) Effects require local rendering (GPU) (2) Over SSH: disable effects: `"cascade": false, "textGlow": false` (3) Use soft variant with reduced effects (4) Or switch to minimal theme for remote work (5) Effects will work again when on local machine (6) Consider using terminal-only theme for remote |
| `ERROR_MT035` | Theme performance degrades after extended use | (1) Memory leak or cache buildup (2) Clear cache: `rm -rf ~/.claude/cache/*` (3) Restart Claude Code (4) Check for zombie processes: `ps aux \| grep claude` (5) Kill if needed: `pkill -f claude` (6) Relaunch Claude Code |

### Troubleshooting & Edge Cases

| Code | Message | Recovery Steps |
|------|---------|-----------------|
| `ERROR_MT036` | Theme conflicts with other Claude Code extensions | (1) List extensions: `/config list-extensions` (2) Disable extensions one-by-one to isolate conflict (3) Test theme after each disable (4) Once identified: contact extension author (5) Or use different theme if conflict unavoidable (6) File issue: conflicts should be fixable |
| `ERROR_MT037` | Theme reverts to default after update | (1) Claude Code auto-update may reset settings (2) Reapply theme: `/config theme` → select Matrix Dark (3) Save settings: should persist now (4) If reverts again: settings.json may be reset during update (5) Backup settings: `cp ~/.claude/settings.json ~/.claude/settings.json.bak` (6) After next update: restore backup |
| `ERROR_MT038` | Opacity/transparency not working in Claude Code | (1) Check setting: `grep opacity ~/.claude/settings.json` (2) Set: `"display": { "opacity": 0.95 }` (3) Range: 0 (transparent) to 1 (opaque) (4) Some OS/environments don't support opacity (5) If not working: remove setting or set to 1.0 (6) Try blur effect instead: `"blur": 0.5` |
| `ERROR_MT039` | Day/night auto-switch not working | (1) Check config: `grep autoSwitch ~/.claude/settings.json` (2) Should have: `"autoSwitch": true, "switchTime": "18:00"` (3) Verify dayVariant/nightVariant are valid theme names (4) System time may not be set correctly (5) Manually switch: `/config theme` (6) Or disable auto and switch manually as needed |
| `ERROR_MT040` | Matrix cascade effect shows wrong characters or glitches | (1) Verify cascadeCharacters setting: `grep cascadeCharacters ~/.claude/settings.json` (2) Should be: `"01"` or similar ASCII (3) If glitched: reset to default: `"cascadeCharacters": "01"` (4) Or disable: `"cascade": false` (5) Save and reload (6) Check terminal encoding: should be UTF-8 |

---

## General Recovery Workflow

For **any** error:

1. **Note the error code** (e.g., ERROR_SS001)
2. **Read the recovery steps** in order (each builds on the previous)
3. **Execute step-by-step** — don't skip
4. **Test after each step** — does the issue resolve?
5. **If step N fails**: investigate why before proceeding (don't force)
6. **If all steps fail**: 
   - Check logs: `tail -50 .sandbox.log` / browser console (F12) / CLI output
   - Search logs for the error code
   - If pattern unclear: escalate to team with logs + error code
7. **Document the fix** for knowledge base (especially if root cause was different than expected)

---

## Error Code Ranges

- **SS001–SS033:** Swarm Sandbox Simulator (topology, config, execution)
- **SI001–SI030:** SVG Interactive Map Inspector (loading, rendering, interaction)
- **MT001–MT040:** Matrix Theme Pack (installation, configuration, performance)

---

## Contact & Support

For errors not covered or if recovery fails:

- **Swarm Sandbox:** Check `.swarm-sandbox.log` and council.js documentation
- **SVG Inspector:** Browser console (F12 → Console tab), SVG validation tools
- **Matrix Theme:** Check Claude Code documentation, terminal emulator docs for your OS

---
