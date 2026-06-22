# Integration Tests

This directory contains integration tests for Claudient components, focusing on real-world scenarios and cross-component interactions.

## Tests

### Swarm Matrix Integration Test
**File:** `swarm-matrix-integration.test.js`

Comprehensive integration test suite for Swarm Sandbox with Matrix theme styling.

#### What This Test Verifies

1. **CLI Output Styling**
   - Matrix theme colors (neon green #00ff41 on dark background #0a0e27)
   - ANSI color codes properly applied
   - Success messages in green, errors in red, warnings in yellow, info in cyan

2. **Status Display Readability**
   - Neon green text remains readable on dark backgrounds
   - Latency information clearly displayed with millisecond units
   - Error rates and thresholds visible
   - Agent statuses distinguishable by color and text
   - Execution timeline chronologically ordered

3. **Error Message Visibility**
   - Timeout errors prominently displayed with recovery options
   - Agent failure errors clearly marked with remediation steps
   - Validation errors list specific issues with context
   - Error messages include affected agent IDs
   - Remediation suggestions provided for each error type
   - ANSI codes properly balanced (no artifacts)

4. **Matrix Theme Visual Effects**
   - Scanline effect reference documented
   - Glow effects don't reduce text contrast
   - Animation effects don't break text flow
   - Terminal cursor styling doesn't interfere with readability

5. **Sandbox Status Displays**
   - Initialization status shows all setup steps
   - Execution trace includes accurate timing information
   - Summary displays key metrics (latency, error rate, queue depth)
   - Health check results show pass/fail status
   - Readiness indicator (GREEN/YELLOW/RED) prominently displayed

6. **Error Scenario Handling**
   - Timeout scenarios show recovery mechanism with backoff
   - Agent failure scenarios indicate graceful degradation
   - Validation failures provide clear remediation path
   - Error details include root cause analysis

7. **Output Formatting**
   - Section headers with visual separation (═ and ─ characters)
   - Success indicators: ✓ (checkmark)
   - Error indicators: ✗ (X symbol)
   - Warning indicators: ⚠ (triangle)
   - Code blocks visually distinct with ┌─ and └─ markers

8. **Matrix Color Contrast**
   - Primary green (#00ff41) readable on background (#0a0e27)
   - Error red (#ff004d) stands out
   - Warning yellow (#ffb700) visible
   - Info cyan (#00d4ff) distinguishable

9. **Accessibility**
   - Color not the only status indicator (uses symbols + text)
   - Error messages include text descriptions, not just colors
   - Terminal output readable without color support
   - Semantic information with symbols and text

#### Running the Tests

**With Jest or Test Framework:**
```bash
npm test -- test/integration/swarm-matrix-integration.test.js
```

**Standalone:**
```bash
node test/integration/swarm-matrix-integration.test.js
```

**Direct Output (Visual Inspection):**
```bash
node test/integration/swarm-matrix-integration.test.js 2>&1 | less -R
```

The `-R` flag in `less` preserves ANSI color codes for proper visualization.

#### Test Output Examples

**Successful Initialization:**
```
════════════════════════════════════════════════════════════════════════════════
  Swarm Sandbox Initialization
════════════════════════════════════════════════════════════════════════════════

ℹ Loading topology configuration...
✓ Topology loaded: 5-agent council (hub-spoke)
✓ Agent IDs validated: orchestrator, researcher, analyst, risk_assessor, writer
────────────────────────────────────────────────────────────────────────────────

════════════════════════════════════════════════════════════════════════════════
  Sandbox Environment Setup
════════════════════════════════════════════════════════════════════════════════

✓ Isolation level: strict
✓ Network access: none (mock endpoints only)
✓ Memory limit per agent: 512 MB
✓ Rate limit: 60 req/min per agent
✓ Timeout: 30000 ms default
```

**Error Scenario - Timeout:**
```
✗ [30000ms] researcher: TIMEOUT - circuit breaker activated
ℹ [30001ms] orchestrator: retry with backoff (attempt 1/3)
ℹ [30101ms] researcher: connection restored
✓ [32500ms] researcher: recovered and completed

Error Details:
✗ Timeout occurred in researcher agent
ℹ Agent ID: researcher-agent
ℹ Error type: TIMEOUT
ℹ Recovery: automatic retry with exponential backoff
ℹ Status: RECOVERED (partial success)
```

#### Test Components

**MatrixThemedCLI Class**
- Generates CLI output with Matrix theme styling
- Methods:
  - `styleText(text, color, bold)` - Apply color/style to text
  - `header(title)` - Add section header with visual separation
  - `status(icon, message, type)` - Add status line with icon and color
  - `success(message)` - Add success indicator (✓)
  - `error(message)` - Add error indicator (✗)
  - `warning(message)` - Add warning indicator (⚠)
  - `info(message)` - Add info indicator (ℹ)
  - `codeBlock(code, language)` - Add code block with Matrix styling
  - `divider()` - Add visual divider
  - `render()` - Get final output

**SwarmSandboxSimulator Class**
- Generates realistic Swarm Sandbox CLI output for testing
- Scenarios:
  - `simulateSuccessfulInit()` - Successful sandbox setup
  - `simulateExecutionTrace()` - Agent execution timeline
  - `simulateStatusSummary()` - Complete status report
  - `simulateTimeoutError()` - Timeout error with recovery
  - `simulateAgentFailure()` - Agent unreachable scenario
  - `simulateValidationFailure()` - Configuration validation error
  - `getFullReport()` - Complete sandbox report

#### Matrix Theme Colors

Reference colors from `themes/matrix.json`:

| Color | Hex | ANSI Code | Usage |
|-------|-----|-----------|-------|
| Primary | #00ff41 | \x1b[92m | Success, normal text |
| Error | #ff004d | \x1b[91m | Errors, failures |
| Warning | #ffb700 | \x1b[93m | Warnings, cautions |
| Info | #00d4ff | \x1b[96m | Information, debug |
| Background | #0a0e27 | - | Terminal background |

#### Integration Points

This test integrates with:
- **themes/matrix.json** - Matrix theme configuration and color palette
- **skills/ai-engineering/swarm-sandbox.md** - Swarm Sandbox skill definition
- **site/src/components/os/apps/CliApp.tsx** - CLI app component
- **site/src/components/os/apps/SwarmApp.tsx** - Swarm app component
- **scripts/claudient-swarm-sandbox.js** - Sandbox CLI script

#### Performance Benchmarks

Tests verify:
- Output generation: < 500ms
- ANSI color code bloat: < 10% of output size
- Large report (100 agents): < 200ms to generate

#### Accessibility Validation

Tests ensure:
- Color contrast ratios meet WCAG AA standards
- Status indicated by symbol + text, not color alone
- Output readable without ANSI color codes
- Error messages include descriptions, not just indicators

#### Troubleshooting

**No ANSI colors in output:**
- Check terminal supports 24-bit true color
- Try piping through `less -R`: `node ... | less -R`

**Tests failing with "Cannot read properties of undefined":**
- Ensure Node.js version supports modern JavaScript
- Run: `npm test` with proper test framework setup

**Color codes visible in output:**
- Output file is probably being stored in binary mode
- Use text mode: ensure newlines are `\n` not `\r\n`

#### Future Enhancements

- [ ] Add tests for light theme compatibility
- [ ] Add performance degradation tests
- [ ] Add stress tests with 1000+ agents
- [ ] Add network failure injection scenarios
- [ ] Add memory leak detection tests
- [ ] Add CSS-based theme rendering tests (for web UI)
- [ ] Add WebGL visualization tests for Matrix effects
