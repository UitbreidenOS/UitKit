# End-to-End Integration Tests

Comprehensive integration test suite for Claudient's core features, validating the complete user workflow from theme setup through visualization export.

## Overview

The `full-feature-workflow.test.js` test orchestrates six distinct stages of the Claudient system:

1. **Matrix Theme Setup** — Validates theme configuration, color schemes, animations, and component definitions
2. **Swarm Sandbox Launch** — Initializes multi-agent sandbox environment with topology configuration
3. **SVG Map Inspection** — Generates and validates topology visualization with node/edge metrics
4. **Visualization Export** — Exports topology in SVG, JSON, and YAML formats
5. **E2E Workflow Validation** — Confirms all workflow stages complete successfully
6. **Data Integrity Checks** — Validates all artifacts pass structural and semantic checks

## Running Tests

### Basic run (default settings)
```bash
node test/e2e/full-feature-workflow.test.js
```

### With verbose output
```bash
node test/e2e/full-feature-workflow.test.js --verbose
```

### With debug logging
```bash
node test/e2e/full-feature-workflow.test.js --debug
```

### Combined (verbose + debug)
```bash
node test/e2e/full-feature-workflow.test.js --verbose --debug
```

### Custom timeout (in milliseconds)
```bash
node test/e2e/full-feature-workflow.test.js --timeout=60000
```

## Test Structure

### Test 1: Matrix Theme Setup

**Purpose:** Validate the Matrix dark theme configuration and all its components.

**Validates:**
- Theme file exists and is valid JSON
- Required theme properties present (name, description, colors, typography, components)
- Color scheme completeness (primary, background, surface, text, error, success, warning, info)
- Color format validity (hex or rgba)
- Matrix-specific effects (scanlines, glitch animation)
- Component configuration count (minimum 5 required)

**Artifacts:**
- `matrix-test.json` — Parsed theme configuration

### Test 2: Swarm Sandbox Launch

**Purpose:** Initialize a multi-agent sandbox environment.

**Validates:**
- Swarm sandbox script exists
- Sandbox configuration is structurally valid
- Sandbox manifest created with correct agent count
- Each agent has required properties (id, role, status)
- Sandbox results generated for agent communication simulation

**Artifacts:**
- `sandbox-config.json` — Sandbox initialization configuration
- `sandbox-manifest.json` — Sandbox state with agent definitions
- `swarm-results.json` — Mock agent execution results

### Test 3: SVG Map Inspection

**Purpose:** Generate and validate topology visualization.

**Validates:**
- SVG inspector script exists
- Topology SVG generated with valid XML structure
- SVG contains expected elements (circles for nodes, lines for edges, text labels)
- Inspection results computed correctly
- Network metrics calculated (density, average degree)

**Artifacts:**
- `swarm-topology.svg` — SVG visualization of agent topology
- `svg-inspection.json` — Topology metrics and inspection results

### Test 4: Visualization Export

**Purpose:** Export topology visualization in multiple formats.

**Validates:**
- SVG export created and accessible
- JSON export with metadata created and parseable
- YAML export created with correct structure
- Export manifest generated and files exist
- Export counts match success counts
- All export files validated at export paths

**Artifacts:**
- `export-topology.svg` — Exported SVG visualization
- `export-topology.json` — Exported JSON topology data
- `export-topology.yaml` — Exported YAML topology data
- `export-manifest.json` — Export metadata and status

### Test 5: E2E Workflow Validation

**Purpose:** Confirm all workflow stages complete successfully.

**Validates:**
- All artifacts from previous stages exist
- Workflow trace generated with all stages marked complete
- No workflow stages show failure status
- Artifact count and stage count match expectations

**Artifacts:**
- `workflow-trace.json` — Complete workflow execution trace

### Test 6: Data Integrity Checks

**Purpose:** Perform comprehensive data validation.

**Validates:**
- Theme data: Primary color, animations, components
- Sandbox manifest: ID present, agents non-empty, all have id/role
- SVG structure: Root element, proper closure, circle/line/text elements
- Export manifest: ID present, counts match, all documented

**Assertions:** 15 total (3 per check category)

## Output

### Success Output
```
────────────────────────────────────────────────────────────────────────────────
  CLAUDIENT END-TO-END INTEGRATION TEST SUITE
────────────────────────────────────────────────────────────────────────────────

[TIME] ℹ Test timeout: 30000ms
[TIME] ✓ Passed: Theme Setup: Matrix theme configuration loaded and validated
[TIME] ✓ Passed: Sandbox Launch: Swarm sandbox initialized with multi-agent topology
...

────────────────────────────────────────────────────────────────────────────────
  TEST SUMMARY
────────────────────────────────────────────────────────────────────────────────

  Total:   6
  Passed:  6
  Failed:  0
  Skipped: 0
  Time:    0.01s

✓ All tests passed!
```

### Exit Codes
- `0` — All tests passed
- `1` — One or more tests failed

## Color Codes

- `✓` (green) — Test passed
- `✗` (red) — Test failed
- `⊘` (yellow) — Test skipped
- `ℹ` (cyan) — Information
- `⚙` (dim) — Debug output
- `!` (yellow) — Warning

## Temporary Files

Tests generate temporary artifacts in a unique directory under `/tmp/`:
```
/tmp/claudient-e2e-{TIMESTAMP}/
├── matrix-test.json
├── sandbox-config.json
├── sandbox-manifest.json
├── swarm-results.json
├── swarm-topology.svg
├── svg-inspection.json
├── export-topology.{svg,json,yaml}
├── export-manifest.json
└── workflow-trace.json
```

**Cleanup:** Temporary directory is automatically removed on test completion or termination.

## Flags & Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--verbose` | boolean | false | Enable verbose output for all test stages |
| `--debug` | boolean | false | Enable detailed debug logging |
| `--timeout=N` | number | 300000 | Custom timeout in milliseconds (5 min default) |

## Requirements

- Node.js 18+
- Valid Claudient installation
- Read/write access to `/tmp` for temporary files
- Read access to theme, script, and guide files in project

## Integration

This test suite validates the complete workflow without requiring external services:
- No API calls
- No network dependencies
- No Docker/container requirements
- Pure file-system based testing

All external systems are mocked with realistic data to simulate:
- Theme engine behavior
- Swarm sandbox initialization
- SVG generation and inspection
- Multi-format export pipeline

## Troubleshooting

### Test times out
Increase timeout with `--timeout=600000` (10 minutes).

### Missing artifact errors
Ensure all required files exist:
```bash
ls -la themes/matrix.json
ls -la scripts/claudient-swarm-sandbox.js
ls -la scripts/claudient-svg-inspector.js
```

### Permission errors
Ensure write access to `/tmp` directory:
```bash
touch /tmp/test-write && rm /tmp/test-write
```

### Debug test failures
Run with `--debug` flag to see detailed logging:
```bash
node test/e2e/full-feature-workflow.test.js --debug
```

## Implementation Details

### Test Architecture

```
E2ETestSuite (test runner)
├── Test 1: Theme Setup
├── Test 2: Sandbox Launch
├── Test 3: SVG Inspection
├── Test 4: Visualization Export
├── Test 5: E2E Workflow Validation
└── Test 6: Data Integrity Checks

Each test:
- Has a descriptive name
- Validates specific system component
- Creates artifacts in temp directory
- Logs progress with color-coded output
- Reports failures with actionable errors
```

### Artifact Flow

```
Matrix theme (themes/matrix.json)
    ↓
[Test 1] → matrix-test.json (validated copy)
    ↓
Sandbox scripts (scripts/claudient-swarm-sandbox.js)
    ↓
[Test 2] → sandbox-manifest.json, swarm-results.json
    ↓
SVG inspector (scripts/claudient-svg-inspector.js)
    ↓
[Test 3] → swarm-topology.svg, svg-inspection.json
    ↓
Export pipeline
    ↓
[Test 4] → export-topology.{svg,json,yaml}, export-manifest.json
    ↓
Workflow validation
    ↓
[Test 5] → workflow-trace.json
    ↓
Data integrity checks
    ↓
[Test 6] → (validation only, no new artifacts)
```

## Performance Characteristics

- **Duration:** < 100ms (mock-based, no I/O waits)
- **Memory:** < 50MB
- **Temp disk usage:** < 500KB
- **No external network calls**

## Future Enhancements

- [ ] Integration with CI/CD pipeline
- [ ] Performance regression detection
- [ ] Snapshot testing for SVG outputs
- [ ] Property-based testing for topology generation
- [ ] Parallel test execution
- [ ] Coverage reporting
